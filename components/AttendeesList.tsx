"use client";

import { useState } from "react";
import { Attendee, Filter } from "@/lib/types";

interface Props {
  attendees: Attendee[];
}

const ZONE_LABEL: Record<string, string> = { vip: "VIP", main: "General", lower: "Social" };

export default function AttendeesList({ attendees }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = attendees.filter(a => {
    if (filter === "male") return a.gender === "male";
    if (filter === "female") return a.gender === "female";
    if (filter === "vip") return a.vip;
    return true;
  });

  const chips: { key: Filter; label: string; accent?: "f" | "vip" }[] = [
    { key: "all", label: "Todos" },
    { key: "male", label: "Hombres" },
    { key: "female", label: "Mujeres", accent: "f" },
    { key: "vip", label: "VIP", accent: "vip" },
  ];

  function chipStyle(key: Filter, accent?: "f" | "vip"): React.CSSProperties {
    const active = filter === key;
    if (!active) return {
      flexShrink: 0, padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700,
      border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
      color: "var(--text-muted)", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px",
    };
    if (accent === "f") return {
      flexShrink: 0, padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700,
      border: "1.5px solid var(--aira-lime)", background: "rgba(225,254,82,0.1)",
      color: "#c8e840", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px",
    };
    if (accent === "vip") return {
      flexShrink: 0, padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700,
      border: "1.5px solid #ffd700", background: "rgba(255,215,0,0.1)",
      color: "#ffd700", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px",
    };
    return {
      flexShrink: 0, padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700,
      border: "1.5px solid var(--aira-blue)", background: "rgba(0,79,255,0.15)",
      color: "#6699ff", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px",
    };
  }

  return (
    <section style={{ padding: "20px 16px 0" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        Asistentes <span style={{ color: "var(--text-faint)", fontSize: 11, fontWeight: 600 }}>{attendees.length}</span>
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {chips.map(c => (
          <button key={c.key} style={chipStyle(c.key, c.accent)} onClick={() => setFilter(c.key)}>
            {c.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "60px 20px", color: "var(--text-faint)" }}>
            <div style={{ fontSize: 56, marginBottom: 14 }} aria-hidden="true">🛥️</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
              {filter === "all" ? "Aun no hay registros" : "Sin resultados"}
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.5, maxWidth: "28ch" }}>
              {filter === "all" ? "Se el primero en unirte a la noche de yate!" : "No hay asistentes en esta categoria aun."}
            </p>
          </div>
        ) : (
          [...filtered].reverse().map((a, i) => {
            const ini = a.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
            const badgeColor = a.vip ? "#ffd700" : a.gender === "male" ? "#6699ff" : "#c8e840";
            const badgeBg = a.vip ? "rgba(255,215,0,0.1)" : a.gender === "male" ? "rgba(0,79,255,0.15)" : "rgba(225,254,82,0.1)";
            const badgeBorder = a.vip ? "rgba(255,215,0,0.3)" : a.gender === "male" ? "rgba(0,79,255,0.3)" : "rgba(225,254,82,0.25)";
            const avatarBg = a.gender === "male"
              ? "linear-gradient(135deg,#004fff,#0066ff)"
              : "linear-gradient(135deg,#e1fe52,#c8e840)";
            const avatarColor = a.gender === "male" ? "#fff" : "#08101f";
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "var(--aira-card)", border: "1px solid var(--aira-border)",
                borderRadius: 16, padding: "12px 14px", animation: "slide-in 0.3s ease",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, fontWeight: 700, background: avatarBg, color: avatarColor }}>
                  {ini}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
                    {ZONE_LABEL[a.zone]} · Puesto {a.seat}
                    {a.insta && <span style={{ color: "var(--aira-blue)", fontSize: 10 }}> · {a.insta}</span>}
                  </div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", color: badgeColor, background: badgeBg, border: `1px solid ${badgeBorder}` }}>
                  {a.vip ? "VIP" : a.gender === "male" ? "H" : "M"}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
