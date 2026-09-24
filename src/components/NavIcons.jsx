import React from 'react';

/**
 * High-end Vector SVG Icons for BeeFund Navigation & Product Showcase
 * Replaces all amateur system emojis with bank-grade, bespoke SVG graphics.
 */

export const LoanIcons = {
    // 1. Loan Against Property (LAP)
    lap: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" />
            <path d="M5 21V7l7-4 7 4v14" />
            <path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor" fillOpacity="0.15" />
            <rect x="9" y="14" width="6" height="7" rx="1" />
            <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
    ),

    // 2. Home Loan (HL)
    homeLoan: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity="0.1" />
            <polyline points="9 22 9 12 15 12 15 22" />
            <path d="M18 4v3.5" />
        </svg>
    ),

    // 3. Secured Business Loan
    businessSecured: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="17" rx="2" fill="currentColor" fillOpacity="0.08" />
            <path d="M9 8h6" />
            <path d="M9 12h6" />
            <path d="M9 16h6" />
            <path d="M7 21V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v18" />
        </svg>
    ),

    // 4. Machinery & Equipment
    machinery: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),

    // 5. Commercial Vehicle Loan
    commercialVehicle: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="1" fill="currentColor" fillOpacity="0.1" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" fill="currentColor" />
            <circle cx="18.5" cy="18.5" r="2.5" fill="currentColor" />
        </svg>
    ),

    // 6. Working Capital (OD/CC)
    workingCapital: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" fill="currentColor" fillOpacity="0.1" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <circle cx="12" cy="14" r="2" />
        </svg>
    ),

    // 7. Bill / Invoice Discounting
    billDiscounting: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="currentColor" fillOpacity="0.1" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="13" y2="17" />
            <polyline points="14 10 16 12 18 10" />
        </svg>
    ),

    // 8. Unsecured Business Loan
    businessUnsecured: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
            <path d="M3 3v18h18" strokeOpacity="0.3" />
        </svg>
    ),

    // 9. Professional Loan (Doctors, CAs)
    professional: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="currentColor" fillOpacity="0.12" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
            <circle cx="12" cy="18" r="1" fill="currentColor" />
        </svg>
    ),

    // 10. Mudra / Stand-Up India
    government: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" fillOpacity="0.1" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <circle cx="12" cy="16" r="1.5" fill="currentColor" />
        </svg>
    ),

    // 11. PMEGP & MSME Schemes
    msme: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 20h20" />
            <path d="M5 20V8l5 4V4l9 7v9" fill="currentColor" fillOpacity="0.1" />
            <circle cx="12" cy="16" r="1" />
            <circle cx="16" cy="16" r="1" />
        </svg>
    ),

    // 12. Personal Loan (PL)
    personal: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" fill="currentColor" fillOpacity="0.1" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <line x1="6" y1="15" x2="10" y2="15" />
        </svg>
    ),

    // 13. Car & Education Loan
    carEducation: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" fill="currentColor" fillOpacity="0.1" />
            <circle cx="7" cy="17" r="2" fill="currentColor" />
            <circle cx="17" cy="17" r="2" fill="currentColor" />
        </svg>
    ),

    // 14. Instant Credit Card
    creditCard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2.5" fill="currentColor" fillOpacity="0.1" />
            <line x1="2" y1="9" x2="22" y2="9" strokeWidth="2.5" />
            <rect x="5" y="14" width="4" height="2.5" rx="0.5" fill="currentColor" fillOpacity="0.3" />
            <circle cx="16.5" cy="15" r="1.8" />
            <circle cx="18.5" cy="15" r="1.8" fill="currentColor" fillOpacity="0.2" />
        </svg>
    ),

    // 15. Gold Loan
    gold: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.12" />
            <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
            <path d="M12 8v8" />
            <path d="M10 10h4" />
            <path d="M9.5 14h5" />
        </svg>
    ),

    // 16. Trade Finance (LC / BG)
    tradeFinance: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.08" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
};

export const ToolIcons = {
    // 1. Loan EMI Calculator
    emi: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
            <line x1="8" y1="6" x2="16" y2="6" strokeWidth="2.5" />
            <line x1="8" y1="10" x2="10" y2="10" strokeWidth="2.5" />
            <line x1="14" y1="10" x2="16" y2="10" strokeWidth="2.5" />
            <line x1="8" y1="14" x2="10" y2="14" strokeWidth="2.5" />
            <line x1="14" y1="14" x2="16" y2="14" strokeWidth="2.5" />
            <line x1="8" y1="18" x2="16" y2="18" strokeWidth="2.5" />
        </svg>
    ),

    // 2. Repayment Schedule Generator
    repayment: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="currentColor" fillOpacity="0.1" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="16" y2="17" />
            <line x1="10" y1="9" x2="12" y2="9" />
        </svg>
    ),

    // 3. OD / CC Interest Calculator
    odcc: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" fill="currentColor" fillOpacity="0.1" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <path d="M7 15h2" strokeWidth="2" />
            <path d="M13 15h4" strokeWidth="2" />
        </svg>
    ),

    // 4. Loan Eligibility Checker
    eligibility: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.12" />
            <polyline points="9 12 11 14 15 10" strokeWidth="2.5" />
        </svg>
    ),

    // 5. Loan Comparison Tool
    comparison: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 3h5v5" />
            <path d="M4 20L21 3" />
            <path d="M21 16v5h-5" />
            <path d="M15 15l6 6" />
            <path d="M4 4l5 5" />
        </svg>
    ),

    // 6. GST Calculator
    gst: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.1" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    ),

    // 7. Tax Benefit Calculator
    tax: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    ),

    // 8. Inflation Impact Analyzer
    inflation: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    ),

    // 9. Home Loan Affordability Tool
    affordability: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity="0.1" />
            <path d="M9 15h6" />
            <path d="M12 12v6" />
        </svg>
    ),

    // 10. Fixed vs Floating ROI
    fixedFloating: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
    ),

    // 11. Business ROI Calculator
    roi: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <polyline points="4 8 10 2 16 6 22 1" />
        </svg>
    )
};

/**
 * Modern Icon Wrapper Badge Component
 * Gives every icon a soft rounded container, premium gradient tint, and responsive sizing.
 */
export const NavIconBadge = ({ icon, color = 'amber' }) => {
    return (
        <div className={`nav-icon-badge badge-color-${color}`}>
            {icon}
        </div>
    );
};
