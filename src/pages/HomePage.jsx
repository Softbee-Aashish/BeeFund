import React from 'react';
import { Link } from 'react-router-dom';
import BeePosterCarrier from '../components/BeePosterCarrier';
import HexagonBackground from '../components/HexagonBackground';
import './HomePage.css';

/* ---- All products — Apply links now go to specific loan sections ---- */
const products = [
    { icon: 'briefcase', name: 'Working Capital', desc: 'Flexible funds for day-to-day ops, inventory & salaries.', tags: ['Up to ₹50L', 'From 9%'], ctaLink: '/loans#working-capital', dir: 'left' },
    { icon: 'factory', name: 'Business Loan', desc: 'Unsecured business funding based on turnover & credit.', tags: ['Up to ₹50L', '3-7 days'], ctaLink: '/loans#working-capital', dir: 'right' },
    { icon: 'home', name: 'Home Loan', desc: 'Purchase or renovate your dream home with tax benefits.', tags: ['Up to ₹10Cr', 'From 8.4%'], ctaLink: '/loans#secured', dir: 'left' },
    { icon: 'building', name: 'Loan Against Property', desc: 'Unlock property value for business or personal needs.', tags: ['Up to ₹5Cr', 'Low rates'], ctaLink: '/loans#secured', dir: 'right' },
    { icon: 'gear', name: 'Machinery Loan', desc: 'Finance new or used machinery for operational growth.', tags: ['90% cost', 'Moratorium'], ctaLink: '/loans#secured', dir: 'bottom' },
    { icon: 'shield', name: 'Mudra Loan (PMMY)', desc: 'Govt-backed collateral-free loans for micro-enterprises.', tags: ['Up to ₹10L', 'Govt scheme'], ctaLink: '/loans#government', dir: 'left' },
    { icon: 'users', name: 'Professional Loan', desc: 'For Doctors, CAs, Architects — expand your practice.', tags: ['No collateral', 'Up to ₹50L'], ctaLink: '/loans#working-capital', dir: 'right' },
    { icon: 'car', name: 'Vehicle Loan', desc: 'Finance cars, bikes, trucks & commercial vehicles.', tags: ['From 8.5%', '90% LTV'], ctaLink: '/loans#personal', dir: 'bottom' },
    { icon: 'graduation', name: 'Education Loan', desc: 'Fund higher education in India or abroad.', tags: ['Up to ₹1.5Cr', 'Moratorium'], ctaLink: '/loans#personal', dir: 'left' },
    { icon: 'star', name: 'Startup India Loan', desc: 'DPIIT-recognized startups with CGTMSE guarantee.', tags: ['Govt backed', 'Up to ₹50L'], ctaLink: '/loans#government', dir: 'right' },
];

