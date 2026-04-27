"use client";
import { useState } from "react";
import LightDatePicker from "@/components/light/DatePicker";
import LightTimePicker from "@/components/light/TimePicker";
import DarkDatePicker from "@/components/dark/DatePicker";
import DarkTimePicker from "@/components/dark/TimePicker";

export default function Home() {
  const [lightDate, setLightDate] = useState("");
  const [lightTime, setLightTime] = useState("");
  const [darkDate, setDarkDate] = useState("");
  const [darkTime, setDarkTime] = useState("");

  return (
    <div>
      {/* ── Header ── */}
      <header style={{ padding: "48px 24px 32px", textAlign: "center", background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF2800", background: "rgba(255,40,0,0.07)", padding: "3px 10px", borderRadius: "99px" }}>
            Open Source
          </span>
        </div>
        <h1 style={{ margin: "0 0 10px", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#18181b", letterSpacing: "-0.03em" }}>
          Date & Time Picker
        </h1>
        <p style={{ margin: "0 auto", color: "#52525b", fontSize: "16px", maxWidth: "480px", lineHeight: 1.6 }}>
          Custom React components — light & dark modes, Material Design clock, mobile responsive, no UI library dependency.
        </p>
        <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://github.com/Rixouu/date-time-picker" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#18181b", color: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/></svg>
            GitHub
          </a>
        </div>
      </header>

      {/* ── Light Mode ── */}
      <section style={{ background: "#f4f4f5", padding: "60px 24px" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div style={{ marginBottom: "24px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF2800" }}>
              Light Mode
            </span>
            <h2 style={{ margin: "4px 0 4px", fontSize: "22px", fontWeight: 700, color: "#18181b" }}>Light Date & Time Picker</h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#52525b" }}>Custom calendar + Material Design clock. Accent: <code style={{ background: "#e4e4e7", padding: "1px 5px", borderRadius: "4px", fontSize: "12px" }}>#FF2800</code></p>
          </div>

          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px 28px", border: "1px solid #e4e4e7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#a1a1aa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>DATE</div>
                <div style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "6px" }}>
                  <LightDatePicker value={lightDate} onChange={setLightDate} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#a1a1aa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>TIME</div>
                <div style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "6px" }}>
                  <LightTimePicker value={lightTime} onChange={setLightTime} />
                </div>
              </div>
            </div>
            {(lightDate || lightTime) && (
              <div style={{ marginTop: "16px", padding: "10px 14px", background: "#f4f4f5", borderRadius: "8px", fontSize: "13px", color: "#52525b" }}>
                Selected:{" "}
                <strong style={{ color: "#18181b" }}>{lightDate}</strong>
                {lightDate && lightTime ? " at " : ""}
                <strong style={{ color: "#18181b" }}>{lightTime}</strong>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Dark Mode ── */}
      <section className="bd-page" style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div style={{ marginBottom: "24px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff2800" }}>
              Dark Mode
            </span>
            <h2 style={{ margin: "4px 0 4px", fontSize: "22px", fontWeight: 700, color: "#fafafa" }}>Dark Date & Time Picker</h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#a3a3a3" }}>Same logic, dark-first design system. Accent: <code style={{ background: "#1f1f1f", padding: "1px 5px", borderRadius: "4px", fontSize: "12px", color: "#a3a3a3" }}>#FF2800</code></p>
          </div>

          <div style={{ background: "#0c0c0c", borderRadius: "16px", padding: "24px 28px", border: "1px solid #262626" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff2800", marginBottom: "8px" }}>DATE</div>
                <DarkDatePicker value={darkDate} onChange={setDarkDate} />
              </div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff2800", marginBottom: "8px" }}>TIME</div>
                <DarkTimePicker value={darkTime} onChange={setDarkTime} />
              </div>
            </div>
            {(darkDate || darkTime) && (
              <div style={{ marginTop: "16px", padding: "10px 14px", background: "#050505", borderRadius: "8px", fontSize: "13px", color: "#a3a3a3", border: "1px solid #1f1f1f" }}>
                Selected:{" "}
                <strong style={{ color: "#fafafa" }}>{darkDate}</strong>
                {darkDate && darkTime ? " at " : ""}
                <strong style={{ color: "#fafafa" }}>{darkTime}</strong>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#050505", borderTop: "1px solid #1f1f1f", padding: "24px", textAlign: "center", fontSize: "13px", color: "#52525b" }}>
        Built by{" "}
        <a href="https://github.com/Rixouu" target="_blank" rel="noopener noreferrer" style={{ color: "#ff2800", textDecoration: "none" }}>
          Jonathan Rycx
        </a>
        {" "}— MIT License
      </footer>
    </div>
  );
}
