import React from 'react';
import { Link } from 'react-router-dom';
import BeePosterCarrier from '../components/BeePosterCarrier';
import HexagonBackground from '../components/HexagonBackground';
import { useEnquiryModal } from '../context/EnquireModalContext';
import { ToolIcons } from '../components/NavIcons';
import './HomePage.css';

/* ---- Concise Products: Govt & Credit Card on Top, Secured Middle, Unsecured Next ---- */
const products = [
    // 1. Govt Schemes & Credit Cards (Top Priority)
    {
        iconKey: 'creditCard',
        color: 'rose',
        badge: 'Instant Approval',
        name: 'Instant Credit Cards',
        desc: 'Pre-approved lifetime-free & reward credit cards from 20+ partner banks.',
        tags: ['50 Days 0% Int', 'Zero Annual Fee'],
        ctaText: 'Apply for Card',
        ctaLink: '/products#credit-card',
        enquiryType: 'Credit Card',
        dir: 'left'
    },
    {
        iconKey: 'government',
        color: 'green',
        badge: 'Subsidized',
        name: 'Mudra Loan (PMMY)',
        desc: 'Govt-backed collateral-free micro funding for MSMEs and retailers.',
        tags: ['Up to ₹10 Lakhs', 'Zero Collateral'],
        ctaText: 'Enquire for Mudra',
        ctaLink: '/products#government',
        enquiryType: 'Mudra',
        dir: 'bottom'
    },
    {
        iconKey: 'msme',
        color: 'green',
        badge: 'CGTMSE Cover',
        name: 'PMEGP & MSME Scheme',
        desc: 'Subsidized enterprise loans with up to 35% government subsidy support.',
        tags: ['Up to ₹50 Lakhs', '15-35% Subsidy'],
        ctaText: 'Enquire for MSME',
        ctaLink: '/products#government',
        enquiryType: 'MSME',
        dir: 'right'
    },

    // 2. Secured Financing
    {
        iconKey: 'lap',
        color: 'blue',
        badge: 'From 8.5%',
        name: 'Loan Against Property',
        desc: 'Unlock high capital against residential, commercial, or industrial property.',
        tags: ['Up to ₹5 Crore', 'Tenure 15 Yrs'],
        ctaText: 'Enquire for LAP',
        ctaLink: '/products#secured',
        enquiryType: 'LAP',
        dir: 'left'
    },
    {
        iconKey: 'homeLoan',
        color: 'blue',
        badge: 'Low ROI',
        name: 'Home Loan',
        desc: 'Purchase or construct your dream home with Sec 80C & 24(b) tax savings.',
        tags: ['Up to ₹10 Crore', 'From 8.4% ROI'],
        ctaText: 'Enquire for Home Loan',
        ctaLink: '/products#secured',
        enquiryType: 'HL',
        dir: 'bottom'
    },
    {
        iconKey: 'machinery',
        color: 'blue',
        badge: '90% Cost',
        name: 'Machinery & Equipment',
        desc: 'Finance new or refurbished machinery with rapid 48-hour approval.',
        tags: ['90% Cost Covered', 'Moratorium'],
        ctaText: 'Enquire for Machinery',
        ctaLink: '/products#secured',
        enquiryType: 'Machinery',
        dir: 'right'
    },

    // 3. Unsecured & Working Capital
    {
        iconKey: 'workingCapital',
        color: 'amber',
        badge: 'Daily Interest',
        name: 'Working Capital (OD/CC)',
        desc: 'Flexible credit line for day-to-day operations, vendor dues & payroll.',
        tags: ['Pay on Utilized', 'Annual Renewal'],
        ctaText: 'Enquire for OD/CC',
        ctaLink: '/products#working-capital',
        enquiryType: 'Working Capital',
        dir: 'left'
    },
    {
        iconKey: 'businessUnsecured',
        color: 'amber',
        badge: 'Zero Collateral',
        name: 'Unsecured Business Loan',
        desc: 'Fast unsecured capital based on your banking turnover & GST filings.',
        tags: ['Up to ₹50 Lakhs', 'Fast 3-7 Days'],
        ctaText: 'Enquire for Business',
        ctaLink: '/products#working-capital',
        enquiryType: 'BL',
        dir: 'bottom'
    },
    {
        iconKey: 'professional',
        color: 'amber',
        badge: 'Doctors & CAs',
        name: 'Professional Loan',
        desc: 'Exclusive high-ticket loans for Doctors, CAs, and licensed Architects.',
        tags: ['Up to ₹50 Lakhs', 'No Collateral'],
        ctaText: 'Enquire for Loan',
        ctaLink: '/products#working-capital',
        enquiryType: 'Professional',
        dir: 'right'
    }
];

