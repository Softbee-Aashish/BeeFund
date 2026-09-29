import React, { useState } from 'react';
import './LeadCategoryModal.css';

export const LOAN_PRODUCT_CONFIGS = [
    {
        id: 'UNSECURED_BUSINESS',
        title: 'Unsecured Business Loan (BL)',
        tagline: 'Zero Collateral • 12M Banking & GST Based',
        ticketRange: '₹5L to ₹1.5 Cr',
        categoryType: 'business',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        )
    },
    {
        id: 'WORKING_CAPITAL',
        title: 'Working Capital (OD / CC)',
        tagline: 'Revolving Line • Stock & Debtors Hypothecation',
        ticketRange: '₹25L to ₹25 Cr',
        categoryType: 'business',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
        )
    },
    {
        id: 'MACHINERY_TERM',
        title: 'Term Loan / Machinery Loan (ML)',
        tagline: 'Capex Financing • OEM Supplier Quotations',
        ticketRange: '₹20L to ₹15 Cr',
        categoryType: 'business',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        )
    },
    {
        id: 'PROJECT_FINANCE',
        title: 'Project Finance & Industrial Capex',
        tagline: 'Land, Civil, Plant Setup • Means of Finance',
        ticketRange: '₹1 Cr to ₹50 Cr',
        categoryType: 'business',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20"></path><path d="M6 20V10l6-4v14"></path><path d="M18 20V4l-6 2"></path></svg>
        )
    },
    {
        id: 'HOME_LAP',
        title: 'Home Loan (HL) / Loan Against Property (LAP)',
        tagline: 'Residential / Commercial Mortgage • 70-80% LTV',
        ticketRange: '₹15L to ₹15 Cr',
        categoryType: 'retail_niche',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        )
    },
    {
        id: 'AUTO_CV',
        title: 'Auto Loan / Commercial Vehicle (AL / CV)',
        tagline: 'HCV / LCV / Fleet & Passenger Cars',
        ticketRange: '₹5L to ₹5 Cr',
        categoryType: 'retail_niche',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
        )
    },
    {
        id: 'PERSONAL_GOLD',
        title: 'Personal Loan (PL) / Gold Loan',
        tagline: 'Fast Disbursal • Salary & Asset Backed',
        ticketRange: '₹50K to ₹40 Lakhs',
        categoryType: 'retail_niche',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
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
    const [selectedProduct, setSelectedProduct] = useState('UNSECURED_BUSINESS');
    const [selectedNiche, setSelectedNiche] = useState('SALARIED');
    const [borrowerName, setBorrowerName] = useState('');
    const [estimatedAmount, setEstimatedAmount] = useState('35');

    if (!isOpen) return null;

    const currentProductConfig = LOAN_PRODUCT_CONFIGS.find(p => p.id === selectedProduct) || LOAN_PRODUCT_CONFIGS[0];
    const isRetailNicheProduct = currentProductConfig.categoryType === 'retail_niche';

    const handleLaunchWizard = () => {
        onSelectCategory({
            loanType: selectedProduct,
            loanTypeTitle: currentProductConfig.title,
            borrowerNiche: isRetailNicheProduct ? selectedNiche : 'BUSINESS_ENTITY',
            borrowerName: borrowerName || (isRetailNicheProduct ? 'Applicant Name' : 'Enterprise Name'),
            estimatedAmountLakhs: parseFloat(estimatedAmount) || 35.0
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
                        <p>Questions and underwriting modules will automatically tailor to your selected loan category.</p>
                    </div>
                    <button type="button" onClick={onClose} className="btn-lead-modal-close" aria-label="Close">✕</button>
                </div>

                <div className="lead-modal-body">
                    {/* SECTION 1: LOAN PRODUCT SELECTION */}
                    <div className="lead-section">
                        <label className="lead-section-title">1. Choose Loan Product Category *</label>
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

                    {/* SECTION 2: NICHE SELECTION (FOR HL/LAP, AUTO/CV, PL/GOLD) */}
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
                        Launch Tailored Underwriting Wizard →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadCategoryModal;
