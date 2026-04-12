"use client";

import { useState } from "react";
import { Attendee, Screen, Zone } from "@/lib/types";
import Header from "@/components/Header";
import YachtMap from "@/components/YachtMap";
import AttendeesList from "@/components/AttendeesList";
import RegisterForm from "@/components/RegisterForm";
import BottomNav from "@/components/BottomNav";
import SuccessOverlay from "@/components/SuccessOverlay";

const TOTAL = 60;
const VIP_SEATS = 10;
const MAIN_SEATS = 28;
const LOWER_SEATS = 22;

const INITIAL_ATTENDEES: Attendee[] = [
  { name: "Carlos M.", gender: "male", zone: "vip", vip: true, seat: "V3", insta: "@carlosm" },
  { name: "Ana Lopez", gender: "female", zone: "vip", vip: true, seat: "V7", insta: "@analopez" },
  { name: "Sebastian R.", gender: "male", zone: "main", vip: false, seat: "M5", insta: "@sebas" },
  { name: "Valeria P.", gender: "female", zone: "main", vip: false, seat: "M12", insta: "@vale" },
  { name: "Mateo G.", gender: "male", zone: "main", vip: false, seat: "M19", insta: "@mateo" },
  { name: "Isabela T.", gender: "female", zone: "lower", vip: false, seat: "L8", insta: "@isa" },
  { name: "Daniel H.", gender: "male", zone: "lower", vip: false, seat: "L2", insta: "" },
  { name: "Camila S.", gender: "female", zone: "main", vip: false, seat: "M24", insta: "@camila" },
  { name: "Juliana R.", gender: "female", zone: "vip", vip: true, seat: "V1", insta: "@juli.r" },
  { name: "Andres V.", gender: "male", zone: "lower", vip: false, seat: "L15", insta: "@andresv" },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("deck");
  const [attendees, setAttendees] = useState<Attendee[]>(INITIAL_ATTENDEES);
  const [newSeat, setNewSeat] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ seat: string; name: string; isVip: boolean } | null>(null);

  function getOccupied() {
    return new Set(attendees.map(a => a.seat));
  }

  function assignSeat(zone: Zone): string | null {
    const occ = getOccupied();
    const prefix = zone === "vip" ? "V" : zone === "main" ? "M" : "L";
    const max = zone === "vip" ? VIP_SEATS : zone === "main" ? MAIN_SEATS : LOWER_SEATS;
    for (let i = 1; i <= max; i++) {
      const s = prefix + i;
      if (!occ.has(s)) return s;
    }
    return null;
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleRegister(attendee: Attendee, seat: string) {
    setAttendees(prev => [...prev, attendee]);
    setNewSeat(seat);
    setSuccess({ seat, name: attendee.name, isVip: attendee.vip });
  }

  function handleSuccessClose() {
    setSuccess(null);
    setScreen("deck");
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", maxWidth: 430, margin: "0 auto", position: "relative" }}>
      <Header />

      {/* Deck Screen */}
      <div style={{ display: screen === "deck" ? "flex" : "none", flex: 1, flexDirection: "column", paddingBottom: 90, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <YachtMap attendees={attendees} newSeat={newSeat} />
      </div>

      {/* List Screen */}
      <div style={{ display: screen === "list" ? "flex" : "none", flex: 1, flexDirection: "column", paddingBottom: 90, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <AttendeesList attendees={attendees} />
      </div>

      {/* Register Screen */}
      <div style={{ display: screen === "register" ? "flex" : "none", flex: 1, flexDirection: "column", paddingBottom: 90, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <RegisterForm
          onRegister={handleRegister}
          assignSeat={assignSeat}
          total={attendees.length}
          TOTAL={TOTAL}
          showToast={showToast}
        />
      </div>

      <BottomNav active={screen} onChange={setScreen} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 300,
          background: "rgba(255,60,60,0.12)", border: "1px solid rgba(255,60,60,0.35)",
          borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 700, color: "#ff7070",
          whiteSpace: "nowrap", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          animation: "fade-in 0.25s ease",
        }} role="alert">
          {toast}
        </div>
      )}

      {/* Success Overlay */}
      {success && (
        <SuccessOverlay
          visible={true}
          seat={success.seat}
          name={success.name}
          isVip={success.isVip}
          onClose={handleSuccessClose}
        />
      )}
    </main>
  );
}
