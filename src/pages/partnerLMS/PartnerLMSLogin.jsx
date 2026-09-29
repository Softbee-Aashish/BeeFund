import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePartnerLMS } from './PartnerLMSAuthContext';
import { PARTNER_LMS_CREDENTIALS } from './lmsData';
import './PartnerLMSLogin.css';

const PartnerLMSLogin = () => {
    const navigate = useNavigate();
    const { login, authError, isLoading } = usePartnerLMS();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!email.trim() || !password.trim()) return;

        const res = await login(email, password);
        if (res.success) {
            navigate('/partnerLMS/dashboard');
        }
    };

    const handleAutoFill = () => {
        setEmail(PARTNER_LMS_CREDENTIALS.email);
        setPassword(PARTNER_LMS_CREDENTIALS.password);
    };

    return (
        <div className="partner-lms-login-root">
            <div className="lms-login-card">
                <div className="lms-login-header">
                    <Link to="/partnerLMS" className="lms-brand-link">
                        <span className="lms-brand-bee">BEE</span>
                        <span className="lms-brand-fund">FUND</span>
                        <span className="lms-brand-badge">PARTNER LMS</span>
                    </Link>
                    <h2>Institutional Partner Login</h2>
                    <p>Enter your assigned Partner credentials to access your Case Underwriting Dashboard.</p>
                </div>

                {authError && (
                    <div className="lms-error-alert" role="alert">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <span>{authError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="lms-login-form">
                    <div className="lms-form-group">
                        <label htmlFor="lms-email">Facilitator / Partner User ID</label>
                        <input
                            id="lms-email"
                            type="text"
                            className={`lms-input ${submitted && !email ? 'has-error' : ''}`}
                            placeholder="e.g. dsa@beefund.in or ID: 15141"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="lms-form-group">
                        <div className="label-flex">
                            <label htmlFor="lms-pass">Security Key / Password</label>
                            <span className="forgot-hint" onClick={() => alert('Pilot Demo Mode: Click "1-Click Auto-Fill Demo Access" below.')}>Need Help?</span>
                        </div>
                        <input
                            id="lms-pass"
                            type="password"
                            className={`lms-input ${submitted && !password ? 'has-error' : ''}`}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-lms-login" disabled={isLoading}>
                        {isLoading ? 'Authenticating Case Access...' : 'Sign In to Case LMS'}
                    </button>
                </form>

                {/* Pilot Demo Box */}
                <div className="lms-demo-box">
                    <div className="demo-header-row">
                        <span className="demo-tag">PILOT ACCESS CREDENTIALS</span>
                        <button type="button" onClick={handleAutoFill} className="btn-autofill-action">
                            1-Click Auto-Fill
                        </button>
                    </div>
                    <div className="demo-row">
                        <span>User ID:</span>
                        <code>dsa@beefund.in</code>
                    </div>
                    <div className="demo-row">
                        <span>Password:</span>
                        <code>partnerlms123</code>
                    </div>
                    <div className="demo-info">
                        Facilitator: <strong>Aadyashiv Consulting Pvt Ltd (ID: 15141)</strong>
                    </div>
                </div>

                <div className="lms-login-footer">
                    <span>Back to public website? </span>
                    <Link to="/" className="link-highlight">BeeFund Home</Link>
                </div>
            </div>
        </div>
    );
};

export default PartnerLMSLogin;
