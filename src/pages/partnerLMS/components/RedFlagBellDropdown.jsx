import React, { useState, useRef, useEffect } from 'react';

const RedFlagBellDropdown = ({ flags = [], onSelectFlag }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const defaultFlags = [
        {
            id: 'RF-1',
            severity: 'YELLOW',
            title: 'Technical Outward Return in Month 6',
            description: '1 outward cheque return of ₹1.2L in Sep-2024. Rectified on same day; verified as signature mismatch.',
            targetTab: 'spreading',
            targetSub: 'truth_serum'
        },
        {
            id: 'RF-2',
            severity: 'GREEN',
            title: 'GST vs Banking Turnover Variance: 4.2%',
            description: 'Bank credits (₹35.12 Cr) exceed GST sales (₹32.49 Cr) by 8.1% due to export drawback & capital advances. Safe.',
            targetTab: 'spreading',
            targetSub: 'truth_serum'
        },
        {
            id: 'RF-3',
            severity: 'GREEN',
            title: 'LAP / ML Tier Rule: 3-Year Audited Financials',
            description: 'Requirement for loan > ₹50L satisfied with audited balance sheets for FY23, FY24 & FY25.',
            targetTab: 'vault',
            targetSub: 'all'
        }
    ];

    const activeFlags = flags.length > 0 ? flags : defaultFlags;
    const warningCount = activeFlags.filter(f => f.severity !== 'GREEN').length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="red-flag-bell-container" ref={dropdownRef}>
            <button
                type="button"
                className={`btn-bell-toggle ${warningCount > 0 ? 'has-warnings' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Underwriting Risk Triggers & Red Flags"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {warningCount > 0 ? (
                    <span className="bell-badge-count">{warningCount}</span>
                ) : (
                    <span className="bell-badge-dot green"></span>
                )}
            </button>

            {isOpen && (
                <div className="red-flag-dropdown-panel">
                    <div className="dropdown-header">
                        <div className="h-title">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>Credit Risk Flags & Audit Triggers ({activeFlags.length})</span>
                        </div>
                        <span className="badge-count-sub">{warningCount} Actionable</span>
                    </div>

                    <div className="flags-list">
                        {activeFlags.map((flag) => (
                            <div
                                key={flag.id}
                                className={`flag-item ${flag.severity.toLowerCase()}`}
                                onClick={() => {
                                    if (onSelectFlag) onSelectFlag(flag);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="flag-top">
                                    <span className={`flag-severity-pill ${flag.severity.toLowerCase()}`}>
                                        {flag.severity === 'RED' ? '🔴 CRITICAL' : flag.severity === 'YELLOW' ? '🟡 ATTENTION' : '🟢 VERIFIED'}
                                    </span>
                                    <span className="flag-id">{flag.id}</span>
                                </div>
                                <h4 className="flag-title">{flag.title}</h4>
                                <p className="flag-desc">{flag.description}</p>
                                <span className="flag-jump-link">Click to view relevant ledger / tab →</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RedFlagBellDropdown;
