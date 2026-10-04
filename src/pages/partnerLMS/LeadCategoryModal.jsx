import React, { useState } from 'react';
import './LeadCategoryModal.css';

export const LOAN_PRODUCT_CONFIGS = [
    {
        id: 'HL',
        title: 'Home Loan (HL)',
        tagline: 'Residential Mortgage • Purchase & Construction • 70-80% LTV',
        ticketRange: '₹15L to ₹10 Cr',
        categoryType: 'retail_niche',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        )
    },
    {
        id: 'LAP',
        title: 'Loan Against Property (LAP)',
        tagline: 'Commercial & Residential Mortgage • 55-65% LTV',
        ticketRange: '₹25L to ₹25 Cr',
        categoryType: 'business',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
        )
    },
    {
        id: 'ML',
        title: 'Machinery Loan / Equipment (ML)',
        tagline: 'Plant & Equipment Capex • OEM Quotations & Hypothecation',
        ticketRange: '₹20L to ₹30 Cr',
        categoryType: 'business',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
        )
    },
    {
        id: 'BL',
        title: 'Business Loan (BL)',
        tagline: 'MSME Growth Capital • 12M Banking & GST Inflow Based',
        ticketRange: '₹10L to ₹5 Cr',
        categoryType: 'business',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
        )
    },
    {
        id: 'PL',
        title: 'Personal Loan (PL)',
        tagline: 'Instant Unsecured Cash • Salaried FOIR & Net Pay Based',
        ticketRange: '₹1L to ₹40 Lakhs',
        categoryType: 'retail_niche',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        )
    },
    {
        id: 'AL',
        title: 'Auto / Commercial Vehicle (AL)',
        tagline: 'Commercial Fleet & Passenger Cars • RTO Lien Hypothecation',
        ticketRange: '₹5L to ₹3 Cr',
        categoryType: 'retail_niche',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
        )
    },
    {
        id: 'PROJECT',
        title: 'Project Funding',
        tagline: 'Greenfield & Brownfield Industrial Capex • Detailed DPR & TEV',
        ticketRange: '₹5 Cr to ₹100 Cr',
        categoryType: 'business',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 20h20"></path>
                <path d="M6 20V10l6-4v14"></path>
                <path d="M18 20V4l-6 2"></path>
            </svg>
        )
    },
    {
        id: 'OD_CC',
        title: 'Overdraft / Cash Credit (OD/CC)',
        tagline: 'Revolving Working Capital • Stock & Debtors MPBF Method II',
        ticketRange: '₹25L to ₹50 Cr',
        categoryType: 'business',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
        )
    },
    {
        id: 'BILL_DISCOUNTING',
        title: 'Bill / Invoice Discounting',
        tagline: 'Supply Chain Liquidity • Accepted Commercial Invoices & POD',
        ticketRange: '₹15L to ₹20 Cr',
        categoryType: 'business',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
        )
    }
];

export const NICHE_OPTIONS = [
    {
        id: 'SALARIED',
        title: 'Salaried Professional / Employee',
        desc: 'MNC, Corporate, PSU, Govt, or Private Ltd employee with regular monthly salary credits.',
        keyDocs: 'Salary Slips (3M), Form-16, Salary A/C Bank Statement (6M)'
    },
    {
        id: 'SENP',
        title: 'Self-Employed Non-Professional (SENP)',
        desc: 'Traders, Manufacturers, Wholesalers, Retailers, and Contractors running an operational business.',
        keyDocs: 'Business ITR (3Y), Computation, GST Filings, Current Account Banking (12M)'
    },
    {
        id: 'SEP',
        title: 'Self-Employed Professional (SEP)',
        desc: 'Certified Professionals including Doctors (MBBS/MD), Chartered Accountants (CAs), Architects, and Lawyers.',
        keyDocs: 'Degree Certificate, Council Registration / COP, Professional ITR & Banking'
    }
];

