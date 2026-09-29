import React from 'react';

const Step5Promoters = ({ formData, updateFormData }) => {
    const promoters = formData.promoters || [
        { id: 1, name: 'PRANSHUL MITTAL', dob: '10/08/1998', pan: 'ANIPM1001A', mobile: '9910614222', designation: 'Partner', chiefSignatory: 'NO', relationName: 'PRADEEP KUMAR MITTAL', shareholding: 7.34, gender: 'Male', email: 'pranshulmittal@hotmail.com' },
        { id: 2, name: 'SHIVANI MITTAL', dob: '20/01/1991', pan: 'ASUPA1336P', mobile: '9910600368', designation: 'Partner', chiefSignatory: 'NO', relationName: 'NEERAJ KUMAR AGARWAL', shareholding: 26.0, gender: 'Female', email: 'shivani.agarwal20@gmail.com' },
        { id: 3, name: 'ROHIT SHISHODIA', dob: '16/02/1990', pan: 'BTRPS0101H', mobile: '9873096337', designation: 'Partner', chiefSignatory: 'YES', relationName: 'ASHOK SHISHODIA', shareholding: 33.33, gender: 'Male', email: 'rohitshi2712@gmail.com' },
        { id: 4, name: 'HARSHIT GARG', dob: '08/01/1993', pan: 'BESPG1392G', mobile: '8130308150', designation: 'Partner', chiefSignatory: 'NO', relationName: 'SURENDRA KUMAR GARG', shareholding: 33.33, gender: 'Male', email: 'harshitgarg2011@gmail.com' }
    ];

    const updatePromoter = (index, field, value) => {
        const updated = [...promoters];
        updated[index][field] = value;
        updateFormData({ promoters: updated });
    };

    const addPromoter = () => {
        const newP = {
            id: Date.now(),
            name: '',
            dob: '01/01/1990',
            pan: '',
            mobile: '',
            designation: 'Partner / Director',
            chiefSignatory: 'NO',
            relationName: '',
            shareholding: 0,
            gender: 'Male',
            email: ''
        };
        updateFormData({ promoters: [...promoters, newP] });
    };

    const removePromoter = (index) => {
        const updated = promoters.filter((_, i) => i !== index);
        updateFormData({ promoters: updated });
    };

    const totalShareholding = promoters.reduce((sum, p) => sum + (parseFloat(p.shareholding) || 0), 0);

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 5: Promoters, Partners & Directors Details</h3>
                <p>Add all key promoters, shareholding pattern, PAN details, and designated chief signatories.</p>
            </div>

            <div className="shareholding-bar">
                <span>Total Mapped Shareholding: <strong>{totalShareholding.toFixed(2)}%</strong></span>
                <span className={Math.abs(totalShareholding - 100) < 0.5 ? 'badge-ok' : 'badge-warn'}>
                    {Math.abs(totalShareholding - 100) < 0.5 ? '100% Fully Allocated' : 'Allocation Mismatch'}
                </span>
            </div>

            <div className="promoters-grid-list">
                {promoters.map((p, idx) => (
                    <div key={p.id || idx} className="promoter-card-box">
                        <div className="promoter-card-top">
                            <span className="promoter-badge">Promoter #{idx + 1} {p.chiefSignatory === 'YES' && '(Chief Signatory)'}</span>
                            {promoters.length > 1 && (
                                <button type="button" onClick={() => removePromoter(idx)} className="btn-remove-row">×</button>
                            )}
                        </div>

                        <div className="promoter-fields-grid">
                            <div className="field-group">
                                <label>Full Legal Name *</label>
                                <input
                                    type="text"
                                    value={p.name}
                                    onChange={(e) => updatePromoter(idx, 'name', e.target.value.toUpperCase())}
                                    placeholder="e.g. ROHIT SHISHODIA"
                                />
                            </div>

                            <div className="field-group">
                                <label>Individual PAN *</label>
                                <input
                                    type="text"
                                    value={p.pan}
                                    onChange={(e) => updatePromoter(idx, 'pan', e.target.value.toUpperCase())}
                                    placeholder="e.g. BTRPS0101H"
                                    maxLength="10"
                                />
                            </div>

                            <div className="field-group">
                                <label>Date of Birth (DOB)</label>
                                <input
                                    type="text"
                                    value={p.dob}
                                    onChange={(e) => updatePromoter(idx, 'dob', e.target.value)}
                                    placeholder="DD/MM/YYYY"
                                />
                            </div>

                            <div className="field-group">
                                <label>Mobile Number *</label>
                                <input
                                    type="text"
                                    value={p.mobile}
                                    onChange={(e) => updatePromoter(idx, 'mobile', e.target.value)}
                                    placeholder="9873096337"
                                    maxLength="10"
                                />
                            </div>

                            <div className="field-group">
                                <label>Shareholding (%) *</label>
                                <input
                                    type="number"
                                    value={p.shareholding}
                                    onChange={(e) => updatePromoter(idx, 'shareholding', parseFloat(e.target.value) || 0)}
                                    step="0.01"
                                />
                            </div>

                            <div className="field-group">
                                <label>Chief Signatory?</label>
                                <select
                                    value={p.chiefSignatory}
                                    onChange={(e) => updatePromoter(idx, 'chiefSignatory', e.target.value)}
                                >
                                    <option value="NO">NO</option>
                                    <option value="YES">YES (Signing Authority)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button type="button" onClick={addPromoter} className="btn-add-table-row">
                + Add Another Promoter / Partner
            </button>
        </div>
    );
};

export default Step5Promoters;
