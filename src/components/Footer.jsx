import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

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
                            <span>🛡️ 100% RBI Compliant Bureau Soft Pulls</span>
                        </div>
                    </div>

                    {/* Quick Links / Loans */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">Loan Products</h4>
                        <ul className="footer-links">
                            <li><Link to="/loans#business">Business Term Loan</Link></li>
                            <li><Link to="/loans#secured">Loan Against Property (LAP)</Link></li>
                            <li><Link to="/loans#machinery">Machinery & Equipment Loan</Link></li>
                            <li><Link to="/loans#government">PMEGP & CGTMSE Cover</Link></li>
                            <li><Link to="/loans#personal">Personal & Vehicle Loans</Link></li>
                            <li><Link to="/loans#working-capital">Working Capital (OD / CC)</Link></li>
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
                    <p>© {currentYear} BeeFund Financial Services Pvt Ltd. All rights reserved.</p>
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