const LeadCategoryModal = ({ isOpen, onClose, onSelectCategory }) => {
    const [selectedProduct, setSelectedProduct] = useState('BL');
    const [selectedNiche, setSelectedNiche] = useState('SALARIED');
    const [borrowerName, setBorrowerName] = useState('');
    const [estimatedAmount, setEstimatedAmount] = useState('50');

    if (!isOpen) return null;

    const currentProductConfig = LOAN_PRODUCT_CONFIGS.find(p => p.id === selectedProduct) || LOAN_PRODUCT_CONFIGS[3];
    const isRetailNicheProduct = currentProductConfig.categoryType === 'retail_niche' || selectedProduct === 'HL' || selectedProduct === 'PL' || selectedProduct === 'AL';

    const handleLaunchWizard = () => {
        const amt = parseFloat(estimatedAmount) || 50.0;
        const formattedAmt = amt >= 100 ? `₹${(amt / 100).toFixed(2)} Cr` : `₹${amt.toFixed(2)} Lakhs`;

        onSelectCategory({
            loanProduct: selectedProduct,
            loanType: currentProductConfig.title,
            borrowerNiche: isRetailNicheProduct ? selectedNiche : 'SENP',
            entityType: isRetailNicheProduct ? (selectedNiche === 'SALARIED' ? 'INDIVIDUAL_SALARIED' : 'INDIVIDUAL_SELF_EMPLOYED') : 'PROPRIETORSHIP',
            enterpriseName: isRetailNicheProduct ? '' : (borrowerName || 'New Enterprise Proposal'),
            applicantName: isRetailNicheProduct ? (borrowerName || 'Applicant Name') : '',
            loanAmountLakhs: amt,
            loanAmountFormatted: formattedAmt
        });
    };

    return (
        <div className="lead-modal-overlay" onClick={onClose}>
            <div className="lead-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="lead-modal-header">
                    <div>
                        <span className="lead-modal-badge">LEAD ORIGINATION GATE</span>
                        <h2>Select Loan Product & Underwriting Niche</h2>
                        <p>Underwriting questions, ratio spreading, and validation workflows automatically adapt across all 9 loan products.</p>
                    </div>
                    <button type="button" onClick={onClose} className="btn-lead-modal-close" aria-label="Close">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="lead-modal-body">
                    {/* SECTION 1: LOAN PRODUCT SELECTION */}
                    <div className="lead-section">
                        <label className="lead-section-title">1. Choose Loan Product Category (All 9 Institutional Products) *</label>
                        <div className="product-cards-grid">
                            {LOAN_PRODUCT_CONFIGS.map(prod => (
                                <div
                                    key={prod.id}
                                    className={`product-choice-card ${selectedProduct === prod.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedProduct(prod.id)}
                                >
                                    <div className="prod-card-top">
                                        <div className="prod-icon">{prod.icon}</div>
                                        <span className="prod-ticket-pill">{prod.ticketRange}</span>
                                    </div>
                                    <h4>{prod.title}</h4>
                                    <p>{prod.tagline}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 2: NICHE SELECTION (FOR HL, PL, AL) */}
                    {isRetailNicheProduct && (
                        <div className="lead-section niche-section-animated">
                            <label className="lead-section-title">
                                2. Borrower Profile / Employment Niche *
                                <span className="niche-title-hint"> (Adapts KYC, Banking & Income requirements)</span>
                            </label>
                            <div className="niche-cards-grid">
                                {NICHE_OPTIONS.map(niche => (
                                    <div
                                        key={niche.id}
                                        className={`niche-choice-card ${selectedNiche === niche.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedNiche(niche.id)}
                                    >
                                        <div className="niche-radio-row">
                                            <span className={`niche-radio ${selectedNiche === niche.id ? 'checked' : ''}`}></span>
                                            <strong>{niche.title}</strong>
                                        </div>
                                        <p className="niche-desc">{niche.desc}</p>
                                        <div className="niche-docs-hint">
                                            <span>Key Requirements:</span> {niche.keyDocs}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION 3: BASIC IDENTIFIER & TICKET SIZE */}
                    <div className="lead-section">
                        <label className="lead-section-title">
                            {isRetailNicheProduct ? '3. Applicant Name & Requested Loan Sizing' : '2. Enterprise Name & Facility Sizing'}
                        </label>
                        <div className="lead-quick-inputs-row">
                            <div className="form-group flex-2">
                                <label>{isRetailNicheProduct ? 'Primary Borrower / Applicant Name *' : 'Applicant Enterprise / Firm Legal Name *'}</label>
                                <input
                                    type="text"
                                    className="lead-modal-input"
                                    placeholder={isRetailNicheProduct ? 'e.g. Rajesh Kumar Sharma' : 'e.g. Apex Precision Solutions LLP'}
                                    value={borrowerName}
                                    onChange={(e) => setBorrowerName(e.target.value)}
                                />
                            </div>

                            <div className="form-group flex-1">
                                <label>Requested Amount (₹ in Lakhs) *</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    className="lead-modal-input"
                                    placeholder="e.g. 50"
                                    value={estimatedAmount}
                                    onChange={(e) => setEstimatedAmount(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="lead-modal-footer">
                    <button type="button" onClick={onClose} className="btn-lead-cancel">
                        Cancel
                    </button>
                    <button type="button" onClick={handleLaunchWizard} className="btn-lead-launch">
                        <span>Launch Tailored Underwriting Wizard</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadCategoryModal;
