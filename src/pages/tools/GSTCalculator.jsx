import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InputDialog, EditableValue, FormulaTooltip } from './ToolComponents';
import './ToolShared.css';

const GSTCalculator = () => {
    const [mode, setMode] = useState('exclusive');
    const [amount, setAmount] = useState(100000);
    const [gstRate, setGstRate] = useState(18);
    const [dialog, setDialog] = useState({ open: false, field: '', value: '' });

    const openDialog = (field, value) => setDialog({ open: true, field, value: String(value) });
    const closeDialog = () => setDialog({ open: false, field: '', value: '' });
    const confirmDialog = (field, v) => { if (field === 'amount') setAmount(v); };

    const results = useMemo(() => {
        if (mode === 'exclusive') {
            const gst = amount * gstRate / 100;
            return { base: amount, gst, total: amount + gst, cgst: gst / 2, sgst: gst / 2 };
        } else {
            const base = amount / (1 + gstRate / 100);
            const gst = amount - base;
            return { base, gst, total: amount, cgst: gst / 2, sgst: gst / 2 };
        }
    }, [amount, gstRate, mode]);

    const fmt = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
    const formula = mode === 'exclusive' ? `GST = Amount x ${gstRate}% | Total = Amount + GST` : `Base = Total / (1 + ${gstRate}%) | GST = Total - Base`;

    return (
        <div className="page-wrapper container section tool-page">
            <Link to="/tools" className="back-link">← Back to Tools</Link>
            <div className="text-center mb-5" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="mb-2">GST Calculator</h1>
                <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    Compute GST on invoices, fees, and business transactions.
                </p>
            </div>

            <div className="tool-layout">
                <div className="card tool-input-panel">
                    <div className="toggle-row mb-3">
                        <button className={`toggle-btn ${mode === 'exclusive' ? 'active' : ''}`} onClick={() => setMode('exclusive')}>Add GST to Amount</button>
                        <button className={`toggle-btn ${mode === 'inclusive' ? 'active' : ''}`} onClick={() => setMode('inclusive')}>Extract GST from Total</button>
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>{mode === 'exclusive' ? 'Amount (excl. GST)' : 'Total (incl. GST)'}</label>
                            <EditableValue label={fmt(amount)} field="amount" value={amount} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={1000} max={10000000} step={1000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                        <div className="tool-range-labels"><span>₹1K</span><span>₹1Cr</span></div>
                    </div>
                    <div className="tool-form-group">
                        <label>GST Rate</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {[5, 12, 18, 28].map(r => (
                                <button key={r} className={`toggle-btn ${gstRate === r ? 'active' : ''}`} onClick={() => setGstRate(r)}>{r}%</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card tool-result-card">
                    <FormulaTooltip formula={formula}>
                        <div className="tool-big-label">Total Amount</div>
                        <div className="tool-big-result mb-3">{fmt(results.total)}</div>
                    </FormulaTooltip>
                    <div className="tool-summary-grid">
                        <div className="tool-summary-item"><span className="tool-summary-label">Base Amount</span><span className="tool-summary-val">{fmt(results.base)}</span></div>
                        <div className="tool-summary-item"><span className="tool-summary-label">Total GST</span><span className="tool-summary-val">{fmt(results.gst)}</span></div>
                        <div className="tool-summary-item"><span className="tool-summary-label">CGST ({gstRate / 2}%)</span><span className="tool-summary-val">{fmt(results.cgst)}</span></div>
                        <div className="tool-summary-item"><span className="tool-summary-label">SGST ({gstRate / 2}%)</span><span className="tool-summary-val">{fmt(results.sgst)}</span></div>
                    </div>
                </div>
            </div>

            <InputDialog open={dialog.open} field={dialog.field} value={dialog.value} onClose={closeDialog} onConfirm={confirmDialog} />
        </div>
    );
};

export default GSTCalculator;
