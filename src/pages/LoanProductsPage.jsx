import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HexagonBackground from '../components/HexagonBackground';
import './LoanProductsPage.css';

/* ================================================
   LOAN DATA — All loan categories with rich content
   ================================================ */
const loanCategories = [
    {
        id: 'secured', tab: 'Secured', title: 'Secured Loans (Collateral-Based)',
        description: 'Get higher loan amounts at lower interest rates by pledging property or assets as collateral. Ideal for large-scale business expansion, home purchase, or equipment financing.',
        loans: [
            { id: 'lap', name: 'Loan Against Property (LAP)', amount: 'Up to ₹5 Crore', rate: '8.50% – 10.50% p.a.', tenure: 'Up to 15 years', desc: 'Unlock the value of your residential or commercial property for business expansion, debt consolidation, or personal needs. LAP offers the best interest rates among all loan products.', features: ['Long repayment tenure up to 15 years', 'No end-use restriction on funds', 'Lower interest rates vs unsecured loans', 'Overdraft facility available'] },
            { id: 'home-loan', name: 'Home Loan (HL)', amount: 'Up to ₹10 Crore', rate: '8.40% – 10.25% p.a.', tenure: 'Up to 30 years', desc: 'Purchase, construct, or renovate your dream home with affordable EMIs and tax benefits under Section 80C and 24(b) of the Income Tax Act.', features: ['Tax benefits under Sec 80C & 24(b)', 'Up to 90% Loan-to-Value ratio', 'Balance transfer from other banks', 'Top-up loan available'] },
            { id: 'business-secured', name: 'Secured Business Loan', amount: 'Up to ₹2 Crore+', rate: '9% – 12% p.a.', tenure: 'Up to 5-7 years', desc: 'Expand your business with a high-limit capital loan backed by business or personal assets. Perfect for working capital, equipment, or expansion.', features: ['Higher loan amounts available', 'Lower interest rate vs unsecured', 'Flexible collateral options accepted', 'Customized repayment schedule'] },
            { id: 'machinery', name: 'Machinery & Equipment Finance', amount: 'Up to 90% cost', rate: '9% – 13% p.a.', tenure: 'Up to 5-7 years', desc: 'Finance new or used machinery, industrial equipment, and technology upgrades. Preserve your working capital while growing production capacity.', features: ['Preserve working capital for operations', 'Tax benefits on depreciation', '3-6 months moratorium option', 'New and used equipment covered'] },
            { id: 'commercial-vehicle', name: 'Commercial Vehicle & Auto Loan', amount: 'Up to 90% cost', rate: '8.75% – 12% p.a.', tenure: 'Up to 5-7 years', desc: 'Get financing for trucks, buses, tempos, passenger vehicles, and construction equipment. Quick approval with flexible repayment.', features: ['Quick 24-48 hour approval', 'New & used vehicles covered', 'Flexible EMI repayment options', 'Insurance bundling available'] },
        ]
    },
    {
        id: 'working-capital', tab: 'Business', title: 'Business & Working Capital Products',
        description: 'Short-term and collateral-free funding solutions to keep your day-to-day business operations running smoothly. Ideal for MSMEs, traders, and service businesses.',
        loans: [
            { id: 'working-capital-loan', name: 'Working Capital Loan', amount: 'Based on turnover', rate: '10% – 15% p.a.', tenure: '12 months (renewable)', desc: 'Manage day-to-day operations, purchase inventory, pay salaries, and bridge cash flow gaps with flexible working capital financing.', features: ['Overdraft (OD) facility', 'Cash Credit (CC) limit', 'Pay interest only on utilized amount', 'Renewable annually'] },
            { id: 'bill-discounting', name: 'Bill / Invoice Discounting', amount: 'Up to 90% of invoice', rate: '8% – 14% p.a.', tenure: '30-180 days', desc: 'Convert your unpaid invoices into immediate cash. Don\'t wait for customer payments — get funds upfront against your receivables.', features: ['Improve cash flow immediately', 'No additional collateral required', 'Credit assessment on your customer', 'Quick 48-hour processing'] },
            { id: 'business-unsecured', name: 'Unsecured Business Loan', amount: 'Up to ₹50 Lakhs', rate: '12% – 18% p.a.', tenure: '1-5 years', desc: 'Collateral-free business loan based on your turnover, profitability, and credit history. Ideal for MSMEs, traders, and small business owners.', features: ['Zero collateral requirement', 'Fast 7 day processing time', 'For MSMEs, traders & service providers', 'Minimal documentation needed'] },
            { id: 'professional', name: 'Professional Loan', amount: 'Up to ₹50 Lakhs', rate: '11% – 16% p.a.', tenure: 'Up to 5-7 years', desc: 'Unsecured loan exclusively for Doctors, Chartered Accountants, Company Secretaries, Architects, and other qualified professionals.', features: ['No collateral required for professionals', 'Moratorium period available', 'Setup new clinic or office space', 'Technology & equipment upgrades'] },
        ]
    },
    {
        id: 'government', tab: 'Govt Schemes', title: 'Government Schemes & MSME Loans',
        description: 'Access subsidized, low-interest loans backed by Indian government initiatives like PMMY, Stand-Up India, and PMEGP. Perfect for micro-enterprises and first-generation entrepreneurs.',
        loans: [
            { id: 'standup-india', name: 'Stand-Up India Loan', amount: '₹10L to ₹1 Crore', rate: 'Competitive', tenure: 'Up to 7 years', desc: 'Promoting entrepreneurship among women and SC/ST communities for greenfield manufacturing or service enterprises.', features: ['Composite term + working capital loan', 'CGTMSE credit guarantee coverage', 'For manufacturing, services & trading', 'Special rates for women entrepreneurs'] },
            { id: 'pmegp', name: 'PMEGP Loan', amount: 'Up to ₹50 Lakhs', rate: '8% – 10% p.a.', tenure: 'Up to 7 years', desc: 'Prime Minister Employment Generation Programme offering subsidized loans with 15-35% government subsidy for setting up new micro-enterprises.', features: ['15%-35% government subsidy on project cost', 'Only 5%-10% margin money required', 'Moratorium period included', 'For manufacturing & service sector'] },
            { id: 'msme-general', name: 'MSME Business Loan', amount: '₹1 Lakh – ₹2 Crore+', rate: '9% – 15% p.a.', tenure: '1-5 years', desc: 'Customized funding solutions for Micro, Small, and Medium Enterprises across manufacturing, trading, and services sectors in India.', features: ['CGTMSE cover available', 'Fast track with GST analysis', 'Flexible terms & repayment', 'Priority sector lending benefit'] },
        ]
    },
    {
        id: 'personal', tab: 'Personal', title: 'Personal & Consumer Loans',
        description: 'Flexible funding for salaried and self-employed individuals to meet personal goals, emergencies, education expenses, and vehicle purchases.',
        loans: [
            { id: 'personal-loan', name: 'Personal Loan (PL)', amount: 'Up to ₹40 Lakhs', rate: '10.50% – 18% p.a.', tenure: '1-5 years', desc: 'Multipurpose unsecured personal loan for medical emergencies, weddings, travel, home renovation, or debt consolidation with quick disbursal.', features: ['No end-use restriction on funds', 'Minimal documentation required', '24-48 hour disbursal possible', 'No collateral or guarantor needed'] },
            { id: 'car-loan', name: 'Personal Car Loan', amount: 'Up to 100% on-road price', rate: '8.50% – 11% p.a.', tenure: 'Up to 7 years', desc: 'Finance a new or pre-owned personal car with competitive interest rates, zero prepayment charges, and quick approval.', features: ['EV special discounted rates', 'No prepayment penalties', 'Insurance financing included', 'Pre-approved offers available'] },
            { id: 'two-wheeler', name: 'Two-Wheeler Loan', amount: 'Up to 95% on-road price', rate: '9% – 15% p.a.', tenure: 'Up to 5 years', desc: 'Affordable financing for motorcycles, scooters, and electric two-wheelers with minimal documentation and quick processing.', features: ['24-hour processing time', 'Minimal documentation needed', 'Up to 95% Loan-to-Value ratio', 'Electric vehicle special rates'] },
            { id: 'education', name: 'Education Loan', amount: 'Up to ₹1.5 Crore', rate: '8% – 13% p.a.', tenure: 'Up to 15 years', desc: 'Fund higher education in India or abroad covering tuition fees, accommodation, books, and living expenses. Moratorium during course.', features: ['Moratorium during study period', 'Tax benefits under Section 80E', 'Overseas education coverage', 'Covers tuition + living expenses'] },
        ]
    },
    {
        id: 'specialized', tab: 'Specialized', title: 'Specialized Business Products',
        description: 'Trade finance instruments, bank guarantees, and specialized financial products for importers, exporters, and businesses participating in government tenders.',
        loans: [
            { id: 'letter-of-credit', name: 'Letter of Credit (LC)', amount: 'Customized', rate: 'Competitive', tenure: 'As per contract', desc: 'Bank guarantee ensuring payment to your supplier upon fulfillment of contract terms. Essential for domestic and international trade.', features: ['Import LC for overseas purchases', 'Domestic LC for local suppliers', 'Builds trust with new suppliers', 'Reduces counterparty risk'] },
            { id: 'bank-guarantee', name: 'Bank Guarantee (BG)', amount: 'Customized', rate: 'Competitive', tenure: 'As per requirement', desc: 'Commitment by the bank to cover a loss if you default. Essential for government tenders, construction contracts, and trade deals.', features: ['Financial guarantee for trade', 'Performance guarantee for projects', 'Advance payment guarantee', 'Bid bond for tenders'] },
            { id: 'export-credit', name: 'Export Credit / Pre-shipment', amount: 'Up to 80% of order', rate: '7% – 9% p.a.', tenure: '90-180 days', desc: 'Working capital finance for exporters to procure raw materials, manufacture, and process goods before shipment at subsidized government rates.', features: ['Subsidized interest rates', 'INR or foreign currency options', 'Based on confirmed export order', 'Post-shipment credit also available'] },
        ]
    }
];

