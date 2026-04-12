"use client";

import { useState, useEffect } from "react";
import { Attendee } from "@/lib/types";

const TOTAL = 60;
const VIP_SEATS = 10;
const MAIN_SEATS = 28;
const LOWER_SEATS = 22;

const MAIN_ROWS = [[1,2,3,4,5,6,7],[8,9,10,11,12,13,14],[15,16,17,18,19,20,21],[22,23,24,25,26,27,28]];
const LOWER_ROWS = [[1,2,3,4,5],[6,7,8,9,10,11],[12,13,14,15,16],[17,18,19,20,21,22]];

interface Props {
  attendees: Attendee[];
  newSeat: string | null;
}

interface TooltipState {
  text: string;
  x: number;
  y: number;
  visible: boolean;
}

function getSeatStyle(person: Attendee | undefined, isNew: boolean) {
  const base: React.CSSProperties = {
    width: 28, height: 28, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, cursor: "pointer", flexShrink: 0,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    animation: isNew ? "pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1)" : undefined,
  };
  if (!person) return { ...base, background: "rgba(255,255,255,0.04)", border: "1.5px dashed rgba(255,255,255,0.1)" };
  if (person.vip) return { ...base, background: "linear-gradient(135deg,#ffd700,#ffb800)", boxShadow: "0 2px 8px rgba(255,215,0,0.4)" };
  if (person.gender === "male") return { ...base, background: "linear-gradient(135deg,#004fff,#0066ff)", boxShadow: "0 2px 8px rgba(0,79,255,0.4)" };
  return { ...base, background: "linear-gradient(135deg,#e1fe52,#c8e840)", boxShadow: "0 2px 8px rgba(225,254,82,0.35)" };
}

function SeatEl({ seatId, person, isNew }: { seatId: string; person: Attendee | undefined; isNew: boolean; onTip: (e: React.MouseEvent, id: string, p: Attendee | undefined) => void }) {
  return (
    <div
      style={getSeatStyle(person, isNew)}
      title={person ? `${person.name}${person.vip ? " VIP"  : ""} · Puesto ${seatId}` : `Puesto ${seatId} — Disponible`}
      aria-label={person ? `${person.name}, puesto ${seatId}` : `Puesto ${seatId} disponible`}
    >
      {person ? (person.gender === "male" ? "👦" : "👩") : ""}
    </div>
  );
}

