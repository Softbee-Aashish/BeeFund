import React from 'react';

const StepSalariedIncome = ({ formData, updateFormData }) => {
    const salaried = formData.salariedDetails || {
        employerName: 'Tata Consultancy Services Ltd',
        employerCategory: 'Category A / Listed Corporate',
        designation: 'Lead Solutions Architect',
        totalWorkExperienceYears: 8,
        currentCompanyVintageYears: 4,
        netMonthlySalary: 165000,
        grossMonthlySalary: 195000,
        salaryMode: 'Direct Bank Transfer (NEFT/RTGS)',
        form16AY1: 1850000,
        form16AY2: 2120000,
        officialEmail: 'rajesh.sharma@tcs.com'
    };

    const updateSalaried = (field, value) => {
        const updated = { ...salaried, [field]: value };
        updateFormData({ salariedDetails: updated });
    };

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step: Salaried Employment & Income Profile</h3>
                <p>Provide employer details, monthly net salary credits, Form 16 assessment, and professional experience.</p>
            </div>

            <div className="step-form-grid">
                <div className="form-field col-2">
                    <label>Employer / Corporate Name *</label>
                    <input
                        type="text"
                        value={salaried.employerName || ''}
                        onChange={(e) => updateSalaried('employerName', e.target.value)}
                        placeholder="e.g. Tata Consultancy Services Ltd / Infosys / Central Govt"
                        required
                    />
                </div>

                <div className="form-field">
                    <label>Employer Category *</label>
                    <select
                        value={salaried.employerCategory || 'Category A / Listed Corporate'}
                        onChange={(e) => updateSalaried('employerCategory', e.target.value)}
                    >
                        <option value="Category A / Listed Corporate">Category A / Listed Corporate</option>
                        <option value="Category B / Top MNC">Category B / Top MNC</option>
                        <option value="Government / PSU Undertaking">Government / PSU Undertaking</option>
                        <option value="Private Limited Company">Private Limited Company</option>
                        <option value="Partnership / Proprietorship Firm">Partnership / Proprietorship Firm</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Designation / Role *</label>
                    <input
                        type="text"
                        value={salaried.designation || ''}
                        onChange={(e) => updateSalaried('designation', e.target.value)}
                        placeholder="e.g. Senior Project Manager"
                    />
                </div>

                <div className="form-field">
                    <label>Total Professional Experience (Years) *</label>
                    <input
                        type="number"
                        value={salaried.totalWorkExperienceYears || ''}
                        onChange={(e) => updateSalaried('totalWorkExperienceYears', e.target.value)}
                        placeholder="e.g. 8"
                        min="0"
                    />
                </div>

                <div className="form-field">
                    <label>Current Company Vintage (Years) *</label>
                    <input
                        type="number"
                        value={salaried.currentCompanyVintageYears || ''}
                        onChange={(e) => updateSalaried('currentCompanyVintageYears', e.target.value)}
                        placeholder="e.g. 3"
                        min="0"
                    />
                </div>

                <div className="form-field">
                    <label>Net In-Hand Monthly Salary (₹) *</label>
                    <input
                        type="number"
                        value={salaried.netMonthlySalary || ''}
                        onChange={(e) => updateSalaried('netMonthlySalary', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 125000"
                    />
                </div>

                <div className="form-field">
                    <label>Gross Monthly Salary (₹) *</label>
                    <input
                        type="number"
                        value={salaried.grossMonthlySalary || ''}
                        onChange={(e) => updateSalaried('grossMonthlySalary', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 150000"
                    />
                </div>

                <div className="form-field">
                    <label>Salary Disbursement Mode *</label>
                    <select
                        value={salaried.salaryMode || 'Direct Bank Transfer (NEFT/RTGS)'}
                        onChange={(e) => updateSalaried('salaryMode', e.target.value)}
                    >
                        <option value="Direct Bank Transfer (NEFT/RTGS)">Direct Bank Transfer (NEFT/RTGS/IMPS)</option>
                        <option value="Company Cheque Deposit">Company Cheque Deposit</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Official Corporate Email</label>
                    <input
                        type="email"
                        value={salaried.officialEmail || ''}
                        onChange={(e) => updateSalaried('officialEmail', e.target.value)}
                        placeholder="e.g. rajesh@company.com"
                    />
                </div>

                <div className="form-field">
                    <label>Form 16 Taxable Gross - AY 2025-26 (₹)</label>
                    <input
                        type="number"
                        value={salaried.form16AY1 || ''}
                        onChange={(e) => updateSalaried('form16AY1', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 1850000"
                    />
                </div>

                <div className="form-field">
                    <label>Form 16 Taxable Gross - AY 2026-27 (₹)</label>
                    <input
                        type="number"
                        value={salaried.form16AY2 || ''}
                        onChange={(e) => updateSalaried('form16AY2', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 2120000"
                    />
                </div>
            </div>

            {/* Income Highlights Card */}
            <div className="finance-table-box" style={{ marginTop: '1.5rem' }}>
                <h4>Salary Verification & Debt Servicing Capacity (FOIR Preview)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.8rem' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Net Annual Salary</span>
                        <h4 style={{ color: '#38bdf8', marginTop: '4px', fontSize: '1.1rem' }}>
                            ₹{((salaried.netMonthlySalary || 0) * 12 / 100000).toFixed(2)} Lakhs / yr
                        </h4>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Max Safe EMI (60% FOIR)</span>
                        <h4 style={{ color: '#10b981', marginTop: '4px', fontSize: '1.1rem' }}>
                            ₹{Math.round((salaried.netMonthlySalary || 0) * 0.60).toLocaleString()} / month
                        </h4>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Estimated HL Eligibility (8.5% 20Y)</span>
                        <h4 style={{ color: '#fbbf24', marginTop: '4px', fontSize: '1.1rem' }}>
                            ₹{(((salaried.netMonthlySalary || 0) * 0.60 * 115) / 100000).toFixed(2)} Lakhs
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepSalariedIncome;
