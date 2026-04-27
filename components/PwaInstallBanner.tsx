"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_INSTALLED = "dtp-pwa-installed";
const STORAGE_SNOOZE_UNTIL = "dtp-pwa-snooze-until";
const SNOOZE_MS = 21 * 24 * 60 * 60 * 1000;
const IOS_FALLBACK_MS = 1800;

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iphone|ipod|ipad/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function iosFlavor(): "safari" | "chrome" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/CriOS\//i.test(ua) || /EdgiOS\//i.test(ua)) return "chrome";
  if (/Safari/i.test(ua) && /Mobile\//i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua)) return "safari";
  return "other";
}

function isSnoozed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_SNOOZE_UNTIL);
    if (!raw) return false;
    const until = Number(raw);
    return Number.isFinite(until) && Date.now() < until;
  } catch { return false; }
}

function snooze(): void {
  try { localStorage.setItem(STORAGE_SNOOZE_UNTIL, String(Date.now() + SNOOZE_MS)); } catch { /* */ }
}

function markInstalled(): void {
  try { localStorage.setItem(STORAGE_INSTALLED, "1"); } catch { /* */ }
}

function wasInstalled(): boolean {
  try { return localStorage.getItem(STORAGE_INSTALLED) === "1"; } catch { return false; }
}

const IosSteps: Record<"safari" | "chrome" | "other", string> = {
  safari: 'Tap the Share button at the bottom of the screen, then tap "Add to Home Screen".',
  chrome: 'Tap the share icon in the toolbar, then tap "Add to Home Screen".',
  other: 'Open this page in Safari, then use Share and select "Add to Home Screen".',
};

export default function PwaInstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [flavor, setFlavor] = useState<"safari" | "chrome" | "other">("other");
  const [installing, setInstalling] = useState(false);

  useEffect(() => { deferredRef.current = deferred; }, [deferred]);
  useEffect(() => { if (iosHint) setFlavor(iosFlavor()); }, [iosHint]);

  const dismiss = useCallback(() => {
    snooze();
    setDeferred(null);
    setIosHint(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone() || wasInstalled() || isSnoozed()) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      markInstalled();
      setDeferred(null);
      setIosHint(false);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    const t = window.setTimeout(() => {
      if (deferredRef.current || isStandalone() || wasInstalled() || isSnoozed()) return;
      if (isIos()) setIosHint(true);
    }, IOS_FALLBACK_MS);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.clearTimeout(t);
    };
  }, []);

  const onInstall = async () => {
    if (!deferred || installing) return;
    setInstalling(true);
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } finally {
      setInstalling(false);
      setDeferred(null);
    }
  };

  const showChrome = deferred != null;
  const showIos = iosHint && !showChrome;
  if (!showChrome && !showIos) return null;

  return (
    <div className="pwa-banner" role="region" aria-label="Install app">
      {/* Icon */}
      <img
        src="/icon-192.png"
        alt="Date Time Picker icon"
        width={44}
        height={44}
        className="pwa-banner-icon"
      />

      {/* Text */}
      <div className="pwa-banner-text">
        {showIos ? (
          <>
            <p className="pwa-banner-title">Add to Home Screen</p>
            <p className="pwa-banner-body">{IosSteps[flavor]}</p>
          </>
        ) : (
          <>
            <p className="pwa-banner-title">Date &amp; Time Picker</p>
            <p className="pwa-banner-body">Install as an app for quick access.</p>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="pwa-banner-actions">
        {showChrome && (
          <button
            type="button"
            className="pwa-btn pwa-btn--install"
            disabled={installing}
            onClick={() => void onInstall()}
          >
            {installing ? "Installing…" : "Install"}
          </button>
        )}
        <button
          type="button"
          className="pwa-btn pwa-btn--dismiss"
          onClick={dismiss}
          aria-label="Dismiss"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .pwa-banner {
          position: fixed;
          top: max(12px, env(safe-area-inset-top, 0px));
          left: 12px;
          right: 12px;
          z-index: 9000;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 10px 12px 12px;
          background: rgba(5, 5, 5, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          max-width: 480px;
          margin: 0 auto;
        }

        .pwa-banner-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          flex-shrink: 0;
          object-fit: cover;
        }

        .pwa-banner-text {
          flex: 1;
          min-width: 0;
        }

        .pwa-banner-title {
          margin: 0 0 2px;
          font-size: 14px;
          font-weight: 700;
          color: #fafafa;
          letter-spacing: -0.01em;
        }

        .pwa-banner-body {
          margin: 0;
          font-size: 11px;
          color: rgba(250, 250, 250, 0.55);
          line-height: 1.4;
        }

        .pwa-banner-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .pwa-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s;
        }

        .pwa-btn:hover { opacity: 0.8; }

        .pwa-btn--install {
          padding: 7px 14px;
          background: #029688;
          color: #fff;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .pwa-btn--install:disabled { opacity: 0.6; cursor: not-allowed; }

        .pwa-btn--dismiss {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.07);
          color: rgba(250, 250, 250, 0.5);
          border-radius: 8px;
        }

        .pwa-btn--dismiss:hover { background: rgba(255, 255, 255, 0.12); color: #fafafa; }
      `}</style>
    </div>
  );
}