export default function YachtMap({ attendees, newSeat }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState>({ text: "", x: 0, y: 0, visible: false });

  const map = new Map<string, Attendee>();
  attendees.forEach(a => map.set(a.seat, a));

  const tot = attendees.length;
  const males = attendees.filter(a => a.gender === "male").length;
  const females = attendees.filter(a => a.gender === "female").length;
  const pct = Math.round((tot / TOTAL) * 100);

  function showTip(e: React.MouseEvent, seatId: string, person: Attendee | undefined) {
    const r = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      text: person ? `${person.name}${person.vip ? " ⭐VIP" : ""} · Puesto ${seatId}` : `Puesto ${seatId} — Disponible`,
      x: Math.max(8, Math.min(r.left - 20, (typeof window !== "undefined" ? window.innerWidth : 400) - 220)),
      y: r.top - 46,
      visible: true,
    });
    setTimeout(() => setTooltip(p => ({ ...p, visible: false })), 2200);
  }

  function buildRow(prefix: string, nums: number[]) {
    return (
      <div key={nums[0]} style={{ display: "flex", gap: 5, alignItems: "center", justifyContent: "center" }}>
        {nums.map(i => {
          const id = prefix + i;
          const person = map.get(id);
          return (
            <div key={id} onClick={e => showTip(e, id, person)}>
              <SeatEl seatId={id} person={person} isNew={id === newSeat} onTip={showTip} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <div style={{
        margin: "16px 16px 0",
        background: "linear-gradient(135deg,var(--aira-dark3) 0%,var(--aira-dark2) 100%)",
        border: "1px solid var(--aira-border)", borderRadius: 32, padding: 24, position: "relative", overflow: "hidden",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--aira-lime)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Sabado 15 Ago · Represa Guatape
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1, marginBottom: 6 }}>AIRA Party<br />Yacht Night</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 18, lineHeight: 1.5 }}>
          Yate Majestic — el mas grande de<br />agua dulce en Latinoamerica
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { num: tot, label: "Registrados" },
            { num: TOTAL, label: "Cupos" },
            { num: TOTAL - tot, label: "Disponibles" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "var(--aira-lime)" }}>{s.num}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div style={{ margin: "20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Ocupacion del yate</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{tot} / {TOTAL}</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden", marginBottom: 6 }}>
          <div style={{ height: "100%", borderRadius: 100, background: "linear-gradient(90deg,var(--aira-blue),var(--aira-lime))", width: `${pct}%`, transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          {[
            { label: "Hombres", count: males, emoji: "👦", color: "#6699ff" },
            { label: "Mujeres", count: females, emoji: "👩", color: "#c8e840" },
          ].map(g => (
            <div key={g.label} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 6px",
              fontSize: 11, fontWeight: 600, color: g.color,
            }}>
              <span>{g.emoji}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>{g.count}</div>
                <div style={{ fontSize: 10, color: "var(--text-faint)" }}>{g.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yacht Map */}
      <section style={{ padding: "0 16px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Mapa del Yate <span style={{ color: "var(--text-faint)", fontSize: 11, fontWeight: 600 }}>Toca para ver info</span>
        </div>
        <div style={{ background: "var(--aira-card)", border: "1px solid var(--aira-border)", borderRadius: 24, padding: "20px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Yate Majestic</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "4px 10px", fontWeight: 600 }}>{tot}/{TOTAL} puestos</div>
          </div>

          {/* Prow */}
          <div style={{ width: 60, height: 24, background: "rgba(0,79,255,0.15)", border: "1px solid rgba(0,79,255,0.3)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            ⚓
          </div>

          {/* VIP Deck */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Zona VIP — Cubierta Superior</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
              {Array.from({ length: VIP_SEATS }, (_, i) => {
                const id = "V" + (i + 1);
                const person = map.get(id);
                return <div key={id} onClick={e => showTip(e, id, person)}><SeatEl seatId={id} person={person} isNew={id === newSeat} onTip={showTip} /></div>;
              })}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--aira-border)", margin: "12px 0" }} />

          {/* Main Deck */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Zona General — Cubierta Principal</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>
              {MAIN_ROWS.map(row => buildRow("M", row))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--aira-border)", margin: "12px 0" }} />

          {/* Lower Deck */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Zona Social — Cubierta Baja</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>
              {LOWER_ROWS.map(row => buildRow("L", row))}
            </div>
          </div>

          {/* Stern */}
          <div style={{ width: 80, height: 14, background: "rgba(0,79,255,0.1)", border: "1px solid rgba(0,79,255,0.2)", borderRadius: "0 0 50% 50% / 0 0 100% 100%", margin: "6px auto 0" }} />

          {/* Legend */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
            {[
              { label: "Hombre", dotStyle: { background: "#004fff" } },
              { label: "Mujer", dotStyle: { background: "#e1fe52" } },
              { label: "VIP", dotStyle: { background: "#ffd700" } },
              { label: "Libre", dotStyle: { background: "transparent", border: "1.5px dashed rgba(255,255,255,0.2)" } },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)" }}>
                <div style={{ width: 12, height: 12, borderRadius: 4, ...l.dotStyle }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tooltip */}
      {tooltip.visible && (
        <div style={{
          position: "fixed", zIndex: 150,
          background: "var(--aira-dark3)",
          border: "1px solid var(--aira-border)",
          borderRadius: 10, padding: "10px 14px",
          fontSize: 12, fontWeight: 600, pointerEvents: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)", whiteSpace: "nowrap",
          top: tooltip.y, left: tooltip.x,
          animation: "fade-in 0.15s ease",
        }}>
          {tooltip.text}
        </div>
      )}
    </>
  );
}
