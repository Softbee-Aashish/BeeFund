import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HexagonBackground from '../components/HexagonBackground';
import { useEnquiryModal } from '../context/EnquireModalContext';
import { LoanIcons } from '../components/NavIcons';
import './LoanProductsPage.css';

/* ========================================================
   CONSOLIDATED FINANCIAL PRODUCT SUITES (10 Core Products)
   With bank-grade vector logos & concise, punchy cards
   ======================================================== */
const ALL_PRODUCTS = [
    {
        id: 'credit-card',
        name: 'Instant Credit Cards',
        category: 'Credit Cards',
        categoryId: 'cards',
        iconKey: 'creditCard',
        iconColor: '#e11d48',
        iconBg: 'rgba(225, 29, 72, 0.1)',
        badge: 'Zero Joining Fee',
        amount: 'Up to ₹10 Lakhs',
        rate: '0% (Up to 50 Days)',
        tenure: 'Revolving Line',
        tagline: 'Paperless application with lounge perks, 50-day 0% interest & cashback rewards.',
        variants: [
            'Lifetime Free',
            'Airport Lounge',
            'Cashback & Rewards',
            'Fuel Waiver'
        ],
        description: 'BeeFund partners with India’s leading private and PSU banks to offer pre-approved credit cards tailored to your lifestyle and spending profile. Enjoy up to 50 days interest-free credit, complimentary domestic and international airport lounge access, 10x reward points on online spends, and fuel surcharge waivers nationwide.',
        features: [
            '100% paperless digital verification process',
            'Up to 50 days interest-free billing cycle',
            'Complimentary airport lounge access across India & overseas',
            'Fuel surcharge waivers and up to 5% direct cashback',
            'Zero joining fee and lifetime-free card options available'
        ],
        eligibility: [
            'Age: 21 to 65 years',
            'Salaried: Min ₹20,000/month net in bank account',
            'Self-Employed: Annual ITR of ₹3,00,000 or above',
            'CIBIL Score: 700+ preferred (650+ for secured FD-backed cards)'
        ],
        documents: [
            'PAN Card & Aadhaar Card (with mobile linked for OTP)',
            'Last 3 months salary slips or last 1 year ITR',
            'Last 3 months bank statement (PDF)'
        ],
        isCreditCard: true
    },
    {
        id: 'home-loan-lap',
        name: 'Home Loan & LAP',
        category: 'Property & Housing',
        categoryId: 'property',
        iconKey: 'homeLoan',
        iconColor: '#0284c7',
        iconBg: 'rgba(2, 132, 199, 0.1)',
        badge: 'Lowest Interest',
        amount: 'Up to ₹15 Cr',
        rate: '8.40% – 10.50%',
        tenure: 'Up to 30 Yrs',
        tagline: 'Home purchase, plot construction, and high-ticket mortgage liquidity against property.',
        variants: [
            'Home Purchase',
            'Mortgage LAP',
            'Plot Construction',
            'Balance Transfer'
        ],
        description: 'Whether buying your dream home or unlocking the hidden equity in your existing real estate, our mortgage solutions combine the lowest institutional rates with flexible tenures. LAP provides unrestricted liquidity for business Capex, debt consolidation, or expansion at half the cost of unsecured loans.',
        features: [
            'Financing up to 90% for Home Loans and up to 70% LTV for LAP',
            'Lowest borrowing cost across all retail and secured debt instruments',
            'Tax deductions up to ₹1.5L (Sec 80C) and ₹2L (Sec 24b) on Home Loans',
            'Residential, commercial shops, offices, and industrial land accepted',
            'Attractive balance transfer with massive top-up facilities'
        ],
        eligibility: [
            'Salaried individuals, self-employed professionals, and business owners',
            'Age: 21 to 65 years at maturity',
            'Clear and marketable title deeds for the pledged property',
            'CIBIL Score: 680+ (750+ secures best prime rate discounts)'
        ],
        documents: [
            'Property Chain Documents (Registry, Mutation, Approved Map)',
            'Last 3 years ITR with computation, P&L, Balance Sheet (or 6 months salary slips)',
            'Last 12 months primary bank statement',
            'KYC documents of all property co-owners & applicants'
        ]
    },
    {
        id: 'business-loan',
        name: 'Business Loan (BL)',
        category: 'Business & MSME',
        categoryId: 'business',
        iconKey: 'businessUnsecured',
        iconColor: '#d97706',
        iconBg: 'rgba(217, 119, 6, 0.1)',
        badge: 'Zero Collateral',
        amount: 'Up to ₹5 Cr+',
        rate: '9.50% – 16.50%',
        tenure: '1 to 7 Yrs',
        tagline: 'Collateral-free business capital for growth and Capex evaluated on GST & banking flows.',
        variants: [
            'Unsecured BL',
            'Secured BL',
            'Merchant POS',
            'Capex Loan'
        ],
        description: 'Fuel your enterprise growth without stalling operations. Unsecured business loans require zero asset pledging and are evaluated directly on your banking cash flows and GST filings. For larger Capex, secured business facilities unlock prime corporate rates and extended multi-year repayment terms.',
        features: [
            'Collateral-free options up to ₹50 Lakhs for quick liquidity',
            'Secured business options up to ₹5 Crore+ for large projects',
            'Predictable monthly EMIs tailored to business cash cycles',
            'Underwriting based on digital GST and banking flows',
            'No restrictions on end-use: purchase inventory, hire staff, or open branches'
        ],
        eligibility: [
            'Proprietorships, Partnerships, LLPs, and Private Limited Companies',
            'Minimum 2 years operational vintage with active GST filing',
            'Annual turnover > ₹30 Lakhs with healthy banking credits',
            'Borrower / Key Director CIBIL: 675+'
        ],
        documents: [
            'PAN, Aadhaar & Business Registration (Udyam / GST / Shop Act)',
            'Last 12 months primary bank statements in PDF',
            'Last 2 years ITR with computation and balance sheet',
            'Company constitutional documents (MOA, AOA, Partnership Deed)'
        ]
    },
    {
        id: 'working-capital-od-cc',
        name: 'Working Capital (OD / CC)',
        category: 'Business & MSME',
        categoryId: 'business',
        iconKey: 'workingCapital',
        iconColor: '#059669',
        iconBg: 'rgba(5, 150, 105, 0.1)',
        badge: 'Daily Reducing ROI',
        amount: 'Turnover Linked',
        rate: '9.25% – 14.50%',
        tenure: '12 Mo (Renewable)',
        tagline: 'Revolving Overdraft & Cash Credit where you pay interest only on exact funds utilized.',
        variants: [
            'Cash Credit (CC)',
            'Bank Overdraft (OD)',
            'Drop-line OD',
            'Invoice Finance'
        ],
        description: 'Never let receivables delays stall your supply chain. An Overdraft or Cash Credit limit allows you to draw down funds as needed to pay suppliers and payroll. Deposit customer receipts back into the account anytime to immediately eliminate interest charges on that surplus.',
        features: [
            'Pay interest strictly on the utilized amount on a daily reducing balance',
            'Deposit customer surplus funds anytime to immediately slash interest outgo',
            'Seamless annual renewal based on healthy turnover credits',
            'Available against book debts, stock hypothecation, or property collateral',
            'Invoice discounting options to unlock cash from 60-90 day customer bills'
        ],
        eligibility: [
            'Manufacturers, traders, distributors, contractors, and service providers',
            'Minimum 2 years continuous operating history',
            'Annual turnover > ₹40 Lakhs with healthy banking flows'
        ],
        documents: [
            'Last 12 months primary current account bank statements',
            'Last 2 years audited ITR, Balance Sheet, and P&L statements',
            'Latest GST returns (GSTR-3B & GSTR-1)',
            'Stock statement & debtors aging schedule'
        ]
    },
    {
        id: 'govt-schemes',
        name: 'Govt MSME Schemes',
        category: 'Govt Schemes',
        categoryId: 'government',
        iconKey: 'government',
        iconColor: '#0d9488',
        iconBg: 'rgba(13, 148, 136, 0.1)',
        badge: 'Govt Subsidized',
        amount: '₹50K to ₹5 Cr',
        rate: '5.00% – 11.50%',
        tenure: 'Up to 7 Yrs',
        tagline: 'Central credit initiatives offering 15%–35% capital subsidies and 0% collateral guarantee.',
        variants: [
            'Mudra (PMMY)',
            'PMEGP Subsidy',
            'CGTMSE Guarantee',
            'Stand-Up India'
        ],
        description: 'Unlock subsidized institutional capital through flagship government welfare and entrepreneurship programs. From micro loans under Mudra to large capital grants under PMEGP and 85% credit default guarantees under CGTMSE, we assist in navigating approvals with zero third-party collateral.',
        features: [
            '15% to 35% direct capital subsidy credited to your bank under PMEGP',
            'Zero property mortgage required under CGTMSE & Mudra schemes',
            'Concessional interest rates subsidized by central ministries',
            'Special quotas and lower margin requirements for Women & SC/ST entrepreneurs',
            'Comprehensive guidance on Project Report (DPR) preparation'
        ],
        eligibility: [
            'Micro, Small & Medium Enterprises, retail traders, artisans, startups',
            'Age: 18 to 65 years',
            'Valid Udyam Registration Certificate',
            'Clean banking track record with no prior institutional defaults'
        ],
        documents: [
            'Udyam Registration Certificate & GST returns',
            'Detailed Project Report (DPR) for new/expansion projects',
            'Promoters KYC: PAN Card and Aadhaar Card',
            'Last 6 to 12 months bank statements & past financial reports'
        ]
    },
    {
        id: 'machinery-loan',
        name: 'Machinery & Equipment (ML)',
        category: 'Business & MSME',
        categoryId: 'business',
        iconKey: 'machinery',
        iconColor: '#4f46e5',
        iconBg: 'rgba(79, 70, 229, 0.1)',
        badge: 'Asset Hypothecation',
        amount: 'Up to 90% Cost',
        rate: '9.00% – 13.00%',
        tenure: 'Up to 7 Yrs',
        tagline: 'Finance industrial machinery, CNC and medical equipment with zero property mortgage.',
        variants: [
            'Industrial CNC',
            'Medical Equipment',
            'Plant Machinery',
            'Moratorium Option'
        ],
        description: 'Upgrade your manufacturing capacity, automate factory lines, or install specialized medical diagnostics without locking up liquid working capital. The equipment itself serves as security via hypothecation, preserving your commercial real estate for other borrowing needs.',
        features: [
            'Finances up to 90% of invoice cost (including GST, transit insurance & freight)',
            'Machinery hypothecation serves as primary collateral — no property mortgage needed',
            'Depreciation tax benefits on the capital asset value',
            'Initial moratorium period of 3 to 6 months during equipment installation',
            'Direct supplier payment to OEM upon proforma verification'
        ],
        eligibility: [
            'Manufacturing units, engineering firms, healthcare clinics, diagnostic centers',
            'Minimum 2 years operating history with profitable track record',
            'Valid order book or demonstrated capacity utilization need'
        ],
        documents: [
            'Proforma Invoice / Quotation from authorized machinery OEM',
            'Last 2 years ITR, P&L, and Balance Sheet certified by CA',
            'Last 12 months bank statements of operating account',
            'Factory electricity bill, lease agreement / ownership proof'
        ]
    },
    {
        id: 'trade-finance-lc-bg',
        name: 'Trade Finance (LC & BG)',
        category: 'Trade Finance',
        categoryId: 'trade-finance',
        iconKey: 'tradeFinance',
        iconColor: '#0891b2',
        iconBg: 'rgba(8, 145, 178, 0.1)',
        badge: 'Bank Guaranteed',
        amount: 'Contract Linked',
        rate: 'Bank Commission',
        tenure: 'Contract Term',
        tagline: 'Letters of Credit and Bank Guarantees for domestic and global trade procurement.',
        variants: [
            'Inland & Import LC',
            'Performance BG',
            'Financial BG',
            'Trade Factoring'
        ],
        description: 'Trade with confidence across India and worldwide. A Letter of Credit (LC) guarantees payment to suppliers upon document verification, allowing you to secure preferential cash prices. Bank Guarantees (BG) satisfy tender, performance, and contract retention requirements without locking cash.',
        features: [
            'Eliminates non-payment risk for suppliers, commanding maximum supplier discounts',
            'Both Inland (domestic) and Foreign Import / Export LC supported',
            'Performance BG and Financial BG for tenders and EPC contracts',
            'Backed by premier PSU and Private sector banks with global SWIFT network',
            'Preserves cash liquidity by utilizing non-fund-based bank credit limits'
        ],
        eligibility: [
            'Importers, exporters, government contractors, manufacturers, EPC firms',
            'Active IEC (Import Export Code) for international trade',
            'Established credit rating and sanctioned non-fund-based bank limit'
        ],
        documents: [
            'Sales Contract / Purchase Order / Tender Document',
            'IEC Certificate, GST Registration, and Udyam Certificate',
            'Last 2 years audited balance sheets and tax returns',
            'Counter-indemnity and security documentation'
        ]
    },
    {
        id: 'auto-vehicle-loan',
        name: 'Auto & Commercial Vehicle',
        category: 'Auto & Vehicles',
        categoryId: 'vehicles',
        iconKey: 'commercialVehicle',
        iconColor: '#ea580c',
        iconBg: 'rgba(234, 88, 12, 0.1)',
        badge: 'Up to 100% Funding',
        amount: 'Up to 100% On-Road',
        rate: '8.50% – 12.50%',
        tenure: 'Up to 7 Yrs',
        tagline: 'Commercial fleets, freight trucks, passenger cars and electric vehicles.',
        variants: [
            'Commercial Fleet',
            'Trucks & Tippers',
            'Car Loans',
            'EV Finance'
        ],
        description: 'Scale your logistics fleet or drive your personal vehicle with minimal upfront down payment. We finance everything from single freight trucks and multi-vehicle transport fleets to new electric cars and commuter two-wheelers with flexible EMI schedules.',
        features: [
            'Up to 90% to 100% financing on ex-showroom and on-road prices',
            'Covers commercial fleets (trucks, tippers, buses) and personal cars',
            'Special discounted interest rate tiers for Electric Vehicles (EVs)',
            'Structured EMI plans tailored for seasonal logistics revenue',
            'Bundled funding for vehicle body-building and comprehensive insurance'
        ],
        eligibility: [
            'Fleet operators, transport contractors, salaried individuals, self-employed',
            'Valid commercial driving permit (for CV) or photo ID',
            'Minimum 1 year employment or 2 years logistics operations'
        ],
        documents: [
            'Dealer quotation / Proforma invoice for chosen vehicle',
            'Borrower KYC (PAN Card, Aadhaar Card)',
            'Last 6 months bank statement showing income or freight receipts',
            'RC copies of existing fleet (for fleet operators)'
        ]
    },
    {
        id: 'professional-education-loan',
        name: 'Professional & Student Loans',
        category: 'Professional & Education',
        categoryId: 'education-personal',
        iconKey: 'professional',
        iconColor: '#7c3aed',
        iconBg: 'rgba(124, 58, 237, 0.1)',
        badge: 'Study Moratorium',
        amount: 'Up to ₹1.5 Cr',
        rate: '8.50% – 14.50%',
        tenure: 'Up to 15 Yrs',
        tagline: 'Higher education loans with study moratorium, plus practice loans for Doctors & CAs.',
        variants: [
            'Doctor & Clinic',
            'CA / CS Practice',
            'Overseas Study',
            'Sec 80E Rebate'
        ],
        description: 'Tailored financing for academic ambitions and professional milestones. Students get comprehensive education loans covering tuition, stay, and flights with zero EMI during studies. Certified professionals (Doctors, CAs, Architects) get high-limit collateral-free practice loans.',
        features: [
            'Full study moratorium: No EMI during study course + 6 to 12 month grace period',
            '100% tax deduction on education loan interest paid under Section 80E',
            'High-ticket collateral-free loans for listed global and Indian universities',
            'Special preferential rates and waived processing fees for Doctors and CAs',
            'Fast-track digital paperwork evaluated on professional credentials'
        ],
        eligibility: [
            'Students: Confirmed admission to recognized Indian/international university with co-borrower',
            'Doctors: MBBS/BDS/MD with active council registration and min 2 years experience',
            'CAs/CS: Valid Certificate of Practice (COP) with min 2 years practice vintage'
        ],
        documents: [
            'Admission letter & fee breakdown (Students) or COP / Degree certificate (Professionals)',
            'Applicant and co-borrower KYC (PAN, Aadhaar)',
            'Last 6 months bank statements & Last 2 years ITR',
            'Academic transcripts (10th, 12th, Graduation degrees)'
        ]
    },
    {
        id: 'gold-loan',
        name: 'Gold Loan (Instant Cash)',
        category: 'Instant & Secured',
        categoryId: 'gold',
        iconKey: 'gold',
        iconColor: '#d97706',
        iconBg: 'rgba(217, 119, 6, 0.1)',
        badge: 'Instant Disbursal',
        amount: 'Up to ₹1.5 Cr',
        rate: '8.00% – 12.00%',
        tenure: '3 to 36 Months',
        tagline: 'Instant liquidity against gold ornaments with 0% balance sheet paperwork.',
        variants: [
            'Working Capital',
            'Emergency Cash',
            'Bullet Repay',
            '0% Foreclosure'
        ],
        description: 'Gold loans are the fastest way to access capital for sudden business opportunities or personal needs. Pledging your gold ornaments provides up to 75% LTV of the gold market value with complete vault insurance, minimal documentation, and flexible bullet repayment options.',
        features: [
            'Direct credit to your bank account upon quick physical appraisal',
            'Zero business balance sheet or complex financial statement prerequisites',
            'Choice between bullet repayment (pay interest at end) or monthly EMI',
            'Gold stored in high-security bank lockers with 100% insurance coverage',
            'Zero prepayment penalty on foreclosure'
        ],
        eligibility: [
            'Any Indian citizen aged 18 years or above',
            'Owner of 18-22 karat gold ornaments or bank minted coins',
            'Valid photo identification (PAN & Aadhaar)'
        ],
        documents: [
            'PAN Card and Aadhaar Card',
            'Passport-size photographs',
            'Bank account details (cancelled cheque / passbook) for NEFT/RTGS disbursal'
        ]
    }
];

