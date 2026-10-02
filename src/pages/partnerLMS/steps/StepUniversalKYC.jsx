import React from 'react';
import { ENTITY_TYPES } from '../masterDocMatrix';

const StepUniversalKYC = ({ formData, updateFormData }) => {
    const entityType = formData.entityType || 'PROPRIETORSHIP';
    const isEntity = !['INDIVIDUAL_SALARIED', 'INDIVIDUAL_SELF_EMPLOYED'].includes(entityType);

    const promoters = formData.promoters && formData.promoters.length > 0 ? formData.promoters : [
        {
            id: 1,
            name: formData.applicantName || 'Primary Applicant / Promoter',
            pan: formData.pan || 'ABNFA3331Q',
            aadhaar: 'XXXX-XXXX-4921',
            dob: '15/08/1982',
            shareholding: isEntity ? 100 : 100,
            cibil: 758,
            netWorthLakhs: 250.0,
            designation: isEntity ? 'Managing Director / Partner' : 'Applicant / Borrower'
        }
    ];

    const handlePromoterChange = (index, field, value) => {
        const updated = [...promoters];
        updated[index] = { ...updated[index], [field]: value };
        updateFormData({ promoters: updated });
    };

    const addPromoter = () => {
        const newPromoter = {
            id: Date.now(),
            name: '',
            pan: '',
            aadhaar: '',
            dob: '',
            shareholding: 0,
            cibil: 750,
            netWorthLakhs: 50.0,
            designation: isEntity ? 'Director / Partner' : 'Co-Applicant / Guarantor'
        };
        updateFormData({ promoters: [...promoters, newPromoter] });
    };

    const removePromoter = (index) => {
        if (promoters.length <= 1) return;
        const updated = promoters.filter((_, i) => i !== index);
        updateFormData({ promoters: updated });
    };

    const totalShareholding = promoters.reduce((sum, p) => sum + Number(p.shareholding || 0), 0);

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 1: Universal Borrower / Applicant & Promoter KYC</h3>
                <p>Every credit case begins with universal identity verification for the primary applicant, corporate constitution, and promoter / co-applicant KYC.</p>
            </div>

            {/* Entity Constitution & Applicant Profile */}
            <div className="finance-table-box" style={{ marginBottom: '1.5rem' }}>
                <div className="table-box-header">
                    <h4>Applicant Identity & Constitution Type</h4>
                    <span className="badge-stat-right">Universal Step 1 Profile</span>
                </div>

                <div className="step-form-grid">
                    <div className="form-field">
                        <label>Constitution / Entity Type *</label>
                        <select
                            value={entityType}
                            onChange={(e) => updateFormData({ entityType: e.target.value })}
                        >
                            {ENTITY_TYPES.map(ent => (
                                <option key={ent.id} value={ent.id}>{ent.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label>{isEntity ? 'Legal Enterprise / Firm Name *' : 'Full Applicant Name *'}</label>
                        <input
                            type="text"
                            value={formData.enterpriseName || formData.applicantName || ''}
                            onChange={(e) => updateFormData({
                                enterpriseName: e.target.value,
                                applicantName: e.target.value
                            })}
                            placeholder={isEntity ? "e.g. APEX PRECISION POLYMERS LLP" : "e.g. RAJESH KUMAR SHARMA"}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>{isEntity ? 'Entity PAN Number *' : 'Applicant PAN Number *'}</label>
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
                        <label>{isEntity ? 'Udyam MSME / CIN / LLPIN Number' : 'Aadhaar / Passport Number *'}</label>
                        <input
                            type="text"
                            value={formData.udyamNo || formData.aadhaarNo || ''}
                            onChange={(e) => updateFormData({
                                udyamNo: e.target.value,
                                aadhaarNo: e.target.value
                            })}
                            placeholder={isEntity ? "e.g. UDYAM-UP-29-0013890 or U25209DL2018PTC123456" : "e.g. 5489 1234 5678"}
                        />
                    </div>

                    <div className="form-field col-2">
                        <label>{isEntity ? 'Registered Office / Factory Address *' : 'Current Residential Address *'}</label>
                        <input
                            type="text"
                            value={formData.registeredOffice || formData.residentialAddress || ''}
                            onChange={(e) => updateFormData({
                                registeredOffice: e.target.value,
                                residentialAddress: e.target.value
                            })}
                            placeholder="Street, Building No, Industrial Area / Locality"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>City & State *</label>
                        <input
                            type="text"
                            value={formData.cityState || 'New Delhi, Delhi'}
                            onChange={(e) => updateFormData({ cityState: e.target.value })}
                            placeholder="e.g. Noida, Uttar Pradesh"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Pin Code *</label>
                        <input
                            type="text"
                            value={formData.pincode || '201301'}
                            onChange={(e) => updateFormData({ pincode: e.target.value })}
                            placeholder="6-digit Pincode"
                            maxLength="6"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Contact Mobile Number *</label>
                        <input
                            type="tel"
                            value={formData.contactMobile || ''}
                            onChange={(e) => updateFormData({ contactMobile: e.target.value })}
                            placeholder="e.g. 9871221173"
                            maxLength="10"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Official Email Address *</label>
                        <input
                            type="email"
                            value={formData.contactEmail || ''}
                            onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                            placeholder="e.g. director@apexpolymers.in"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Promoters, Partners & Co-Applicants Grid */}
            <div className="finance-table-box">
                <div className="table-box-header">
                    <h4>{isEntity ? 'Key Promoters, Directors & Partners KYC' : 'Applicant & Co-Applicant / Guarantor KYC'}</h4>
                    {isEntity && (
                        <span className={`shareholding-pill ${totalShareholding === 100 ? 'badge-ok' : 'badge-warn'}`}>
                            Total Shareholding: {totalShareholding}% {totalShareholding === 100 ? '✓ Balanced' : '(Must Equal 100%)'}
                        </span>
                    )}
                </div>

                <div className="promoters-grid-list">
                    {promoters.map((prom, idx) => (
                        <div key={prom.id || idx} className="promoter-card-box">
                            <div className="promoter-card-top">
                                <span className="promoter-badge">
                                    {isEntity ? `Promoter / Director #${idx + 1}` : `Individual Applicant #${idx + 1}`}
                                </span>
                                {promoters.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePromoter(idx)}
                                        className="btn-remove-tbl"
                                        title="Remove Person"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            <div className="promoter-fields-grid">
                                <div className="field-group">
                                    <label>Full Legal Name *</label>
                                    <input
                                        type="text"
                                        value={prom.name || ''}
                                        onChange={(e) => handlePromoterChange(idx, 'name', e.target.value)}
                                        placeholder="Full Name as per PAN"
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Individual PAN Number *</label>
                                    <input
                                        type="text"
                                        value={prom.pan || ''}
                                        onChange={(e) => handlePromoterChange(idx, 'pan', e.target.value.toUpperCase())}
                                        placeholder="10-digit PAN"
                                        maxLength="10"
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Aadhaar Number *</label>
                                    <input
                                        type="text"
                                        value={prom.aadhaar || ''}
                                        onChange={(e) => handlePromoterChange(idx, 'aadhaar', e.target.value)}
                                        placeholder="12-digit Aadhaar"
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Designation / Role</label>
                                    <input
                                        type="text"
                                        value={prom.designation || ''}
                                        onChange={(e) => handlePromoterChange(idx, 'designation', e.target.value)}
                                        placeholder="Director / Partner / Co-Applicant"
                                    />
                                </div>

                                {isEntity && (
                                    <div className="field-group">
                                        <label>Shareholding Equity (%) *</label>
                                        <input
                                            type="number"
                                            value={prom.shareholding || 0}
                                            onChange={(e) => handlePromoterChange(idx, 'shareholding', Number(e.target.value))}
                                            placeholder="Shareholding %"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                )}

                                <div className="field-group">
                                    <label>Estimated Net Worth (₹ Lakhs)</label>
                                    <input
                                        type="number"
                                        value={prom.netWorthLakhs || 0}
                                        onChange={(e) => handlePromoterChange(idx, 'netWorthLakhs', Number(e.target.value))}
                                        placeholder="₹ in Lakhs"
                                    />
                                </div>

                                <div className="field-group">
                                    <label>CIBIL Bureau Score</label>
                                    <input
                                        type="number"
                                        value={prom.cibil || 750}
                                        onChange={(e) => handlePromoterChange(idx, 'cibil', Number(e.target.value))}
                                        placeholder="e.g. 760"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addPromoter}
                    className="btn-add-table-row"
                >
                    + Add Additional Promoter / Director / Co-Applicant
                </button>
            </div>
        </div>
    );
};

export default StepUniversalKYC;
