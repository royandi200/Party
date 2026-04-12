export default function Header() {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 20px 14px",
      background: "rgba(8,16,31,0.88)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--aira-border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg,var(--aira-blue),#0052ff)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 18c0 0 5-3 10-3s10 3 10 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5 18V11l7-7 7 7v7" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M10 18v-4h4v4" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: "#fff" }}>
          Par<em style={{ color: "var(--aira-lime)", fontStyle: "normal" }}>ty</em>
        </div>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        background: "rgba(225,254,82,0.1)",
        border: "1px solid rgba(225,254,82,0.3)",
        borderRadius: 20, padding: "4px 10px",
        fontSize: 11, fontWeight: 700, color: "var(--aira-lime)",
        textTransform: "uppercase", letterSpacing: "0.8px",
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--aira-lime)",
          animation: "pulse-dot 1.5s ease-in-out infinite",
          display: "inline-block",
        }} aria-hidden="true" />
        En vivo
      </div>
    </header>
  );
}
