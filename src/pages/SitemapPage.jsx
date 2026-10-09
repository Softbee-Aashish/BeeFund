import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/HexagonBackground';
import './TermsPage.css';

const SitemapPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="page-wrapper container section terms-page">
            <HexagonBackground opacity={0.04} />

            <div className="terms-header text-center mb-5">
                <div className="tool-badge">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        <span>Complete Site Navigation Map</span>
                    </span>
                </div>
                <h1 className="mb-2">
                    HTML <span className="text-highlight">Sitemap</span>
                </h1>
                <p className="text-light" style={{ maxWidth: '750px', margin: '0 auto' }}>
                    Browse all pages, financial tools, calculators, loan products, and knowledge resources available on BeeFund Financial Services.
                </p>
            </div>

            <div className="terms-content-card card">
                {/* MAIN PAGES */}
                <section className="terms-section">
                    <h2>🏠 Main Pages</h2>
                    <ul className="legal-bullet-list">
                        <li><Link to="/">Home — BeeFund Financial Services</Link></li>
                        <li><Link to="/about">About Us — Our Story, Team & Mission</Link></li>
                        <li><Link to="/contact">Contact Us — Enquiry Form & Support</Link></li>
                        <li><Link to="/apply">Apply for a Loan — Quick Application</Link></li>
                        <li><Link to="/credit-report">Free CIBIL Score & Credit Report Check</Link></li>
                        <li><Link to="/credit-score">Credit Score Guide & Health Check</Link></li>
                    </ul>
                </section>

                {/* LOAN PRODUCTS */}
                <section className="terms-section">
                    <h2>💰 Loan Products & Credit Cards</h2>
                    <ul className="legal-bullet-list">
                        <li><Link to="/products">All Financial Products Overview</Link></li>
                        <li><Link to="/products#credit-card">Apply for Credit Card</Link></li>
                        <li><Link to="/products#government">Mudra & PMEGP Government Schemes</Link></li>
                        <li><Link to="/products#personal">Personal Loan (PL)</Link></li>
                        <li><Link to="/products#secured">Home Loan & Loan Against Property (LAP)</Link></li>
                        <li><Link to="/products#secured">Machinery & Equipment Financing</Link></li>
                        <li><Link to="/products#working-capital">Working Capital — OD / CC Facility</Link></li>
                        <li><Link to="/products#working-capital">Unsecured Business Loan</Link></li>
                        <li><Link to="/products#working-capital">Bill & Invoice Discounting</Link></li>
                        <li><Link to="/credit-cards">Credit Cards Showcase & Comparison</Link></li>
                    </ul>
                </section>

                {/* FINANCIAL TOOLS */}
                <section className="terms-section">
                    <h2>🧮 Financial Calculators & Tools</h2>
                    <ul className="legal-bullet-list">
                        <li><Link to="/tools">All Financial Tools Hub</Link></li>
                        <li><Link to="/tools/emi-calculator">Loan EMI Calculator</Link></li>
                        <li><Link to="/tools/repayment-schedule">Repayment Schedule Generator</Link></li>
                        <li><Link to="/tools/od-cc-calculator">OD & CC Interest Calculator</Link></li>
                        <li><Link to="/tools/eligibility">Loan Eligibility Checker</Link></li>
                        <li><Link to="/tools/loan-comparison">Loan Comparison Tool</Link></li>
                        <li><Link to="/tools/gst-calculator">GST Calculator</Link></li>
                        <li><Link to="/tools/tax-benefit">Tax Benefit Calculator (80C & 24b)</Link></li>
                        <li><Link to="/tools/inflation-impact">Inflation Impact Analyzer</Link></li>
                        <li><Link to="/tools/affordability">Home Affordability Calculator</Link></li>
                        <li><Link to="/tools/roi-calculator">ROI Calculator</Link></li>
                        <li><Link to="/tools/fixed-vs-floating">Fixed vs Floating Interest Rate Comparison</Link></li>
                    </ul>
                </section>

                {/* BLOG / KNOWLEDGE HUB */}
                <section className="terms-section">
                    <h2>📚 Financial Blog & Knowledge Hub (30 Published Guides)</h2>
                    
                    <h3>Business & Working Capital</h3>
                    <ul className="legal-bullet-list">
                        <li><Link to="/blog/working-capital-guide">Working Capital Loans in India: Complete Guide to Types, Eligibility & Fast Approvals</Link></li>
                        <li><Link to="/blog/secured-vs-unsecured-business-loans">Secured vs Unsecured Business Loans: Interest Rates, Collateral & Eligibility Compared</Link></li>
                        <li><Link to="/blog/cash-credit-vs-overdraft-facility-guide">Cash Credit (CC) vs Overdraft (OD) Facility: Drawing Power, Stock Audits & Interest Calculation</Link></li>
                        <li><Link to="/blog/bill-invoice-discounting-msme-guide">Bill & Invoice Discounting for Indian MSMEs: Fast Liquidity, POs & GSTR-1 Match</Link></li>
                        <li><Link to="/blog/dpr-detailed-project-report-bank-loans-guide">Detailed Project Report (DPR) for Bank Loans: Structure, TEV Study & Financial Projections</Link></li>
                        <li><Link to="/blog/tandon-committee-mpbf-working-capital-method-guide">Tandon Committee MPBF (Method II) Explained: How Indian Banks Assess Working Capital Limits</Link></li>
                        <li><Link to="/blog/mudra-loan-schemes-explained">Pradhan Mantri MUDRA Yojana (PMMY) & MSME Credit Schemes: Complete 2026 Guide</Link></li>
                        <li><Link to="/blog/business-loan-application-step-by-step">How to Apply for a Business Loan in India: Step-by-Step 2026 Borrowing Guide</Link></li>
                        <li><Link to="/blog/cgtmse-scheme-collateral-free-msme-loans">CGTMSE Scheme Explained: Collateral-Free Loans Up to ₹5 Crore for Indian MSMEs</Link></li>
                        <li><Link to="/blog/foir-dscr-banking-ratios-guide">Understanding FOIR, DSCR & Commercial Loan Banking Ratios: A Borrower's Guide</Link></li>
                        <li><Link to="/blog/top-government-schemes-msme-business-india">Top 10 Government Loan Schemes for Small Businesses & MSMEs in India (2026)</Link></li>
                    </ul>

                    <h3>Credit Health & Scores</h3>
                    <ul className="legal-bullet-list">
                        <li><Link to="/blog/improve-cibil-score-guide">How to Improve Your CIBIL Score from 600 to 750+: Proven 6-Month Action Plan</Link></li>
                        <li><Link to="/blog/cibil-vs-experian-vs-crif-highmark-guide">CIBIL vs Experian vs CRIF High Mark: Differences, Scoring Models & Bank Preferences in India</Link></li>
                        <li><Link to="/blog/credit-card-rewards-balance-transfer-guide">Credit Card Rewards Optimization & Balance Transfers: How to Save Thousands Annually</Link></li>
                        <li><Link to="/blog/what-is-credit-score-factors-importance">What is a Credit Score? How It Works, Scoring Ranges & Why It Matters in India</Link></li>
                        <li><Link to="/blog/how-to-read-cibil-credit-report-guide">How to Read Your CIBIL Credit Report: Section-by-Section Decryption Guide</Link></li>
                        <li><Link to="/blog/loan-balance-transfer-refinancing-guide">Loan Balance Transfer & Debt Refinancing: How to Cut EMIs and Save Lakhs in India</Link></li>
                        <li><Link to="/blog/credit-utilization-ratio-strategies-guide">Credit Utilization Ratio (CUR): How to Calculate, Manage & Optimize for a 750+ CIBIL Score</Link></li>
                    </ul>

                    <h3>Loans & Products</h3>
                    <ul className="legal-bullet-list">
                        <li><Link to="/blog/loan-against-property-lap-underwriting-handbook">Loan Against Property (LAP) Underwriting Handbook: Valuation, LTV & Legal Title Verification</Link></li>
                        <li><Link to="/blog/machinery-loan-equipment-financing-guide">Machinery Loan & Equipment Financing: Proforma Invoices, Supplier Quotes & CapEx Sizing</Link></li>
                        <li><Link to="/blog/personal-loan-vs-gold-loan-comparison-guide">Personal Loan vs Gold Loan: Interest Rates, Processing Time & Hidden Charges Compared</Link></li>
                        <li><Link to="/blog/home-loan-emi-eligibility-calculation-guide">Home Loan EMI & Eligibility Calculation: Mathematical Models, Tax Offsets & Step-Down Schedules</Link></li>
                        <li><Link to="/blog/fixed-vs-floating-interest-rate-comparison-guide">Fixed vs Floating Interest Rates on Bank Loans: EBLR, MCLR & Benchmark Risk Compared</Link></li>
                        <li><Link to="/blog/education-loan-india-abroad-complete-guide">Complete Guide to Education Loans in India & Abroad: Collateral, Co-Borrowers & Subsidies</Link></li>
                    </ul>

                    <h3>Financial Planning & Tax</h3>
                    <ul className="legal-bullet-list">
                        <li><Link to="/blog/home-loan-tax-benefits-guide">Tax Benefits on Home Loans in India: Section 80C, 24(b) & 80EEA Optimization Guide</Link></li>
                        <li><Link to="/blog/gstr-2a-vs-3b-reconciliation-guide">GSTR-2A vs GSTR-3B Reconciliation: Avoiding ITC Mismatch Notices & Commercial Loan Friction</Link></li>
                        <li><Link to="/blog/ultimate-loan-tools-seo-guide">Ultimate Financial Tools & Loan Calculators Guide: How to Model EMIs, OD Interest & Eligibility</Link></li>
                        <li><Link to="/blog/section-80c-tax-saving-salaried-guide">Section 80C Tax Saving Guide for Salaried Employees: Beyond EPF, PPF & ELSS (2026)</Link></li>
                        <li><Link to="/blog/gst-registration-process-compliance-guide">GST Registration Process & Compliance for New Businesses in India: Complete Guide</Link></li>
                        <li><Link to="/blog/emergency-fund-debt-payoff-balance-guide">Emergency Fund vs Loan Prepayment: The Mathematical Guide to Debt & Liquidity Optimization</Link></li>
                    </ul>
                </section>

                {/* LEGAL & COMPLIANCE */}
                <section className="terms-section">
                    <h2>⚖️ Legal & Compliance</h2>
                    <ul className="legal-bullet-list">
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                        <li><Link to="/privacy">Privacy Policy & Cookie Disclosure</Link></li>
                        <li><Link to="/disclaimer">Disclaimer</Link></li>
                    </ul>
                </section>

                {/* DSA PORTAL */}
                <section className="terms-section">
                    <h2>🤝 Partner Portal</h2>
                    <ul className="legal-bullet-list">
                        <li><Link to="/partnerLMS">PartnerLMS — DSA & Channel Partner Portal</Link></li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default SitemapPage;
