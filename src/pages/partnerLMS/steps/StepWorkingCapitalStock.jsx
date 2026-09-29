import React from 'react';

const StepWorkingCapitalStock = ({ formData, updateFormData }) => {
    const wc = formData.workingCapitalData || {
        rawMaterialStockLakhs: 85.0,
        workInProgressStockLakhs: 35.0,
        finishedGoodsStockLakhs: 60.0,
        debtorsUnder90DaysLakhs: 140.0,
        debtorsOver90DaysLakhs: 15.0,
        tradeCreditorsLakhs: 65.0,
        stockMarginPercent: 25,
        debtorMarginPercent: 30,
        requestedLimitLakhs: 150.0
    };

    const updateWC = (field, value) => {
        const updated = { ...wc, [field]: parseFloat(value) || 0 };
        updateFormData({ workingCapitalData: updated });
    };

    // Calculate Eligible Stock & Debtors
    const totalEligibleStock = (wc.rawMaterialStockLakhs || 0) + (wc.workInProgressStockLakhs || 0) + (wc.finishedGoodsStockLakhs || 0);
    const paidStock = Math.max(0, totalEligibleStock - (wc.tradeCreditorsLakhs || 0));
    const stockDrawingPower = paidStock * (1 - (wc.stockMarginPercent || 25) / 100);

    const eligibleDebtors = wc.debtorsUnder90DaysLakhs || 0;
    const debtorDrawingPower = eligibleDebtors * (1 - (wc.debtorMarginPercent || 30) / 100);

    const totalDrawingPower = stockDrawingPower + debtorDrawingPower;

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step: Working Capital Stock, Book Debts & Drawing Power (DP)</h3>
                <p>Enter current inventory, debtors ageing, creditors position, and compute automated Drawing Power for OD/CC.</p>
            </div>

            <div className="finance-table-box">
                <h4>A. Inventory / Stock Position (₹ in Lakhs)</h4>
                <div className="step-form-grid" style={{ marginTop: '0.8rem' }}>
                    <div className="form-field">
                        <label>Raw Material Stock (₹ Lakhs) *</label>
                        <input
                            type="number"
                            step="0.1"
                            value={wc.rawMaterialStockLakhs || ''}
                            onChange={(e) => updateWC('rawMaterialStockLakhs', e.target.value)}
                            placeholder="e.g. 85.0"
                        />
                    </div>

                    <div className="form-field">
                        <label>Work-in-Progress (WIP) (₹ Lakhs)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={wc.workInProgressStockLakhs || ''}
                            onChange={(e) => updateWC('workInProgressStockLakhs', e.target.value)}
                            placeholder="e.g. 35.0"
                        />
                    </div>

                    <div className="form-field">
                        <label>Finished Goods Stock (₹ Lakhs) *</label>
                        <input
                            type="number"
                            step="0.1"
                            value={wc.finishedGoodsStockLakhs || ''}
                            onChange={(e) => updateWC('finishedGoodsStockLakhs', e.target.value)}
                            placeholder="e.g. 60.0"
                        />
                    </div>

                    <div className="form-field">
                        <label>Trade Creditors / Unpaid Stock (₹ Lakhs) *</label>
                        <input
                            type="number"
                            step="0.1"
                            value={wc.tradeCreditorsLakhs || ''}
                            onChange={(e) => updateWC('tradeCreditorsLakhs', e.target.value)}
                            placeholder="e.g. 65.0"
                        />
                    </div>
                </div>

                <h4 style={{ marginTop: '1.75rem' }}>B. Book Debts / Receivables Ageing (₹ in Lakhs)</h4>
                <div className="step-form-grid" style={{ marginTop: '0.8rem' }}>
                    <div className="form-field">
                        <label>Debtors &lt; 90 Days (Eligible for DP) *</label>
                        <input
                            type="number"
                            step="0.1"
                            value={wc.debtorsUnder90DaysLakhs || ''}
                            onChange={(e) => updateWC('debtorsUnder90DaysLakhs', e.target.value)}
                            placeholder="e.g. 140.0"
                        />
                    </div>

                    <div className="form-field">
                        <label>Debtors &gt; 90 Days (Ineligible)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={wc.debtorsOver90DaysLakhs || ''}
                            onChange={(e) => updateWC('debtorsOver90DaysLakhs', e.target.value)}
                            placeholder="e.g. 15.0"
                        />
                    </div>

                    <div className="form-field">
                        <label>Stock Margin Deduction (%)</label>
                        <select
                            value={wc.stockMarginPercent || 25}
                            onChange={(e) => updateWC('stockMarginPercent', e.target.value)}
                        >
                            <option value={20}>20% Margin</option>
                            <option value={25}>25% Standard Bank Margin</option>
                            <option value={30}>30% Margin</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Book Debt Margin Deduction (%)</label>
                        <select
                            value={wc.debtorMarginPercent || 30}
                            onChange={(e) => updateWC('debtorMarginPercent', e.target.value)}
                        >
                            <option value={25}>25% Margin</option>
                            <option value={30}>30% Standard Bank Margin</option>
                            <option value={40}>40% Margin</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Live Drawing Power Result */}
            <div className={`finance-balance-banner ${totalDrawingPower >= (wc.requestedLimitLakhs || 0) ? 'balanced' : 'unbalanced'}`} style={{ marginTop: '1.5rem' }}>
                <div className="balance-col">
                    <span>Calculated Total Drawing Power (DP)</span>
                    <h3>₹{totalDrawingPower.toFixed(2)} Lakhs</h3>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        (Paid Stock DP: ₹{stockDrawingPower.toFixed(2)}L + Eligible Debtor DP: ₹{debtorDrawingPower.toFixed(2)}L)
                    </span>
                </div>
                <div className="balance-icon">
                    {totalDrawingPower >= (wc.requestedLimitLakhs || 0) ? '✓' : '!'}
                </div>
                <div className="balance-col text-right">
                    <span>Requested OD/CC Limit</span>
                    <h3>₹{(wc.requestedLimitLakhs || 150).toFixed(2)} Lakhs</h3>
                    <span style={{ fontSize: '0.78rem', color: totalDrawingPower >= (wc.requestedLimitLakhs || 0) ? '#10b981' : '#f59e0b' }}>
                        {totalDrawingPower >= (wc.requestedLimitLakhs || 0) ? '100% Fully Covered by DP' : 'Requires Additional Collateral'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StepWorkingCapitalStock;
