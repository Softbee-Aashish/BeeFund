import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InputDialog, EditableValue, FormulaTooltip } from './ToolComponents';
import './ToolShared.css';

const LoanComparison = () => {
    const [amount, setAmount] = useState(1000000);
    const [rateA, setRateA] = useState(9.5);
    const [tenureA, setTenureA] = useState(60);
    const [feeA, setFeeA] = useState(1);
    const [rateB, setRateB] = useState(10.5);
    const [tenureB, setTenureB] = useState(48);
    const [feeB, setFeeB] = useState(0.5);
    const [dialog, setDialog] = useState({ open: false, field: '', value: '' });

    const openDialog = (field, value) => setDialog({ open: true, field, value: String(value) });
    const closeDialog = () => setDialog({ open: false, field: '', value: '' });
    const confirmDialog = (field, v) => {
        const map = { amount: setAmount, rateA: setRateA, tenureA: (x) => setTenureA(Math.round(x)), feeA: setFeeA, rateB: setRateB, tenureB: (x) => setTenureB(Math.round(x)), feeB: setFeeB };
        if (map[field]) map[field](v);
    };

    const calcEMI = (P, r, n) => { const mr = r / 12 / 100; if (mr === 0) return P / n; return (P * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1); };

    const results = useMemo(() => {
        const emiA = calcEMI(amount, rateA, tenureA);
        const emiB = calcEMI(amount, rateB, tenureB);
        const totalA = emiA * tenureA + amount * feeA / 100;
        const totalB = emiB * tenureB + amount * feeB / 100;
        const interestA = emiA * tenureA - amount;
        const interestB = emiB * tenureB - amount;
        return { emiA, emiB, totalA, totalB, interestA, interestB, costA: totalA, costB: totalB };
    }, [amount, rateA, tenureA, feeA, rateB, tenureB, feeB]);

    const fmt = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
    const better = results.costA < results.costB ? 'A' : results.costB < results.costA ? 'B' : null;
    const savings = Math.abs(results.costA - results.costB);

    return (
        <div className="page-wrapper container section tool-page">
            <Link to="/tools" className="back-link">← Back to Tools</Link>
            <div className="text-center mb-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="mb-2">Loan Comparison</h1>
                <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    Compare two loan offers side by side to find the best deal.
                </p>
            </div>

            <div className="tool-form-group" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                <div className="tool-slider-header"><label>Loan Amount (common)</label>
                    <EditableValue label={fmt(amount)} field="amount" value={amount} onEdit={openDialog} />
                </div>
                <input type="range" className="tool-range" min={50000} max={10000000} step={50000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                <div className="tool-range-labels"><span>₹50K</span><span>₹1Cr</span></div>
            </div>

            <div className="comparison-grid mb-4">
                <div className="card comparison-panel">
                    <h3>Option A</h3>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Interest Rate</label>
                            <EditableValue label={`${rateA}%`} field="rateA" value={rateA} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={5} max={25} step={0.25} value={rateA} onChange={(e) => setRateA(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Tenure (months)</label>
                            <EditableValue label={`${tenureA} mo`} field="tenureA" value={tenureA} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={6} max={360} step={1} value={tenureA} onChange={(e) => setTenureA(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Processing Fee</label>
                            <EditableValue label={`${feeA}%`} field="feeA" value={feeA} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={0} max={3} step={0.25} value={feeA} onChange={(e) => setFeeA(Number(e.target.value))} />
                    </div>
                    <div className="card tool-result-card">
                        <FormulaTooltip formula="EMI = P x r x (1+r)^n / [(1+r)^n - 1]">
                            <div className="tool-big-label">EMI</div>
                            <div className="tool-big-result" style={{ fontSize: '1.8rem' }}>{fmt(results.emiA)}</div>
                        </FormulaTooltip>
                        <div className="tool-summary-grid mt-3">
                            <div className="tool-summary-item"><span className="tool-summary-label">Interest</span><span className="tool-summary-val">{fmt(results.interestA)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">Total Cost</span><span className="tool-summary-val">{fmt(results.costA)}</span></div>
                        </div>
                        {better === 'A' && <span className="better-badge">Better Deal</span>}
                    </div>
                </div>

                <div className="card comparison-panel panel-b">
                    <h3>Option B</h3>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Interest Rate</label>
                            <EditableValue label={`${rateB}%`} field="rateB" value={rateB} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={5} max={25} step={0.25} value={rateB} onChange={(e) => setRateB(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Tenure (months)</label>
                            <EditableValue label={`${tenureB} mo`} field="tenureB" value={tenureB} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={6} max={360} step={1} value={tenureB} onChange={(e) => setTenureB(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Processing Fee</label>
                            <EditableValue label={`${feeB}%`} field="feeB" value={feeB} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={0} max={3} step={0.25} value={feeB} onChange={(e) => setFeeB(Number(e.target.value))} />
                    </div>
                    <div className="card tool-result-card">
                        <FormulaTooltip formula="EMI = P x r x (1+r)^n / [(1+r)^n - 1]">
                            <div className="tool-big-label">EMI</div>
                            <div className="tool-big-result" style={{ fontSize: '1.8rem' }}>{fmt(results.emiB)}</div>
                        </FormulaTooltip>
                        <div className="tool-summary-grid mt-3">
                            <div className="tool-summary-item"><span className="tool-summary-label">Interest</span><span className="tool-summary-val">{fmt(results.interestB)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">Total Cost</span><span className="tool-summary-val">{fmt(results.costB)}</span></div>
                        </div>
                        {better === 'B' && <span className="better-badge">Better Deal</span>}
                    </div>
                </div>
            </div>

            {better && <div className="card tool-result-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <FormulaTooltip formula="Savings = |Total Cost A - Total Cost B|">
                    <div className="tool-big-label">You Save</div>
                    <div className="tool-big-result" style={{ color: '#16a34a' }}>{fmt(savings)}</div>
                    <p className="text-light" style={{ fontSize: '0.85rem' }}>by choosing Option {better}</p>
                </FormulaTooltip>
            </div>}

            <InputDialog open={dialog.open} field={dialog.field} value={dialog.value} onClose={closeDialog} onConfirm={confirmDialog} />
        </div>
    );
};

export default LoanComparison;
