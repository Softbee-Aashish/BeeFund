import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/HexagonBackground';
import './ToolsHome.css';

const svgIcons = {
    emi: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M2 9h20" /><path d="M9 21V9" /></svg>,
    eligibility: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    comparison: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    gst: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    tax: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /></svg>,
    inflation: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
    afford: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    roi: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    fixfloat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>,
};

const tools = [
    { id: 'emi-calculator', icon: svgIcons.emi, title: 'EMI Calculator', desc: 'Calculate monthly loan EMI instantly with full repayment schedule, interest breakdown, and amortization table.', keywords: 'EMI calculator, loan EMI, monthly installment, business loan EMI, home loan EMI calculator India' },
    { id: 'eligibility', icon: svgIcons.eligibility, title: 'Loan Eligibility Calculator', desc: 'Know how much loan you can qualify for based on your income, expenses, credit score, and existing obligations.', keywords: 'loan eligibility calculator, how much loan can I get, business loan eligibility, home loan eligibility check' },
    { id: 'loan-comparison', icon: svgIcons.comparison, title: 'Loan Comparison Tool', desc: 'Compare two different loan offers side by side — interest rates, total cost, tenure, and monthly EMI to find the best deal.', keywords: 'loan comparison tool, compare loan rates, best loan offer, interest rate comparison India' },
    { id: 'gst-calculator', icon: svgIcons.gst, title: 'GST Calculator', desc: 'Compute GST on invoices, service fees, and business transactions. Calculate CGST, SGST, IGST for all slab rates.', keywords: 'GST calculator, GST calculation online, CGST SGST calculator, GST for business, invoice GST calculator' },
    { id: 'tax-benefit', icon: svgIcons.tax, title: 'Tax Benefit Calculator', desc: 'Calculate tax savings on Home Loan (80C + 24b) and Business Loan interest deductions under Income Tax Act.', keywords: 'tax benefit calculator, home loan tax deduction, Section 80C calculator, loan interest tax saving India' },
    { id: 'inflation-impact', icon: svgIcons.inflation, title: 'Inflation Impact Analyzer', desc: 'Understand how inflation reduces the real burden of your loan over time. See the true cost in today\'s rupees.', keywords: 'inflation impact calculator, loan inflation effect, real cost of loan, inflation adjusted EMI India' },
    { id: 'affordability', icon: svgIcons.afford, title: 'Home Affordability Calculator', desc: 'Determine the maximum property price you can comfortably afford based on income, savings, and loan eligibility.', keywords: 'home affordability calculator, how much house can I afford, property budget calculator, home loan affordability' },
    { id: 'roi-calculator', icon: svgIcons.roi, title: 'Business ROI Calculator', desc: 'Evaluate whether a loan-funded business investment makes financial sense. Calculate return on investment vs loan cost.', keywords: 'business ROI calculator, return on investment calculator, loan funded business ROI, investment vs loan cost' },
    { id: 'fixed-vs-floating', icon: svgIcons.fixfloat, title: 'Fixed vs Floating Rate', desc: 'Compare fixed and floating interest rate options for your loan. See which saves more based on RBI rate projections.', keywords: 'fixed vs floating rate, fixed rate loan, floating rate loan comparison, best interest type for loan India' },
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

    return (
        <div className="tools-home-page">
            {/* === HERO === */}
            <section className="th-hero">
                <HexagonBackground opacity={0.12} />
                <div className="container th-hero-inner">
                    <span className="th-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                        Free • No Sign-up • 100% Private
                    </span>
                    <h1 className="th-title">
                        Free <span className="th-hl">Financial Calculators</span> & Loan Tools
                    </h1>
                    <p className="th-subtitle">
                        Plan your finances with <strong>EMI calculators</strong>, <strong>loan eligibility checkers</strong>, <strong>GST calculators</strong>, <strong>tax benefit tools</strong>, and more.
                        All tools run on your browser — your data stays private and secure.
                    </p>

                    <div className="th-stats">
                        <div className="th-stat"><span className="th-stat-val">9</span><span className="th-stat-lbl">Free Tools</span></div>
                        <div className="th-stat-sep" />
                        <div className="th-stat"><span className="th-stat-val">100%</span><span className="th-stat-lbl">Private</span></div>
                        <div className="th-stat-sep" />
                        <div className="th-stat"><span className="th-stat-val">Zero</span><span className="th-stat-lbl">Sign-up</span></div>
                    </div>
                </div>
            </section>

            {/* === SEO INTRO === */}
            <section className="th-seo">
                <div className="container">
                    <div className="th-seo-block">
                        <h2 className="th-seo-h2">Best Free Financial Calculators Online — <span className="th-hl">India 2025</span></h2>
                        <p className="th-seo-text">
                            Make smarter financial decisions with our suite of <strong>free online financial calculators</strong>. Whether you're planning a <strong>business loan</strong>, buying a <strong>home</strong>, comparing <strong>interest rates</strong>, or calculating <strong>GST</strong> — our tools give you instant, accurate results. Built by BeeFund, powered by <strong>AADYASHIV CONSULTING PRIVATE LIMITED</strong>, these calculators are used by thousands of borrowers, CAs, and financial advisors across India.
                        </p>
                    </div>
                </div>
            </section>

            {/* === TOOL CARDS === */}
            <section className="th-grid-section">
                <HexagonBackground opacity={0.08} className="hex-right" />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="th-grid">
                        {tools.map((tool, i) => (
                            <Link to={`/tools/${tool.id}`} key={tool.id} className="th-card" id={`tool-${tool.id}`}>
                                <div className="th-card-top">
                                    <span className="th-card-icon">{tool.icon}</span>
                                    <span className="th-card-num">0{i + 1}</span>
                                </div>
                                <h3 className="th-card-title">{tool.title}</h3>
                                <p className="th-card-desc">{tool.desc}</p>
                                {/* Hidden SEO keywords */}
                                <span className="sr-only">{tool.keywords}</span>
                                <span className="th-card-cta">Open Calculator →</span>
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