const HomePage = () => {
    return (
        <div className="home-page">
            {/* ====== HERO ====== */}
            <section className="hero-section">
                <div className="hero-accent-orb hero-accent-orb--1" />
                <div className="hero-accent-orb hero-accent-orb--2" />
                <HexagonBackground opacity={0.08} />

                <div className="container hero-inner">
                    <span className="hero-badge">🐝 Trusted by 10,000+ Businesses</span>
                    <h1 className="hero-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.2em', letterSpacing: '-1px' }}>
                            <span className="hero-highlight">BEEFUND</span>
                        </span>
                        <span style={{ fontSize: '0.45em', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dark)' }}>
                            Apka Loan Partner
                        </span>
                    </h1>
                    <p className="hero-subtitle" style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary-color)', fontStyle: 'italic', marginBottom: '2.5rem' }}>
                        "Beefund Hain Sath To Banegi Har Baat"
                    </p>
                    <div className="hero-stats">
                        <div className="hero-stat"><span className="stat-val">8-9%</span><span className="stat-lbl">Interest p.a.</span></div>
                        <div className="stat-sep" />
                        <div className="hero-stat"><span className="stat-val">₹50L</span><span className="stat-lbl">Max Amount</span></div>
                        <div className="stat-sep" />
                        <div className="hero-stat"><span className="stat-val">Zero</span><span className="stat-lbl">Collateral</span></div>
                    </div>
                    <div className="hero-actions">
                        <Link to="/apply" className="btn btn-primary btn-lg" id="hero-apply">Apply Now</Link>
                        <Link to="/tools/emi-calculator" className="btn-ghost" id="hero-emi">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                            EMI Calculator
                        </Link>
                    </div>
                </div>
            </section>

            {/* ====== PRODUCTS — bee-carried cards ====== */}
            <section className="products-section" id="loan-products">
                <HexagonBackground opacity={0.05} className="hex-right" />
                <div className="container">
                    <h2 className="sec-title text-center">Our <span className="hero-highlight">Loan Products</span></h2>
                    <p className="sec-sub text-center">Scroll down — our bees will deliver each product to you.</p>
                    <div className="products-grid">
                        {products.map((p, i) => (
                            <BeePosterCarrier key={i} direction={p.dir} icon={p.icon} name={p.name}
                                description={p.desc} tags={p.tags} ctaText="Learn More"
                                ctaLink={p.ctaLink} delay={80 + (i % 3) * 150} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== TOOLS ====== */}
            <section className="tools-section">
                <HexagonBackground opacity={0.04} className="hex-left" />
                <div className="container">
                    <h2 className="sec-title text-center">Smart <span className="hero-highlight">Financial Tools</span></h2>
                    <p className="sec-sub text-center">Plan your finances before you commit.</p>
                    <div className="tools-grid">
                        {[
                            { to: '/tools/emi-calculator', icon: 'M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zM2 9h20M8 6h8M8 13h3M13 13h3M8 17h8', name: 'EMI Calculator', desc: 'Calculate monthly installments' },
                            { to: '/tools/eligibility', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4', name: 'Eligibility Check', desc: 'Know your loan eligibility' },
                            { to: '/tools/loan-comparison', icon: 'M18 20V10M12 20V4M6 20v-6', name: 'Loan Comparison', desc: 'Compare options side by side' },
                            { to: '/tools/tax-benefit', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v12M8 9.5h7a1.5 1.5 0 010 3H9a1.5 1.5 0 000 3h7', name: 'Tax Benefits', desc: 'Calculate tax savings' },
                            { to: '/tools/affordability', icon: 'M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5zM9 21V12h6v9', name: 'Affordability', desc: 'How much can you afford?' },
                            { to: '/tools/gst-calculator', icon: 'M1 4h22v16a2 2 0 01-2 2H3a2 2 0 01-2-2V4zM1 10h22M6 15h4M14 15h4', name: 'GST Calculator', desc: 'Quick GST computation' },
                        ].map((t, i) => (
                            <Link to={t.to} className="tool-card" key={i} id={`tool-${i}`}>
                                <svg className="tool-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d={t.icon} /></svg>
                                <span className="tool-name">{t.name}</span>
                                <span className="tool-desc">{t.desc}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center" style={{ marginTop: '2rem' }}>
                        <Link to="/tools" className="btn btn-outline" id="view-all-tools">View All Tools →</Link>
                    </div>
                </div>
            </section>

            {/* ====== WHY BEEFUND ====== */}
            <section className="why-section">
                <HexagonBackground opacity={0.06} />
                <div className="container">
                    <h2 className="sec-title text-center">Why Choose <span className="hero-highlight">BeeFund?</span></h2>
                    <div className="why-grid">
                        {[
                            { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4', t: 'Secure & Encrypted', d: 'Bank-grade SSL encryption protects your data.' },
                            { icon: 'M3 3h18v18H3V3zM3 9h18M9 3v18', t: 'RBI Compliant', d: 'All lending partners are RBI-registered NBFCs.' },
                            { icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', t: 'Instant Approval', d: 'Get approved in under 24 hours.' },
                            { icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 0M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', t: 'Zero Hidden Fees', d: '100% transparent. No upfront charges.' },
                        ].map((w, i) => (
                            <div className="why-card" key={i}>
                                <svg className="why-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d={w.icon} /></svg>
                                <h3>{w.t}</h3><p>{w.d}</p>
                            </div>
                        ))}
                    </div>
                    <div className="partner-row">
                        <span className="partner-label">Trusted Partners</span>
                        <div className="partner-logos">
                            {['SBI', 'HDFC', 'ICICI', 'Axis'].map(p => <span key={p} className="partner-pill">{p}</span>)}
                        </div>
                    </div>

                    {/* Loan disclaimer */}
                    <div className="loan-disclaimer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                        <p>
                            <strong>Note:</strong> The loan details shown are general guidelines. Actual terms, rates, and eligibility may vary based on individual profiles. BeeFund specializes in helping <strong>startups and newly launched businesses</strong> — we'll work with you to find the best financing option.
                        </p>
                    </div>
                </div>
            </section>

            {/* ====== FINAL CTA ====== */}
            <section className="final-cta">
                <div className="container text-center">
                    <h2 className="cta-h">Ready to fund your next big move?</h2>
                    <p className="cta-p">Join thousands of businesses that trust BeeFund.</p>
                    <div className="cta-btns">
                        <Link to="/apply" className="btn btn-primary btn-lg" id="cta-apply">Get Started — Free</Link>
                        <Link to="/contact" className="btn-ghost btn-ghost--dark" id="cta-contact">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.68 2.34a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.74.32 1.53.55 2.34.68a2 2 0 011.72 2.03z" /></svg>
                            Talk to Expert
                        </Link>
                    </div>
                    <div className="cta-info">
                        <span>📞 +91 96253 51970</span>
                        <span>✉️ softbee@outlook.in</span>
                        <span>📍 Delhi, India</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
