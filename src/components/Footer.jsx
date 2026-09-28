import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { openLoginModal } = useAdminAuth();
    const clickCountRef = useRef(0);
    const clickTimerRef = useRef(null);

    const handleSecretTrigger = () => {
        clickCountRef.current += 1;
        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        if (clickCountRef.current >= 3) {
            clickCountRef.current = 0;
            openLoginModal();
        } else {
            clickTimerRef.current = setTimeout(() => {
                clickCountRef.current = 0;
            }, 600);
        }
    };

    return (
        <footer className="site-footer">
            <div className="container footer-container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-col footer-brand-col">
                        <Link to="/" className="footer-logo-link">
                            <img src="/logo.png" alt="BeeFund Logo" className="footer-logo" />
                        </Link>
                        <p className="footer-brand-desc">
                            <strong>BeeFund Financial Services</strong> is India’s trusted digital loan partner, debt structuring advisor, and free credit score intelligence platform. Empowering MSMEs and individuals to secure the fastest bank sanctions at the lowest market rates.
                        </p>
                        <div className="footer-trust-badge">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                <span>100% RBI Compliant Bureau Soft Pulls</span>
                            </span>
                        </div>
                    </div>

                    {/* Quick Links / Products */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">Financial Products</h4>
                        <ul className="footer-links">
                            <li><Link to="/products#credit-card">Apply for Credit Card</Link></li>
                            <li><Link to="/products#government">Mudra & PMEGP Schemes</Link></li>
                            <li><Link to="/products#secured">Home Loan & LAP</Link></li>
                            <li><Link to="/products#secured">Machinery & Vehicle Loan</Link></li>
                            <li><Link to="/products#working-capital">Working Capital (OD / CC)</Link></li>
                            <li><Link to="/products#working-capital">Unsecured Business Loan</Link></li>
                        </ul>
                    </div>

                    {/* Financial Tools */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">Financial Calculators</h4>
                        <ul className="footer-links">
                            <li><Link to="/tools/emi-calculator">Loan EMI Calculator</Link></li>
                            <li><Link to="/tools/repayment-schedule">Repayment Schedule Generator</Link></li>
                            <li><Link to="/tools/od-cc-calculator">OD & CC Interest Calculator</Link></li>
                            <li><Link to="/tools/eligibility">Loan Eligibility Checker</Link></li>
                            <li><Link to="/tools/affordability">Home Affordability Tool</Link></li>
                            <li><Link to="/tools/fixed-vs-floating">Fixed vs Floating ROI Tool</Link></li>
                        </ul>
                    </div>

                    {/* Credit & Legal */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">Credit & Compliance</h4>
                        <ul className="footer-links">
                            <li><Link to="/credit-report" className="footer-highlight-link">Check Free CIBIL Score</Link></li>
                            <li><Link to="/credit-score">Credit Report Guide</Link></li>
                            <li><Link to="/terms">Terms & Conditions</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/about">About BeeFund</Link></li>
                            <li><Link to="/contact">Contact & Grievance Desk</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Statutory Disclaimer Bar */}
                <div className="footer-disclaimer-bar">
                    <p>
                        <strong>Disclaimer:</strong> BeeFund Financial Services acts as a loan facilitator and capital advisory intermediary. We do not charge borrowers any upfront fees for credit score generation or preliminary underwriting evaluation. All loan disbursements, interest rates, processing charges, and terms are subject to the independent credit discretion of our RBI-licensed partner banks and NBFCs. Credit reports generated through our portal constitute soft inquiries under RBI CICRA 2005 regulations and have zero negative impact on your credit score.
                    </p>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom-bar">
                    <p onClick={handleSecretTrigger} style={{ cursor: 'default', userSelect: 'none' }}>
                        © {currentYear} BeeFund Financial Services Pvt Ltd. All rights reserved.
                    </p>
                    <div className="footer-bottom-links">
                        <Link to="/terms">Terms of Service</Link>
                        <span>•</span>
                        <Link to="/privacy">Privacy & Bureau Consent</Link>
                        <span>•</span>
                        <Link to="/contact">Contact Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
