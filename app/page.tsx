"use client";
import { useState } from "react";
import LightDatePicker from "@/components/light/DatePicker";
import LightTimePicker from "@/components/light/TimePicker";
import DarkDatePicker from "@/components/dark/DatePicker";
import DarkTimePicker from "@/components/dark/TimePicker";

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/>
  </svg>
);

const CalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

function FieldRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="field-row">
      <div className="field-icon">{icon}</div>
      <div className="field-main">
        <div className="field-label">{label}</div>
        <div className="field-input">{children}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [lightDate, setLightDate] = useState("");
  const [lightTime, setLightTime] = useState("");
  const [darkDate, setDarkDate] = useState("");
  const [darkTime, setDarkTime] = useState("");

  return (
    <>
      <div className="layout">

        {/* ====== LIGHT PANEL ====== */}
        <div className="panel panel--light">
          <div className="panel-inner">

            {/* Badge */}
            <div className="badge badge--light">Light Mode</div>

            {/* Card */}
            <div className="card card--light">
              <div className="card-head">
                <p className="card-eyebrow">Book your ride</p>
                <h2 className="card-title">When do you need us?</h2>
              </div>

              <div className="card-fields">
                <FieldRow icon={<CalIcon />} label="Date">
                  <LightDatePicker value={lightDate} onChange={setLightDate} placeholder="Select a date" />
                </FieldRow>
                <FieldRow icon={<ClockIcon />} label="Time">
                  <LightTimePicker value={lightTime} onChange={setLightTime} placeholder="Select a time" />
                </FieldRow>
              </div>

              {(lightDate || lightTime) ? (
                <div className="card-result card-result--light">
                  <span className="result-dot result-dot--light" />
                  <span>
                    {[lightDate, lightTime].filter(Boolean).join(" at ")}
                  </span>
                </div>
              ) : (
                <div className="card-hint">Click a field to open the picker</div>
              )}

              <button className="cta cta--light" type="button">Continue</button>
            </div>

            {/* Component label */}
            <div className="comp-label comp-label--light">
              <code>components/light/</code>
            </div>
          </div>
        </div>

        {/* ====== DARK PANEL ====== */}
        <div className="panel panel--dark bd-page">
          <div className="panel-inner">

            <div className="badge badge--dark">Dark Mode</div>

            <div className="card card--dark">
              <div className="card-head">
                <p className="card-eyebrow card-eyebrow--dark">Book your ride</p>
                <h2 className="card-title card-title--dark">When do you need us?</h2>
              </div>

              <div className="card-fields card-fields--dark">
                <div className="bd-inf-row">
                  <div className="bd-inf-ico">
                    <CalIcon />
                  </div>
                  <div className="bd-inf-row__main">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="dark-field-label">Date</div>
                      <DarkDatePicker value={darkDate} onChange={setDarkDate} placeholder="Select a date" />
                    </div>
                  </div>
                </div>
                <div className="bd-inf-row">
                  <div className="bd-inf-ico">
                    <ClockIcon />
                  </div>
                  <div className="bd-inf-row__main">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="dark-field-label">Time</div>
                      <DarkTimePicker value={darkTime} onChange={setDarkTime} placeholder="Select a time" />
                    </div>
                  </div>
                </div>
              </div>

              {(darkDate || darkTime) ? (
                <div className="card-result card-result--dark">
                  <span className="result-dot result-dot--dark" />
                  <span>
                    {[darkDate, darkTime].filter(Boolean).join(" at ")}
                  </span>
                </div>
              ) : (
                <div className="card-hint card-hint--dark">Click a field to open the picker</div>
              )}

              <button className="cta cta--dark" type="button">Continue</button>
            </div>

            <div className="comp-label comp-label--dark">
              <code>components/dark/</code>
            </div>
          </div>
        </div>
      </div>

      {/* ====== HEADER OVERLAY ====== */}
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-date-time-picker.png" alt="Date Time Picker" width={28} height={28} />
            <span>date-time-picker</span>
          </div>
          <a
            href="https://github.com/Rixouu/date-time-picker"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <GitHubIcon />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      <style jsx global>{`
        html, body { margin: 0; padding: 0; height: 100%; }

        /* ── Layout: two equal columns, full viewport ── */
        .layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }

        @media (max-width: 700px) {
          .layout { grid-template-columns: 1fr; }
        }

        /* ── Panels ── */
        .panel { display: flex; align-items: center; justify-content: center; }
        .panel--light { background: #f4f4f5; }
        .panel--dark  { background: #050505; }

        .panel-inner {
          width: 100%;
          max-width: 360px;
          padding: 100px 24px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        /* ── Badges ── */
        .badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 99px;
          align-self: flex-start;
        }
        .badge--light { color: #FF2800; background: rgba(255,40,0,0.08); }
        .badge--dark  { color: #FF2800; background: rgba(255,40,0,0.12); }

        /* ── Cards ── */
        .card {
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
        }
        .card--light {
          background: #fff;
          border: 1px solid #e4e4e7;
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
        }
        .card--dark {
          background: #0c0c0c;
          border: 1px solid #262626;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
        }

        /* ── Card head ── */
        .card-head { padding: 24px 24px 0; }
        .card-eyebrow {
          margin: 0 0 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #FF2800;
        }
        .card-eyebrow--dark { color: #FF2800; }
        .card-title { margin: 0; font-size: 18px; font-weight: 700; color: #18181b; letter-spacing: -0.02em; }
        .card-title--dark { color: #fafafa; }

        /* ── Card fields (light) ── */
        .card-fields { padding: 20px 24px 4px; display: flex; flex-direction: column; gap: 0; }

        .field-row {
          display: flex;
          align-items: stretch;
          gap: 12px;
          min-height: 48px;
          border-bottom: 1px solid #e4e4e7;
          padding: 6px 0;
        }
        .field-icon {
          display: flex;
          align-items: center;
          color: #FF2800;
          width: 20px;
          flex-shrink: 0;
        }
        .field-main { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
        .field-label { font-size: 10px; font-weight: 700; color: #a1a1aa; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2px; }
        .field-input { font-size: 14px; color: #18181b; }

        /* ── Card fields (dark) ── */
        .card-fields--dark { padding: 20px 24px 4px; }
        .card-fields--dark .bd-inf-row { padding: 6px 0; min-height: 48px; }
        .dark-field-label { font-size: 10px; font-weight: 700; color: rgba(163,163,163,0.6); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2px; }

        /* ── Result row ── */
        .card-result {
          margin: 12px 24px;
          padding: 10px 14px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
        }
        .card-result--light { background: #f4f4f5; color: #18181b; }
        .card-result--dark  { background: #050505; color: #fafafa; border: 1px solid #1f1f1f; }

        .result-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }
        .result-dot--light { background: #FF2800; }
        .result-dot--dark  { background: #FF2800; }

        .card-hint { margin: 12px 24px; font-size: 12px; color: #a1a1aa; }
        .card-hint--dark { color: rgba(163,163,163,0.45); }

        /* ── CTA button ── */
        .cta {
          display: block;
          width: calc(100% - 48px);
          margin: 12px 24px 24px;
          padding: 13px;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s;
        }
        .cta:hover { opacity: 0.88; }
        .cta--light { background: #18181b; color: #fff; }
        .cta--dark  { background: #FF2800; color: #fff; }

        /* ── Component label ── */
        .comp-label { align-self: flex-start; }
        .comp-label code {
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .comp-label--light code { background: #e4e4e7; color: #52525b; }
        .comp-label--dark  code { background: #1f1f1f; color: #a3a3a3; }

        /* ── Site header ── */
        .site-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          pointer-events: none;
        }
        .site-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          pointer-events: all;
        }
        .site-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #18181b;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(8px);
          padding: 6px 12px 6px 8px;
          border-radius: 10px;
          border: 1px solid #e4e4e7;
        }
        .site-logo img { border-radius: 6px; }
        .github-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(8px);
          color: #fff;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.08);
          transition: background 0.15s;
        }
        .github-link:hover { background: rgba(15, 23, 42, 0.98); }

        /* Dark panel SVG strokes */
        .panel--dark svg { stroke: #a3a3a3; }
        .panel--dark .bd-inf-ico svg { stroke: #FF2800; }
      `}</style>
    </>
  );
}
