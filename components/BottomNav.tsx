"use client";

import { Screen } from "@/lib/types";

interface Props {
  active: Screen;
  onChange: (s: Screen) => void;
}

const TABS: { key: Screen; label: string; icon: React.ReactNode }[] = [
  {
    key: "deck",
    label: "Cubierta",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden="true">
        <path d="M3 17l4-8 4 4 4-6 4 10M3 21h18"/>
      </svg>
    ),
  },
  {
    key: "list",
    label: "Asistentes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden="true">
        <circle cx="12" cy="8" r="4"/>
        <path d="M20 21a8 8 0 1 0-16 0"/>
      </svg>
    ),
  },
  {
    key: "register",
    label: "Registro",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 8v8M8 12h8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, zIndex: 100,
      background: "rgba(8,16,31,0.92)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderTop: "1px solid var(--aira-border)",
      display: "flex", padding: "8px 0",
    }} aria-label="Navegacion principal">
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          aria-current={active === t.key ? "page" : undefined}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "6px 0", background: "none", border: "none", cursor: "pointer",
            color: active === t.key ? "var(--aira-lime)" : "var(--text-faint)",
            fontFamily: "var(--font-figtree), sans-serif",
            fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
            transition: "color 0.2s",
          }}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </nav>
  );
}
