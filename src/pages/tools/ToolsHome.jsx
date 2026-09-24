import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/HexagonBackground';
import { ToolIcons } from '../../components/NavIcons';
import './ToolsHome.css';

const tools = [
    // 1. Repayment & Working Capital
    {
        id: 'emi-calculator',
        iconKey: 'emi',
        color: 'amber',
        category: 'repayment',
        categoryLabel: 'Repayment',
        badge: 'Most Popular',
        title: 'Loan EMI Calculator',
        desc: 'Calculate monthly installment, total interest payable, and comprehensive loan amortization table instantly.',
        tags: ['Instant Calculation', 'Monthly Breakdown'],
        keywords: 'EMI calculator, loan EMI, monthly installment, business loan EMI, home loan EMI calculator India'
    },
    {
        id: 'repayment-schedule',
        iconKey: 'repayment',
        color: 'blue',
        category: 'repayment',
        categoryLabel: 'Amortization',
        badge: 'Excel & PDF Export',
        title: 'Repayment Schedule Generator',
        desc: 'Generate complete bank-grade loan amortization schedules from sanction letters with opening/closing POS and download in Excel or PDF.',
        tags: ['Excel Export', 'POS Tracking'],
        keywords: 'repayment schedule generator, sanction letter repayment schedule, loan amortization schedule excel, POS balance schedule'
    },
    {
        id: 'od-cc-calculator',
        iconKey: 'odcc',
        color: 'emerald',
        category: 'repayment',
        categoryLabel: 'Working Capital',
        badge: 'Daily Utilization',
        title: 'OD / CC Interest Calculator',
        desc: 'Calculate daily interest on Overdraft accounts with variable balances, random date gap entries, credit card revolving charges, and export to Excel.',
        tags: ['Variable Balances', 'Export to Excel'],
        keywords: 'OD interest calculator, CC interest calculator, overdraft interest, credit card interest, variable balance interest excel'
    },

    // 2. Eligibility & Loan Decision
    {
        id: 'eligibility',
        iconKey: 'eligibility',
        color: 'purple',
        category: 'eligibility',
        categoryLabel: 'Eligibility',
        badge: 'Instant Check',
        title: 'Loan Eligibility Calculator',
        desc: 'Know how much loan you can qualify for based on your net income, living expenses, existing EMI obligations, and bank multipliers.',
        tags: ['FOIR Analysis', 'Multi-Bank Formula'],
        keywords: 'loan eligibility calculator, how much loan can I get, business loan eligibility, home loan eligibility check'
    },
    {
        id: 'affordability',
        iconKey: 'affordability',
        color: 'blue',
        category: 'eligibility',
        categoryLabel: 'Budgeting',
        badge: 'Budget Planner',
        title: 'Home Affordability Calculator',
        desc: 'Determine the maximum property price you can comfortably afford based on income, savings, and safe EMI capacity.',
        tags: ['Safe EMI Limits', 'Down Payment Plan'],
        keywords: 'home affordability calculator, how much house can I afford, property budget calculator, home loan affordability'
    },
    {
        id: 'loan-comparison',
        iconKey: 'comparison',
        color: 'indigo',
        category: 'eligibility',
        categoryLabel: 'Comparison',
        badge: 'Side-by-Side',
        title: 'Loan Comparison Tool',
        desc: 'Compare two different loan offers side by side — interest rates, total lifetime cost, tenure, and monthly EMI to find the best deal.',
        tags: ['Compare 2 Loans', 'Total Cost View'],
        keywords: 'loan comparison tool, compare loan rates, best loan offer, interest rate comparison India'
    },
    {
        id: 'fixed-vs-floating',
        iconKey: 'fixedFloating',
        color: 'teal',
        category: 'eligibility',
        categoryLabel: 'Interest Rate',
        badge: 'Rate Forecast',
        title: 'Fixed vs Floating Rate Analyzer',
        desc: 'Compare fixed and floating interest rate options for your loan. See which saves more based on RBI benchmark rate projections.',
        tags: ['Repo Rate Shift', 'Cost Sensitivity'],
        keywords: 'fixed vs floating rate, fixed rate loan, floating rate loan comparison, best interest type for loan India'
    },

    // 3. Tax & Business Growth
    {
        id: 'gst-calculator',
        iconKey: 'gst',
        color: 'blue',
        category: 'tax-business',
        categoryLabel: 'Taxation',
        badge: 'All Slabs (5%-28%)',
        title: 'GST Calculator',
        desc: 'Compute GST on invoices, service fees, and business transactions. Calculate CGST, SGST, IGST for all slab rates with inclusive/exclusive modes.',
        tags: ['CGST / SGST / IGST', 'Inclusive & Exclusive'],
        keywords: 'GST calculator, GST calculation online, CGST SGST calculator, GST for business, invoice GST calculator'
    },
    {
        id: 'tax-benefit',
        iconKey: 'tax',
        color: 'rose',
        category: 'tax-business',
        categoryLabel: 'Tax Savings',
        badge: 'Sec 80C & 24(b)',
        title: 'Tax Benefit Calculator',
        desc: 'Calculate annual tax savings on Home Loan (80C + 24b) and Business Loan interest deductions under the Income Tax Act.',
        tags: ['Old & New Slabs', 'Up to ₹3.5L Deduction'],
        keywords: 'tax benefit calculator, home loan tax deduction, Section 80C calculator, loan interest tax saving India'
    },
    {
        id: 'roi-calculator',
        iconKey: 'roi',
        color: 'amber',
        category: 'tax-business',
        categoryLabel: 'Business Growth',
        badge: 'CapEx Evaluation',
        title: 'Business ROI Calculator',
        desc: 'Evaluate whether a loan-funded business investment makes financial sense. Calculate return on investment vs debt service cost.',
        tags: ['Net Present Value', 'Payback Period'],
        keywords: 'business ROI calculator, return on investment calculator, loan funded business ROI, investment vs loan cost'
    },
    {
        id: 'inflation-impact',
        iconKey: 'inflation',
        color: 'amber',
        category: 'tax-business',
        categoryLabel: 'Economics',
        badge: 'Real Cost Value',
        title: 'Inflation Impact Analyzer',
        desc: 'Understand how inflation reduces the real burden of your loan over time. See the true discounted cost in today\'s rupees.',
        tags: ['Purchasing Power', 'Real vs Nominal EMI'],
        keywords: 'inflation impact calculator, loan inflation effect, real cost of loan, inflation adjusted EMI India'
    }
];

