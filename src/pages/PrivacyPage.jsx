import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/HexagonBackground';
import './TermsPage.css';

const PrivacyPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="page-wrapper container section terms-page">
            <HexagonBackground opacity={0.04} />

            <div className="terms-header text-center mb-5">
                <div className="tool-badge">
                    <span>🔒 Data Protection, Cookies & AdSense Compliance</span>
                </div>
                <h1 className="mb-2">
                    Privacy Policy & <span className="text-highlight">Cookie Disclosure</span>
                </h1>
                <p className="text-light" style={{ maxWidth: '750px', margin: '0 auto' }}>
                    Transparent information on how BeeFund Financial Services collects, processes, protects user data, and complies with Google AdSense, RBI CICRA 2005, and DPDP Act 2023 regulations.
                </p>
                <div className="terms-meta-pill mt-3">
                    <span>Last Revised: September 2026</span>
                    <span>•</span>
                    <span>Compliant with Google AdSense Policies & DPDP Act 2023</span>
                </div>
            </div>

            <div className="terms-content-card card">
                {/* TABLE OF CONTENTS */}
                <div className="terms-toc">
                    <h3>Table of Contents</h3>
                    <ul>
                        <li><a href="#p-section-1">1. Introduction & Scope</a></li>
                        <li><a href="#p-section-2">2. Information We Collect</a></li>
                        <li><a href="#p-section-3">3. How We Use Your Information</a></li>
                        <li><a href="#p-section-4">4. Google AdSense & Third-Party Advertising Cookies (Crucial Disclosure)</a></li>
                        <li><a href="#p-section-5">5. Log Files & Web Beacons</a></li>
                        <li><a href="#p-section-6">6. Credit Bureau Data & Privacy Protection</a></li>
                        <li><a href="#p-section-7">7. User Rights & Personalized Ad Opt-Out Options</a></li>
                        <li><a href="#p-section-8">8. Children's Online Privacy (COPPA Compliance)</a></li>
                        <li><a href="#p-section-9">9. Data Security & Storage Standards</a></li>
                        <li><a href="#p-section-10">10. Grievance Officer & Contact Details</a></li>
                    </ul>
                </div>

                {/* SECTION 1 */}
                <section id="p-section-1" className="terms-section">
                    <h2>1. Introduction & Scope</h2>
                    <p>
                        Welcome to <strong>BeeFund Financial Services</strong> ("BeeFund", "we", "our", or "us"), powered by <strong>AADYASHIV CONSULTING PRIVATE LIMITED</strong>. We respect your privacy and are committed to protecting personal data collected through our website (<code>beefund.in</code> and <code>beefund.pages.dev</code>) and interactive financial advisory tools.
                    </p>
                    <p>
                        This Privacy Policy explains how we collect, store, use, and safeguard your information when you visit our website, utilize our free CIBIL score checker, calculate EMIs, or apply for business and personal loans.
                    </p>
                </section>

                {/* SECTION 2 */}
                <section id="p-section-2" className="terms-section">
                    <h2>2. Information We Collect</h2>
                    <p>We may collect information directly from you or automatically as you navigate our platform:</p>
                    <div className="terms-data-grid">
                        <div className="data-box">
                            <h4>Directly Provided Information</h4>
                            <p>Full Name, mobile phone number, email address, PAN card details, Date of Birth, employment details, and loan requirements entered into forms or financial calculators.</p>
                        </div>
                        <div className="data-box">
                            <h4>Automatically Collected Data</h4>
                            <p>IP addresses, browser type, operating system, referring URLs, pages visited, time stamps, and device telemetry to ensure website stability and fraud prevention.</p>
                        </div>
                    </div>
                </section>

                {/* SECTION 3 */}
                <section id="p-section-3" className="terms-section">
                    <h2>3. How We Use Your Information</h2>
                    <p>The information collected is used strictly for legitimate operational and financial advisory purposes, including:</p>
                    <ul className="terms-purposes-list">
                        <li>Evaluating credit eligibility and delivering free credit bureau health analyses.</li>
                        <li>Assisting you in obtaining loan sanctions from our verified banking and NBFC partners.</li>
                        <li>Operating, optimizing, and personalizing the website user experience.</li>
                        <li>Communicating updates, repayment schedules, and critical regulatory notices.</li>
                        <li>Detecting security threats and preventing fraudulent inquiries.</li>
                    </ul>
                </section>

                {/* SECTION 4 - CRUCIAL ADSENSE DISCLOSURE */}
                <section id="p-section-4" className="terms-section">
                    <h2>4. Google AdSense & Third-Party Advertising Cookies</h2>
                    <div className="legal-highlight-box">
                        <span className="hl-tag">MANDATORY ADSENSE DISCLOSURE</span>
                        <p>
                            We use <strong>Google AdSense</strong> to display advertisements when you visit our website. Google, as a third-party vendor, uses cookies to serve ads on our site.
                        </p>
                        <p>
                            Google's use of advertising cookies (such as the DoubleClick DART cookie) enables it and its partners to serve ads to our users based on their prior visits to <strong>BeeFund</strong> and/or other websites across the Internet.
                        </p>
                    </div>

                    <h3>Important Cookie Facts for Our Users:</h3>
                    <ul className="legal-bullet-list">
                        <li>
                            <strong>Third-Party Vendor Cookies:</strong> Third-party ad networks or vendors (including Google) may place and read cookies on your browser or use web beacons to collect information as a result of ad serving on our site.
                        </li>
                        <li>
                            <strong>Interest-Based Advertising:</strong> Ads shown to you may be tailored according to your browsing patterns, interests, and previous interactions.
                        </li>
                        <li>
                            <strong>Opting Out of Personalized Ads:</strong> Users may opt out of personalized advertising by visiting Google's <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
                        </li>
                        <li>
                            Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">AboutAds.info</a> or the <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer">Network Advertising Initiative (NAI) Opt-Out Page</a>.
                        </li>
                    </ul>
                </section>

                {/* SECTION 5 */}
                <section id="p-section-5" className="terms-section">
                    <h2>5. Log Files & Web Beacons</h2>
                    <p>
                        BeeFund follows standard industry procedures for utilizing log files. These files log visitors when they access websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamps, referring/exit pages, and number of clicks. These are not linked to any information that is personally identifiable and are used solely for analyzing trends, administering the site, tracking users' movements around the website, and gathering demographic information.
                    </p>
                </section>

                {/* SECTION 6 */}
                <section id="p-section-6" className="terms-section">
                    <h2>6. Credit Bureau Data & Financial Privacy Protection</h2>
                    <p>
                        In accordance with the <em>Credit Information Companies (Regulation) Act, 2005 (CICRA 2005)</em> and Reserve Bank of India mandates, any credit information obtained through authorized bureaus (TransUnion CIBIL, Experian, Equifax, CRIF) is handled under bank-grade confidentiality.
                    </p>
                    <p>
                        BeeFund does not sell your credit report or sensitive financial records to unauthorized third parties or telemarketers. All credit pulls requested through our portal are classified as soft inquiries and have <strong>zero negative impact</strong> on your credit score.
                    </p>
                </section>

                {/* SECTION 7 */}
                <section id="p-section-7" className="terms-section">
                    <h2>7. User Rights & Cookie Management</h2>
                    <p>
                        You retain full control over how cookies are handled on your device. Most modern web browsers allow you to accept, reject, or delete cookies through browser preferences (Chrome, Safari, Firefox, Edge). Please note that disabling essential cookies may impact certain interactive calculator functions on the site.
                    </p>
                    <p>
                        Under India’s <em>Digital Personal Data Protection Act (DPDP Act 2023)</em>, you have the right to request a summary of personal data processed, request correction of inaccurate data, or withdraw marketing consent at any time.
                    </p>
                </section>

                {/* SECTION 8 */}
                <section id="p-section-8" className="terms-section">
                    <h2>8. Children's Online Privacy Protection (COPPA Compliance)</h2>
                    <p>
                        Protecting the privacy of young children is especially important to us. BeeFund does not knowingly collect any Personal Identifiable Information from children under the age of 18. Our financial products, loan calculators, and credit score services are exclusively designed for adults and legal entities. If a parent or guardian believes that BeeFund has unintentionally collected information from a minor, please contact us immediately and we will promptly remove such information from our records.
                    </p>
                </section>

                {/* SECTION 9 */}
                <section id="p-section-9" className="terms-section">
                    <h2>9. Data Security & Storage Standards</h2>
                    <p>
                        We employ enterprise-level 256-bit SSL/TLS encryption for all data transmissions between your browser and our servers. Access to collected customer information is strictly restricted to authorized compliance officers and loan underwriting personnel.
                    </p>
                </section>

                {/* SECTION 10 */}
                <section id="p-section-10" className="terms-section">
                    <h2>10. Grievance Officer & Contact Details</h2>
                    <p>
                        If you have questions, comments, or require assistance regarding our Privacy Policy or cookie management, please reach out to our Grievance & Compliance Desk:
                    </p>
                    <div className="contact-details-box">
                        <p><strong>AADYASHIV CONSULTING PRIVATE LIMITED (BeeFund)</strong></p>
                        <p>Corporate Office: Connaught Place, New Delhi, Delhi 110001, India</p>
                        <p>Registered Office: A-1023 S/F G.D. Colony, Mayur Vihar Phase-III, East Delhi-110096</p>
                        <p>Official Helpline: +91 96253 51970</p>
                        <p>Privacy & Compliance Email: <code>softbee@outlook.in</code></p>
                    </div>
                </section>

                <div className="terms-footer-actions text-center mt-5">
                    <Link to="/terms" className="btn btn-primary mr-3">
                        View Terms of Service →
                    </Link>
                    <Link to="/" className="btn-ghost">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
