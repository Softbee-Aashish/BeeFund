import React, { useState } from 'react';

const DecisionMatrixPanel = ({ caseData, onAction }) => {
    const [recommendation, setRecommendation] = useState('APPROVE'); // 'APPROVE' | 'APPROVE_WITH_CONDITIONS' | 'REJECT'
    const [justificationNotes, setJustificationNotes] = useState(
        'The applicant enterprise exhibits strong financial health with DSCR of 2.05x, robust operating cash flow, and 100% timely GST filings. Working capital cycle is stabilized at 120 days. Primary security covers 142% of exposure. Recommended for sanction with standard condition of quarterly stock statement audit.'
    );
    const [actionFeedback, setActionFeedback] = useState('');

    const checklist = [
        { id: 'cibil', rule: 'Promoter & Commercial CIBIL CIR Score', policy: '> 750', value: '758 (Tier-1 Clean)', status: 'PASS' },
        { id: 'dscr', rule: 'Projected Debt Service Coverage Ratio (DSCR)', policy: '> 1.33x', value: '2.05x', status: 'PASS' },
        { id: 'tol_tnw', rule: 'Total Outside Liabilities to Net Worth (TOL/TNW)', policy: '< 3.00x', value: '1.49x', status: 'PASS' },
        { id: 'liquidity', rule: 'Current Ratio (Working Capital Liquidity)', policy: '> 1.33x', value: '1.53x', status: 'PASS' },
        { id: 'gst_bank', rule: 'GST vs Banking Turnover Variance', policy: '< 20% Variance', value: '4.2% Variance', status: 'PASS' },
        { id: 'bounces', rule: '12-Month Inward Cheque/ECS Bounces', policy: 'Max 3 Returns', value: '0 Inward Bounces', status: 'PASS' }
    ];

    const hasFail = checklist.some(c => c.status === 'FAIL');
    const isJustificationValid = justificationNotes.trim().length >= 50;

    const handleTriggerAction = (actionType) => {
        if (hasFail && !isJustificationValid) {
            alert('A policy deviation requires at least 50 characters of credit analyst mitigating justification.');
            return;
        }

        if (actionType === 'CAM') {
            setActionFeedback('✓ Compiling Institutional Credit Appraisal Memorandum (CAM.pdf & CAM.docx)...');
            setTimeout(() => {
                if (onAction) onAction('EXPORT_CAM');
                setActionFeedback('✓ Credit Appraisal Memorandum (CAM) generated and downloaded.');
                setTimeout(() => setActionFeedback(''), 4000);
            }, 1000);
        } else if (actionType === 'RECOMMEND') {
            setActionFeedback('✓ Proposal successfully recommended and submitted to Credit Committee.');
            if (onAction) onAction('RECOMMEND', { recommendation, notes: justificationNotes });
            setTimeout(() => setActionFeedback(''), 4000);
        } else if (actionType === 'REJECT') {
            const reason = prompt('Please enter the formal rejection remarks for the credit record:');
            if (reason) {
                setActionFeedback(`Case #${caseData?.id || ''} rejected with logged reason.`);
                if (onAction) onAction('REJECT', { reason });
                setTimeout(() => setActionFeedback(''), 4000);
            }
        } else if (actionType === 'REQUEST_INFO') {
            const query = prompt('Enter the specific information/clarification requested from Channel Partner:');
            if (query) {
                setActionFeedback('✓ Clarification enquiry dispatched to Channel Partner.');
                if (onAction) onAction('REQUEST_INFO', { query });
                setTimeout(() => setActionFeedback(''), 4000);
            }
        } else {
            setActionFeedback('✓ Draft credit assessment saved.');
            setTimeout(() => setActionFeedback(''), 3000);
        }
    };

    return (
        <div className="decision-matrix-card">
            <div className="decision-matrix-header">
                <div className="h-left">
                    <div className="dec-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                    </div>
                    <div>
                        <h3>CREDIT DECISION & DEVIATION MATRIX</h3>
                        <span className="sub">Institutional Underwriting Sign-off & Credit Committee Memo Engine</span>
                    </div>
                </div>

                <div className="overall-policy-badge pass">
                    <span className="dot"></span>
                    <span>100% POLICY COMPLIANT</span>
                </div>
            </div>

            {/* Section 1: Policy Compliance Checklist */}
            <div className="policy-checklist-section">
                <h4>Institutional Credit Policy Compliance Matrix</h4>
                <div className="checklist-table-wrapper">
                    <table className="policy-table">
                        <thead>
                            <tr>
                                <th>CREDIT RISK PARAMETER</th>
                                <th>POLICY CRITERIA</th>
                                <th>APPLICANT FIGURE</th>
                                <th>AUDIT STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checklist.map((item) => (
                                <tr key={item.id}>
                                    <td className="param-name">{item.rule}</td>
                                    <td className="param-policy">{item.policy}</td>
                                    <td className="param-val">{item.value}</td>
                                    <td>
                                        <span className={`policy-status-pill ${item.status.toLowerCase()}`}>
                                            {item.status === 'PASS' ? '✓ PASS' : '⚠ FAIL (DEVIATION)'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Section 2: Underwriter Recommendation & Deviation Justification */}
            <div className="justification-section">
                <div className="recommendation-selector-row">
                    <label>Credit Officer Recommendation:</label>
                    <div className="rec-radios">
                        <button
                            type="button"
                            className={`btn-rec-choice approve ${recommendation === 'APPROVE' ? 'active' : ''}`}
                            onClick={() => setRecommendation('APPROVE')}
                        >
                            ✓ Approve In Full
                        </button>
                        <button
                            type="button"
                            className={`btn-rec-choice cond ${recommendation === 'APPROVE_WITH_CONDITIONS' ? 'active' : ''}`}
                            onClick={() => setRecommendation('APPROVE_WITH_CONDITIONS')}
                        >
                            ⚡ Approve With Covenants
                        </button>
                        <button
                            type="button"
                            className={`btn-rec-choice reject ${recommendation === 'REJECT' ? 'active' : ''}`}
                            onClick={() => setRecommendation('REJECT')}
                        >
                            ✕ Reject Case
                        </button>
                    </div>
                </div>

                <div className="notes-group">
                    <div className="notes-header">
                        <label>Credit Underwriter Detailed Rationale & Risk Mitigants:</label>
                        <span className={`char-count ${justificationNotes.trim().length >= 50 ? 'valid' : 'invalid'}`}>
                            {justificationNotes.trim().length} / 50 min chars
                        </span>
                    </div>
                    <textarea
                        rows="4"
                        value={justificationNotes}
                        onChange={(e) => setJustificationNotes(e.target.value)}
                        placeholder="Detail the repayment capacity rationale, collateral coverage, promoter background, and mitigants for any policy breaches..."
                        className="notes-textarea"
                    />
                </div>
            </div>

            {actionFeedback && (
                <div className="action-feedback-banner">
                    <span>{actionFeedback}</span>
                </div>
            )}

            {/* Section 3: Sticky Action Buttons */}
            <div className="decision-actions-bar">
                <button
                    type="button"
                    className="btn-dec save"
                    onClick={() => handleTriggerAction('DRAFT')}
                >
                    Save Draft
                </button>

                <button
                    type="button"
                    className="btn-dec req-info"
                    onClick={() => handleTriggerAction('REQUEST_INFO')}
                >
                    Request More Info
                </button>

                <button
                    type="button"
                    className="btn-dec reject"
                    onClick={() => handleTriggerAction('REJECT')}
                >
                    Reject Case
                </button>

                <button
                    type="button"
                    className="btn-dec auto-cam"
                    onClick={() => handleTriggerAction('CAM')}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    <span>Auto-Generate CAM</span>
                </button>

                <button
                    type="button"
                    className="btn-dec recommend-btn"
                    onClick={() => handleTriggerAction('RECOMMEND')}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Recommend to Credit Committee</span>
                </button>
            </div>
        </div>
    );
};

export default DecisionMatrixPanel;
