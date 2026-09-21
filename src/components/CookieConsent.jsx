import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('beefund_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('beefund_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('beefund_cookie_consent', 'essential_only');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <aside className="cookie-consent-bar" role="dialog" aria-live="polite" aria-label="Cookie and Privacy Consent">
            <div className="container cookie-consent-inner">
                <div className="cookie-consent-text">
                    <span className="cookie-icon" aria-hidden="true">🍪</span>
                    <p>
                        We use cookies, including third-party advertising cookies from Google AdSense, to improve your experience, analyze site usage, and serve personalized ads. By using our site, you agree to our{' '}
                        <Link to="/privacy" className="cookie-policy-link">Privacy & Cookie Policy</Link>.
                    </p>
                </div>
                <div className="cookie-consent-actions">
                    <button type="button" onClick={handleDecline} className="btn-cookie-ghost">
                        Essential Only
                    </button>
                    <button type="button" onClick={handleAccept} className="btn-cookie-accept">
                        Accept All
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default CookieConsent;
