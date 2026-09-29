import React from 'react';

const Step3ITRUpload = ({ formData, updateFormData }) => {
    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 3: Income Tax Returns (ITR) & Audited Financials</h3>
                <p>Upload 3-year computation sheets, audited balance sheets, profit & loss statements, and audit reports.</p>
            </div>

            <div className="step-form-grid">
                <div className="form-field">
                    <label>FY 2025-26 Gross Total Income (₹ Lakhs) *</label>
                    <input
                        type="number"
                        value={formData.itrFY26 || 52.20}
                        onChange={(e) => updateFormData({ itrFY26: parseFloat(e.target.value) })}
                    />
                </div>

                <div className="form-field">
                    <label>FY 2024-25 Gross Total Income (₹ Lakhs) *</label>
                    <input
                        type="number"
                        value={formData.itrFY25 || 40.84}
                        onChange={(e) => updateFormData({ itrFY25: parseFloat(e.target.value) })}
                    />
                </div>

                <div className="form-field">
                    <label>FY 2023-24 Gross Total Income (₹ Lakhs) *</label>
                    <input
                        type="number"
                        value={formData.itrFY24 || 29.21}
                        onChange={(e) => updateFormData({ itrFY24: parseFloat(e.target.value) })}
                    />
                </div>

                <div className="form-field">
                    <label>Statutory Auditor Name / Firm</label>
                    <input
                        type="text"
                        value={formData.auditorName || 'M/s V.K. Aggarwal & Associates (FRN: 014920N)'}
                        onChange={(e) => updateFormData({ auditorName: e.target.value })}
                    />
                </div>

                <div className="form-field col-2">
                    <div className="upload-dropzone-box">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <p><strong>Upload 3 Years Audited Balance Sheet & ITR-V Ack (PDF / ZIP)</strong></p>
                        <span>Verified 3-Year Audited Accounts Attached (Annexure 3 Verified)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3ITRUpload;
