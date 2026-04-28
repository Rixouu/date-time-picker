'use client';

import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import './pwa-banner.css';

export function PWAInstallBanner() {
  const { isInstallable, isIOS, isStandalone, installPWA } = usePWA();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner if installable and not already standalone
    if ((isInstallable || isIOS) && !isStandalone) {
      const timer = setTimeout(() => {
        // Check local storage to see if user dismissed it in this session
        const dismissed = sessionStorage.getItem('pwa-banner-dismissed');
        if (!dismissed) {
          setShowBanner(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isIOS, isStandalone]);

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="pwa-banner-fixed">
      <div className="pwa-banner-container">
        <div className="pwa-banner-info">
          <div className="pwa-banner-icon">
            <Download size={24} />
          </div>
          <div className="pwa-banner-content">
            <h3>Install Date & Time</h3>
            <p>Add to home screen for the best experience</p>
          </div>
        </div>
        
        <div className="pwa-banner-actions">
          {isIOS ? (
            <div className="pwa-ios-instructions">
              <span>Tap</span> <Share size={14} /> <span>then &quot;Add to Home Screen&quot;</span>
            </div>
          ) : (
            <button 
              onClick={installPWA}
              className="pwa-install-btn"
            >
              Install
            </button>
          )}
          <button 
            onClick={handleDismiss}
            className="pwa-close-btn"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
