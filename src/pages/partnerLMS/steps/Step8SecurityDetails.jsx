import React from 'react';

const Step8SecurityDetails = ({ formData, updateFormData }) => {
    const securities = formData.securities || [
        { id: 1, type: 'Industrial Land & Building', owner: 'APEX PRECISION POLYMERS LLP', relation: 'PARTNERSHIP', nature: 'Primary', marketValue: 180.0, chargeType: 'Nil', chargeOffered: '1st' },
        { id: 2, type: 'Cash Collateral (FDR)', owner: 'APEX PRECISION POLYMERS LLP', relation: 'PARTNERSHIP', nature: 'Collateral', marketValue: 45.0, chargeType: 'Nil', chargeOffered: '1st' }
    ];

    const guarantors = formData.guarantors || [
        { id: 1, name: 'ROHIT SHISHODIA', pan: 'BTRPS0101H', netWorth: 285.0 },
        { id: 2, name: 'SHIVANI MITTAL', pan: 'ASUPA1336P', netWorth: 215.0 },
        { id: 3, name: 'HARSHIT GARG', pan: 'BESPG1392G', netWorth: 320.0 }
    ];

    const updateSecurity = (index, field, value) => {
        const updated = [...securities];
        updated[index][field] = value;
        updateFormData({ securities: updated });
    };

    const addSecurity = () => {
        const newSec = {
            id: Date.now(),
            type: 'Property / Land / Plant',
            owner: formData.enterpriseName || 'Applicant Enterprise',
            relation: formData.constitution || 'Partnership',
            nature: 'Collateral',
            marketValue: 100.0,
            chargeType: 'Nil',
            chargeOffered: '1st Charge'
        };
        updateFormData({ securities: [...securities, newSec] });
    };

    const removeSecurity = (index) => {
        const updated = securities.filter((_, i) => i !== index);
        updateFormData({ securities: updated });
    };

    const updateGuarantor = (index, field, value) => {
        const updated = [...guarantors];
        updated[index][field] = value;
        updateFormData({ guarantors: updated });
    };

    const addGuarantor = () => {
        const newG = {
            id: Date.now(),
            name: '',
            pan: '',
            netWorth: 100.0
        };
        updateFormData({ guarantors: [...guarantors, newG] });
    };

    const removeGuarantor = (index) => {
        const updated = guarantors.filter((_, i) => i !== index);
        updateFormData({ guarantors: updated });
    };

    const totalSecurityValue = securities.reduce((sum, s) => sum + (parseFloat(s.marketValue) || 0), 0);
    const totalGuarantorNetWorth = guarantors.reduce((sum, g) => sum + (parseFloat(g.netWorth) || 0), 0);

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 8: Security Details & Personal/Corporate Guarantees</h3>
                <p>Provide tangible primary and collateral security valuation and individual personal net worth of guarantors (₹ Lakhs).</p>
            </div>

            {/* Part A: Securities */}
            <div className="finance-table-box">
                <div className="table-box-header">
                    <h4>A. Security Details (Land, Building, P&M, Shares, FDR)</h4>
                    <span className="badge-stat-right">Total Security: <strong>₹{totalSecurityValue.toFixed(2)} L</strong></span>
                </div>

                <div className="securities-rows-list">
                    {securities.map((sec, idx) => (
                        <div key={sec.id || idx} className="security-item-card">
                            <div className="sec-top-row">
                                <span className="sec-num-badge">Security #{idx + 1} ({sec.nature})</span>
                                {securities.length > 1 && (
                                    <button type="button" onClick={() => removeSecurity(idx)} className="btn-remove-row">×</button>
                                )}
                            </div>
                            <div className="sec-inputs-grid">
                                <div className="field-group">
                                    <label>Particulars of Security</label>
                                    <input
                                        type="text"
                                        value={sec.type}
                                        onChange={(e) => updateSecurity(idx, 'type', e.target.value)}
                                    />
                                </div>
                                <div className="field-group">
                                    <label>Name of Owner</label>
                                    <input
                                        type="text"
                                        value={sec.owner}
                                        onChange={(e) => updateSecurity(idx, 'owner', e.target.value)}
                                    />
                                </div>
                                <div className="field-group">
                                    <label>Nature of Security</label>
                                    <select
                                        value={sec.nature}
                                        onChange={(e) => updateSecurity(idx, 'nature', e.target.value)}
                                    >
                                        <option value="Primary">Primary</option>
                                        <option value="Collateral">Collateral</option>
                                    </select>
                                </div>
                                <div className="field-group">
                                    <label>Market Value (₹ Lakhs)</label>
                                    <input
                                        type="number"
                                        value={sec.marketValue}
                                        onChange={(e) => updateSecurity(idx, 'marketValue', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="field-group">
                                    <label>Charge Offered to Bank</label>
                                    <input
                                        type="text"
                                        value={sec.chargeOffered}
                                        onChange={(e) => updateSecurity(idx, 'chargeOffered', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button type="button" onClick={addSecurity} className="btn-add-table-row">
                    + Add Additional Security / Collateral
                </button>
            </div>

            {/* Part B: Personal Guarantees */}
            <div className="finance-table-box" style={{ marginTop: '2rem' }}>
                <div className="table-box-header">
                    <h4>B. Personal / Corporate Guarantee Details</h4>
                    <span className="badge-stat-right">Total Net Worth: <strong>₹{totalGuarantorNetWorth.toFixed(2)} L (₹{(totalGuarantorNetWorth/100).toFixed(2)} Cr)</strong></span>
                </div>

                <table className="finance-data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name of Guarantor / Corporate</th>
                            <th>PAN / CIN Number</th>
                            <th>Net Worth (₹ in Lakhs)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guarantors.map((g, idx) => (
                            <tr key={g.id || idx}>
                                <td>{idx + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={g.name}
                                        onChange={(e) => updateGuarantor(idx, 'name', e.target.value.toUpperCase())}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={g.pan}
                                        onChange={(e) => updateGuarantor(idx, 'pan', e.target.value.toUpperCase())}
                                        maxLength="10"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={g.netWorth}
                                        onChange={(e) => updateGuarantor(idx, 'netWorth', parseFloat(e.target.value) || 0)}
                                    />
                                </td>
                                <td>
                                    {guarantors.length > 1 && (
                                        <button type="button" onClick={() => removeGuarantor(idx)} className="btn-remove-tbl">×</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="button" onClick={addGuarantor} className="btn-add-table-row">
                    + Add Guarantor
                </button>
            </div>
        </div>
    );
};

export default Step8SecurityDetails;
