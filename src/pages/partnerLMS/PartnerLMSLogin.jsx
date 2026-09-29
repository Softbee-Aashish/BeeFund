import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePartnerLMS } from './PartnerLMSAuthContext';
import { PARTNER_LMS_CREDENTIALS } from './lmsData';
import './PartnerLMSLogin.css';

const PartnerLMSLogin = () => {
    const navigate = useNavigate();
    const { login, authError, isLoading, setPartnerProfile } = usePartnerLMS();

    // Mode: 'login' | 'signup'
    const [authMode, setAuthMode] = useState('login');

    // Login Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSubmitted, setLoginSubmitted] = useState(false);

    // Sign Up / Onboarding Form State
    const [signupForm, setSignupForm] = useState({
        firmName: '',
        contactPerson: '',
        category: 'DSA / Loan Consultant',
        email: '',
        phone: '',
        pan: '',
        city: '',
        state: '',
        expectedVolume: '₹5 Cr – ₹20 Cr / month'
    });
    const [signupSubmitted, setSignupSubmitted] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginSubmitted(true);
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

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        setSignupSubmitted(true);

        if (!signupForm.firmName || !signupForm.contactPerson || !signupForm.email || !signupForm.phone) {
            return;
        }

        // Generate simulated dynamic facilitator ID
        const generatedFacilitatorId = Math.floor(10000 + Math.random() * 90000).toString();
        const newProfile = {
            facilitatorId: generatedFacilitatorId,
            leadId: '21008',
            name: signupForm.firmName,
            primaryContact: signupForm.contactPerson,
            email: signupForm.email,
            phone: signupForm.phone,
            pan: (signupForm.pan || 'ABCDE1234F').toUpperCase(),
            address: `${signupForm.city || 'Connaught Place'}, ${signupForm.state || 'New Delhi'}`,
            tier: 'Institutional Channel Partner',
            walletBalance: 10000, // ₹10,000 complimentary onboarding balance
            activeCases: 0,
            disbursedVolume: '₹0.0 Cr',
            sanctionRatio: '100.0%'
        };

        if (setPartnerProfile) {
            setPartnerProfile(newProfile);
        }

        setSignupSuccess(true);
        setTimeout(async () => {
            await login(PARTNER_LMS_CREDENTIALS.email, PARTNER_LMS_CREDENTIALS.password);
            navigate('/partnerLMS/dashboard');
        }, 1500);
    };

    return (
        <div className="partner-portal-wrapper">
            {/* Dedicated Top Institutional Bar */}
            <header className="portal-standalone-header">
                <div className="portal-header-container">
                    <div className="portal-header-brand">
                        <Link to="/partnerLMS" className="brand-logo-txt">
                            <span className="logo-b-gold">BEE</span>
                            <span className="logo-b-white">FUND</span>
                            <span className="logo-portal-tag">PARTNER LMS</span>
                        </Link>
                        <span className="portal-env-badge">INSTITUTIONAL B2B CREDIT DESK</span>
                    </div>

                    <div className="portal-header-actions">
                        <Link to="/" className="btn-return-main">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            <span>Back to BeeFund.in</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="partner-portal-body">
                <div className="partner-layout-grid">
                    {/* Left Column: Platform Capabilities & Value Matrix */}
                    <div className="portal-feature-overview">
                        <div className="portal-badge-pill">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            <span>DSA, CA & Financial Advisor Workspace</span>
                        </div>

                        <h1 className="portal-headline">
                            Automated Underwriting & <br />
                            <span className="gold-text">Institutional Loan Management</span>
                        </h1>

                        <p className="portal-subtext">
                            A private, data-driven credit origination and underwriting system engineered for high-ticket commercial, MSME, and project finance proposals (₹10 Lakhs to ₹50 Crores).
                        </p>

                        <div className="portal-value-props">
                            <div className="val-prop-item">
                                <div className="val-icon-box icon-gold">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                </div>
                                <div className="val-text">
                                    <h4>Streamlined 10-Step Case Underwriting</h4>
                                    <p>Structured KYC, Promoter shareholding, 3-Year financials, self-certified net worth statement, and primary security hypothecation.</p>
                                </div>
                            </div>

                            <div className="val-prop-item">
                                <div className="val-icon-box icon-blue">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                </div>
                                <div className="val-text">
                                    <h4>Automated Bank Statement Analyzer (BSA)</h4>
                                    <p>Upload multi-account bank statements for instant Average Bank Balance (ABB), inward clearing velocity, and EMI bounce detection.</p>
                                </div>
                            </div>

                            <div className="val-prop-item">
                                <div className="val-icon-box icon-emerald">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v12M17 10h-7.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6"></path></svg>
                                </div>
                                <div className="val-text">
                                    <h4>GST & ITR Verification Engine</h4>
                                    <p>Cross-reconcile declared turnover with GSTR-3B filings and 2A/2B input tax credits to identify circular turnover patterns.</p>
                                </div>
                            </div>

                            <div className="val-prop-item">
                                <div className="val-icon-box icon-purple">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                </div>
                                <div className="val-text">
                                    <h4>0–100 Objective Case Scorecard & Dossier</h4>
                                    <p>Get instant algorithmic debt-service coverage ratio (DSCR), risk ratings, and exportable bank-ready credit dossiers in seconds.</p>
                                </div>
                            </div>
                        </div>

                        {/* Pilot Quick Fill Tag */}
                        <div className="portal-pilot-card">
                            <div className="pilot-card-top">
                                <span className="pilot-indicator"></span>
                                <strong>Evaluation Mode Enabled</strong>
                            </div>
                            <p>Pre-loaded institutional sandbox with sample cases, live scorecards, and ₹8,500 API test wallet balance.</p>
                        </div>
                    </div>

                    {/* Right Column: Tabbed Sign In / Onboarding Portal Card */}
                    <div className="portal-auth-card-container">
                        <div className="portal-auth-card">
                            {/* Tab Switcher */}
                            <div className="auth-tab-bar">
                                <button
                                    type="button"
                                    className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                                    onClick={() => setAuthMode('login')}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                                    <span>Partner Sign In</span>
                                </button>
                                <button
                                    type="button"
                                    className={`auth-tab-btn ${authMode === 'signup' ? 'active' : ''}`}
                                    onClick={() => setAuthMode('signup')}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                                    <span>Apply for Partner Access</span>
                                </button>
                            </div>

                            {/* TAB 1: SIGN IN */}
                            {authMode === 'login' && (
                                <div className="auth-tab-content">
                                    <div className="auth-form-header">
                                        <h3>Institutional Facilitator Sign In</h3>
                                        <p>Access your cases, underwriting pipeline, and client reports.</p>
                                    </div>

                                    {authError && (
                                        <div className="portal-error-alert" role="alert">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                            <span>{authError}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleLoginSubmit} className="portal-form">
                                        <div className="form-group">
                                            <label htmlFor="p-login-id">Partner User ID or Registered Email</label>
                                            <input
                                                id="p-login-id"
                                                type="text"
                                                className={`portal-input ${loginSubmitted && !email ? 'error' : ''}`}
                                                placeholder="e.g. dsa@beefund.in or ID: 15141"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <div className="label-row">
                                                <label htmlFor="p-login-pass">Security Key / Password</label>
                                                <button
                                                    type="button"
                                                    className="link-helper"
                                                    onClick={handleAutoFill}
                                                >
                                                    Use Demo Passkey
                                                </button>
                                            </div>
                                            <input
                                                id="p-login-pass"
                                                type="password"
                                                className={`portal-input ${loginSubmitted && !password ? 'error' : ''}`}
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>

                                        <button type="submit" className="btn-portal-submit" disabled={isLoading}>
                                            {isLoading ? 'Authenticating Institutional Credentials...' : 'Sign In to Partner LMS →'}
                                        </button>
                                    </form>

                                    {/* 1-Click Pilot Access Box */}
                                    <div className="demo-credentials-card">
                                        <div className="demo-top">
                                            <span className="demo-tag">PILOT ACCESS PRESET</span>
                                            <button type="button" onClick={handleAutoFill} className="btn-quick-autofill">
                                                ⚡ 1-Click Fill & Sign In
                                            </button>
                                        </div>
                                        <div className="demo-field-row">
                                            <span className="demo-lbl">User ID:</span>
                                            <code>dsa@beefund.in</code>
                                        </div>
                                        <div className="demo-field-row">
                                            <span className="demo-lbl">Password:</span>
                                            <code>partnerlms123</code>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: SIGN UP / ONBOARDING */}
                            {authMode === 'signup' && (
                                <div className="auth-tab-content">
                                    <div className="auth-form-header">
                                        <h3>Channel Partner Registration</h3>
                                        <p>Onboard your firm as an authorized DSA, CA, or institutional broker.</p>
                                    </div>

                                    {signupSuccess ? (
                                        <div className="portal-success-splash">
                                            <div className="success-icon-wrap">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <h4>Registration Successful!</h4>
                                            <p>Allocating Partner Facilitator ID & ₹10,000 complimentary test wallet balance. Launching workspace...</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSignupSubmit} className="portal-form">
                                            <div className="form-row-2">
                                                <div className="form-group">
                                                    <label>Firm / Entity Name *</label>
                                                    <input
                                                        type="text"
                                                        name="firmName"
                                                        className={`portal-input ${signupSubmitted && !signupForm.firmName ? 'error' : ''}`}
                                                        placeholder="e.g. Apex Financial Advisory"
                                                        value={signupForm.firmName}
                                                        onChange={handleSignupChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Authorized Signatory *</label>
                                                    <input
                                                        type="text"
                                                        name="contactPerson"
                                                        className={`portal-input ${signupSubmitted && !signupForm.contactPerson ? 'error' : ''}`}
                                                        placeholder="e.g. Amit Sharma"
                                                        value={signupForm.contactPerson}
                                                        onChange={handleSignupChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-row-2">
                                                <div className="form-group">
                                                    <label>Partner Type *</label>
                                                    <select
                                                        name="category"
                                                        className="portal-input"
                                                        value={signupForm.category}
                                                        onChange={handleSignupChange}
                                                    >
                                                        <option value="DSA / Loan Consultant">DSA / Loan Consultant</option>
                                                        <option value="Chartered Accountant (CA)">Chartered Accountant (CA)</option>
                                                        <option value="Wealth & Financial Planner">Wealth & Financial Planner</option>
                                                        <option value="NBFC / Bank Sub-Broker">NBFC / Bank Sub-Broker</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Entity / Individual PAN</label>
                                                    <input
                                                        type="text"
                                                        name="pan"
                                                        className="portal-input"
                                                        placeholder="e.g. ABCDE1234F"
                                                        maxLength="10"
                                                        value={signupForm.pan}
                                                        onChange={(e) => setSignupForm(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-row-2">
                                                <div className="form-group">
                                                    <label>Official Email *</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className={`portal-input ${signupSubmitted && !signupForm.email ? 'error' : ''}`}
                                                        placeholder="name@firm.in"
                                                        value={signupForm.email}
                                                        onChange={handleSignupChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Mobile Number *</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        className={`portal-input ${signupSubmitted && !signupForm.phone ? 'error' : ''}`}
                                                        placeholder="10-digit mobile"
                                                        maxLength="10"
                                                        value={signupForm.phone}
                                                        onChange={handleSignupChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-row-2">
                                                <div className="form-group">
                                                    <label>Operating City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        className="portal-input"
                                                        placeholder="e.g. Mumbai / Delhi NCR"
                                                        value={signupForm.city}
                                                        onChange={handleSignupChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Monthly Origination Target</label>
                                                    <select
                                                        name="expectedVolume"
                                                        className="portal-input"
                                                        value={signupForm.expectedVolume}
                                                        onChange={handleSignupChange}
                                                    >
                                                        <option value="₹1 Cr – ₹5 Cr / month">₹1 Cr – ₹5 Cr / month</option>
                                                        <option value="₹5 Cr – ₹20 Cr / month">₹5 Cr – ₹20 Cr / month</option>
                                                        <option value="₹20 Cr+ / month">₹20 Cr+ / month</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <button type="submit" className="btn-portal-submit">
                                                Complete Onboarding & Access Portal →
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PartnerLMSLogin;
