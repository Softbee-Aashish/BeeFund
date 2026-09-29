import React from 'react';

const StepProfessionalProfile = ({ formData, updateFormData }) => {
    const prof = formData.professionalDetails || {
        professionType: 'Doctor (MD / MS / MBBS)',
        qualification: 'MBBS, MD (Internal Medicine)',
        councilRegistrationNumber: 'MCI/DMC-78219',
        yearsOfPractice: 10,
        clinicOrFirmName: 'Apex Multispeciality Clinic & Diagnostics',
        premiseOwnership: 'Owned Commercial Premise',
        grossAnnualReceipts: 6800000,
        netProfitAnnual: 3400000,
        dailyPatientOrClientVolume: '25-35 consultations/day'
    };

    const updateProf = (field, value) => {
        const updated = { ...prof, [field]: value };
        updateFormData({ professionalDetails: updated });
    };

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step: Self-Employed Professional (SEP) Credentials & Practice</h3>
                <p>Provide medical/legal/CA council registration, practice vintage, clinic/office setup, and gross professional receipts.</p>
            </div>

            <div className="step-form-grid">
                <div className="form-field">
                    <label>Professional Discipline *</label>
                    <select
                        value={prof.professionType || 'Doctor (MD / MS / MBBS)'}
                        onChange={(e) => updateProf('professionType', e.target.value)}
                    >
                        <option value="Doctor (MD / MS / MBBS)">Doctor (MD / MS / MBBS / BDS)</option>
                        <option value="Chartered Accountant (FCA / ACA)">Chartered Accountant (FCA / ACA)</option>
                        <option value="Architect / Civil Consultant (COA)">Architect / Civil Consultant (COA)</option>
                        <option value="Advocate / Legal Counsel (BCI)">Advocate / Legal Counsel (BCI)</option>
                        <option value="Consulting Engineer">Consulting Engineer</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Highest Qualification Degree *</label>
                    <input
                        type="text"
                        value={prof.qualification || ''}
                        onChange={(e) => updateProf('qualification', e.target.value)}
                        placeholder="e.g. MBBS, MD / FCA / B.Arch"
                        required
                    />
                </div>

                <div className="form-field">
                    <label>Council / Statutory Registration No. *</label>
                    <input
                        type="text"
                        value={prof.councilRegistrationNumber || ''}
                        onChange={(e) => updateProf('councilRegistrationNumber', e.target.value)}
                        placeholder="e.g. MCI-78219 / ICAI-092811"
                        required
                    />
                </div>

                <div className="form-field">
                    <label>Total Experience / Post-Qualification Vintage (Years) *</label>
                    <input
                        type="number"
                        value={prof.yearsOfPractice || ''}
                        onChange={(e) => updateProf('yearsOfPractice', e.target.value)}
                        placeholder="e.g. 10"
                        min="1"
                    />
                </div>

                <div className="form-field col-2">
                    <label>Clinic / Consulting Chamber / Firm Name *</label>
                    <input
                        type="text"
                        value={prof.clinicOrFirmName || ''}
                        onChange={(e) => updateProf('clinicOrFirmName', e.target.value)}
                        placeholder="e.g. Apex Health Centre & Day Care"
                    />
                </div>

                <div className="form-field">
                    <label>Clinic / Office Premise Ownership *</label>
                    <select
                        value={prof.premiseOwnership || 'Owned Commercial Premise'}
                        onChange={(e) => updateProf('premiseOwnership', e.target.value)}
                    >
                        <option value="Owned Commercial Premise">Owned Commercial Premise</option>
                        <option value="Owned Residential-cum-Clinic">Owned Residential-cum-Clinic</option>
                        <option value="Rented / Leased Chamber">Rented / Leased Chamber</option>
                        <option value="Visiting Consultant in Hospitals">Visiting Consultant in Hospitals</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Daily Patient / Client Footfall</label>
                    <input
                        type="text"
                        value={prof.dailyPatientOrClientVolume || ''}
                        onChange={(e) => updateProf('dailyPatientOrClientVolume', e.target.value)}
                        placeholder="e.g. 20-30 patients/day"
                    />
                </div>

                <div className="form-field">
                    <label>Gross Annual Professional Receipts (₹) *</label>
                    <input
                        type="number"
                        value={prof.grossAnnualReceipts || ''}
                        onChange={(e) => updateProf('grossAnnualReceipts', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 6800000"
                    />
                </div>

                <div className="form-field">
                    <label>Net Annual Professional Profit (₹) *</label>
                    <input
                        type="number"
                        value={prof.netProfitAnnual || ''}
                        onChange={(e) => updateProf('netProfitAnnual', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 3400000"
                    />
                </div>
            </div>
        </div>
    );
};

export default StepProfessionalProfile;
