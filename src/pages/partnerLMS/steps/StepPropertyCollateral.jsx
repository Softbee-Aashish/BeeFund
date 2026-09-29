import React from 'react';

const StepPropertyCollateral = ({ formData, updateFormData }) => {
    const prop = formData.propertyDetails || {
        propertyType: 'Residential Apartment (Ready to Move)',
        propertyUsage: 'Self-Occupied Residential',
        propertyAddress: 'Tower 4, Flat 1204, ATS Greens, Sector 50, Noida - 201301',
        builtUpAreaSqFt: 1850,
        estimatedMarketValueLakhs: 145.0,
        agreementValueLakhs: 135.0,
        circleRateValueLakhs: 110.0,
        propertyOwnership: 'Solely Owned by Applicant',
        occupancyStatus: 'Ready to Move / Self Occupied',
        approvedBuildingPlan: 'YES',
        clearTitleCertificate: 'YES',
        priorEncumbranceStatus: 'Nil / Clean Title Deed'
    };

    const updateProp = (field, value) => {
        const updated = { ...prop, [field]: value };
        updateFormData({ propertyDetails: updated });
    };

    const marketValue = parseFloat(prop.estimatedMarketValueLakhs) || 100.0;
    const requestedLoan = parseFloat(formData.termLoanLakhs || formData.loanAmountLakhs) || 85.0;
    const calculatedLTV = (requestedLoan / marketValue) * 100;

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step: Property Mortgage & Collateral Valuation (HL / LAP)</h3>
                <p>Provide property identification, valuation estimates, municipal sanction status, and chain title deeds.</p>
            </div>

            <div className="step-form-grid">
                <div className="form-field">
                    <label>Property Nature & Classification *</label>
                    <select
                        value={prop.propertyType || 'Residential Apartment (Ready to Move)'}
                        onChange={(e) => updateProp('propertyType', e.target.value)}
                    >
                        <option value="Residential Apartment (Ready to Move)">Residential Apartment (Ready to Move)</option>
                        <option value="Independent House / Villa">Independent House / Villa</option>
                        <option value="Commercial Office / Retail Shop">Commercial Office / Retail Shop</option>
                        <option value="Industrial Plot / Shed">Industrial Plot / Shed</option>
                        <option value="Under-Construction Builder Flat">Under-Construction Builder Flat (RERA Approved)</option>
                        <option value="Residential Plot for Construction">Residential Plot for Construction</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Property Occupancy / Usage *</label>
                    <select
                        value={prop.propertyUsage || 'Self-Occupied Residential'}
                        onChange={(e) => updateProp('propertyUsage', e.target.value)}
                    >
                        <option value="Self-Occupied Residential">Self-Occupied Residential</option>
                        <option value="Rented to Commercial Tenant">Rented to Commercial Tenant</option>
                        <option value="Vacant / Under Interior Fit-out">Vacant / Under Interior Fit-out</option>
                        <option value="Self-Occupied Business Premise">Self-Occupied Business Premise</option>
                    </select>
                </div>

                <div className="form-field col-2">
                    <label>Complete Property Address (as per Registered Title Deed) *</label>
                    <input
                        type="text"
                        value={prop.propertyAddress || ''}
                        onChange={(e) => updateProp('propertyAddress', e.target.value)}
                        placeholder="e.g. Flat 1204, Tower 4, ATS Greens, Sector 50, Noida"
                        required
                    />
                </div>

                <div className="form-field">
                    <label>Built-Up / Carpet Area (Sq. Ft.) *</label>
                    <input
                        type="number"
                        value={prop.builtUpAreaSqFt || ''}
                        onChange={(e) => updateProp('builtUpAreaSqFt', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 1850"
                    />
                </div>

                <div className="form-field">
                    <label>Property Ownership Pattern *</label>
                    <select
                        value={prop.propertyOwnership || 'Solely Owned by Applicant'}
                        onChange={(e) => updateProp('propertyOwnership', e.target.value)}
                    >
                        <option value="Solely Owned by Applicant">Solely Owned by Applicant</option>
                        <option value="Jointly Owned with Spouse">Jointly Owned with Spouse</option>
                        <option value="Owned by Entity / Partners">Owned by Entity / Partners</option>
                        <option value="Owned by Parents / Blood Relative">Owned by Parents / Blood Relative</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Estimated Market Valuation (₹ in Lakhs) *</label>
                    <input
                        type="number"
                        step="0.1"
                        value={prop.estimatedMarketValueLakhs || ''}
                        onChange={(e) => updateProp('estimatedMarketValueLakhs', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 145.0"
                    />
                </div>

                <div className="form-field">
                    <label>Registered Agreement Value / Circle Rate (₹ in Lakhs) *</label>
                    <input
                        type="number"
                        step="0.1"
                        value={prop.agreementValueLakhs || ''}
                        onChange={(e) => updateProp('agreementValueLakhs', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 135.0"
                    />
                </div>

                <div className="form-field">
                    <label>Municipal / Authority Sanction Plan Approved? *</label>
                    <select
                        value={prop.approvedBuildingPlan || 'YES'}
                        onChange={(e) => updateProp('approvedBuildingPlan', e.target.value)}
                    >
                        <option value="YES">YES - Approved Sanction Plan Available</option>
                        <option value="NO">NO - Unapproved / Gram Panchayat</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Prior Bank Mortgage / Lien Encumbrance</label>
                    <select
                        value={prop.priorEncumbranceStatus || 'Nil / Clean Title Deed'}
                        onChange={(e) => updateProp('priorEncumbranceStatus', e.target.value)}
                    >
                        <option value="Nil / Clean Title Deed">Nil - Freehold & Clean Title Deed</option>
                        <option value="Existing Loan to be Balance Transferred (BT)">Existing Loan (Balance Transfer BT + Topup)</option>
                    </select>
                </div>
            </div>

            {/* LTV Safety Banner */}
            <div className={`finance-balance-banner ${calculatedLTV <= 75 ? 'balanced' : 'unbalanced'}`} style={{ marginTop: '1.5rem' }}>
                <div className="balance-col">
                    <span>Property Market Value</span>
                    <h3>₹{marketValue.toFixed(2)} Lakhs</h3>
                </div>
                <div className="balance-col">
                    <span>Proposed Loan Sizing</span>
                    <h3>₹{requestedLoan.toFixed(2)} Lakhs</h3>
                </div>
                <div className="balance-col text-right">
                    <span>Calculated LTV (Loan-to-Value)</span>
                    <h3 className={calculatedLTV <= 75 ? 'text-green' : 'text-gold'}>{calculatedLTV.toFixed(1)}%</h3>
                    <span style={{ fontSize: '0.78rem', color: calculatedLTV <= 75 ? '#10b981' : '#f59e0b' }}>
                        {calculatedLTV <= 75 ? 'Optimal Bank LTV Range (≤ 75%)' : 'High LTV (Subject to Risk Premium)'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StepPropertyCollateral;