const homeTools = [
    { to: '/tools/emi-calculator', iconKey: 'emi', color: 'amber', name: 'EMI Calculator', desc: 'Calculate monthly installment & schedule' },
    { to: '/tools/repayment-schedule', iconKey: 'repayment', color: 'blue', name: 'Repayment Schedule', desc: 'Sanction letter amortization export' },
    { to: '/tools/od-cc-calculator', iconKey: 'odcc', color: 'emerald', name: 'OD / CC Calculator', desc: 'Compute daily utilization interest' },
    { to: '/tools/eligibility', iconKey: 'eligibility', color: 'purple', name: 'Eligibility Check', desc: 'Know maximum qualifying loan amount' },
    { to: '/tools/loan-comparison', iconKey: 'comparison', color: 'indigo', name: 'Loan Comparison', desc: 'Compare two loan offers side-by-side' },
    { to: '/tools/tax-benefit', iconKey: 'tax', color: 'rose', name: 'Tax Benefits', desc: 'Calculate Sec 80C & 24(b) savings' },
];

const HomePage = () => {
    const { openEnquiryModal } = useEnquiryModal();

    return (
        <div className="home-page">
            {/* ====== HERO ====== */}
            <section className="hero-section">
                <div className="hero-accent-orb hero-accent-orb--1" />
                <div className="hero-accent-orb hero-accent-orb--2" />
                <HexagonBackground opacity={0.08} />

                <div className="container hero-inner">
                    <span className="hero-badge">
                        <img src="/logo.png" alt="BeeFund" style={{ width: 16, height: 16, objectFit: 'contain', display: 'inline-block', verticalAlign: '-2px', marginRight: '6px' }} />
                        Trusted by 10,000+ Businesses
                    </span>
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
                        <button type="button" onClick={() => openEnquiryModal({ source: 'Hero Button' })} className="btn btn-primary btn-lg" id="hero-apply">
                            Enquire Now
                        </button>
                        <Link to="/tools/emi-calculator" className="btn-ghost" id="hero-emi">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                            EMI Calculator
                        </Link>
                        <Link to="/credit-report" className="btn-ghost btn-cibil-hero" id="hero-cibil">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            Get Free CIBIL Score
                            <span className="hero-btn-badge">FREE</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ====== PRODUCTS — bee-carried cards ====== */}
            <section className="products-section" id="products">
                <HexagonBackground opacity={0.05} className="hex-right" />
                <div className="container">
                    <h2 className="sec-title text-center">Our <span className="hero-highlight">Financial Products</span></h2>
                    <p className="sec-sub text-center">Compare credit cards, government schemes, and tailored loan solutions delivered by our bees.</p>
                    <div className="products-grid">
                        {products.map((p, i) => (
                            <BeePosterCarrier
                                key={i}
                                direction={p.dir}
                                iconKey={p.iconKey}
                                color={p.color}
                                badge={p.badge}
                                name={p.name}
                                description={p.desc}
                                tags={p.tags}
                                ctaText={p.ctaText}
                                ctaLink={p.ctaLink}
                                onCtaClick={() => openEnquiryModal({ loanType: p.enquiryType || p.name, source: `Home Card - ${p.name}` })}
                                delay={80 + (i % 3) * 150}
                            />
                        ))}
                    </div>
                    <div className="text-center" style={{ marginTop: '3rem' }}>
                        <Link to="/products" className="btn btn-outline" id="view-all-products">
                            Explore All Financial Products & Cards →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ====== TOOLS ====== */}
            <section className="tools-section">
                <HexagonBackground opacity={0.04} className="hex-left" />
                <div className="container">
                    <h2 className="sec-title text-center">Smart <span className="hero-highlight">Financial Tools</span></h2>
                    <p className="sec-sub text-center">Plan your finances with bank-grade calculators before committing.</p>
                    <div className="tools-grid">
                        {homeTools.map((t, i) => (
                            <Link to={t.to} className="tool-card" key={i} id={`tool-${i}`}>
                                <span className={`tool-card-icon-box icon-color-${t.color}`}>
                                    {ToolIcons[t.iconKey]}
                                </span>
                                <span className="tool-name">{t.name}</span>
                                <span className="tool-desc">{t.desc}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center" style={{ marginTop: '2.5rem' }}>
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
                        <button type="button" onClick={() => openEnquiryModal({ source: 'Home Final CTA' })} className="btn btn-primary btn-lg" id="cta-apply">
                            Enquire Now — Free
                        </button>
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
