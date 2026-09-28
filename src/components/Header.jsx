import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEnquiryModal } from '../context/EnquireModalContext';
import { LoanIcons, ToolIcons } from './NavIcons';
import './Header.css';

const LOAN_MENU_ITEMS = [
    {
        category: 'Govt Schemes & Credit Cards',
        theme: 'green',
        items: [
            { name: 'Apply for Credit Card', iconKey: 'creditCard', color: 'rose', path: '/products#credit-card', badge: 'Instant Approval' },
            { name: 'Mudra / Stand-Up India', iconKey: 'government', color: 'green', path: '/products#government', badge: 'Subsidized' },
            { name: 'PMEGP & MSME Schemes', iconKey: 'msme', color: 'green', path: '/products#government', badge: 'CGTMSE cover' },
            { name: 'Personal Loan (PL)', iconKey: 'personal', color: 'rose', path: '/products#personal', badge: 'Quick disbursal' },
            { name: 'Car & Education Loan', iconKey: 'carEducation', color: 'rose', path: '/products#personal', badge: 'Low rates' }
        ]
    },
    {
        category: 'Secured Products',
        theme: 'blue',
        items: [
            { name: 'Loan Against Property (LAP)', iconKey: 'lap', color: 'blue', path: '/products#secured', badge: 'From 8.5%' },
            { name: 'Home Loan (HL)', iconKey: 'homeLoan', color: 'blue', path: '/products#secured', badge: 'Up to ₹10 Cr' },
            { name: 'Secured Business Loan', iconKey: 'businessSecured', color: 'blue', path: '/products#secured', badge: 'Low ROI' },
            { name: 'Machinery & Equipment', iconKey: 'machinery', color: 'blue', path: '/products#secured', badge: '90% Cost' },
            { name: 'Commercial Vehicle Loan', iconKey: 'commercialVehicle', color: 'blue', path: '/products#secured', badge: 'Fast 48h' }
        ]
    },
    {
        category: 'Business & Working Capital',
        theme: 'amber',
        items: [
            { name: 'Working Capital (OD/CC)', iconKey: 'workingCapital', color: 'amber', path: '/products#working-capital', badge: 'Turnover based' },
            { name: 'Bill / Invoice Discounting', iconKey: 'billDiscounting', color: 'amber', path: '/products#working-capital', badge: 'Immediate cash' },
            { name: 'Unsecured Business Loan', iconKey: 'businessUnsecured', color: 'amber', path: '/products#working-capital', badge: 'Zero collateral' },
            { name: 'Professional Loan', iconKey: 'professional', color: 'amber', path: '/products#working-capital', badge: 'Doctors & CAs' }
        ]
    }
];

const TOOL_MENU_ITEMS = [
    {
        id: 'emi-calculator',
        name: 'Loan EMI Calculator',
        iconKey: 'emi',
        color: 'amber',
        desc: 'Calculate monthly installment & schedule',
        path: '/tools/emi-calculator'
    },
    {
        id: 'repayment-schedule',
        name: 'Repayment Schedule Generator',
        iconKey: 'repayment',
        color: 'blue',
        desc: 'Sanction letter amortization & Excel export',
        path: '/tools/repayment-schedule'
    },
    {
        id: 'od-cc-calculator',
        name: 'OD / CC Interest Calculator',
        iconKey: 'odcc',
        color: 'emerald',
        desc: 'Overdraft daily interest & Excel generator',
        path: '/tools/od-cc-calculator'
    },
    {
        id: 'eligibility',
        name: 'Loan Eligibility Checker',
        iconKey: 'eligibility',
        color: 'purple',
        desc: 'Find maximum qualifying loan amount',
        path: '/tools/eligibility'
    },
    {
        id: 'loan-comparison',
        name: 'Loan Comparison Tool',
        iconKey: 'comparison',
        color: 'indigo',
        desc: 'Compare two loan offers side-by-side',
        path: '/tools/loan-comparison'
    },
    {
        id: 'gst-calculator',
        name: 'GST Calculator',
        iconKey: 'gst',
        color: 'blue',
        desc: 'Compute CGST, SGST & IGST slabs',
        path: '/tools/gst-calculator'
    },
    {
        id: 'tax-benefit',
        name: 'Tax Benefit Calculator',
        iconKey: 'tax',
        color: 'rose',
        desc: 'Sec 80C & 24(b) deduction savings',
        path: '/tools/tax-benefit'
    },
    {
        id: 'inflation-impact',
        name: 'Inflation Impact Analyzer',
        iconKey: 'inflation',
        color: 'amber',
        desc: 'Real purchasing power cost of loan',
        path: '/tools/inflation-impact'
    },
    {
        id: 'affordability',
        name: 'Home Affordability Tool',
        iconKey: 'affordability',
        color: 'blue',
        desc: 'Property budget & EMI capacity',
        path: '/tools/affordability'
    },
    {
        id: 'fixed-vs-floating',
        name: 'Fixed vs Floating ROI',
        iconKey: 'fixedFloating',
        color: 'teal',
        desc: 'Compare fixed & variable benchmark rate',
        path: '/tools/fixed-vs-floating'
    }
];