/* ---- FAQ ---- */
const toolsFaqs = [
    { q: 'How do I calculate EMI for a business loan?', a: 'Use our free EMI Calculator — enter your loan amount, interest rate, and tenure. The calculator instantly shows your monthly EMI, total interest payable, and generates a complete amortization schedule. Works for all loan types: business loans, home loans, personal loans, and more.' },
    { q: 'What factors affect my loan eligibility in India?', a: 'Key factors include: monthly income (salary or business profit), existing EMI obligations, credit score (CIBIL score above 700 is ideal), employment stability, age, and the type of loan you\'re applying for. Our Eligibility Calculator considers all these factors to give you an accurate estimate.' },
    { q: 'How to compare two loan offers effectively?', a: 'Don\'t just compare interest rates — look at total cost of the loan (principal + interest), processing fees, prepayment charges, and foreclosure penalties. Our Loan Comparison Tool calculates all of this side-by-side so you can make an informed decision.' },
    { q: 'What tax benefits can I get on a Home Loan?', a: 'Under Section 80C, you can claim up to ₹1.5 Lakhs deduction on principal repayment. Under Section 24(b), up to ₹2 Lakhs deduction on interest paid annually. For first-time home buyers, additional ₹50,000 under Section 80EEA. Our Tax Benefit Calculator computes your exact savings.' },
    { q: 'Is fixed or floating interest rate better for my loan?', a: 'It depends on the economic outlook. Fixed rates give predictability — your EMI stays the same. Floating rates may start lower but can increase if RBI raises repo rates. Generally, for short-tenure loans (1-3 years), fixed is safer. For long tenure (10+ years), floating often works out cheaper over time.' },
    { q: 'How does inflation reduce my loan burden?', a: 'Inflation means the value of money decreases over time. A ₹10,000 EMI today will feel like ₹7,000 in real terms after 5 years at 7% inflation. This means your loan becomes "cheaper" in real terms as your income grows with inflation. Our Inflation Impact Analyzer quantifies this effect.' },
    { q: 'Are these financial calculators accurate?', a: 'Yes, our calculators use standard financial formulas (compound interest, reducing balance method) used by banks and RBI. They provide estimates that closely match actual bank calculations. However, final loan terms may vary based on the specific lender\'s policies and your individual profile.' },
    { q: 'Can I use these tools without signing up?', a: 'Absolutely! All calculators on BeeFund are 100% free, require no registration, and work entirely on your browser (client-side). Your financial data is never sent to any server. Calculate as many times as you want — completely private and secure.' },
];