/* ================================================
   SEO FAQ — Questions & Answers
   ================================================ */
const faqs = [
    { q: 'What is a Business Loan and how does it work?', a: 'A Business Loan is a financing facility provided by banks and NBFCs to entrepreneurs, MSMEs, traders, and professionals for business purposes. It can be secured (backed by collateral like property) or unsecured (based on credit score and turnover). BeeFund helps you compare 25+ lenders to find the best business loan rates starting from 8.50% p.a.' },
    { q: 'What documents are required for a Business Loan in India?', a: 'Typically you need: PAN Card, Aadhaar Card, last 12 months bank statements, 2 years ITR, GST registration, business proof (incorporation certificate / Udyam registration), and property documents (for secured loans). BeeFund simplifies this — our team pre-checks your eligibility before submission.' },
    { q: 'How much loan can I get for my MSME business?', a: 'MSME loans range from ₹1 Lakh to ₹2 Crore+ depending on your turnover, profitability, and credit score. Government schemes like Mudra Loan offer up to ₹10 Lakhs without collateral. For secured loans, you can get up to ₹5 Crore against property.' },
    { q: 'What is the interest rate on Home Loan in 2025?', a: 'Home loan interest rates in India currently range from 8.40% to 10.25% p.a. depending on your credit score, loan amount, and the lending institution. BeeFund partners with HDFC, SBI, ICICI, Axis, and 20+ other banks to get you the best rate.' },
    { q: 'What is CGTMSE and how does it help my loan application?', a: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) is a government scheme that provides credit guarantee to lenders, reducing their risk. This enables collateral-free loans up to ₹5 Crore for MSMEs. BeeFund helps eligible businesses access CGTMSE-covered loans.' },
    { q: 'Can I get a loan for my startup in India?', a: 'Yes! Under the Startup India scheme, DPIIT-recognized startups can get loans up to ₹50 Lakhs with government credit guarantee at competitive rates of 8.50% – 12% p.a. with up to 12 months moratorium. BeeFund specializes in startup financing.' },
    { q: 'What is Loan Against Property (LAP) and who is eligible?', a: 'LAP allows you to pledge your residential or commercial property to get a loan of up to 60-70% of the property value. Salaried individuals, self-employed professionals, and business owners with clear property titles are eligible. Interest rates start from 8.50% p.a.' },
    { q: 'How long does it take to get a business loan approved?', a: 'Unsecured business loans can be approved in 7 working days. Secured loans (LAP, Home Loan) typically take 10-15 days including property valuation. With BeeFund\'s pre-screening and dedicated ops team, we cut processing time by up to 40%.' },
    { q: 'Is BeeFund a bank or an NBFC?', a: 'BeeFund is the digital lending platform of AADYASHIV CONSULTING PRIVATE LIMITED, a Direct Selling Agent (DSA) authorized by 25+ banks and NBFCs. We don\'t lend directly — we connect you with the best lender for your profile at zero cost to you.' },
    { q: 'Are there any charges or fees for using BeeFund?', a: 'BeeFund charges absolutely ZERO fees to borrowers. Our services are completely free. We earn a commission from our banking partners when your loan is disbursed. No hidden charges, no upfront fees — guaranteed.' },
];

