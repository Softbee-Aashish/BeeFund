import React from 'react';
import { Link } from 'react-router-dom';
import './PartnerLMSLanding.css';

const PartnerLMSLanding = () => {
    return (
        <div className="partner-lms-landing">
            {/* Top Bar Header */}
            <section className="lms-hero">
                <div className="lms-hero-container">
                    <div className="lms-hero-badge">
                        <span>INSTITUTIONAL UNDERWRITING & LOAN LMS</span>
                    </div>
                    <h1 className="lms-hero-title">
                        Next-Gen Credit Underwriting for <br />
                        <span className="text-gradient">DSAs, CAs & Channel Partners</span>
                    </h1>
                    <p className="lms-hero-subtitle">
                        Structure, underwrite, and log bank-grade Project Loans (₹10L to ₹50Cr), Working Capital Facilities,
                        and MSME proposals with automated CIBIL Soft-Pulls, Multi-Bank BSA, and instant Bank Report generation.
                    </p>

                    <div className="lms-hero-actions">
                        <Link to="/partnerLMS/login" className="btn-lms-primary">
                            Enter Partner LMS Portal
                        </Link>
                        <Link to="/partnerLMS/login" className="btn-lms-secondary">
                            View Live Pilot Demo (Apex Polymers ₹3.75 Cr Case)
                        </Link>
                    </div>

                    {/* Stats Strip */}
                    <div className="lms-stats-strip">
                        <div className="lms-stat-box">
                            <span className="stat-num">₹10L – ₹50Cr</span>
                            <span className="stat-desc">Loan Sizing Coverage</span>
                        </div>
                        <div className="stat-sep"></div>
                        <div className="lms-stat-box">
                            <span className="stat-num">10-Step</span>
                            <span className="stat-desc">Institutional Underwriting</span>
                        </div>
                        <div className="stat-sep"></div>
                        <div className="lms-stat-box">
                            <span className="stat-num">₹50 / Pull</span>
                            <span className="stat-desc">Transparent Wallet Economics</span>
                        </div>
                        <div className="stat-sep"></div>
                        <div className="lms-stat-box">
                            <span className="stat-num">10-Page</span>
                            <span className="stat-desc">Exportable Bank Dossier</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Modules Grid */}
            <section className="lms-features-section">
                <div className="lms-container">
                    <div className="section-heading-center">
                        <span className="section-pill">FULL STACK LMS</span>
                        <h2>Engineered for High-Ticket Case Origination</h2>
                        <p>Everything a loan consultant or chartered accountant needs to submit first-time-right credit proposals.</p>
                    </div>

                    <div className="lms-grid-3">
                        <div className="lms-feature-card">
                            <div className="feat-icon icon-gold">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <h3>11-Step Case Underwriting Wizard</h3>
                            <p>From Enterprise Profile, Promoters, and Udyam to Project Cost & Means of Finance balance sheets, DCCO schedules, and IFC environmental compliance.</p>
                        </div>

                        <div className="lms-feature-card">
                            <div className="feat-icon icon-blue">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                            </div>
                            <h3>Account-Level BSA & Wallet Controls</h3>
                            <p>Select specific bank accounts to analyze. Pay only for the accounts you analyze (₹30 for 6M, ₹45 for 12M). Automated Average Bank Balance (ABB) & bounce detection.</p>
                        </div>

                        <div className="lms-feature-card">
                            <div className="feat-icon icon-purple">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v12M17 10h-7.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6"></path></svg>
                            </div>
                            <h3>GST Turnover & ITC Verification</h3>
                            <p>Reconcile declared sales against GSTR-1 and GSTR-3B filings. Detect circular trading patterns, invoice gaps, and revenue discrepancies automatically.</p>
                        </div>

                        <div className="lms-feature-card">
                            <div className="feat-icon icon-green">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            </div>
                            <h3>0–100 Creditworthiness Scorecard</h3>
                            <p>Objective multi-pillar score weighing CIBIL bureau track (30 pts), FOIR/Debt Service (20 pts), Banking Health (20 pts), Income Match (15 pts), and GST Compliance (10 pts).</p>
                        </div>

                        <div className="lms-feature-card">
                            <div className="feat-icon icon-red">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            </div>
                            <h3>Red Flag Early Warning Radar</h3>
                            <p>Flags non-disputed arrears, inward returns, statutory disputes, PEP connections, and collateral encumbrances before presenting the file to banks.</p>
                        </div>

                        <div className="lms-feature-card">
                            <div className="feat-icon icon-emerald">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            </div>
                            <h3>Institutional Dossier PDF & Excel Export</h3>
                            <p>Generate clean, bank-ready PDF proposals with cover sheet, executive summary, promoter net worth, Means of Finance, and e-signatures.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PartnerLMSLanding;
