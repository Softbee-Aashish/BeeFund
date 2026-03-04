import React from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/HexagonBackground';
import './AboutPage.css';

/* ---- Banking partners ---- */
const bankPartners = [
    'HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank',
    'Bank of Baroda', 'Punjab National Bank', 'Kotak Mahindra',
    'IndusInd Bank', 'Yes Bank', 'Federal Bank',
    'IDFC First Bank', 'Bajaj Finserv',
];
const additionalPartners = 13;

/* ---- Company details ---- */
const companyDetails = [
    { label: 'Company Name', value: 'AADYASHIV CONSULTING PRIVATE LIMITED' },
    { label: 'CIN', value: 'U74901DL2024PTC426076' },
    { label: 'Constitution', value: 'Private Limited Company' },
    { label: 'Date of Incorporation', value: '01/02/2024' },
    { label: 'Former Entity', value: 'Aadya Consulting (since 15/02/2018)' },
    { label: 'Registered Office', value: 'A-1023 S/F G.D. Colony, Mayur Vihar, Phase-III, East Delhi-110096' },
    { label: 'GST / Udyam', value: 'Registered & Compliant' },
];

/* ---- Stats ---- */
const stats = [
    { val: '100+', label: 'Unsecured Loan Clients' },
    { val: '80+', label: 'Secured Loan Cases' },
    { val: '25+', label: 'Banking Partners' },
    { val: '9', label: 'Team Members' },
];

/* ---- Client names ---- */
const clients = ['Nepzpack Industries', 'Beston Air', 'Opusing', 'Skyline Traders', 'NovaTech Solutions'];

