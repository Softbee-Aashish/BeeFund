import React from 'react';
import { LOAN_PRODUCTS, BORROWER_NICHES } from '../masterDocMatrix';

const LENDER_OPTIONS = [
    'State Bank of India (MSME & Commercial)',
    'HDFC Bank (Wholesale & Business Banking)',
    'ICICI Bank (SME & Corporate)',
    'Small Industries Development Bank of India (SIDBI)',
    'Bank of Baroda (MSME Hub)',
    'Punjab National Bank (Zonal Credit Desk)',
    'Axis Bank (Commercial Banking)',
    'Kotak Mahindra Bank',
    'Tata Capital Financial Services',
    'Bajaj Finance Limited',
    'Hero Fincorp (MSME)',
    'Piramal Capital & Housing Finance'
];

const Step2ProductFacility = ({ formData, updateFormData }) => {
    const selectedProductId = formData.loanProduct || 'BL';
    const selectedProduct = LOAN_PRODUCTS.find(p => p.id === selectedProductId) || LOAN_PRODUCTS[3];

    const handleProductChange = (productId) => {
        const prod = LOAN_PRODUCTS.find(p => p.id === productId);
        if (prod) {
            updateFormData({
                loanProduct: prod.id,
                loanType: prod.name,
                loanTenureMonths: prod.defaultTenure || formData.loanTenureMonths || 60
            });
        }
    };

    const loanAmountLakhs = Number(formData.loanAmountLakhs) || 50.0;
    const loanAmountCrores = (loanAmountLakhs / 100).toFixed(2);

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 2: Loan Product Facility & Sizing Parameters</h3>
                <p>Select the targeted financial product, borrower sub-niche, required loan sizing, and lending institution.</p>
            </div>

            <div className="finance-table-box">
                <div className="table-box-header">
                    <h4>Target Loan Product Selection</h4>
                    <span className="badge-stat-right">Category: {selectedProduct.category}</span>
                </div>

                <div className="step-form-grid">
                    <div className="form-field col-2">
                        <label>Target Financial Loan Product *</label>
                        <select
                            value={selectedProductId}
                            onChange={(e) => handleProductChange(e.target.value)}
                            style={{ fontWeight: '700', fontSize: '0.95rem' }}
                        >
                            {LOAN_PRODUCTS.map(prod => (
                                <option key={prod.id} value={prod.id}>
                                    {prod.name} ({prod.code}) — {prod.typicalTicket}
                                </option>
                            ))}
                        </select>
                        <span className="helper-tip" style={{ color: 'var(--wiz-accent)' }}>
                            {selectedProduct.tagline}
                        </span>
                    </div>

                    <div className="form-field">
                        <label>Borrower Profile / Sub-Niche *</label>
                        <select
                            value={formData.borrowerNiche || 'SENP'}
                            onChange={(e) => updateFormData({ borrowerNiche: e.target.value })}
                        >
                            {BORROWER_NICHES.map(niche => (
                                <option key={niche.id} value={niche.id}>{niche.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Target Lending Institution / Bank *</label>
                        <select
                            value={formData.targetLender || LENDER_OPTIONS[0]}
                            onChange={(e) => updateFormData({ targetLender: e.target.value })}
                        >
                            {LENDER_OPTIONS.map(lender => (
                                <option key={lender} value={lender}>{lender}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Requested Loan Amount (₹ in Lakhs) *</label>
                        <input
                            type="number"
                            value={formData.loanAmountLakhs || 50.0}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                updateFormData({
                                    loanAmountLakhs: val,
                                    loanAmountFormatted: val >= 100 ? `₹${(val / 100).toFixed(2)} Cr` : `₹${val.toFixed(2)} Lakhs`
                                });
                            }}
                            min="1"
                            step="0.5"
                            placeholder="Amount in Lakhs"
                            required
                        />
                        <span className="helper-tip">
                            Equivalent to: <strong>₹{loanAmountLakhs} Lakhs ({loanAmountCrores} Crores)</strong>
                        </span>
                    </div>

                    <div className="form-field">
                        <label>Requested Loan Tenure (Months) *</label>
                        <input
                            type="number"
                            value={formData.loanTenureMonths || selectedProduct.defaultTenure || 60}
                            onChange={(e) => updateFormData({ loanTenureMonths: Number(e.target.value) })}
                            min="3"
                            max="360"
                            placeholder="e.g. 60 Months"
                            required
                        />
                    </div>

                    <div className="form-field col-2">
                        <label>Specific Loan End-Use Purpose *</label>
                        <input
                            type="text"
                            value={formData.loanPurpose || ''}
                            onChange={(e) => updateFormData({ loanPurpose: e.target.value })}
                            placeholder="e.g. Setting up new automatic injection molding line & raw material stock purchase"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Dynamic Rule Alert preview based on Phase 2 rules */}
            <div className="finance-balance-banner balanced" style={{ marginTop: '1.5rem' }}>
                <div className="balance-col">
                    <span>Dynamic Underwriting Engine</span>
                    <h3>Product: {selectedProduct.name} ({formData.borrowerNiche || 'General'})</h3>
                </div>
                <div className="balance-col text-right">
                    <span>Target Sizing</span>
                    <h3>{loanAmountLakhs >= 100 ? `₹${loanAmountCrores} Cr` : `₹${loanAmountLakhs} Lakhs`}</h3>
                </div>
            </div>
        </div>
    );
};

export default Step2ProductFacility;
