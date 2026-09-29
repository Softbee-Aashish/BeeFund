import React from 'react';

const Step6ProjectCost = ({ formData, updateFormData }) => {
    // Project Cost Items (in ₹ Lakhs)
    const costItems = formData.projectCostItems || [
        { id: 1, particular: 'Land including Development', incurred: 600.0, toIncur: 0.0 },
        { id: 2, particular: 'Building & other Civil Works', incurred: 200.0, toIncur: 800.0 },
        { id: 3, particular: 'Plant & Machinery - Indigenous', incurred: 100.0, toIncur: 1900.0 },
        { id: 4, particular: 'Plant & Machinery - Imported', incurred: 0.0, toIncur: 0.0 },
        { id: 5, particular: 'Miscellaneous Fixed Assets (Spares, Tools, Testing)', incurred: 0.0, toIncur: 0.0 },
        { id: 6, particular: 'Preliminary & Pre-operative Expenses', incurred: 0.0, toIncur: 0.0 },
        { id: 7, particular: 'Provisions for Contingencies', incurred: 0.0, toIncur: 0.0 },
        { id: 8, particular: 'Margin for Working Capital Required', incurred: 0.0, toIncur: 0.0 }
    ];

    // Means of Finance (in ₹ Lakhs)
    const meansItems = formData.meansItems || [
        { id: 1, particular: 'Additional Capital (Share/Partners/Proprietor Capital)', raised: 600.0, proposed: 0.0 },
        { id: 2, particular: 'Internal Cash Accruals', raised: 0.0, proposed: 0.0 },
        { id: 3, particular: 'Interest-free Unsecured Loans', raised: 300.0, proposed: 0.0 },
        { id: 4, particular: 'Term Loan proposed from SIDBI / Bank', raised: 0.0, proposed: 2700.0 }
    ];

    const updateCost = (index, field, value) => {
        const updated = [...costItems];
        updated[index][field] = parseFloat(value) || 0.0;
        updateFormData({ projectCostItems: updated });
    };

    const updateMeans = (index, field, value) => {
        const updated = [...meansItems];
        updated[index][field] = parseFloat(value) || 0.0;
        updateFormData({ meansItems: updated });
    };

    const totalCostIncurred = costItems.reduce((sum, c) => sum + c.incurred, 0);
    const totalCostToIncur = costItems.reduce((sum, c) => sum + c.toIncur, 0);
    const grandTotalCost = totalCostIncurred + totalCostToIncur;

    const totalMeansRaised = meansItems.reduce((sum, m) => sum + m.raised, 0);
    const totalMeansProposed = meansItems.reduce((sum, m) => sum + m.proposed, 0);
    const grandTotalMeans = totalMeansRaised + totalMeansProposed;

    const isBalanced = Math.abs(grandTotalCost - grandTotalMeans) < 0.01;

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 6: Project Cost & Means of Finance (Balance Sheet Matrix)</h3>
                <p>Ensure Total Project Cost exactly balances with Total Means of Finance (Figures in ₹ Lakhs).</p>
            </div>

            {/* Balance Badge */}
            <div className={`finance-balance-banner ${isBalanced ? 'balanced' : 'unbalanced'}`}>
                <div className="balance-col">
                    <span>Total Project Cost</span>
                    <h3>₹{grandTotalCost.toFixed(2)} Lakhs (₹{(grandTotalCost / 100).toFixed(2)} Cr)</h3>
                </div>
                <div className="balance-icon">
                    {isBalanced ? '=' : '≠'}
                </div>
                <div className="balance-col">
                    <span>Total Means of Finance</span>
                    <h3>₹{grandTotalMeans.toFixed(2)} Lakhs (₹{(grandTotalMeans / 100).toFixed(2)} Cr)</h3>
                </div>
                <div className="balance-status">
                    {isBalanced ? (
                        <span className="pill-balanced">✓ Perfectly Balanced</span>
                    ) : (
                        <span className="pill-diff">Diff: ₹{Math.abs(grandTotalCost - grandTotalMeans).toFixed(2)} L</span>
                    )}
                </div>
            </div>

            {/* Part A: Project Cost */}
            <div className="finance-table-box">
                <h4>A. Project Cost (in ₹ Lakhs)</h4>
                <table className="finance-data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Cost Head / Particulars</th>
                            <th>Already Incurred</th>
                            <th>To be Incurred</th>
                            <th>Total (₹ Lakhs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {costItems.map((item, idx) => (
                            <tr key={item.id}>
                                <td>{idx + 1}</td>
                                <td>{item.particular}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.incurred}
                                        onChange={(e) => updateCost(idx, 'incurred', e.target.value)}
                                        step="0.1"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.toIncur}
                                        onChange={(e) => updateCost(idx, 'toIncur', e.target.value)}
                                        step="0.1"
                                    />
                                </td>
                                <td><strong>{(item.incurred + item.toIncur).toFixed(2)}</strong></td>
                            </tr>
                        ))}
                        <tr className="total-row">
                            <td colSpan="2"><strong>TOTAL PROJECT COST</strong></td>
                            <td><strong>₹{totalCostIncurred.toFixed(2)}</strong></td>
                            <td><strong>₹{totalCostToIncur.toFixed(2)}</strong></td>
                            <td><strong className="text-gold">₹{grandTotalCost.toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Part B: Means of Finance */}
            <div className="finance-table-box">
                <h4>B. Means of Finance (in ₹ Lakhs)</h4>
                <table className="finance-data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Funding Source / Particulars</th>
                            <th>Already Raised</th>
                            <th>Proposed to be Raised</th>
                            <th>Total (₹ Lakhs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meansItems.map((item, idx) => (
                            <tr key={item.id}>
                                <td>{idx + 1}</td>
                                <td>{item.particular}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.raised}
                                        onChange={(e) => updateMeans(idx, 'raised', e.target.value)}
                                        step="0.1"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.proposed}
                                        onChange={(e) => updateMeans(idx, 'proposed', e.target.value)}
                                        step="0.1"
                                    />
                                </td>
                                <td><strong>{(item.raised + item.proposed).toFixed(2)}</strong></td>
                            </tr>
                        ))}
                        <tr className="total-row">
                            <td colSpan="2"><strong>TOTAL MEANS OF FINANCE</strong></td>
                            <td><strong>₹{totalMeansRaised.toFixed(2)}</strong></td>
                            <td><strong>₹{totalMeansProposed.toFixed(2)}</strong></td>
                            <td><strong className="text-gold">₹{grandTotalMeans.toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Step6ProjectCost;
