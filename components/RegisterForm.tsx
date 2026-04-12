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

  const nameRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLSelectElement>(null);

  function handleSubmit() {
    let valid = true;
    if (!name.trim()) { setNameError(true); setTimeout(() => setNameError(false), 900); nameRef.current?.focus(); valid = false; }
    if (!gender) { setGenderError(true); setTimeout(() => setGenderError(false), 900); valid = false; }
    if (!zone) { setZoneError(true); setTimeout(() => setZoneError(false), 900); if (valid) zoneRef.current?.focus(); valid = false; }
    if (!valid) return;
    if (total >= TOTAL) { showToast("El yate esta lleno!"); return; }

    const seat = assignSeat(zone as Zone);
    if (!seat) { showToast(`La zona ${({ vip: "VIP", main: "General", lower: "Social" } as Record<Zone, string>)[zone as Zone]} esta llena`); return; }

    const attendee: Attendee = {
      name: name.trim(),
      gender: gender as Gender,
      zone: zone as Zone,
      vip: isVip,
      seat,
      insta: insta.trim(),
    };

    onRegister(attendee, seat);
    setName(""); setInsta(""); setGender(""); setZone(""); setIsVip(false);
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
          Unete a la experiencia AIRA Party en el Yate Majestic
        </div>

        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 6, display: "block" }}>
            Nombre completo
          </label>
          <input
            ref={nameRef}
            style={{ ...inputBase, borderColor: nameError ? "rgba(255,79,79,0.7)" : "rgba(255,255,255,0.1)", boxShadow: nameError ? "0 0 0 3px rgba(255,79,79,0.15)" : undefined }}
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Ej: Maria Garcia" autoComplete="name"
          />
        </div>

        {/* Instagram */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 6, display: "block" }}>
            Instagram (opcional)
          </label>
          <input
            style={inputBase}
            type="text" value={insta} onChange={e => setInsta(e.target.value)}
            placeholder="@tuusuario" autoComplete="off"
          />
        </div>

        {/* Gender */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 6, display: "block" }}>
            Genero
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
                  onClick={() => setGender(g)}
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

        {/* Zone */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 6, display: "block" }}>
            Zona preferida
          </label>
          <select
            ref={zoneRef}
            style={{ ...inputBase, borderColor: zoneError ? "rgba(255,79,79,0.7)" : "rgba(255,255,255,0.1)", boxShadow: zoneError ? "0 0 0 3px rgba(255,79,79,0.15)" : undefined }}
            value={zone} onChange={e => setZone(e.target.value as Zone | "")}
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

        <button
          onClick={handleSubmit}
          style={{
            width: "100%", padding: 16, background: "var(--aira-blue)", color: "#fff",
            fontFamily: "var(--font-figtree), sans-serif", fontSize: 15, fontWeight: 800,
            border: "none", borderRadius: 16, cursor: "pointer", marginTop: 20,
            letterSpacing: "0.3px",
          }}
        >
          Reservar mi puesto
        </button>
      </div>
    </div>
  );
}