const ToolsHome = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredTools = activeFilter === 'all'
        ? tools
        : tools.filter(tool => tool.category === activeFilter);

    return (
        <div className="tools-home-page">
            {/* === HERO === */}
            <section className="th-hero">
                <HexagonBackground opacity={0.12} />
                <div className="container th-hero-inner">
                    <span className="th-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                        Free • No Sign-up • 100% Client-Side Private
                    </span>
                    <h1 className="th-title">
                        Smart <span className="th-hl">Financial Tools</span> & Calculators
                    </h1>
                    <p className="th-subtitle">
                        Empower your borrowing decisions with bank-accurate <strong>EMI calculators</strong>, <strong>repayment schedule generators</strong>, <strong>eligibility checkers</strong>, and <strong>tax optimization tools</strong>.
                    </p>

                    <div className="th-stats">
                        <div className="th-stat"><span className="th-stat-val">11</span><span className="th-stat-lbl">Free Tools</span></div>
                        <div className="th-stat-sep" />
                        <div className="th-stat"><span className="th-stat-val">100%</span><span className="th-stat-lbl">Private</span></div>
                        <div className="th-stat-sep" />
                        <div className="th-stat"><span className="th-stat-val">Zero</span><span className="th-stat-lbl">Sign-up</span></div>
                    </div>
                </div>
            </section>

            {/* === CATEGORY FILTER BAR & TOOL CARDS === */}
            <section className="th-grid-section">
                <HexagonBackground opacity={0.06} className="hex-right" />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    {/* Category Filter Pills */}
                    <div className="th-filter-wrapper">
                        <div className="th-filter-tabs">
                            <button
                                type="button"
                                className={`th-filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveFilter('all')}
                            >
                                All Tools ({tools.length})
                            </button>
                            <button
                                type="button"
                                className={`th-filter-tab ${activeFilter === 'repayment' ? 'active' : ''}`}
                                onClick={() => setActiveFilter('repayment')}
                            >
                                EMI & Repayment (3)
                            </button>
                            <button
                                type="button"
                                className={`th-filter-tab ${activeFilter === 'eligibility' ? 'active' : ''}`}
                                onClick={() => setActiveFilter('eligibility')}
                            >
                                Eligibility & Loans (4)
                            </button>
                            <button
                                type="button"
                                className={`th-filter-tab ${activeFilter === 'tax-business' ? 'active' : ''}`}
                                onClick={() => setActiveFilter('tax-business')}
                            >
                                Tax & Business (4)
                            </button>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="th-grid">
                        {filteredTools.map((tool) => (
                            <Link to={`/tools/${tool.id}`} key={tool.id} className="th-card" id={`tool-${tool.id}`}>
                                <div className="th-card-header">
                                    <span className={`th-card-icon-box icon-color-${tool.color}`}>
                                        {ToolIcons[tool.iconKey]}
                                    </span>
                                    <div className="th-card-badges">
                                        <span className={`th-badge-category badge-color-${tool.color}`}>
                                            {tool.categoryLabel}
                                        </span>
                                        {tool.badge && (
                                            <span className="th-badge-highlight">
                                                {tool.badge}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="th-card-body">
                                    <h3 className="th-card-title">{tool.title}</h3>
                                    <p className="th-card-desc">{tool.desc}</p>
                                </div>
                                <div className="th-card-footer">
                                    <div className="th-card-tags">
                                        {tool.tags.map((t, idx) => (
                                            <span key={idx} className="th-micro-tag">{t}</span>
                                        ))}
                                    </div>
                                    <span className="th-card-action">
                                        <span>Open Tool</span>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </span>
                                </div>
                                {/* Hidden SEO keywords */}
                                <span className="sr-only">{tool.keywords}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* === WHY USE OUR TOOLS === */}
            <section className="th-why">
                <div className="container">
                    <h2 className="th-sec-title">Why Use BeeFund's <span className="th-hl">Financial Tools?</span></h2>
                    <div className="th-why-grid">
                        {[
                            { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4', t: '100% Private & Secure', d: 'All calculations happen on your browser. Zero data sent to servers. No cookies, no tracking.' },
                            { icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', t: 'Instant Results', d: 'Get calculations in milliseconds. No waiting, no loading. Works offline too.' },
                            { icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v12M8 9.5h7a1.5 1.5 0 010 3H9a1.5 1.5 0 000 3h7', t: 'Bank-Grade Accuracy', d: 'Uses the same financial formulas as banks and RBI for precise loan calculations.' },
                            { icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 0', t: 'No Registration Needed', d: 'Use all 9 tools unlimited times without creating an account or sharing personal info.' },
                        ].map((item, i) => (
                            <div className="th-why-card" key={i}>
                                <svg className="th-why-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d={item.icon} /></svg>
                                <h3>{item.t}</h3>
                                <p>{item.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === FAQ === */}
            <section className="th-faq">
                <div className="container">
                    <h2 className="th-sec-title">Frequently Asked Questions About <span className="th-hl">Financial Calculators</span></h2>
                    <p className="th-sec-sub">Common questions about EMI, loan eligibility, tax benefits, and our free online tools.</p>

                    <div className="faq-list">
                        {toolsFaqs.map((faq, i) => (
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

            {/* === CTA === */}
            <section className="th-cta">
                <div className="container text-center">
                    <h2 className="th-cta-h">Need help choosing the right loan?</h2>
                    <p className="th-cta-p">Our financial experts at AADYASHIV CONSULTING will guide you — completely free.</p>
                    <div className="th-cta-btns">
                        <Link to="/apply" className="btn-cta-dark" id="tools-apply">Apply for a Loan</Link>
                        <Link to="/loans" className="th-cta-link">Browse All Loan Products →</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ToolsHome;
