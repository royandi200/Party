"use client";

import { useEffect, useRef } from "react";

interface Props {
  visible: boolean;
  seat: string;
  name: string;
  isVip: boolean;
  onClose: () => void;
}

const COLORS = ["#004fff", "#e1fe52", "#ffffff", "#ffd700", "#0066ff", "#c8e840"];

export default function SuccessOverlay({ visible, seat, name, isVip, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !containerRef.current) return;
    const c = containerRef.current;
    c.innerHTML = "";
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("div");
      p.style.cssText = `
        position:absolute;
        width:8px;height:8px;border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
        left:${Math.random() * 100}%;
        top:${-10 + Math.random() * -20}%;
        background:${COLORS[i % COLORS.length]};
        animation:confetti-fall ${1.5 + Math.random()}s ease-in ${Math.random() * 0.8}s forwards;
        transform:rotate(${Math.random() * 360}deg);
      `;
      c.appendChild(p);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(8,16,31,0.97)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: 40, animation: "fade-in 0.35s ease",
    }} role="dialog" aria-modal="true" aria-label="Registro exitoso">
      <div ref={containerRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }} aria-hidden="true" />
      <div style={{ fontSize: 72, marginBottom: 16, animation: "pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" }} aria-hidden="true">
        🎉
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Estas dentro!</div>
      <div style={{ fontSize: 40, fontWeight: 900, color: "var(--aira-lime)", margin: "12px 0", letterSpacing: -1 }}>
        Puesto {seat}
      </div>
      <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.5 }}>
        {isVip && <><strong style={{ color: "#ffd700" }}>Pass VIP activado</strong><br /></>}
        <strong>{name}</strong>, tu lugar esta asegurado en el Yate Majestic
      </div>
      <button
        onClick={onClose}
        style={{
          padding: "14px 32px", background: "var(--aira-lime)", color: "#08101f",
          border: "none", borderRadius: 16, fontFamily: "var(--font-figtree), sans-serif",
          fontSize: 15, fontWeight: 800, cursor: "pointer",
        }}
      >
        Ver mi puesto
      </button>
    </div>
  );
}