/* Category Filter Tabs */
const CATEGORIES = [
    { id: 'all', label: 'All Products' },
    { id: 'business', label: 'Business & MSME' },
    { id: 'property', label: 'Property & Housing' },
    { id: 'government', label: 'Govt Schemes' },
    { id: 'trade-finance', label: 'Trade Finance' },
    { id: 'vehicles', label: 'Auto & Vehicles' },
    { id: 'education-personal', label: 'Professional & Education' },
    { id: 'cards', label: 'Credit Cards' },
    { id: 'gold', label: 'Gold Loan' }
];

/* SEO FAQs */
const FAQS = [
    {
        q: 'How does BeeFund help me get the best loan or credit card?',
        a: 'BeeFund acts as an authorized institutional digital loan partner and debt advisor. We evaluate your profile across 25+ top partner banks and NBFCs, matching your financial requirements with the lender offering the lowest interest rate, maximum loan-to-value (LTV), and highest approval likelihood — at 100% ZERO cost to you.'
    },
    {
        q: 'What is the difference between Enquire Now and Apply Now?',
        a: 'Both options connect directly to our senior loan advisory desk. "Enquire Now" opens a rapid 30-second inquiry form if you want a callback with customized loan options. "Apply Now" takes you to our full application form where you can submit comprehensive business/personal details for fast-track underwriting review.'
    },
    {
        q: 'Are BeeFund services completely free of charge?',
        a: 'Yes, 100% guaranteed. BeeFund never charges borrowers, applicants, or partners any upfront consultation fee, file charge, or commission. We are compensated directly by our empaneled banking partners when your facility is sanctioned.'
    },
    {
        q: 'Can I get a loan if I don’t have property collateral?',
        a: 'Absolutely! We offer multiple collateral-free loan solutions including Mudra Loans (up to ₹10L), CGTMSE MSME Loans (up to ₹5Cr), Unsecured Business Loans (up to ₹50L), Invoice Discounting, and Instant Credit Cards.'
    },
    {
        q: 'How does checking credit score or applying affect my CIBIL score?',
        a: 'Soft credit checks and initial profile reviews conducted through BeeFund do not affect your credit score. Hard inquiries are only initiated with partner banks upon your explicit authorization when formal sanction is requested.'
    }
];

const LoanProductsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { openEnquiryModal } = useEnquiryModal();

    // Active Category Filter
    const [selectedCategory, setSelectedCategory] = useState('all');
    // Search Query
    const [searchQuery, setSearchQuery] = useState('');
    // Selected Product for Popup Modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    // Open FAQ Accordion
    const [openFaq, setOpenFaq] = useState(null);

    // Sync hash with category or product modal
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash) {
            const foundCat = CATEGORIES.find(c => c.id === hash);
            if (foundCat) {
                setSelectedCategory(foundCat.id);
            } else {
                const matchedProduct = ALL_PRODUCTS.find(p => p.id === hash);
                if (matchedProduct) {
                    setSelectedProduct(matchedProduct);
                }
            }
        }
    }, [location.hash]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedProduct(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter products based on selected category and search query
    const filteredProducts = useMemo(() => {
        return ALL_PRODUCTS.filter(product => {
            const matchesCategory =
                selectedCategory === 'all' ||
                product.categoryId === selectedCategory;

            if (!matchesCategory) return false;

            if (!searchQuery.trim()) return true;

            const q = searchQuery.toLowerCase().trim();
            const nameMatch = product.name.toLowerCase().includes(q);
            const catMatch = product.category.toLowerCase().includes(q);
            const taglineMatch = product.tagline.toLowerCase().includes(q);
            const variantMatch = product.variants?.some(v => v.toLowerCase().includes(q));
            const descMatch = product.description.toLowerCase().includes(q);

            return nameMatch || catMatch || taglineMatch || variantMatch || descMatch;
        });
    }, [selectedCategory, searchQuery]);

    // Quick enquiry handler
    const handleQuickEnquire = (e, product) => {
        e.stopPropagation();
        openEnquiryModal({
            loanType: product.name,
            source: `Product Card Quick Enquiry - ${product.name}`
        });
    };

    // Full application form handler
    const handleFullApply = (e, product) => {
        e.stopPropagation();
        navigate(`/apply?loan=${encodeURIComponent(product.name)}`);
    };

    return (
        <div className="loan-products-page">
            <HexagonBackground opacity={0.07} />

            {/* ========================================================
               HERO SECTION
               ======================================================== */}
            <section className="lp-hero">
                <div className="container lp-hero-inner">
                    <span className="lp-badge">
                        <span>✦</span>
                        <span>Institutional Direct Lending & Advisory</span>
                    </span>

                    <h1 className="lp-title">
                        All <span className="lp-hl">Financial Products & Cards</span> — Compare & Apply
                    </h1>

                    <p className="lp-subtitle">
                        Explore our consolidated catalog of retail, business, government, and trade credit facilities.
                        Transparent terms, institutional pricing, and 100% zero consulting fee.
                    </p>

                    {/* Stats Highlights Bar */}
                    <div className="lp-stats">
                        <div className="lp-stat">
                            <span className="lp-stat-val">25+</span>
                            <span className="lp-stat-lbl">Partner Banks</span>
                        </div>
                        <div className="lp-stat-sep" />
                        <div className="lp-stat">
                            <span className="lp-stat-val">8.40%</span>
                            <span className="lp-stat-lbl">Lowest Rates Starting</span>
                        </div>
                        <div className="lp-stat-sep" />
                        <div className="lp-stat">
                            <span className="lp-stat-val">₹15 Cr+</span>
                            <span className="lp-stat-lbl">Max Credit Limit</span>
                        </div>
                        <div className="lp-stat-sep" />
                        <div className="lp-stat">
                            <span className="lp-stat-val">100% Free</span>
                            <span className="lp-stat-lbl">Zero Upfront Fees</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="lp-search-container">
                        <div className="lp-search-box">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search products (e.g. LAP, Mudra, Credit Card, OD/CC, Education, Gold)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="lp-search-clear"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Clear search"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
               CONTROLS BAR (Category Filter Pills)
               ======================================================== */}
            <div className="lp-controls-section">
                <div className="container lp-controls-bar">
                    <div className="lp-category-pills">
                        {CATEGORIES.map(cat => {
                            const count = cat.id === 'all'
                                ? ALL_PRODUCTS.length
                                : ALL_PRODUCTS.filter(p => p.categoryId === cat.id).length;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    className={`lp-pill ${selectedCategory === cat.id ? 'lp-pill--active' : ''}`}
                                    onClick={() => setSelectedCategory(cat.id)}
                                >
                                    <span>{cat.label}</span>
                                    <span className="lp-pill-count">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ========================================================
               PRODUCTS GRID SECTION
               ======================================================== */}
            <section className="lp-products-grid-section">
                <div className="container">
                    <div className="lp-results-header">
                        <span className="lp-results-count">
                            Showing <strong>{filteredProducts.length}</strong> financial product {filteredProducts.length === 1 ? 'suite' : 'suites'}
                        </span>
                        <span className="lp-click-hint">
                            Click any card for full specs, eligibility & documents
                        </span>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="lp-no-results">
                            <h3>No matching products found</h3>
                            <p>We could not find any financial facility matching "{searchQuery}".</p>
                            <button
                                type="button"
                                className="lp-btn-apply"
                                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                            >
                                Reset Search Filters
                            </button>
                        </div>
                    ) : (
                        <div className="lp-cards-grid">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="lp-product-card"
                                    onClick={() => setSelectedProduct(product)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter') setSelectedProduct(product); }}
                                >
                                    {/* Card Header */}
                                    <div className="lp-card-header">
                                        <div
                                            className="lp-card-icon"
                                            style={{
                                                color: product.iconColor || '#d97706',
                                                background: product.iconBg || 'rgba(217, 119, 6, 0.1)'
                                            }}
                                        >
                                            {LoanIcons[product.iconKey] || LoanIcons.businessUnsecured}
                                        </div>
                                        <div className="lp-card-tags">
                                            <span className="lp-tag-cat">{product.category}</span>
                                            <span className="lp-tag-badge">{product.badge}</span>
                                        </div>
                                    </div>

                                    {/* Product Title & Tagline */}
                                    <h3 className="lp-card-title">{product.name}</h3>
                                    <p className="lp-card-tagline">{product.tagline}</p>

                                    {/* Included Variants Chips */}
                                    {product.variants && (
                                        <div className="lp-card-variants">
                                            <span className="lp-variants-label">Includes:</span>
                                            <div className="lp-variants-list">
                                                {product.variants.map((v, i) => (
                                                    <span key={i} className="lp-variant-chip">{v}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Key Metrics Grid */}
                                    <div className="lp-card-metrics">
                                        <div className="lp-metric-item">
                                            <span className="metric-label">Max Limit</span>
                                            <span className="metric-val">{product.amount}</span>
                                        </div>
                                        <div className="lp-metric-item">
                                            <span className="metric-label">Indicative ROI</span>
                                            <span className="metric-val highlight">{product.rate}</span>
                                        </div>
                                        <div className="lp-metric-item">
                                            <span className="metric-label">Tenure</span>
                                            <span className="metric-val">{product.tenure}</span>
                                        </div>
                                    </div>

                                    {/* Card Action Buttons (Both write to Google Sheets) */}
                                    <div className="lp-card-actions">
                                        <button
                                            type="button"
                                            className="lp-btn-enquire"
                                            onClick={(e) => handleQuickEnquire(e, product)}
                                            title="Submit instant 30-sec enquiry to our team"
                                        >
                                            Quick Enquiry
                                        </button>

                                        <button
                                            type="button"
                                            className="lp-btn-apply"
                                            onClick={(e) => handleFullApply(e, product)}
                                            title="Go to full application form"
                                        >
                                            Apply Now &rarr;
                                        </button>

                                        <button
                                            type="button"
                                            className="lp-btn-details"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProduct(product);
                                            }}
                                            title="View detailed loan description, eligibility & checklist"
                                        >
                                            Details &bull;
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ========================================================
               PRODUCT DETAILS POPUP MODAL
               Opens when ANY product is clicked (No TAT days)
               ======================================================== */}
            {selectedProduct && (
                <div className="lp-modal-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="lp-modal-card" onClick={e => e.stopPropagation()}>
                        {/* Close button */}
                        <button
                            type="button"
                            className="lp-modal-close"
                            onClick={() => setSelectedProduct(null)}
                            aria-label="Close details"
                        >
                            &times;
                        </button>

                        {/* Modal Header */}
                        <div className="lp-modal-header">
                            <div className="lp-modal-header-top">
                                {selectedProduct.iconKey && LoanIcons[selectedProduct.iconKey] && (
                                    <div
                                        className="lp-modal-icon"
                                        style={{
                                            color: selectedProduct.iconColor || '#d97706',
                                            background: selectedProduct.iconBg || 'rgba(217, 119, 6, 0.1)'
                                        }}
                                    >
                                        {LoanIcons[selectedProduct.iconKey]}
                                    </div>
                                )}
                                <div className="lp-modal-badge-row">
                                    <span className="lp-tag-cat">{selectedProduct.category}</span>
                                    <span className="lp-tag-badge">{selectedProduct.badge}</span>
                                </div>
                            </div>
                            <h2 className="lp-modal-title">{selectedProduct.name}</h2>
                            <p className="lp-modal-subtitle">{selectedProduct.tagline}</p>
                        </div>

                        {/* Modal Body */}
                        <div className="lp-modal-body">
                            {/* Key Numbers Bar (Max Funding, Rate ROI, Tenure) */}
                            <div className="lp-modal-specs-bar">
                                <div className="modal-spec">
                                    <span className="spec-label">Maximum Limit</span>
                                    <span className="spec-val">{selectedProduct.amount}</span>
                                </div>
                                <div className="modal-spec">
                                    <span className="spec-label">Indicative Rate (ROI)</span>
                                    <span className="spec-val gold">{selectedProduct.rate}</span>
                                </div>
                                <div className="modal-spec">
                                    <span className="spec-label">Repayment Tenure</span>
                                    <span className="spec-val">{selectedProduct.tenure}</span>
                                </div>
                            </div>

                            {/* Covered Variants / Loan Sub-Types */}
                            {selectedProduct.variants && (
                                <div className="lp-modal-section">
                                    <h4 className="modal-sec-heading">Covered Loan Types & Variants</h4>
                                    <div className="modal-variants-grid">
                                        {selectedProduct.variants.map((variant, i) => (
                                            <div key={i} className="modal-variant-badge">
                                                <span className="variant-bullet">✦</span>
                                                <span>{variant}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Detailed Description */}
                            <div className="lp-modal-section">
                                <h4 className="modal-sec-heading">About This Facility</h4>
                                <p className="modal-sec-text">{selectedProduct.description}</p>
                            </div>

                            {/* Key Benefits & Features */}
                            <div className="lp-modal-section">
                                <h4 className="modal-sec-heading">Key Institutional Benefits</h4>
                                <ul className="modal-checklist">
                                    {selectedProduct.features.map((feat, i) => (
                                        <li key={i}>
                                            <span className="check-icon">✓</span>
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Eligibility Criteria */}
                            <div className="lp-modal-section">
                                <h4 className="modal-sec-heading">Eligibility Criteria</h4>
                                <ul className="modal-bullet-list">
                                    {selectedProduct.eligibility.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Required Documents Checklist */}
                            <div className="lp-modal-section">
                                <h4 className="modal-sec-heading">Required Documents</h4>
                                <ul className="modal-bullet-list docs">
                                    {selectedProduct.documents.map((doc, i) => (
                                        <li key={i}>{doc}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="lp-modal-footer">
                            <div className="modal-footer-hint">
                                <span>🔒 100% Free &bull; Zero Upfront Fee &bull; RBI-Licensed Banking Partners</span>
                            </div>

                            <div className="modal-footer-actions">
                                <button
                                    type="button"
                                    className="btn-modal-enquire"
                                    onClick={() => {
                                        const prod = selectedProduct;
                                        setSelectedProduct(null);
                                        openEnquiryModal({
                                            loanType: prod.name,
                                            source: `Modal Quick Enquiry - ${prod.name}`
                                        });
                                    }}
                                >
                                    Quick Enquiry (30s)
                                </button>

                                <button
                                    type="button"
                                    className="btn-modal-apply"
                                    onClick={() => {
                                        const prod = selectedProduct;
                                        setSelectedProduct(null);
                                        navigate(`/apply?loan=${encodeURIComponent(prod.name)}`);
                                    }}
                                >
                                    Full Application Form &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* HOW IT WORKS SECTION (Realistic institutional steps, no TAT promises) */}
            <section className="lp-how-section">
                <HexagonBackground opacity={0.06} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h2 className="lp-sec-title">
                        How Loans Are Processed Through <span className="lp-hl">BeeFund</span>
                    </h2>
                    <p className="lp-sec-sub">
                        Direct loan application assistance linked with authorized bank underwriters.
                    </p>

                    <div className="lp-steps-grid">
                        <div className="lp-step-item">
                            <span className="lp-step-num">01</span>
                            <h3>Submit Details</h3>
                            <p>Fill our 2-minute quick enquiry or apply form. Our credit advisory team reviews your requirements promptly.</p>
                        </div>
                        <div className="lp-step-item">
                            <span className="lp-step-num">02</span>
                            <h3>Underwriting Review</h3>
                            <p>Our dedicated debt syndication team compares your profile across 25+ empaneled lenders.</p>
                        </div>
                        <div className="lp-step-item">
                            <span className="lp-step-num">03</span>
                            <h3>Best Offer Selection</h3>
                            <p>Receive loan options with the lowest interest rate and maximum sanctioned limit.</p>
                        </div>
                        <div className="lp-step-item">
                            <span className="lp-step-num">04</span>
                            <h3>Bank Sanction & Disbursal</h3>
                            <p>Complete KYC verification with our bank partners and receive sanctioned loan funds directly in your account.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <section className="lp-faq-section">
                <div className="container">
                    <h2 className="lp-sec-title">
                        Frequently Asked Questions About <span className="lp-hl">Financial Products</span>
                    </h2>
                    <p className="lp-sec-sub">Everything you need to know before applying for retail, business, or government loans.</p>

                    <div className="lp-faq-list">
                        {FAQS.map((faq, i) => (
                            <div className={`lp-faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                                <button
                                    type="button"
                                    className="lp-faq-question"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span>{faq.q}</span>
                                    <span className="lp-faq-arrow">{openFaq === i ? '▲' : '▼'}</span>
                                </button>
                                {openFaq === i && (
                                    <div className="lp-faq-answer">
                                        <p>{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATUTORY DISCLAIMER */}
            <section className="lp-disclaimer-section">
                <div className="container">
                    <div className="lp-disclaimer-box">
                        <div className="disclaimer-icon">🛡️</div>
                        <div className="disclaimer-text">
                            <strong>Regulatory Notice & Transparency:</strong> All interest rates, loan amounts, tenures, and eligibility requirements listed on this page are indicative as of 2026 and subject to independent credit evaluation by our RBI-licensed banking partners. BeeFund (AADYASHIV CONSULTING PRIVATE LIMITED) acts solely as an authorized direct selling agent and loan facilitator. We never charge upfront processing fees to borrowers. Loan approval timelines are governed by respective lender underwriting policies and verification procedures.
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoanProductsPage;
