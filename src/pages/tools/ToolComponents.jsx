import React, { useState } from 'react';

/* ─── Input Dialog ────────────────────────────────────────────── */
export const InputDialog = ({ open, field, value, onClose, onConfirm }) => {
    const [val, setVal] = useState(value);

    React.useEffect(() => { setVal(value); }, [value]);

    if (!open) return null;

    const handleConfirm = () => {
        const v = parseFloat(val);
        if (!isNaN(v) && v > 0) onConfirm(field, v);
        onClose();
    };

    const label = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-box" onClick={e => e.stopPropagation()}>
                <h3>Edit {label}</h3>
                <input
                    type="number"
                    className="dialog-input"
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleConfirm()}
                />
                <div className="dialog-actions">
                    <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleConfirm}>Apply</button>
                </div>
            </div>
        </div>
    );
};

/* ─── Clickable Value with edit pencil ────────────────────────── */
export const EditableValue = ({ label, value, field, onEdit }) => (
    <span className="slider-value clickable" onClick={() => onEdit(field, value)}>
        {label}
        <span className="edit-icon" style={{ marginLeft: '0.4rem', fontSize: '0.75rem', opacity: 0.4 }}>&#9998;</span>
    </span>
);

/* ─── Formula Tooltip ─────────────────────────────────────────── */
export const FormulaTooltip = ({ formula, children }) => (
    <div className="formula-wrap">
        {children}
        <div className="formula-tip">{formula}</div>
    </div>
);
