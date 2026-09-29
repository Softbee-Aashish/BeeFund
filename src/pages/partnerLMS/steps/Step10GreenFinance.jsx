import React from 'react';

const Step10GreenFinance = ({ formData, updateFormData }) => {
    const ifc = formData.ifcChecklist || {
        envClearance: 'NO',
        validConsentSPCB: 'YES',
        employChildLabour: 'NO',
        occupationalHealthSafety: 'YES',
        landDisplacement: 'NO',
        tribalSettlement: 'NO',
        culturalHeritage: 'NO',
        ecoSensitiveZone: 'NO'
    };

    const updateIFC = (field, value) => {
        const updated = { ...ifc, [field]: value };
        updateFormData({ ifcChecklist: updated });
    };

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 10: 4E / Green Finance & IFC Environmental & Social Checklist</h3>
                <p>Mandatory ESG and social compliance checks for direct institutional refinance and SIDBI scheme eligibility.</p>
            </div>

            <div className="finance-table-box">
                <h4>A. Environmental Aspects</h4>
                <div className="governance-questions-list">
                    <div className="gov-q-row">
                        <span>1. Environment Clearance from Ministry of Environment, Forest & Climate Change / SEIAA?</span>
                        <div className="yes-no-group">
                            <button type="button" className={ifc.envClearance === 'YES' ? 'active-yes' : ''} onClick={() => updateIFC('envClearance', 'YES')}>YES</button>
                            <button type="button" className={ifc.envClearance === 'NO' ? 'active-no' : ''} onClick={() => updateIFC('envClearance', 'NO')}>NO</button>
                        </div>
                    </div>

                    <div className="gov-q-row">
                        <span>2. Valid Consent(s) / Clearances from SPCB / CPCB (State/Central Pollution Control Board)?</span>
                        <div className="yes-no-group">
                            <button type="button" className={ifc.validConsentSPCB === 'YES' ? 'active-yes' : ''} onClick={() => updateIFC('validConsentSPCB', 'YES')}>YES</button>
                            <button type="button" className={ifc.validConsentSPCB === 'NO' ? 'active-no' : ''} onClick={() => updateIFC('validConsentSPCB', 'NO')}>NO</button>
                        </div>
                    </div>
                </div>

                <h4 style={{ marginTop: '1.75rem' }}>B. Social & Labour Safety Aspects</h4>
                <div className="governance-questions-list">
                    <div className="gov-q-row">
                        <span>1. Does the enterprise employ child and/or forced labour for its operations?</span>
                        <div className="yes-no-group">
                            <button type="button" className={ifc.employChildLabour === 'YES' ? 'active-yes' : ''} onClick={() => updateIFC('employChildLabour', 'YES')}>YES</button>
                            <button type="button" className={ifc.employChildLabour === 'NO' ? 'active-no' : ''} onClick={() => updateIFC('employChildLabour', 'NO')}>NO</button>
                        </div>
                    </div>

                    <div className="gov-q-row">
                        <span>2. Does the unit employ Occupational Health & Safety measures (PPE, fire safety, extinguishers in green zone)?</span>
                        <div className="yes-no-group">
                            <button type="button" className={ifc.occupationalHealthSafety === 'YES' ? 'active-yes' : ''} onClick={() => updateIFC('occupationalHealthSafety', 'YES')}>YES</button>
                            <button type="button" className={ifc.occupationalHealthSafety === 'NO' ? 'active-no' : ''} onClick={() => updateIFC('occupationalHealthSafety', 'NO')}>NO</button>
                        </div>
                    </div>

                    <div className="gov-q-row">
                        <span>3. Does the project require compulsory land acquisition causing involuntary resettlement?</span>
                        <div className="yes-no-group">
                            <button type="button" className={ifc.landDisplacement === 'YES' ? 'active-yes' : ''} onClick={() => updateIFC('landDisplacement', 'YES')}>YES</button>
                            <button type="button" className={ifc.landDisplacement === 'NO' ? 'active-no' : ''} onClick={() => updateIFC('landDisplacement', 'NO')}>NO</button>
                        </div>
                    </div>

                    <div className="gov-q-row">
                        <span>4. Is the factory located within 10km of national parks, wildlife sanctuary, or eco-sensitive zone?</span>
                        <div className="yes-no-group">
                            <button type="button" className={ifc.ecoSensitiveZone === 'YES' ? 'active-yes' : ''} onClick={() => updateIFC('ecoSensitiveZone', 'YES')}>YES</button>
                            <button type="button" className={ifc.ecoSensitiveZone === 'NO' ? 'active-no' : ''} onClick={() => updateIFC('ecoSensitiveZone', 'NO')}>NO</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step10GreenFinance;
