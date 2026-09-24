import React, { useEffect, useRef } from 'react';
import './AdSenseSlot.css';

/**
 * Google AdSense Compliant Ad Container
 * 
 * Behavior:
 * - If NO active Google AdSense Client ID is configured, it renders NOTHING (completely hidden, returns null).
 * - When configured (e.g. VITE_ADSENSE_CLIENT_ID is set), it renders the official Google AdSense <ins> tag with compliant labels.
 */
const AdSenseSlot = ({
    slotType = 'top-leaderboard', // 'top-leaderboard' | 'sidebar-rectangle' | 'sidebar-halfpage' | 'in-article' | 'bottom-banner'
    clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || '',
    slotId = '',
    format = 'auto',
    className = ''
}) => {
    const adRef = useRef(null);
    const isLive = Boolean(clientId);

    useEffect(() => {
        if (isLive && slotId) {
            try {
                if (typeof window !== 'undefined') {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
            } catch (e) {
                console.warn('AdSense notice:', e);
            }
        }
    }, [isLive, slotId]);

    // Completely hide when no ads are active (zero random/dummy data)
    if (!isLive) {
        return null;
    }

    return (
        <aside
            className={`adsense-wrapper adsense-${slotType} ${className}`}
            aria-label="Advertisement"
        >
            <div className="adsense-label-row">
                <span className="adsense-label">ADVERTISEMENT</span>
                <span className="adsense-info-badge" title="Google AdSense Verified Ad Placement">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Ad
                </span>
            </div>

            <div className="adsense-content-box" ref={adRef}>
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client={clientId}
                    data-ad-slot={slotId || undefined}
                    data-ad-format={format}
                    data-full-width-responsive="true"
                />
            </div>
        </aside>
    );
};

export default AdSenseSlot;
