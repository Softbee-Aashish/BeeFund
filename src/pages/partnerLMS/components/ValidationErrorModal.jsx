import React from 'react';
import './ValidationErrorModal.css';

const ValidationErrorModal = ({ isOpen, errors, onClose }) => {
    if (!isOpen || !errors || errors.length === 0) return null;

    return (
        <div className="validation-modal-overlay" onClick={onClose}>
            <div className="validation-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="validation-modal-header">
                    <div className="validation-alert-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                    <div>
                        <span className="validation-pill-tag">CREDIT DESK DATA RESTRICTION</span>
                        <h3>Invalid Form Inputs Detected</h3>
                        <p>Please correct the following fields to match institutional banking standards:</p>
                    </div>
                    <button type="button" onClick={onClose} className="btn-validation-close" aria-label="Close">✕</button>
                </div>

                <div className="validation-modal-body">
                    <div className="validation-errors-list">
                        {errors.map((err, idx) => (
                            <div key={idx} className="validation-err-card">
                                <div className="err-card-header">
                                    <span className="err-field-name">{err.field}</span>
                                    {err.value && (
                                        <span className="err-entered-val">
                                            Entered: <code>{err.value}</code>
                                        </span>
                                    )}
                                </div>
                                <div className="err-message-text">{err.message}</div>
                                {err.example && (
                                    <div className="err-valid-example">
                                        <strong>Valid Format / Requirement:</strong> {err.example}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="validation-modal-footer">
                    <button type="button" onClick={onClose} className="btn-validation-ok">
                        ✓ OK, I will put the valid details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ValidationErrorModal;
