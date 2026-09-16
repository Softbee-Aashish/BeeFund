import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEnquiryModal } from '../context/EnquireModalContext';
import './Header.css';

const LOAN_MENU_ITEMS = [
    {
        category: 'Secured Loans',
        items: [
            { name: 'Loan Against Property (LAP)', icon: '🏠', path: '/loans#secured', badge: 'From 8.5%' },
            { name: 'Home Loan (HL)', icon: '🏡', path: '/loans#secured', badge: 'Up to ₹10 Cr' },
            { name: 'Secured Business Loan', icon: '🏢', path: '/loans#secured', badge: 'Low ROI' },
            { name: 'Machinery & Equipment', icon: '⚙️', path: '/loans#secured', badge: '90% Cost' },
            { name: 'Commercial Vehicle Loan', icon: '🚛', path: '/loans#secured', badge: 'Fast 48h' }
        ]
    },
    {
        category: 'Business & Working Capital',
        items: [
            { name: 'Working Capital (OD/CC)', icon: '💼', path: '/loans#working-capital', badge: 'Turnover based' },
            { name: 'Bill / Invoice Discounting', icon: '🧾', path: '/loans#working-capital', badge: 'Immediate cash' },
            { name: 'Unsecured Business Loan', icon: '📈', path: '/loans#working-capital', badge: 'Zero collateral' },
            { name: 'Professional Loan', icon: '👨‍⚕️', path: '/loans#working-capital', badge: 'Doctors & CAs' }
        ]
    },
    {
        category: 'Govt Schemes & Personal',
        items: [
            { name: 'Mudra / Stand-Up India', icon: '🇮🇳', path: '/loans#government', badge: 'Subsidized' },
            { name: 'PMEGP & MSME Schemes', icon: '🏭', path: '/loans#government', badge: 'CGTMSE cover' },
            { name: 'Personal Loan (PL)', icon: '💳', path: '/loans#personal', badge: 'Quick disbursal' },
            { name: 'Car & Education Loan', icon: '🚗', path: '/loans#personal', badge: 'Low rates' }
        ]
    }
];

const TOOL_MENU_ITEMS = [
    {
        id: 'emi-calculator',
        name: 'Loan EMI Calculator',
        icon: '🧮',
        desc: 'Calculate monthly installment & schedule',
        path: '/tools/emi-calculator'
    },
    {
        id: 'repayment-schedule',
        name: 'Repayment Schedule Generator',
        icon: '📑',
        desc: 'Sanction letter amortization & Excel export',
        path: '/tools/repayment-schedule'
    },
    {
        id: 'od-cc-calculator',
        name: 'OD / CC Interest Calculator',
        icon: '💳',
        desc: 'Overdraft daily interest & Excel generator',
        path: '/tools/od-cc-calculator'
    },
    {
        id: 'eligibility',
        name: 'Loan Eligibility Checker',
        icon: '✅',
        desc: 'Find maximum qualifying loan amount',
        path: '/tools/eligibility'
    },
    {
        id: 'loan-comparison',
        name: 'Loan Comparison Tool',
        icon: '⚖️',
        desc: 'Compare two loan offers side-by-side',
        path: '/tools/loan-comparison'
    },
    {
        id: 'gst-calculator',
        name: 'GST Calculator',
        icon: '🧾',
        desc: 'Compute CGST, SGST & IGST slabs',
        path: '/tools/gst-calculator'
    },
    {
        id: 'tax-benefit',
        name: 'Tax Benefit Calculator',
        icon: '🛡️',
        desc: 'Sec 80C & 24(b) deduction savings',
        path: '/tools/tax-benefit'
    },
    {
        id: 'inflation-impact',
        name: 'Inflation Impact Analyzer',
        icon: '📈',
        desc: 'Real purchasing power cost of loan',
        path: '/tools/inflation-impact'
    },
    {
        id: 'affordability',
        name: 'Home Affordability Tool',
        icon: '🏠',
        desc: 'Property budget & EMI capacity',
        path: '/tools/affordability'
    },
    {
        id: 'fixed-vs-floating',
        name: 'Fixed vs Floating ROI',
        icon: '🔄',
        desc: 'Compare fixed & variable benchmark rate',
        path: '/tools/fixed-vs-floating'
    }
];

