import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/HexagonBackground';
import './TermsPage.css';

const TermsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="page-wrapper container section terms-page">
            <HexagonBackground opacity={0.04} />

            <div className="terms-header text-center mb-5">
                <div className="tool-badge">
                    <span>📜 Legal, Regulatory & Compliance Disclosures</span>
                </div>
                <h1 className="mb-2">
                    Terms & Conditions <span className="text-highlight">& Privacy Policy</span>
                </h1>
                <p className="text-light" style={{ maxWidth: '720px', margin: '0 auto' }}>
                    Official Terms of Use, Credit Bureau Data Authorization, Customer Data Storage & Loan Matchmaking Agreement for BeeFund Financial Services.
                </p>
                <div className="terms-meta-pill mt-3">
                    <span>Last Updated: September 2026</span>
                    <span>•</span>
                    <span>Governed by RBI CICRA 2005 & DPDP Act 2023</span>
                </div>
            </div>

            <div className="terms-content-card card">
                {/* TABLE OF CONTENTS */}
                <div className="terms-toc">
                    <h3>Agreement Summary & Table of Contents</h3>
                    <ul>
                        <li><a href="#section-1">1. Acceptance of Terms & Intermediary Role</a></li>
                        <li><a href="#section-2">2. Credit Bureau Authorization & Consent (CIBIL / Experian / Equifax / CRIF)</a></li>
                        <li><a href="#section-3">3. Customer Profile & Credit Bureau Data Storage Policy</a></li>
                        <li><a href="#section-4">4. Authorized Use, Loan Matchmaking & Cross-Selling Financial Products</a></li>
                        <li><a href="#section-5">5. Multi-Channel Communication Consent (WhatsApp, SMS, Calls, Email)</a></li>
                        <li><a href="#section-6">6. Data Protection, Security & DPDP Act 2023 Compliance</a></li>
                        <li><a href="#section-7">7. Intellectual Property, Disclaimers & Limitation of Liability</a></li>
                        <li><a href="#section-8">8. Contact Information & Grievance Redressal</a></li>
                    </ul>
                </div>

                {/* SECTION 1 */}
                <section id="section-1" className="terms-section">
                    <h2>1. Acceptance of Terms & Intermediary Role</h2>
                    <p>
                        These Terms and Conditions, together with our Privacy Policy and Credit Bureau Authorization Policy (collectively, the <strong>"Agreement"</strong>), constitute a legally binding agreement between you (the <strong>"User"</strong>, <strong>"Customer"</strong>, or <strong>"Borrower"</strong>) and <strong>BeeFund Financial Services</strong> (hereinafter referred to as <strong>"BeeFund"</strong>, <strong>"we"</strong>, <strong>"us"</strong>, or <strong>"our"</strong>).
                    </p>
                    <p>
                        By accessing our website (<code>beefund.in</code> / <code>beefund.pages.dev</code>), utilizing our loan EMI calculators, requesting a credit score analysis, or applying for financial facilities, you explicitly accept and agree to be governed by all terms articulated herein. If you do not agree with any provision of this Agreement, you must refrain from accessing our services.
                    </p>
                    <p>
                        <strong>Our Intermediary Role:</strong> BeeFund operates as a premier digital loan marketplace, capital structuring advisor, and financial technology intermediary. BeeFund is not an RBI-registered bank or non-banking financial company (NBFC). We collaborate with RBI-licensed banks, NBFCs, and institutional credit bureaus to facilitate credit discovery, underwriting readiness, and loan origination.
                    </p>
                </section>

                {/* SECTION 2 */}
                <section id="section-2" className="terms-section">
                    <h2>2. Credit Bureau Authorization & Consent (CICRA 2005)</h2>
                    <div className="legal-highlight-box">
                        <span className="hl-tag">CRITICAL STATUTORY CONSENT</span>
                        <p>
                            By submitting your Name, Mobile Number, Date of Birth, and PAN (Permanent Account Number) on our Free CIBIL & Credit Score portal, you hereby appoint and authorize <strong>BeeFund Financial Services</strong> as your authorized representative to request, receive, access, and verify your Credit Information Report (CIR) and Credit Score from any or all Reserve Bank of India (RBI) authorized Credit Information Companies (CICs), including:
                        </p>
                        <ul className="legal-bullet-list">
                            <li><strong>TransUnion CIBIL Limited</strong></li>
                            <li><strong>Experian Credit Information Services India Private Limited</strong></li>
                            <li><strong>Equifax Credit Information Services Private Limited</strong></li>
                            <li><strong>CRIF High Mark Credit Information Services Private Limited</strong></li>
                        </ul>
                    </div>
                    <p>
                        This authorization is granted under the provisions of the <em>Credit Information Companies (Regulation) Act, 2005 (CICRA 2005)</em>, the CICRA Rules 2006, and applicable Reserve Bank of India directives. You acknowledge that credit pulls initiated through BeeFund for your personal review are classified by credit bureaus as <strong>"Soft Inquiries"</strong> and will not adversely affect or lower your credit rating.
                    </p>
                </section>

                {/* SECTION 3 */}
                <section id="section-3" className="terms-section">
                    <h2>3. Customer Profile & Credit Bureau Data Storage Policy</h2>
                    <p>
                        To provide persistent financial advisory, track your credit score trajectory, assess your borrowing capacity, and pre-qualify you for customized loan products, <strong>BeeFund collects, maintains, and securely stores customer profile and credit history records</strong>.
                    </p>
                    <h3>Categories of Data Stored by BeeFund:</h3>
                    <div className="terms-data-grid">
                        <div className="data-box">
                            <h4>Personal & Identity Data</h4>
                            <p>Full Legal Name, Date of Birth, Gender, Father’s/Spouse’s Name, PAN Card Number, and KYC identifiers.</p>
                        </div>
                        <div className="data-box">
                            <h4>Contact & Geographic Data</h4>
                            <p>Primary Mobile Number, Email Address, Current Residential Address, Permanent Address, and PIN code.</p>
                        </div>
                        <div className="data-box">
                            <h4>Credit Bureau Records</h4>
                            <p>Historical credit scores, active and closed loan accounts, credit card limits, Days Past Due (DPD) payment histories, write-offs, settlements, and inquiry logs.</p>
                        </div>
                        <div className="data-box">
                            <h4>Commercial & Financial Data</h4>
                            <p>Employment status, business vintage, declared annual turnover, monthly income, and desired loan parameters.</p>
                        </div>
                    </div>
                    <p>
                        You expressly acknowledge, agree, and grant irrevocable consent to BeeFund to retain and securely warehouse this data in our encrypted databases for as long as necessary to fulfill the commercial and advisory purposes outlined in this Agreement.
                    </p>
                </section>

                {/* SECTION 4 */}
                <section id="section-4" className="terms-section">
                    <h2>4. Authorized Use, Loan Matchmaking & Cross-Selling Financial Products</h2>
                    <p>
                        BeeFund leverages customer profile and credit bureau data to deliver an intelligent, streamlined financing experience. You explicitly authorize BeeFund to utilize your stored customer data for the following commercial and operational purposes:
                    </p>
                    <ul className="terms-purposes-list">
                        <li>
                            <strong>Credit Health Dossiers & Ongoing Monitoring:</strong> Generating customized credit improvement roadmaps, tracking monthly score changes, and alerting you to delinquency risks or clerical reporting errors.
                        </li>
                        <li>
                            <strong>Loan Eligibility & Underwriting Matchmaking:</strong> Analyzing your debt-to-income ratio, Fixed Obligation to Income Ratio (FOIR), and repayment vintage to identify optimal lending programs among our 25+ partner banks and NBFCs.
                        </li>
                        <li>
                            <strong>Pre-Approved Financial Product Offers:</strong> Formulating customized, pre-approved loan sanctions, instant credit lines, MSME working capital limits, Overdraft (OD) facilities, and Machinery Loans tailored to your credit profile.
                        </li>
                        <li>
                            <strong>Financial Cross-Selling & Commercial Partnerships:</strong> Sharing your basic eligibility parameters with verified lending partners, insurance providers, and co-branded financial institutions to present you with competitive balance transfer opportunities, corporate credit cards, collateral-free business loans, and commercial insurance.
                        </li>
                        <li>
                            <strong>Service Optimization & Internal Analytics:</strong> Auditing platform performance, refining automated underwriting models, and benchmarking credit risk profiles.
                        </li>
                    </ul>
                </section>

                {/* SECTION 5 */}
                <section id="section-5" className="terms-section">
                    <h2>5. Multi-Channel Communication Consent (TRAI DND Waiver)</h2>
                    <p>
                        By providing your mobile telephone number and email address on our platform, you provide your express <strong>"Opt-In" consent</strong> to receive informational, transactional, and promotional communications from BeeFund Financial Services and its authorized banking partners.
                    </p>
                    <p>
                        <strong>DND / NDNC Registry Waiver:</strong> You expressly confirm that this consent overrides any registration of your mobile phone number on the National Do Not Call (NDNC) Registry or Telecom Commercial Communications Customer Preference Regulations (TCCCPR) maintained under the Telecom Regulatory Authority of India (TRAI).
                    </p>
                    <p>Authorized communication channels include:</p>
                    <ul className="legal-bullet-list">
                        <li><strong>WhatsApp Messages:</strong> Credit score summaries, loan sanction updates, and PDF dossier delivery.</li>
                        <li><strong>SMS / Text Notifications:</strong> OTP verification, security alerts, and pre-approved offers.</li>
                        <li><strong>Direct Voice Calls:</strong> Consultations with BeeFund loan advisors and bank credit underwriters.</li>
                        <li><strong>Electronic Mail (Email):</strong> Monthly credit monitoring reports, repayment schedules, and policy updates.</li>
                    </ul>
                </section>

                {/* SECTION 6 */}
                <section id="section-6" className="terms-section">
                    <h2>6. Data Protection, Security & DPDP Act 2023 Compliance</h2>
                    <p>
                        BeeFund implements rigorous technical, administrative, and physical safeguards in accordance with the <em>Digital Personal Data Protection Act, 2023 (DPDP Act)</em> and ISO/IEC 27001 data security standards:
                    </p>
                    <ul className="terms-security-points">
                        <li><strong>256-Bit SSL/TLS Encryption:</strong> All data transmitted between your browser and our servers is encrypted in transit and secured at rest.</li>
                        <li><strong>Zero Unauthorized Resale:</strong> BeeFund does not sell raw personal data to unauthorized third-party telemarketers. All disclosures are strictly restricted to verified lending partners for the purpose of facilitating credit services requested by you.</li>
                        <li><strong>User Rights:</strong> Subject to statutory retention requirements under Indian lending and anti-money laundering (AML) laws, users may contact our Data Privacy Officer to request data review or revocation of marketing consent.</li>
                    </ul>
                </section>

                {/* SECTION 7 */}
                <section id="section-7" className="terms-section">
                    <h2>7. Disclaimers & Limitation of Liability</h2>
                    <p>
                        BeeFund provides financial tools, calculators, and credit score evaluations for guidance and informational purposes. While we strive for 100% calculation accuracy, final loan sanction amounts, interest rates, processing fees, and collateral requirements are solely determined by the respective lending bank or NBFC based on their independent internal credit policies.
                    </p>
                    <p>
                        BeeFund shall not be held liable for any indirect, consequential, or punitive damages resulting from loan application rejections by institutional lenders, credit bureau downtime, or clerical reporting errors made by third-party financial institutions.
                    </p>
                </section>

                {/* SECTION 8 */}
                <section id="section-8" className="terms-section">
                    <h2>8. Contact Information & Grievance Redressal</h2>
                    <p>
                        For any legal inquiries, data privacy concerns, or grievance redressal, please contact our compliance desk:
                    </p>
                    <div className="contact-details-box">
                        <p><strong>BeeFund Financial Services Pvt Ltd</strong></p>
                        <p>Corporate Office: Connaught Place, New Delhi, Delhi 110001, India</p>
                        <p>Official Telephone: +91 96253 51970</p>
                        <p>Compliance & Privacy Desk: <code>softbee@outlook.in</code></p>
                        <p>Operational Hours: Monday through Saturday, 09:30 AM to 06:30 PM IST</p>
                    </div>
                </section>

                <div className="terms-footer-actions text-center mt-5">
                    <Link to="/credit-report" className="btn btn-primary btn-lg mr-3">
                        Check Your Free CIBIL Score →
                    </Link>
                    <Link to="/" className="btn-ghost">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
