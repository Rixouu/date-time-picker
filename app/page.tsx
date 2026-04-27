"use client";
import { useState } from "react";
import DatePicker from "@/components/ui/picker/DatePicker";
import TimePicker from "@/components/ui/picker/TimePicker";

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
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");

  return (
    <>
      <div className="layout">

        {/* ====== LIGHT PANEL ====== */}
        <div className="panel panel--light">
          <div className="panel-inner">

            <div className="badge badge--light">Light Theme</div>

            <div className="card card--light">
              <div className="card-head">
                <p className="card-eyebrow">Book your ride</p>
                <h2 className="card-title">Standard Light</h2>
              </div>

              <div className="card-fields">
                <FieldRow icon={<div style={{ color: '#FF2800' }}><CalIcon /></div>} label="Date">
                  <DatePicker value={lightDate} onChange={setLightDate} theme="light" accentColor="#FF2800" />
                </FieldRow>
                <FieldRow icon={<div style={{ color: '#FF2800' }}><ClockIcon /></div>} label="Time">
                  <TimePicker value={lightTime} onChange={setLightTime} theme="light" accentColor="#FF2800" />
                </FieldRow>
              </div>

              {(lightDate || lightTime) ? (
                <div className="card-result card-result--light">
                  <span className="result-dot" />
                  <span>{[lightDate, lightTime].filter(Boolean).join(" at ")}</span>
                </div>
              ) : (
                <div className="card-hint">Default light mode settings</div>
              )}

              <button className="cta cta--light" type="button">Continue</button>
            </div>

            {/* Custom Theme Preview */}
            <div className="card card--light" style={{ marginTop: '20px', border: '1px solid #e0e7ff', background: '#f8faff', '--picker-accent': '#6366f1' } as React.CSSProperties}>
              <div className="card-head">
                <p className="card-eyebrow" style={{ color: '#6366f1' }}>Branding Example</p>
                <h2 className="card-title">Custom Indigo</h2>
              </div>
              <div className="card-fields">
                <FieldRow icon={<div style={{ color: '#6366f1' }}><CalIcon /></div>} label="Date">
                  <DatePicker 
                    value={customDate} 
                    onChange={setCustomDate} 
                    theme="light" 
                    accentColor="#6366f1" 
                    borderRadius="12px"
                  />
                </FieldRow>
                <FieldRow icon={<div style={{ color: '#6366f1' }}><ClockIcon /></div>} label="Time">
                  <TimePicker 
                    value={customTime} 
                    onChange={setCustomTime} 
                    theme="light" 
                    accentColor="#6366f1" 
                    borderRadius="12px"
                  />
                </FieldRow>
              </div>
              <button className="cta" style={{ background: '#6366f1', color: 'white' }} type="button">Custom Style</button>
            </div>
          </div>
        </div>

        {/* ====== DARK PANEL ====== */}
        <div className="panel panel--dark">
          <div className="panel-inner">

            <div className="badge badge--dark">Dark Theme</div>

            <div className="card card--dark">
              <div className="card-head">
                <p className="card-eyebrow">Book your ride</p>
                <h2 className="card-title card-title--dark">Standard Dark</h2>
              </div>

              <div className="card-fields card-fields--dark">
                <FieldRow icon={<div style={{ color: '#FF2800' }}><CalIcon /></div>} label="Date">
                  <DatePicker value={darkDate} onChange={setDarkDate} theme="dark" accentColor="#FF2800" />
                </FieldRow>
                <FieldRow icon={<div style={{ color: '#FF2800' }}><ClockIcon /></div>} label="Time">
                  <TimePicker value={darkTime} onChange={setDarkTime} theme="dark" accentColor="#FF2800" />
                </FieldRow>
              </div>

              {(darkDate || darkTime) ? (
                <div className="card-result card-result--dark">
                  <span className="result-dot" />
                  <span>{[darkDate, darkTime].filter(Boolean).join(" at ")}</span>
                </div>
              ) : (
                <div className="card-hint card-hint--dark">Default dark mode settings</div>
              )}

              <button className="cta cta--dark" type="button">Continue</button>
            </div>

            <div className="comp-label comp-label--dark">
              <code>components/ui/picker/</code>
            </div>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-logo">
            <img src="/icon-date-time-picker.png" alt="Date Time Picker" width={28} height={28} />
            <span>date-time-picker</span>
          </div>
          <a href="https://github.com/Rixouu/date-time-picker" target="_blank" rel="noopener noreferrer" className="github-link">
            <GitHubIcon />
            <span>GitHub</span>
          </a>
        </div>
      </header>
    </>
  );
}
