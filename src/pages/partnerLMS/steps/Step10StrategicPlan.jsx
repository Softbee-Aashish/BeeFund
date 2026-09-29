import React from 'react';

const Step10StrategicPlan = ({ formData, updateFormData }) => {
    const plan = formData.strategicPlan || {
        fundDeploymentTarget: '3-Phase machinery procurement, installation, and trial production within 6 months.',
        projectedDSCR: '2.15',
        targetRevenueGrowth: '35% YoY expansion supported by verified buyer purchase orders.',
        breakEvenTimeline: 'Operational break-even in Month 4 of full commercial operations.',
        repaymentStrategy: 'Monthly debt service covered 2.2x by operating EBITDA and structured receivables escrow.',
        facilitatorDeclarationSigned: true
    };

    const updatePlan = (field, value) => {
        const updated = { ...plan, [field]: value };
        updateFormData({ strategicPlan: updated });
    };

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 10: Strategic Execution Plan & Facilitator Sign-Off</h3>
                <p>Define the target execution milestones, revenue projections, debt servicing capability, and facilitator certification.</p>
            </div>

            <div className="finance-table-box">
                <h4>A. Fund Deployment & Target Execution Roadmap</h4>
                <div className="step-form-grid" style={{ marginTop: '1rem' }}>
                    <div className="form-field col-2">
                        <label>Fund Utilization & Procurement Milestones *</label>
                        <textarea
                            rows="2"
                            value={plan.fundDeploymentTarget || ''}
                            onChange={(e) => updatePlan('fundDeploymentTarget', e.target.value)}
                            placeholder="e.g. 3-Phase machinery procurement, installation, and commissioning within 6 months."
                        />
                    </div>

                    <div className="form-field">
                        <label>Projected Average DSCR (Debt Service Coverage) *</label>
                        <input
                            type="text"
                            value={plan.projectedDSCR || '2.15'}
                            onChange={(e) => updatePlan('projectedDSCR', e.target.value)}
                            placeholder="e.g. 2.15 (Min 1.50 recommended)"
                        />
                    </div>

                    <div className="form-field">
                        <label>Target Commercial Break-Even Timeline *</label>
                        <input
                            type="text"
                            value={plan.breakEvenTimeline || ''}
                            onChange={(e) => updatePlan('breakEvenTimeline', e.target.value)}
                            placeholder="e.g. Month 4 of full commercial operations"
                        />
                    </div>

                    <div className="form-field col-2">
                        <label>Target Revenue Growth & Demand Visibility *</label>
                        <input
                            type="text"
                            value={plan.targetRevenueGrowth || ''}
                            onChange={(e) => updatePlan('targetRevenueGrowth', e.target.value)}
                            placeholder="e.g. 35% YoY expansion supported by verified buyer contracts"
                        />
                    </div>

                    <div className="form-field col-2">
                        <label>Repayment & Cash Flow Escrow Strategy *</label>
                        <textarea
                            rows="2"
                            value={plan.repaymentStrategy || ''}
                            onChange={(e) => updatePlan('repaymentStrategy', e.target.value)}
                            placeholder="e.g. Monthly debt service covered 2.2x by operating EBITDA and structured receivables escrow."
                        />
                    </div>
                </div>

                <h4 style={{ marginTop: '2rem' }}>B. Facilitator Underwriting Certification</h4>
                <div className="declarations-box" style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155', marginTop: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={plan.facilitatorDeclarationSigned || false}
                            onChange={(e) => updatePlan('facilitatorDeclarationSigned', e.target.checked)}
                            style={{ marginTop: '3px' }}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                            <strong>Facilitator Certification:</strong> I hereby certify that the applicant KYC, promoters net worth, GST turnover reconciliation, bank statements, and project viability data have been verified against primary documentation. The case is structured for presentation to commercial banking credit committees.
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Step10StrategicPlan;