const Header = () => {
    const { openEnquiryModal } = useEnquiryModal();
    const [scrolled, setScrolled] = useState(false);
    const [loansOpen, setLoansOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns on route change
    useEffect(() => {
        setLoansOpen(false);
        setToolsOpen(false);
    }, [location.pathname]);

    return (
        <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
            <div className="container header-container">
                <Link to="/" className="logo-link">
                    <img src="/logo.png" alt="BEEFUND Logo" className="logo" />
                </Link>

                <nav className="desktop-nav">
                    <ul className="nav-list">
                        <li>
                            <Link
                                to="/"
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                            >
                                Home
                            </Link>
                        </li>

                        {/* LOANS WITH HOVER DROPDOWN */}
                        <li
                            className="nav-item-has-dropdown"
                            onMouseEnter={() => setLoansOpen(true)}
                            onMouseLeave={() => setLoansOpen(false)}
                        >
                            <Link
                                to="/loans"
                                className={`nav-link ${location.pathname.startsWith('/loans') ? 'active' : ''}`}
                            >
                                Loans <span className="dropdown-caret">▾</span>
                            </Link>

                            <div className={`nav-dropdown loans-mega-dropdown ${loansOpen ? 'open' : ''}`}>
                                <div className="loans-mega-grid">
                                    {LOAN_MENU_ITEMS.map((col, idx) => (
                                        <div key={idx} className="loans-dropdown-col">
                                            <h4 className="dropdown-col-title">{col.category}</h4>
                                            <ul className="dropdown-items-list">
                                                {col.items.map((item, i) => (
                                                    <li key={i}>
                                                        <Link to={item.path} className="dropdown-item-link">
                                                            <span className="dropdown-item-icon">{item.icon}</span>
                                                            <div className="dropdown-item-text">
                                                                <span className="dropdown-item-name">{item.name}</span>
                                                                <span className="dropdown-item-badge">{item.badge}</span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <div className="dropdown-footer-bar">
                                    <span>Looking for a tailored corporate loan?</span>
                                    <Link to="/loans" className="dropdown-footer-link">
                                        View All Loan Products →
                                    </Link>
                                </div>
                            </div>
                        </li>

                        {/* TOOLS WITH HOVER DROPDOWN */}
                        <li
                            className="nav-item-has-dropdown"
                            onMouseEnter={() => setToolsOpen(true)}
                            onMouseLeave={() => setToolsOpen(false)}
                        >
                            <Link
                                to="/tools"
                                className={`nav-link ${location.pathname.startsWith('/tools') ? 'active' : ''}`}
                            >
                                Tools <span className="dropdown-caret">▾</span>
                            </Link>

                            <div className={`nav-dropdown tools-mega-dropdown ${toolsOpen ? 'open' : ''}`}>
                                <div className="tools-dropdown-grid">
                                    {TOOL_MENU_ITEMS.map((tool) => (
                                        <Link key={tool.id} to={tool.path} className="tool-dropdown-item">
                                            <span className="tool-dropdown-icon">{tool.icon}</span>
                                            <div className="tool-dropdown-info">
                                                <span className="tool-dropdown-title">{tool.name}</span>
                                                <span className="tool-dropdown-desc">{tool.desc}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <div className="dropdown-footer-bar">
                                    <span>All calculators are 100% free with instant Excel and PDF download</span>
                                    <Link to="/tools" className="dropdown-footer-link">
                                        Explore All Financial Tools →
                                    </Link>
                                </div>
                            </div>
                        </li>

                        {/* CREDIT REPORT CHECK (NEW PRODUCT) */}
                        <li>
                            <Link
                                to="/credit-report"
                                className={`nav-link nav-link-credit ${location.pathname.startsWith('/credit-report') || location.pathname.startsWith('/credit-score') ? 'active' : ''}`}
                            >
                                <span>Credit Report</span>
                                <span className="nav-free-badge">FREE</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/about"
                                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/blog"
                                className={`nav-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`}
                            >
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="header-cta">
                    <button
                        type="button"
                        onClick={() => openEnquiryModal({ source: 'Header CTA' })}
                        className="btn btn-primary btn-sm"
                    >
                        Enquire Now
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
