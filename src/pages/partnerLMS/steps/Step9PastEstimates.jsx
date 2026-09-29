import React from 'react';

const Step9PastEstimates = ({ formData, updateFormData }) => {
    const fin = formData.pastFinancials || {
        sales: { past1: 3024.27, past2: 2743.11, currentEst: 3249.42, nextProj: 5282.79 },
        netProfit: { past1: 29.21, past2: 40.84, currentEst: 52.20, nextProj: 153.86 },
        netWorth: { past1: 177.13, past2: 479.23, currentEst: 488.07, nextProj: 1056.12 }
    };

    const updateFin = (category, field, value) => {
        const updated = {
            ...fin,
            [category]: {
                ...fin[category],
                [field]: parseFloat(value) || 0
            }
        };
        updateFormData({ pastFinancials: updated });
    };

    const gov = formData.governance || {
        disputedLiabilities: 'NO',
        nonDisputedArrears: 'NO',
        courtCases: 'NO',
        labourDisputes: 'NO',
        connectedLending: 'NO'
    };

    const updateGov = (field, value) => {
        const updated = { ...gov, [field]: value };
        updateFormData({ governance: updated });
    };

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 9: Past Performance, Future Estimates & Corporate Governance</h3>
                <p>Provide audited financial history and statutory compliance disclosures (Figures in ₹ Lakhs).</p>
            </div>

            {/* Part A: Financial Estimates */}
            <div className="finance-table-box">
                <h4>A. Past Performance / Future Estimates (₹ in Lakhs)</h4>
                <table className="finance-data-table">
                    <thead>
                        <tr>
                            <th>Parameter (₹ Lakhs)</th>
                            <th>Past Year 1 (Actual)</th>
                            <th>Past Year 2 (Actual)</th>
                            <th>Present Year (Estimate)</th>
                            <th>Next Year (Projection)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Net Sales / Turnover</strong></td>
                            <td><input type="number" value={fin.sales.past1} onChange={(e) => updateFin('sales', 'past1', e.target.value)} /></td>
                            <td><input type="number" value={fin.sales.past2} onChange={(e) => updateFin('sales', 'past2', e.target.value)} /></td>
                            <td><input type="number" value={fin.sales.currentEst} onChange={(e) => updateFin('sales', 'currentEst', e.target.value)} /></td>
                            <td><input type="number" value={fin.sales.nextProj} onChange={(e) => updateFin('sales', 'nextProj', e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td><strong>Net Profit after Tax</strong></td>
                            <td><input type="number" value={fin.netProfit.past1} onChange={(e) => updateFin('netProfit', 'past1', e.target.value)} /></td>
                            <td><input type="number" value={fin.netProfit.past2} onChange={(e) => updateFin('netProfit', 'past2', e.target.value)} /></td>
                            <td><input type="number" value={fin.netProfit.currentEst} onChange={(e) => updateFin('netProfit', 'currentEst', e.target.value)} /></td>
                            <td><input type="number" value={fin.netProfit.nextProj} onChange={(e) => updateFin('netProfit', 'nextProj', e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td><strong>Capital (Net Worth)</strong></td>
                            <td><input type="number" value={fin.netWorth.past1} onChange={(e) => updateFin('netWorth', 'past1', e.target.value)} /></td>
                            <td><input type="number" value={fin.netWorth.past2} onChange={(e) => updateFin('netWorth', 'past2', e.target.value)} /></td>
                            <td><input type="number" value={fin.netWorth.currentEst} onChange={(e) => updateFin('netWorth', 'currentEst', e.target.value)} /></td>
                            <td><input type="number" value={fin.netWorth.nextProj} onChange={(e) => updateFin('netWorth', 'nextProj', e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Part B: Corporate Governance YES/NO Questions */}
            <div className="finance-table-box" style={{ marginTop: '2rem' }}>
                <h4>B. Corporate Governance & Statutory Compliance Disclosures</h4>
                <div className="governance-questions-list">
                    <div className="gov-q-row">
                        <span>1. Details of disputed liabilities towards statutory payments (Income Tax, Sales Tax, PF, ESIC, GST)?</span>
                        <div className="yes-no-group">
                            <button type="button" className={gov.disputedLiabilities === 'YES' ? 'active-yes' : ''} onClick={() => updateGov('disputedLiabilities', 'YES')}>YES</button>
                            <button type="button" className={gov.disputedLiabilities === 'NO' ? 'active-no' : ''} onClick={() => updateGov('disputedLiabilities', 'NO')}>NO</button>
                        </div>
                    </div>

                    <div className="gov-q-row">
                        <span>2. Details of arrears in non-disputed statutory payments in respect of enterprise?</span>
                        <div className="yes-no-group">
                            <button type="button" className={gov.nonDisputedArrears === 'YES' ? 'active-yes' : ''} onClick={() => updateGov('nonDisputedArrears', 'YES')}>YES</button>
                            <button type="button" className={gov.nonDisputedArrears === 'NO' ? 'active-no' : ''} onClick={() => updateGov('nonDisputedArrears', 'NO')}>NO</button>
                        </div>
                    </div>

                    <div className="gov-q-row">
                        <span>3. Details of pending court cases initiated by banks / FIs / Govt against enterprise or promoters?</span>
                        <div className="yes-no-group">
                            <button type="button" className={gov.courtCases === 'YES' ? 'active-yes' : ''} onClick={() => updateGov('courtCases', 'YES')}>YES</button>
                            <button type="button" className={gov.courtCases === 'NO' ? 'active-no' : ''} onClick={() => updateGov('courtCases', 'NO')}>NO</button>
                        </div>
                    </div>

                    <div className="gov-q-row">
                        <span>4. Details of labour disputes / litigations by or against promoters / directors?</span>
                        <div className="yes-no-group">
                            <button type="button" className={gov.labourDisputes === 'YES' ? 'active-yes' : ''} onClick={() => updateGov('labourDisputes', 'YES')}>YES</button>
                            <button type="button" className={gov.labourDisputes === 'NO' ? 'active-no' : ''} onClick={() => updateGov('labourDisputes', 'NO')}>NO</button>
                        </div>
                    </div>

                    <div className="gov-q-row">
                        <span>5. Connected Lending - Relationship of Promoters with officials / Directors of Target Bank?</span>
                        <div className="yes-no-group">
                            <button type="button" className={gov.connectedLending === 'YES' ? 'active-yes' : ''} onClick={() => updateGov('connectedLending', 'YES')}>YES</button>
                            <button type="button" className={gov.connectedLending === 'NO' ? 'active-no' : ''} onClick={() => updateGov('connectedLending', 'NO')}>NO</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step9PastEstimates;
