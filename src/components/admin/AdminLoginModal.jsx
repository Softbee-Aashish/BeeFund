import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './AdminLoginModal.css';

const AdminLoginModal = () => {
    const { isLoginModalOpen, closeLoginModal, login, isLocked, secondsLeftInLockout } = useAdminAuth();
    const [passkey, setPasskey] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoginModalOpen) {
            setPasskey('');
            setHoneypot('');
            setErrorMessage('');
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isLoginModalOpen]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isLoginModalOpen) {
                closeLoginModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLoginModalOpen, closeLoginModal]);

    if (!isLoginModalOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLocked) return;

        if (!passkey.trim()) {
            setErrorMessage('Please enter the security passkey.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        const res = login(passkey, honeypot);
        setIsSubmitting(false);

        if (res.success) {
            navigate('/admin-studio');
        } else {
            setErrorMessage(res.error || 'Access denied.');
            setPasskey('');
        }
    };

    const formatLockout = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="admin-modal-overlay" onClick={closeLoginModal}>
            <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
                <button className="admin-modal-close" onClick={closeLoginModal} aria-label="Close modal">
                    &times;
                </button>

                <div className="admin-modal-header">
                    <div className="admin-modal-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="admin-modal-title">BeeFund Control Terminal</h3>
                        <p className="admin-modal-subtitle">Authorized Administrator Authentication</p>
                    </div>
                </div>

                {isLocked ? (
                    <div className="admin-lockout-banner">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <div>
                            <strong>Terminal Locked</strong>
                            <p>Anti-brute force barrier active. Unlocks in {formatLockout(secondsLeftInLockout)}.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="admin-modal-form">
                        {/* Honeypot field - visually hidden to trap bots */}
                        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                            <input
                                type="text"
                                name="website_url_trap"
                                tabIndex="-1"
                                autoComplete="off"
                                value={honeypot}
                                onChange={e => setHoneypot(e.target.value)}
                            />
                        </div>

                        <div className="admin-input-group">
                            <label htmlFor="admin-passkey" className="admin-input-label">
                                Master Passkey
                            </label>
                            <div className="admin-password-wrapper">
                                <input
                                    id="admin-passkey"
                                    ref={inputRef}
                                    type={showPassword ? 'text' : 'password'}
                                    className="admin-input-field"
                                    placeholder="Enter authorization key..."
                                    value={passkey}
                                    onChange={e => setPasskey(e.target.value)}
                                    autoComplete="current-password"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    className="admin-pw-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                    title={showPassword ? 'Hide passkey' : 'Show passkey'}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="admin-error-alert">
                                <span>⚠️</span>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <div className="admin-modal-actions">
                            <button
                                type="button"
                                className="admin-btn-cancel"
                                onClick={closeLoginModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="admin-btn-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Authenticating...' : 'Authenticate & Enter Studio'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="admin-modal-footer-hint">
                    <span>Press <code>Esc</code> to exit &bull; Multi-tier brute-force protected</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginModal;
