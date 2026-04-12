"use client";

import { useState, useRef } from "react";
import { Attendee, Gender, Zone } from "@/lib/types";

interface Props {
  onRegister: (attendee: Attendee, seat: string) => void;
  assignSeat: (zone: Zone) => string | null;
  total: number;
  TOTAL: number;
  showToast: (msg: string) => void;
}

export default function RegisterForm({ onRegister, assignSeat, total, TOTAL, showToast }: Props) {
  const [name, setName] = useState("");
  const [insta, setInsta] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [zone, setZone] = useState<Zone | "">("");
  const [isVip, setIsVip] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [zoneError, setZoneError] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLSelectElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Solo se permiten imágenes"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("La imagen no puede superar 5MB"); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoError(false);
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit() {
    let valid = true;

    // Foto OBLIGATORIA
    if (!photoFile) {
      setPhotoError(true);
      setTimeout(() => setPhotoError(false), 900);
      fileRef.current?.click();
      valid = false;
    }
    if (!name.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 900);
      if (valid) nameRef.current?.focus();
      valid = false;
    }
    if (!gender) {
      setGenderError(true);
      setTimeout(() => setGenderError(false), 900);
      valid = false;
    }
    if (!zone) {
      setZoneError(true);
      setTimeout(() => setZoneError(false), 900);
      if (valid) zoneRef.current?.focus();
      valid = false;
    }
    if (!valid) return;
    if (total >= TOTAL) { showToast("El yate está lleno!"); return; }

    const seat = assignSeat(zone as Zone);
    if (!seat) {
      showToast(`La zona ${{ vip: "VIP", main: "General", lower: "Social" }[zone as Zone]} está llena`);
      return;
    }

    // Upload foto a Vercel Blob
    setUploading(true);
    let photoUrl: string;
    try {
      const fd = new FormData();
      fd.append("file", photoFile!);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Error al subir la foto");
        setUploading(false);
        return;
      }
      photoUrl = data.url;
    } catch {
      showToast("Error de red al subir la foto");
      setUploading(false);
      return;
    }
    setUploading(false);

    const attendee: Attendee = {
      name: name.trim(),
      gender: gender as Gender,
      zone: zone as Zone,
      vip: isVip,
      seat,
      insta: insta.trim(),
      photoUrl,
    };

    onRegister(attendee, seat);
    setName(""); setInsta(""); setGender(""); setZone(""); setIsVip(false);
    removePhoto();
  }

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "13px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 16, color: "var(--text)",
    fontFamily: "var(--font-figtree), sans-serif",
    fontSize: 15, outline: "none",
    WebkitAppearance: "none", appearance: "none",
  };

  return (
    <div style={{ padding: "20px 0 0" }}>
      <div style={{ background: "var(--aira-card)", border: "1px solid var(--aira-border)", borderRadius: 24, padding: 20, margin: "0 16px" }}>
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>Reserva tu puesto</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 22, lineHeight: 1.5 }}>
          Únete a la experiencia AIRA Party en el Yate Majestic
        </div>

        {/* ── FOTO OBLIGATORIA ── */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.7px", marginBottom: 8, display: "flex",
            alignItems: "center", gap: 6,
            color: photoError ? "#ff7070" : "var(--text-muted)",
          }}>
            Foto de perfil
            <span style={{
              fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20,
              background: photoError ? "rgba(255,79,79,0.2)" : "rgba(0,79,255,0.15)",
              color: photoError ? "#ff7070" : "#6699ff",
              border: `1px solid ${photoError ? "rgba(255,79,79,0.4)" : "rgba(0,79,255,0.3)"}`,
              textTransform: "uppercase", letterSpacing: 0.5,
            }}>REQUERIDA</span>
          </label>

          {photoPreview ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={photoPreview}
                  alt="Vista previa"
                  width={72} height={72}
                  style={{
                    width: 72, height: 72, borderRadius: "50%", objectFit: "cover",
                    border: "2.5px solid var(--aira-lime)",
                    boxShadow: "0 0 0 4px rgba(225,254,82,0.15)",
                  }}
                />
                <button
                  onClick={removePhoto}
                  aria-label="Cambiar foto"
                  style={{
                    position: "absolute", bottom: -2, right: -2, width: 22, height: 22,
                    borderRadius: "50%", background: "var(--aira-dark)",
                    border: "1.5px solid var(--aira-border)",
                    color: "var(--text-muted)", fontSize: 11,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  ✎
                </button>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--aira-lime)" }}>Foto cargada ✓</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>Toca el lápiz para cambiarla</div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "16px",
                background: photoError ? "rgba(255,79,79,0.06)" : "rgba(0,79,255,0.06)",
                border: `1.5px dashed ${photoError ? "rgba(255,79,79,0.5)" : "rgba(0,79,255,0.35)"}`,
                borderRadius: 16, cursor: "pointer", width: "100%",
                fontFamily: "var(--font-figtree), sans-serif",
                animation: photoError ? "bump 0.4s ease" : undefined,
                boxShadow: photoError ? "0 0 0 3px rgba(255,79,79,0.12)" : undefined,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                background: photoError ? "rgba(255,79,79,0.12)" : "rgba(0,79,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>
                📸
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: photoError ? "#ff7070" : "#6699ff" }}>
                  {photoError ? "¡Foto requerida!" : "Subir selfie o foto"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>
                  JPG · PNG · WEBP · Max 5MB
                </div>
              </div>
            </button>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="user"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
        </div>

        {/* Nombre */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: nameError ? "#ff7070" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 6, display: "block" }}>
            Nombre completo
          </label>
          <input
            ref={nameRef}
            style={{ ...inputBase, borderColor: nameError ? "rgba(255,79,79,0.7)" : "rgba(255,255,255,0.1)", boxShadow: nameError ? "0 0 0 3px rgba(255,79,79,0.15)" : undefined }}
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Ej: María García" autoComplete="name"
          />
        </div>

        {/* Instagram */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 6, display: "block" }}>
            Instagram <span style={{ color: "var(--text-faint)", fontSize: 10, fontWeight: 500, textTransform: "none" }}>(opcional)</span>
          </label>
          <input
            style={inputBase}
            type="text" value={insta} onChange={e => setInsta(e.target.value)}
            placeholder="@tuusuario" autoComplete="off"
          />
        </div>

        {/* Género */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: genderError ? "#ff7070" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 6, display: "block" }}>
            Género
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {(["male", "female"] as Gender[]).map(g => {
              const isSelected = gender === g;
              const selStyle = g === "male"
                ? { borderColor: "var(--aira-blue)", background: "rgba(0,79,255,0.12)", color: "#6699ff" }
                : { borderColor: "var(--aira-lime)", background: "rgba(225,254,82,0.08)", color: "#c8e840" };
              return (
                <button
                  key={g}
                  onClick={() => { setGender(g); setGenderError(false); }}
                  style={{
                    padding: "14px 12px", borderRadius: 16,
                    border: `1.5px solid ${genderError ? "rgba(255,79,79,0.5)" : "rgba(255,255,255,0.1)"}`,
                    background: "rgba(255,255,255,0.03)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--text-muted)",
                    fontFamily: "var(--font-figtree), sans-serif",
                    ...(isSelected ? selStyle : {}),
                  }}
                >
                  <span style={{ fontSize: 24 }}>{g === "male" ? "👦" : "👩"}</span>
                  {g === "male" ? "Hombre" : "Mujer"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zona */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: zoneError ? "#ff7070" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 6, display: "block" }}>
            Zona preferida
          </label>
          <select
            ref={zoneRef}
            style={{ ...inputBase, borderColor: zoneError ? "rgba(255,79,79,0.7)" : "rgba(255,255,255,0.1)", boxShadow: zoneError ? "0 0 0 3px rgba(255,79,79,0.15)" : undefined }}
            value={zone} onChange={e => { setZone(e.target.value as Zone | ""); setZoneError(false); }}
          >
            <option value="">Selecciona una zona</option>
            <option value="vip">VIP — Cubierta Superior</option>
            <option value="main">General — Cubierta Principal</option>
            <option value="lower">Social — Cubierta Baja</option>
          </select>
        </div>

        {/* VIP Toggle */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 6, display: "block" }}>
            Acceso especial
          </label>
          <div
            onClick={() => { setIsVip(v => !v); if (!isVip) setZone("vip"); }}
            role="checkbox" aria-checked={isVip}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: isVip ? "rgba(255,215,0,0.12)" : "rgba(255,215,0,0.06)",
              border: `1.5px solid ${isVip ? "rgba(255,215,0,0.4)" : "rgba(255,215,0,0.2)"}`,
              borderRadius: 16, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>🎟️</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#ffd700" }}>Pass VIP</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>Acceso exclusivo · Open bar · Zona gold</div>
              </div>
            </div>
            <div style={{ width: 44, height: 26, borderRadius: 100, background: isVip ? "#ffd700" : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 3, left: isVip ? "auto" : 3, right: isVip ? 3 : "auto", width: 20, height: 20, borderRadius: "50%", background: isVip ? "#08101f" : "white", transition: "all 0.2s" }} />
            </div>
          </div>
        </div>

        {/* Resumen antes de enviar */}
        {photoFile && name && gender && zone && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(225,254,82,0.06)", border: "1px solid rgba(225,254,82,0.2)",
            borderRadius: 14, padding: "12px 14px", marginBottom: 16,
          }}>
            <img src={photoPreview!} alt="" width={36} height={36} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
                {zone === "vip" ? "VIP" : zone === "main" ? "General" : "Social"} · {gender === "male" ? "Hombre" : "Mujer"}
                {isVip && <span style={{ color: "#ffd700" }}> · Pass VIP</span>}
              </div>
            </div>
            <span style={{ fontSize: 16 }}>✓</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={uploading}
          style={{
            width: "100%", padding: 16,
            background: uploading
              ? "rgba(0,79,255,0.4)"
              : !photoFile || !name || !gender || !zone
              ? "rgba(255,255,255,0.06)"
              : "var(--aira-blue)",
            color: !photoFile || !name || !gender || !zone ? "var(--text-faint)" : "#fff",
            fontFamily: "var(--font-figtree), sans-serif", fontSize: 15, fontWeight: 800,
            border: "none", borderRadius: 16,
            cursor: uploading ? "not-allowed" : "pointer",
            marginTop: 4, letterSpacing: "0.3px", transition: "all 0.25s",
          }}
        >
          {uploading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }} aria-hidden="true">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Subiendo foto a Blob...
            </span>
          ) : "Reservar mi puesto 🛥️"}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bump { 0%,100%{transform:scale(1)} 50%{transform:scale(1.02)} }
      `}</style>
    </div>
  );
}
