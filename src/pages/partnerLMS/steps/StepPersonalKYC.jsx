import React from 'react';

const StepPersonalKYC = ({ formData, updateFormData }) => {
    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step: Primary Applicant & Co-Applicant Personal Profile</h3>
                <p>Provide legal identification, residential status, contact information, and Aadhaar/PAN details.</p>
            </div>

            <div className="step-form-grid">
                <div className="form-field col-2">
                    <label>Full Legal Name (as per PAN) *</label>
                    <input
                        type="text"
                        value={formData.applicantName || formData.enterpriseName || ''}
                        onChange={(e) => updateFormData({ applicantName: e.target.value, enterpriseName: e.target.value })}
                        placeholder="e.g. Rajesh Kumar Sharma"
                        required
                    />
                </div>

                <div className="form-field">
                    <label>Individual PAN Number *</label>
                    <input
                        type="text"
                        value={formData.pan || ''}
                        onChange={(e) => updateFormData({ pan: e.target.value.toUpperCase() })}
                        placeholder="e.g. ABCPS1234F"
                        maxLength="10"
                        required
                    />
                </div>

                <div className="form-field">
                    <label>Aadhaar Number (Last 4 Digits / Masked) *</label>
                    <input
                        type="text"
                        value={formData.aadhaarMasked || 'XXXX-XXXX-8921'}
                        onChange={(e) => updateFormData({ aadhaarMasked: e.target.value })}
                        placeholder="e.g. XXXX-XXXX-8921"
                        maxLength="14"
                    />
                </div>

                <div className="form-field">
                    <label>Date of Birth *</label>
                    <input
                        type="date"
                        value={formData.dob || '1988-06-15'}
                        onChange={(e) => updateFormData({ dob: e.target.value })}
                    />
                </div>

                <div className="form-field">
                    <label>Gender *</label>
                    <select
                        value={formData.gender || 'Male'}
                        onChange={(e) => updateFormData({ gender: e.target.value })}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Mobile Number *</label>
                    <input
                        type="tel"
                        value={formData.contactMobile || ''}
                        onChange={(e) => updateFormData({ contactMobile: e.target.value })}
                        placeholder="e.g. 9810144921"
                        maxLength="10"
                    />
                </div>

                <div className="form-field">
                    <label>Personal Email Address *</label>
                    <input
                        type="email"
                        value={formData.contactEmail || ''}
                        onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                        placeholder="e.g. rajesh.sharma@gmail.com"
                    />
                </div>

                <div className="form-field col-2">
                    <label>Current Residential Address *</label>
                    <input
                        type="text"
                        value={formData.registeredOffice || ''}
                        onChange={(e) => updateFormData({ registeredOffice: e.target.value })}
                        placeholder="e.g. Flat 402, Royal Palms Apartment, Indirapuram, Ghaziabad"
                    />
                </div>

                <div className="form-field">
                    <label>Residential Status *</label>
                    <select
                        value={formData.residentialStatus || 'Owned by Self / Parents'}
                        onChange={(e) => updateFormData({ residentialStatus: e.target.value })}
                    >
                        <option value="Owned by Self / Parents">Owned by Self / Parents</option>
                        <option value="Rented with Family">Rented with Family</option>
                        <option value="Company Provided Accommodation">Company Provided Accommodation</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>City & State *</label>
                    <input
                        type="text"
                        value={formData.cityState || 'Ghaziabad, Uttar Pradesh'}
                        onChange={(e) => updateFormData({ cityState: e.target.value })}
                    />
                </div>

                <div className="form-field">
                    <label>Pincode *</label>
                    <input
                        type="text"
                        value={formData.pincode || '201014'}
                        onChange={(e) => updateFormData({ pincode: e.target.value })}
                        maxLength="6"
                    />
                </div>

                <div className="form-field">
                    <label>Co-Applicant / Guarantor Name (Optional)</label>
                    <input
                        type="text"
                        value={formData.coApplicantName || ''}
                        onChange={(e) => updateFormData({ coApplicantName: e.target.value })}
                        placeholder="e.g. Sunita Sharma (Spouse / Co-Borrower)"
                    />
                </div>
            </div>
        </div>
    );
};

export default StepPersonalKYC;
