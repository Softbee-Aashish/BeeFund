import React from 'react';

const Step2GSTInfo = ({ formData, updateFormData }) => {
    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 2: Goods and Services Tax (GST) Information</h3>
                <p>Verify active GSTIN registrations, turnover declaration, and filing frequency.</p>
            </div>

            <div className="step-form-grid">
                <div className="form-field">
                    <label>Primary GSTIN Number *</label>
                    <input
                        type="text"
                        value={formData.gstin || '09ABNFA3331Q1ZT'}
                        onChange={(e) => updateFormData({ gstin: e.target.value.toUpperCase() })}
                        placeholder="e.g. 09ABNFA3331Q1ZT"
                        maxLength="15"
                    />
                </div>

                <div className="form-field">
                    <label>GST Registration Date</label>
                    <input
                        type="date"
                        value={formData.gstRegDate || '2019-04-22'}
                        onChange={(e) => updateFormData({ gstRegDate: e.target.value })}
                    />
                </div>

                <div className="form-field">
                    <label>Last 12-Month Total GSTR-3B Turnover (₹ Lakhs) *</label>
                    <input
                        type="number"
                        value={formData.gstTurnover12M || 3249.42}
                        onChange={(e) => updateFormData({ gstTurnover12M: parseFloat(e.target.value) })}
                    />
                </div>

                <div className="form-field">
                    <label>Filing Compliance Regularity (Last 12M)</label>
                    <select
                        value={formData.gstFilingStatus || '100% Filed on Time (12/12)'}
                        onChange={(e) => updateFormData({ gstFilingStatus: e.target.value })}
                    >
                        <option value="100% Filed on Time (12/12)">100% Filed on Time (12/12)</option>
                        <option value="Minor Delay in 1-2 Months">Minor Delay in 1-2 Months (Delayed &lt; 15 days)</option>
                        <option value="Gaps / Non-Filing Exists">Gaps / Non-Filing Exists</option>
                    </select>
                </div>

                <div className="form-field col-2">
                    <label>ITC (Input Tax Credit) Ratio vs Output Tax</label>
                    <div className="itc-preview-badge">
                        <span>Healthy ITC Claim Ratio (~84.2%) • No Disputed Invoices Flagged</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2GSTInfo;