const Header = () => {
    const { openEnquiryModal } = useEnquiryModal();
    const [scrolled, setScrolled] = useState(false);
    const [loansOpen, setLoansOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileLoansOpen, setMobileLoansOpen] = useState(false);
    const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns and mobile drawer on route change
    useEffect(() => {
        setLoansOpen(false);
        setToolsOpen(false);
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scrolling when mobile drawer is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
            <div className="container header-container">
                <Link to="/" className="logo-link" onClick={closeMobileMenu}>
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
                                to="/products"
                                className={`nav-link ${location.pathname.startsWith('/products') || location.pathname.startsWith('/loans') ? 'active' : ''}`}
                            >
                                Products <span className="dropdown-caret">▾</span>
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
                                                            <span className={`dropdown-item-icon-box icon-color-${item.color || 'blue'}`}>
                                                                 {LoanIcons[item.iconKey]}
                                                            </span>
                                                            <div className="dropdown-item-text">
                                                                <div className="dropdown-title-row">
                                                                    <span className="dropdown-item-name">{item.name}</span>
                                                                    <span className="dropdown-item-badge">{item.badge}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <div className="dropdown-footer-bar">
                                    <span>Looking for customized enterprise financing or card offers?</span>
                                    <Link to="/products" className="dropdown-footer-link">
                                        View All Financial Products →
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
                                            <span className={`tool-dropdown-icon-box icon-color-${tool.color || 'amber'}`}>
                                                {ToolIcons[tool.iconKey]}
                                            </span>
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

                        {/* DEDICATED CREDIT CARDS SHOWCASE */}
                        <li>
                            <Link
                                to="/credit-cards"
                                className={`nav-link ${location.pathname.startsWith('/credit-cards') || location.pathname.startsWith('/cards') ? 'active' : ''}`}
                            >
                                <span>Credit Cards</span>
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

                <div className="header-actions">
                    <div className="header-cta">
                        <button
                            type="button"
                            onClick={() => openEnquiryModal({ source: 'Header CTA' })}
                            className="btn btn-primary btn-sm"
                        >
                            Enquire Now
                        </button>
                    </div>

                    {/* Mobile Menu Hamburger Button */}
                    <button
                        type="button"
                        className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer Backdrop */}
            <div
                className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`}
                onClick={closeMobileMenu}
                aria-hidden="true"
            />

            {/* Mobile Navigation Drawer */}
            <aside className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-drawer-header">
                    <Link to="/" onClick={closeMobileMenu} className="mobile-drawer-logo">
                        <img src="/logo.png" alt="BEEFUND" className="logo" />
                    </Link>
                    <button
                        type="button"
                        className="mobile-drawer-close"
                        onClick={closeMobileMenu}
                        aria-label="Close Menu"
                    >
                        ✕
                    </button>
                </div>

                <div className="mobile-drawer-body">
                    <ul className="mobile-nav-list">
                        <li>
                            <Link to="/" onClick={closeMobileMenu} className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                                <span>Home</span>
                            </Link>
                        </li>

                        {/* FREE CREDIT SCORE LINK */}
                        <li>
                            <Link
                                to="/credit-report"
                                onClick={closeMobileMenu}
                                className={`mobile-nav-link mobile-nav-highlight ${location.pathname.startsWith('/credit-report') || location.pathname.startsWith('/credit-score') ? 'active' : ''}`}
                            >
                                <div className="mobile-nav-link-content">
                                    <span>Free Credit Report</span>
                                    <span className="nav-free-badge">FREE</span>
                                </div>
                            </Link>
                        </li>

                        {/* LOANS ACCORDION */}
                        <li className="mobile-accordion-item">
                            <button
                                type="button"
                                className={`mobile-accordion-btn ${mobileLoansOpen ? 'expanded' : ''}`}
                                onClick={() => setMobileLoansOpen(!mobileLoansOpen)}
                            >
                                <span>Products & Cards</span>
                                <span className="accordion-arrow">{mobileLoansOpen ? '▲' : '▼'}</span>
                            </button>

                            {mobileLoansOpen && (
                                <div className="mobile-accordion-panel">
                                    {LOAN_MENU_ITEMS.map((cat, i) => (
                                        <div key={i} className="mobile-cat-group">
                                            <div className="mobile-cat-title">{cat.category}</div>
                                            {cat.items.map((item, j) => (
                                                <Link
                                                    key={j}
                                                    to={item.path}
                                                    onClick={closeMobileMenu}
                                                    className="mobile-sub-link"
                                                >
                                                    <span className={`mobile-sub-icon icon-color-${item.color || 'blue'}`}>
                                                        {LoanIcons[item.iconKey]}
                                                    </span>
                                                    <div className="sub-text">
                                                        <span className="sub-name">{item.name}</span>
                                                        <span className="sub-badge">{item.badge}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                    <Link to="/products" onClick={closeMobileMenu} className="mobile-view-all-link">
                                        View All Financial Products →
                                    </Link>
                                </div>
                            )}
                        </li>

                        {/* TOOLS & CALCULATORS ACCORDION */}
                        <li className="mobile-accordion-item">
                            <button
                                type="button"
                                className={`mobile-accordion-btn ${mobileToolsOpen ? 'expanded' : ''}`}
                                onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                            >
                                <span>Financial Calculators & Tools</span>
                                <span className="accordion-arrow">{mobileToolsOpen ? '▲' : '▼'}</span>
                            </button>

                            {mobileToolsOpen && (
                                <div className="mobile-accordion-panel">
                                    {TOOL_MENU_ITEMS.map((tool) => (
                                        <Link
                                            key={tool.id}
                                            to={tool.path}
                                            onClick={closeMobileMenu}
                                            className="mobile-sub-link"
                                        >
                                            <span className={`mobile-sub-icon icon-color-${tool.color || 'amber'}`}>
                                                {ToolIcons[tool.iconKey]}
                                            </span>
                                            <div className="sub-text">
                                                <span className="sub-name">{tool.name}</span>
                                                <span className="sub-desc">{tool.desc}</span>
                                            </div>
                                        </Link>
                                    ))}
                                    <Link to="/tools" onClick={closeMobileMenu} className="mobile-view-all-link">
                                        Explore All Financial Tools →
                                    </Link>
                                </div>
                            )}
                        </li>

                        <li>
                            <Link to="/credit-cards" onClick={closeMobileMenu} className={`mobile-nav-link ${location.pathname.startsWith('/credit-cards') || location.pathname.startsWith('/cards') ? 'active' : ''}`}>
                                <span>Credit Cards Showcase</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/about" onClick={closeMobileMenu} className={`mobile-nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
                                <span>About BeeFund</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/blog" onClick={closeMobileMenu} className={`mobile-nav-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`}>
                                <span>Financial Insights & Blog</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" onClick={closeMobileMenu} className={`mobile-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                                <span>Contact Us</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms" onClick={closeMobileMenu} className={`mobile-nav-link ${location.pathname === '/terms' ? 'active' : ''}`}>
                                <span>Terms & Privacy</span>
                            </Link>
                        </li>
                    </ul>

                    <div className="mobile-drawer-cta">
                        <button
                            type="button"
                            onClick={() => {
                                closeMobileMenu();
                                openEnquiryModal({ source: 'Mobile Drawer CTA' });
                            }}
                            className="btn btn-primary w-full"
                        >
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                <span>Instant Loan Enquiry</span>
                            </span>
                        </button>
                    </div>
                </div>
            </aside>
        </header>
    );
};

export default Header;
