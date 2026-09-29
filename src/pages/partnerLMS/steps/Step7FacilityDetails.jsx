import React from 'react';

const Step7FacilityDetails = ({ formData, updateFormData }) => {
    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 7: Proposed Facilities & Repayment Schedule</h3>
                <p>Define requested term loan, working capital limits, DCCO commercial production date, and moratorium.</p>
            </div>

            <div className="step-form-grid">
                <div className="form-field">
                    <label>Rupee Term Loan Requested (₹ Lakhs) *</label>
                    <input
                        type="number"
                        value={formData.termLoanLakhs || 2700.0}
                        onChange={(e) => updateFormData({ termLoanLakhs: parseFloat(e.target.value) })}
                    />
                </div>

                <div className="form-field">
                    <label>Working Capital Cash Credit / OD (₹ Lakhs)</label>
                    <input
                        type="number"
                        value={formData.wcCashCredit || 0.0}
                        onChange={(e) => updateFormData({ wcCashCredit: parseFloat(e.target.value) })}
                    />
                </div>

                <div className="form-field">
                    <label>Non-Fund Based (LC / BG) (₹ Lakhs)</label>
                    <input
                        type="number"
                        value={formData.nonFundLCBG || 0.0}
                        onChange={(e) => updateFormData({ nonFundLCBG: parseFloat(e.target.value) })}
                    />
                </div>

                <div className="form-field">
                    <label>Economic Life of the Project (Months)</label>
                    <input
                        type="number"
                        value={formData.economicLifeMonths || 180}
                        onChange={(e) => updateFormData({ economicLifeMonths: parseInt(e.target.value) })}
                    />
                </div>

                <div className="form-field">
                    <label>Moratorium Period (Months) *</label>
                    <input
                        type="number"
                        value={formData.moratoriumMonths || 12}
                        onChange={(e) => updateFormData({ moratoriumMonths: parseInt(e.target.value) })}
                    />
                </div>

                <div className="form-field">
                    <label>Repayment Tenure (Excluding Moratorium) (Months) *</label>
                    <input
                        type="number"
                        value={formData.repaymentMonths || 108}
                        onChange={(e) => updateFormData({ repaymentMonths: parseInt(e.target.value) })}
                    />
                </div>

                <div className="form-field">
                    <label>Expected Trial Runs Date</label>
                    <input
                        type="text"
                        value={formData.trialRunDate || '01/08/2027'}
                        onChange={(e) => updateFormData({ trialRunDate: e.target.value })}
                        placeholder="DD/MM/YYYY"
                    />
                </div>

                <div className="form-field">
                    <label>Commercial Production Date (DCCO) *</label>
                    <input
                        type="text"
                        value={formData.dccoDate || '30/09/2027'}
                        onChange={(e) => updateFormData({ dccoDate: e.target.value })}
                        placeholder="DD/MM/YYYY"
                    />
                </div>
            </div>
        </div>
    );
};

export default Step7FacilityDetails;
