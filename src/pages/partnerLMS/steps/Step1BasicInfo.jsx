import React from 'react';

const Step1BasicInfo = ({ formData, updateFormData }) => {
    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 1: Applicant Basic Information & Enterprise Profile</h3>
                <p>Provide legal enterprise constitution, tax identification, factory location, and MSME category.</p>
            </div>

            <div className="step-form-grid">
                <div className="form-field col-2">
                    <label>Name of Applicant Enterprise *</label>
                    <input
                        type="text"
                        value={formData.enterpriseName || ''}
                        onChange={(e) => updateFormData({ enterpriseName: e.target.value })}
                        placeholder="e.g. APEX PRECISION POLYMERS LLP"
                        required
                    />
                </div>

                <div className="form-field">
                    <label>Constitution *</label>
                    <select
                        value={formData.constitution || 'Partnership'}
                        onChange={(e) => updateFormData({ constitution: e.target.value })}
                    >
                        <option value="Proprietorship">Proprietorship</option>
                        <option value="Partnership">Partnership</option>
                        <option value="LLP">Limited Liability Partnership (LLP)</option>
                        <option value="Private Limited">Private Limited Company</option>
                        <option value="Public Limited">Public Limited Company</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Enterprise PAN Number *</label>
                    <input
                        type="text"
                        value={formData.pan || ''}
                        onChange={(e) => updateFormData({ pan: e.target.value.toUpperCase() })}
                        placeholder="e.g. ABNFA3331Q"
                        maxLength="10"
                        required
                    />
                </div>

                <div className="form-field">
                    <label>Years of Operation *</label>
                    <select
                        value={formData.yearsOfOperation || 'Enterprise having 3 years ITR or more'}
                        onChange={(e) => updateFormData({ yearsOfOperation: e.target.value })}
                    >
                        <option value="Enterprise having 3 years ITR or more">Enterprise having 3 years ITR or more</option>
                        <option value="Enterprise having 1-2 years ITR">Enterprise having 1-2 years ITR</option>
                        <option value="Greenfield / Startup (< 1 year)">Greenfield / Startup (&lt; 1 year)</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Nature of Industry *</label>
                    <select
                        value={formData.industry || 'Manufacturing'}
                        onChange={(e) => updateFormData({ industry: e.target.value })}
                    >
                        <option value="Manufacturing">Manufacturing (P&M / Industrial)</option>
                        <option value="Service">Services Sector</option>
                        <option value="Trading">Trading & Wholesale Distribution</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>MSME Category *</label>
                    <select
                        value={formData.msmeCategory || 'SMALL'}
                        onChange={(e) => updateFormData({ msmeCategory: e.target.value })}
                    >
                        <option value="MICRO">MICRO (Investment &lt; ₹1Cr, Turnover &lt; ₹5Cr)</option>
                        <option value="SMALL">SMALL (Investment &lt; ₹10Cr, Turnover &lt; ₹50Cr)</option>
                        <option value="MEDIUM">MEDIUM (Investment &lt; ₹50Cr, Turnover &lt; ₹250Cr)</option>
                    </select>
                </div>

                <div className="form-field col-2">
                    <label>Registered Office Address *</label>
                    <input
                        type="text"
                        value={formData.registeredOffice || ''}
                        onChange={(e) => updateFormData({ registeredOffice: e.target.value })}
                        placeholder="e.g. Industrial Complex Phase 1, Ghaziabad, Uttar Pradesh"
                    />
                </div>

                <div className="form-field">
                    <label>Pincode *</label>
                    <input
                        type="text"
                        value={formData.pincode || '201001'}
                        onChange={(e) => updateFormData({ pincode: e.target.value })}
                        maxLength="6"
                    />
                </div>

                <div className="form-field">
                    <label>City & State *</label>
                    <input
                        type="text"
                        value={formData.cityState || 'Ghaziabad, Uttar Pradesh'}
                        onChange={(e) => updateFormData({ cityState: e.target.value })}
                    />
                </div>

                <div className="form-field col-2">
                    <label>Factory Address (Proposed Site / Operating Land) *</label>
                    <textarea
                        rows="2"
                        value={formData.factoryAddressProposed || ''}
                        onChange={(e) => updateFormData({ factoryAddressProposed: e.target.value })}
                        placeholder="e.g. Plot 45, Ecotech Industrial Park, Greater Noida, Uttar Pradesh"
                    />
                </div>

                <div className="form-field">
                    <label>MSME Udyam Registration No. *</label>
                    <input
                        type="text"
                        value={formData.udyamNo || ''}
                        onChange={(e) => updateFormData({ udyamNo: e.target.value })}
                        placeholder="e.g. UDYAM-UP-29-0013890"
                    />
                </div>

                <div className="form-field">
                    <label>Target Bank / Lending Desk *</label>
                    <select
                        value={formData.targetLender || 'State Bank of India (MSME Desk)'}
                        onChange={(e) => updateFormData({ targetLender: e.target.value })}
                    >
                        <option value="State Bank of India (MSME Desk)">State Bank of India (MSME Desk)</option>
                        <option value="Punjab National Bank">Punjab National Bank (Commercial Desk)</option>
                        <option value="HDFC Bank (Commercial Banking)">HDFC Bank (Commercial Banking)</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="ICICI Bank (SME Division)">ICICI Bank (SME Division)</option>
                        <option value="Axis Bank">Axis Bank Commercial</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Step1BasicInfo;