const AboutPage = () => {
    return (
        <div className="about-page">

            {/* === HERO === */}
            <section className="about-hero">
                <HexagonBackground opacity={0.07} />
                <div className="container about-hero-inner">
                    <span className="about-badge">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
                        Powered by AADYASHIV CONSULTING
                    </span>
                    <h1 className="about-title">
                        Your Trusted Partner for{' '}
                        <span className="about-highlight">Comprehensive Financial Solutions</span>
                    </h1>
                    <p className="about-subtitle">
                        BEEFUND is the digital lending platform powered by <strong>AADYASHIV CONSULTING PRIVATE LIMITED</strong> —
                        a Direct Selling Agent (DSA) with deep banking relationships and a legacy of trust since 2018.
                    </p>
                </div>
            </section>

            {/* === OUR STORY === */}
            <section className="about-section">
                <div className="container">
                    <div className="section-header">
                        <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
                        <h2 className="section-title">Our Story — <span className="about-highlight">The Journey</span></h2>
                    </div>

                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-dot" />
                            <div className="timeline-card">
                                <span className="timeline-year">2018 – 2024</span>
                                <h3>Foundation</h3>
                                <p>Established as a proprietorship <strong>"Aadya Consulting"</strong>. For six years, we built a strong reputation and client base across secured and unsecured lending segments.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot timeline-dot--active" />
                            <div className="timeline-card">
                                <span className="timeline-year">2024 – Present</span>
                                <h3>Expansion</h3>
                                <p>Upgraded to a Private Limited entity — <strong>AADYASHIV CONSULTING PRIVATE LIMITED</strong> (Incorporated 1 Feb 2024) — to better serve our partners and clients at scale.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot timeline-dot--now" />
                            <div className="timeline-card">
                                <span className="timeline-year">Today</span>
                                <h3>Growing Strong</h3>
                                <p>A team of <strong>9 experienced professionals</strong>, aggressively expanding our footprint with 25+ banking partnerships and a dedicated operations team processing files daily.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === FINANCIAL STRENGTH === */}
            <section className="about-section about-section--alt">
                <HexagonBackground opacity={0.04} className="hex-right" />
                <div className="container">
                    <div className="section-header">
                        <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                        <h2 className="section-title">Financial Strength & <span className="about-highlight">Growth</span></h2>
                    </div>

                    <div className="financial-cards">
                        <div className="fin-card">
                            <span className="fin-badge">FY 2023-24</span>
                            <div className="fin-entity">Proprietorship</div>
                            <div className="fin-name">Aadya Consulting</div>
                            <div className="fin-label mt-3">Established Operations</div>
                        </div>
                        <div className="fin-arrow">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </div>
                        <div className="fin-card fin-card--current">
                            <span className="fin-badge fin-badge--gold">FY 2024-25</span>
                            <div className="fin-entity">Private Limited</div>
                            <div className="fin-name">Aadyashiv Consulting</div>
                            <div className="fin-label mt-3">Rapid Expansion</div>
                            <div className="fin-growth">↑ 30-40% Growth Rate</div>
                        </div>
                    </div>
                    <p className="fin-note">This upward trajectory reflects our operational efficiency and the trust our clients place in us.</p>
                </div>
            </section>

            {/* === BANKING PARTNERS === */}
            <section className="about-section">
                <div className="container">
                    <div className="section-header">
                        <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></svg>
                        <h2 className="section-title">We're Authorized by <span className="about-highlight">Leading Banks</span></h2>
                    </div>
                    <p className="section-sub">We hold active codes with major financial institutions, ensuring you get the best rates and quick approvals.</p>

                    <div className="partners-grid">
                        {bankPartners.map((bank, i) => (
                            <div className="partner-card" key={i}>
                                <div className="partner-logo">
                                    {bank === 'State Bank of India' ? 'SBI' : bank.split(' ').map(w => w[0]).join('').slice(0, 3)}
                                </div>
                                <p className="partner-name">{bank}</p>
                            </div>
                        ))}
                        <div className="partner-card partner-card--more">
                            <div className="partner-logo partner-logo--more">+{additionalPartners}</div>
                            <p className="partner-name">And {additionalPartners} more</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* === LEADERSHIP === */}
            <section className="about-section about-section--alt">
                <HexagonBackground opacity={0.05} />
                <div className="container">
                    <div className="section-header">
                        <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
                        <h2 className="section-title">Meet the Minds Behind <span style={{ fontSize: '1.2em', fontWeight: '900' }} className="about-highlight">BEEFUND</span> <span style={{ fontSize: '0.6em', color: '#6b7280', fontWeight: '600' }}>Powered by AADYASHIV CONSULTING PVT LTD</span></h2>
                    </div>

                    <div className="leaders-grid">
                        <div className="team-card">
                            <div className="team-image">
                                <div className="image-placeholder">CS</div>
                            </div>
                            <h3>Mr. Chandan Singh</h3>
                            <div className="team-title-wrap">
                                <span className="team-title">Director</span>
                            </div>
                            <div className="team-bio">
                                <p>A strategic director driving the vision of AADYASHIV, bringing deep market insights and banking relationships since 2018.</p>
                                <p><strong>Vision:</strong> "To build a robust, long-term financial platform that scales operations and delivers maximum value to our enterprise clients."</p>
                                <p><strong>Core Strengths:</strong> Strategic planning, relationship management, and financial pipeline optimization.</p>
                            </div>
                        </div>

                        <div className="team-card">
                            <div className="team-image">
                                <div className="image-placeholder">TK</div>
                            </div>
                            <h3>Mr. Tarun Kapil</h3>
                            <div className="team-title-wrap">
                                <span className="team-title">Director</span>
                            </div>
                            <div className="team-bio">
                                <p>An experienced leader dedicated to handling operations, ensuring absolute processing efficiency across all branches.</p>
                                <p><strong>Vision:</strong> "To maintain the highest approval rates in the industry while providing an exceptional, transparent client experience."</p>
                                <p><strong>Core Strengths:</strong> Operations management, portfolio handling, and efficiency tracking.</p>
                            </div>
                        </div>

                        <div className="team-card">
                            <div className="team-image">
                                <div className="image-placeholder">RH</div>
                            </div>
                            <h3>Mr. Rahul Sharma</h3>
                            <div className="team-title-wrap">
                                <span className="team-title">Executive</span>
                            </div>
                            <div className="team-bio">
                                <p>A brilliant executive ensuring the smooth day-to-day operations and meticulous document processing at AADYASHIV.</p>
                                <p><strong>Vision:</strong> "To keep our team perfectly aligned and ensure seamless communication between our banking partners and our clients."</p>
                                <p><strong>Core Strengths:</strong> Client communication, document processing, and team alignment.</p>
                            </div>
                        </div>

                        <div className="team-card">
                            <div className="team-image">
                                <div className="image-placeholder">AS</div>
                            </div>
                            <h3>Mr. Aashish Sah</h3>
                            <div className="team-title-wrap">
                                <span className="team-title">Executive</span>
                            </div>
                            <div className="team-bio">
                                <p>A dynamic professional bringing a unique blend of financial acumen and technical expertise to the BEEFUND platform.</p>
                                <p><strong>Vision:</strong> "I want to make the loan process completely seamless with proper documentation, faster processing, and a hassle‑free experience."</p>
                                <p><strong>Core Strengths:</strong> Loan advisory, business development, technical troubleshooting, and digital optimization.</p>
                            </div>
                        </div>
                    </div>

                    <div className="team-appreciation">
                        <h3>And Our Incredible Dedicated Team</h3>
                        <p>Behind these minds is a team of passionate professionals working daily to process files, assist clients, and make <strong>BEEFUND</strong> the preferred choice for businesses across India. We appreciate every single member of our staff!</p>
                    </div>
                </div>
            </section>

            {/* === TRACK RECORD === */}
            <section className="about-section">
                <div className="container">
                    <div className="section-header">
                        <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        <h2 className="section-title">Trusted by <span className="about-highlight">Businesses Like Yours</span></h2>
                    </div>

                    <div className="stats-row">
                        {stats.map((s, i) => (
                            <div className="stat-card" key={i}>
                                <span className="stat-number">{s.val}</span>
                                <span className="stat-desc">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="clients-row">
                        <span className="clients-label">Trusted Clients</span>
                        <div className="clients-pills">
                            {clients.map((c, i) => <span className="client-pill" key={i}>{c}</span>)}
                        </div>
                    </div>
                </div>
            </section>

            {/* === COMPLIANCE === */}
            <section className="about-section about-section--alt">
                <div className="container">
                    <div className="section-header">
                        <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        <h2 className="section-title">Fully Compliant & <span className="about-highlight">Transparent</span></h2>
                    </div>

                    <div className="compliance-grid">
                        {companyDetails.map((d, i) => (
                            <div className="compliance-row" key={i}>
                                <span className="compliance-label">{d.label}</span>
                                <span className="compliance-value">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === WHY PARTNER === */}
            <section className="about-section">
                <HexagonBackground opacity={0.04} className="hex-left" />
                <div className="container">
                    <div className="section-header">
                        <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        <h2 className="section-title">Why Partner <span className="about-highlight">With Us?</span></h2>
                    </div>

                    <div className="why-partner-grid">
                        {[
                            { icon: 'M9 12l2 2 4-4M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', t: 'Direct Selling Agent', d: 'Active codes across 25+ banks — we bring the best rates directly to you.' },
                            { icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 0', t: 'Dedicated Operations Team', d: 'Daily file processing ensures your application moves swiftly through approvals.' },
                            { icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', t: 'High Approval Rates', d: 'Strong bank relationships translate to faster processing and higher acceptance.' },
                            { icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v12M8 9.5h7a1.5 1.5 0 010 3H9a1.5 1.5 0 000 3h7', t: 'Zero Cost to Clients', d: 'Our services are completely free for you — we are compensated by our banking partners.' },
                        ].map((item, i) => (
                            <div className="wp-card" key={i}>
                                <svg className="wp-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d={item.icon} /></svg>
                                <h3>{item.t}</h3>
                                <p>{item.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === CTA === */}
            <section className="about-cta">
                <div className="container text-center">
                    <h2 className="about-cta-h">Ready to grow your business with a trusted partner?</h2>
                    <p className="about-cta-p">Join hundreds of businesses that trust BEEFUND & AADYASHIV CONSULTING for their financing needs.</p>
                    <div className="about-cta-btns">
                        <Link to="/apply" className="btn btn-primary btn-lg" id="about-apply">Apply Now — Free</Link>
                        <Link to="/contact" className="btn-ghost btn-ghost--dark" id="about-contact">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.68 2.34a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.74.32 1.53.55 2.34.68a2 2 0 011.72 2.03z" /></svg>
                            Talk to Expert
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