const LoanProductsPage = () => {
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState(loanCategories[0].id);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash) {
            const cat = loanCategories.find(c => c.id === hash);
            if (cat) {
                setActiveCategory(cat.id);
                setTimeout(() => {
                    const el = document.getElementById(`cat-${cat.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 200);
            }
        }
    }, [location.hash]);

    const activeCat = loanCategories.find(c => c.id === activeCategory);

    return (
        <div className="loan-products-page">
            {/* === SEO META (handled by Helmet or title) === */}

            {/* === HERO === */}
            <section className="lp-hero">
                <HexagonBackground opacity={0.12} />
                <div className="container lp-hero-inner">
                    <span className="lp-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
                        25+ Banking Partners • Zero Fees
                    </span>
                    <h1 className="lp-title">
                        All <span className="lp-hl">Loan Products</span> in India — Compare & Apply
                    </h1>
                    <p className="lp-subtitle">
                        Compare <strong>business loans</strong>, <strong>home loans</strong>, <strong>MSME loans</strong>, <strong>personal loans</strong>, and <strong>government-backed schemes</strong> from 25+ banks.
                        <br />Best interest rates starting <strong>8.40% p.a.</strong> — processed by BeeFund's expert team at zero cost.
                    </p>

                    {/* Quick stats */}
                    <div className="lp-stats">
                        <div className="lp-stat"><span className="lp-stat-val">25+</span><span className="lp-stat-lbl">Bank Partners</span></div>
                        <div className="lp-stat-sep" />
                        <div className="lp-stat"><span className="lp-stat-val">8.4%</span><span className="lp-stat-lbl">Starting Rate</span></div>
                        <div className="lp-stat-sep" />
                        <div className="lp-stat"><span className="lp-stat-val">₹10Cr</span><span className="lp-stat-lbl">Max Amount</span></div>
                        <div className="lp-stat-sep" />
                        <div className="lp-stat"><span className="lp-stat-val">7 Days</span><span className="lp-stat-lbl">Min Approval</span></div>
                    </div>
                </div>
            </section>

            {/* === CATEGORY TABS === */}
            <section className="lp-tabs-wrap">
                <div className="container">
                    <div className="lp-tabs">
                        {loanCategories.map(cat => (
                            <button
                                key={cat.id}
                                className={`lp-tab ${activeCategory === cat.id ? 'lp-tab--active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.tab}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* === SEO INTRO TEXT === */}
            <section className="lp-seo-intro">
                <div className="container">
                    <div className="seo-block">
                        <h2 className="seo-h2">
                            {activeCat.title} — <span className="lp-hl">Best Rates in India 2025</span>
                        </h2>
                        <p className="seo-text">
                            {activeCat.description} At BeeFund, powered by AADYASHIV CONSULTING PRIVATE LIMITED, we process your loan application through 25+ authorized banking partners including SBI, HDFC, ICICI, Axis Bank, and more — ensuring you get the <strong>lowest interest rates</strong> and <strong>fastest approval</strong> available in the market.
                        </p>
                        <div className="seo-cta-row">
                            <Link to="/apply" className="btn btn-primary" id="lp-apply-top">Check Eligibility — Free</Link>
                            <Link to="/tools/emi-calculator" className="lp-link">Calculate EMI →</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* === LOAN CARDS === */}
            <section className="lp-cards-section" id={`cat-${activeCat.id}`}>
                <div className="container">
                    <div className="lp-loan-grid">
                        {activeCat.loans.map((loan, idx) => (
                            <article className="lp-loan-card" key={loan.id} id={`loan-${loan.id}`}>
                                <div className="lp-card-top">
                                    <span className="lp-card-num">0{idx + 1}</span>
                                    <h3 className="lp-card-name">{loan.name}</h3>
                                </div>
                                <p className="lp-card-desc">{loan.desc}</p>

                                <div className="lp-card-stats">
                                    <div className="lp-card-stat">
                                        <span className="lp-cs-label">Max Amount</span>
                                        <span className="lp-cs-val">{loan.amount}</span>
                                    </div>
                                    <div className="lp-card-stat">
                                        <span className="lp-cs-label">Interest Rate</span>
                                        <span className="lp-cs-val">{loan.rate}</span>
                                    </div>
                                    <div className="lp-card-stat">
                                        <span className="lp-cs-label">Tenure</span>
                                        <span className="lp-cs-val">{loan.tenure}</span>
                                    </div>
                                </div>

                                <ul className="lp-card-features">
                                    {loan.features.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>

                                <div className="lp-card-actions">
                                    <Link to={`/apply?product=${loan.id}`} className="btn btn-primary lp-card-btn">Apply Now</Link>
                                    <Link to="/tools/emi-calculator" className="lp-card-link">Calculate EMI →</Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* === HOW IT WORKS === */}
            <section className="lp-how-section">
                <HexagonBackground opacity={0.08} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h2 className="lp-sec-title">How to Apply for a Loan Through <span className="lp-hl">BeeFund</span></h2>
                    <div className="lp-steps">
                        {[
                            { num: '01', t: 'Submit Application', d: 'Fill in basic details — takes just 2 minutes. No documents needed initially.' },
                            { num: '02', t: 'Expert Review', d: 'Our team reviews your profile and pre-screens eligibility across 25+ lenders.' },
                            { num: '03', t: 'Best Offer Match', d: 'We present the best loan offers with lowest rates & highest approval probability.' },
                            { num: '04', t: 'Quick Disbursal', d: 'Submit documents, get approved, and receive funds directly to your account.' },
                        ].map((s, i) => (
                            <div className="lp-step" key={i}>
                                <span className="lp-step-num">{s.num}</span>
                                <h3>{s.t}</h3>
                                <p>{s.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === FAQs === */}
            <section className="lp-faq-section">
                <div className="container">
                    <h2 className="lp-sec-title">Frequently Asked Questions About <span className="lp-hl">Loans in India</span></h2>
                    <p className="lp-sec-sub">Everything you need to know about business loans, home loans, MSME loans, and government loan schemes.</p>

                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <div className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`} key={i}>
                                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    <span>{faq.q}</span>
                                    <svg className="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                                </button>
                                <div className="faq-a">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === DISCLAIMER === */}
            <section className="lp-disclaimer-section">
                <div className="container">
                    <div className="lp-disclaimer">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                        <div>
                            <p><strong>Disclaimer:</strong> The interest rates, loan amounts, tenure, and eligibility criteria mentioned above are indicative and subject to change based on individual profiles, credit scores, lender policies, and market conditions as of 2025.</p>
                            <p style={{ marginTop: '0.5rem' }}><strong>🐝 BeeFund Specialty:</strong> We specialize in helping <strong>startups, MSMEs, first-time borrowers, and new businesses</strong> navigate the loan process. Our dedicated team at AADYASHIV CONSULTING will work with you to find the best financing solution. <Link to="/contact" style={{ color: '#d97706', fontWeight: 700 }}>Talk to us →</Link></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* === CTA === */}
            <section className="lp-cta">
                <div className="container text-center">
                    <h2 className="lp-cta-h">Ready to get the best loan rates in India?</h2>
                    <p className="lp-cta-p">Apply in 2 minutes. Zero fees. Expert guidance from AADYASHIV CONSULTING's team.</p>
                    <Link to="/apply" className="btn-cta-dark" id="lp-cta-apply">Apply Now — It's Free</Link>
                </div>
            </section>
        </div>
    );
};

export default LoanProductsPage;
