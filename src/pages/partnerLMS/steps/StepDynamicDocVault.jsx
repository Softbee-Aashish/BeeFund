import React, { useState } from 'react';
import { evaluateCaseDocumentChecklist } from '../masterDocMatrix';

const StepDynamicDocVault = ({ formData, updateFormData }) => {
    const productType = formData.loanProduct || 'BL';
    const entityType = formData.entityType || 'PROPRIETORSHIP';
    const loanAmount = (Number(formData.loanAmountLakhs) || 50) * 100000;
    const borrowerNiche = formData.borrowerNiche || 'SENP';

    const checklistDocs = evaluateCaseDocumentChecklist({
        productType,
        entityType,
        loanAmount,
        borrowerNiche
    });

    // In-memory document status map (default: initial mock status)
    const [docStatuses, setDocStatuses] = useState(() => {
        const initial = formData.documentStatuses || {};
        checklistDocs.forEach((doc, idx) => {
            if (!initial[doc.docId]) {
                // First 3 are verified green, next is yellow, rest red or green based on mock
                if (idx < 2) {
                    initial[doc.docId] = { status: 'VERIFIED', fileName: `${doc.docId}_Verified.pdf`, uploadTime: 'Today, 11:20 AM' };
                } else if (idx === 2) {
                    initial[doc.docId] = { status: 'PENDING', fileName: `${doc.docId}_Uploaded.pdf`, uploadTime: 'Today, 11:35 AM' };
                } else {
                    initial[doc.docId] = { status: 'MISSING', fileName: null, uploadTime: null };
                }
            }
        });
        return initial;
    });

    const handleUploadSimulate = (docId, fileName) => {
        const updated = {
            ...docStatuses,
            [docId]: {
                status: 'VERIFIED',
                fileName: fileName || `${docId}_Document.pdf`,
                uploadTime: 'Just now'
            }
        };
        setDocStatuses(updated);
        updateFormData({ documentStatuses: updated });
    };

    const handleMarkPending = (docId) => {
        const updated = {
            ...docStatuses,
            [docId]: {
                status: 'PENDING',
                fileName: `${docId}_Review.pdf`,
                uploadTime: 'Just now'
            }
        };
        setDocStatuses(updated);
        updateFormData({ documentStatuses: updated });
    };

    const handleRemoveDoc = (docId) => {
        const updated = {
            ...docStatuses,
            [docId]: {
                status: 'MISSING',
                fileName: null,
                uploadTime: null
            }
        };
        setDocStatuses(updated);
        updateFormData({ documentStatuses: updated });
    };

    // Calculate Traffic Light statistics
    const totalDocs = checklistDocs.length;
    const mandatoryDocs = checklistDocs.filter(d => d.isMandatory);
    const verifiedCount = checklistDocs.filter(d => docStatuses[d.docId]?.status === 'VERIFIED').length;
    const pendingCount = checklistDocs.filter(d => docStatuses[d.docId]?.status === 'PENDING').length;
    const missingMandatoryCount = mandatoryDocs.filter(d => !docStatuses[d.docId] || docStatuses[d.docId]?.status === 'MISSING').length;

    const compliancePercent = Math.round((verifiedCount / totalDocs) * 100);

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step: Dynamic Document Checklist & Data Ingestion Engine</h3>
                <p>Documents generated dynamically based on Product (<strong>{productType}</strong>), Entity (<strong>{entityType}</strong>), and Loan Sizing (<strong>₹{(loanAmount / 100000).toFixed(2)} Lakhs</strong>).</p>
            </div>

            {/* Traffic Light Compliance Summary */}
            <div className="finance-balance-banner" style={{ background: missingMandatoryCount === 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', border: '1px solid var(--wiz-border)' }}>
                <div className="balance-col">
                    <span>Traffic Light Compliance</span>
                    <h3>{compliancePercent}% Complete</h3>
                </div>
                <div className="balance-col">
                    <span style={{ color: '#10b981' }}>🟢 Verified: <strong>{verifiedCount}</strong></span>
                    <span style={{ color: '#fbbf24', marginLeft: '12px' }}>🟡 Pending: <strong>{pendingCount}</strong></span>
                    <span style={{ color: '#ef4444', marginLeft: '12px' }}>🔴 Missing: <strong>{missingMandatoryCount}</strong></span>
                </div>
                <div className="balance-col text-right">
                    <span>Mandatory Readiness</span>
                    <h3 style={{ color: missingMandatoryCount === 0 ? '#10b981' : '#ef4444' }}>
                        {missingMandatoryCount === 0 ? '✓ Ready for Submission' : `${missingMandatoryCount} Mandatory Action Pending`}
                    </h3>
                </div>
            </div>

            {/* Document Checklist Items */}
            <div className="finance-table-box">
                <div className="table-box-header">
                    <h4>Tailored Ingestion Checklist ({checklistDocs.length} Requirements)</h4>
                    <span className="badge-stat-right">Traffic Light Verification System</span>
                </div>

                <div className="promoters-grid-list">
                    {checklistDocs.map((doc, idx) => {
                        const state = docStatuses[doc.docId] || { status: 'MISSING' };
                        const isGreen = state.status === 'VERIFIED';
                        const isYellow = state.status === 'PENDING';
                        const isRed = state.status === 'MISSING';

                        return (
                            <div
                                key={doc.docId}
                                className="doc-checklist-item"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'stretch',
                                    gap: '8px',
                                    borderLeft: `4px solid ${isGreen ? '#10b981' : isYellow ? '#f59e0b' : '#ef4444'}`,
                                    background: 'var(--wiz-bg-card-subtle)',
                                    padding: '1rem',
                                    borderRadius: '8px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '1.1rem' }}>
                                            {isGreen ? '🟢' : isYellow ? '🟡' : '🔴'}
                                        </span>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <strong style={{ color: 'var(--wiz-text-primary)', fontSize: '0.92rem' }}>
                                                    {doc.docName}
                                                </strong>
                                                <span className="case-limit-badge" style={{ fontSize: '0.65rem' }}>
                                                    {doc.category}
                                                </span>
                                                {doc.isMandatory ? (
                                                    <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.65rem', fontWeight: '800', padding: '1px 6px', border: '1px solid #fca5a5', borderRadius: '4px' }}>
                                                        MANDATORY
                                                    </span>
                                                ) : (
                                                    <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.65rem', fontWeight: '700', padding: '1px 6px', borderRadius: '4px' }}>
                                                        OPTIONAL
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--wiz-text-muted)' }}>
                                                {doc.description}
                                            </p>
                                            {doc.ruleNotes && doc.ruleNotes.length > 0 && (
                                                <div style={{ marginTop: '4px', fontSize: '0.74rem', color: 'var(--wiz-gold)', fontWeight: '700' }}>
                                                    {doc.ruleNotes.join(' | ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isGreen && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '800' }}>
                                                    ✓ {state.fileName || 'Verified Document'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveDoc(doc.docId)}
                                                    className="btn-remove-tbl"
                                                    title="Remove Uploaded Document"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}

                                        {isYellow && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '800' }}>
                                                    ⏳ {state.fileName || 'Pending Verification'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUploadSimulate(doc.docId, `${doc.docId}_Extracted.pdf`)}
                                                    className="btn-wiz-nav"
                                                    style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                                                >
                                                    Verify OCR
                                                </button>
                                            </div>
                                        )}

                                        {isRed && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUploadSimulate(doc.docId, `${doc.docId}_Uploaded.pdf`)}
                                                    className="btn-add-partner-row"
                                                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                                >
                                                    + Upload PDF / OCR
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleMarkPending(doc.docId)}
                                                    className="btn-wiz-nav"
                                                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                                >
                                                    API Ingest
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StepDynamicDocVault;
