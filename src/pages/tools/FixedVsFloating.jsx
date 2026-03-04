import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InputDialog, EditableValue, FormulaTooltip } from './ToolComponents';
import './ToolShared.css';

const FixedVsFloating = () => {
    const [amount, setAmount] = useState(3000000);
    const [fixedRate, setFixedRate] = useState(10);
    const [floatingRate, setFloatingRate] = useState(8.5);
    const [rateHike, setRateHike] = useState(1.5);
    const [tenure, setTenure] = useState(15);
    const [dialog, setDialog] = useState({ open: false, field: '', value: '' });

    const openDialog = (field, value) => setDialog({ open: true, field, value: String(value) });
    const closeDialog = () => setDialog({ open: false, field: '', value: '' });
    const confirmDialog = (field, v) => {
        const map = { amount: setAmount, fixed_rate: setFixedRate, floating_rate: setFloatingRate, rate_hike: setRateHike, tenure: (x) => setTenure(Math.round(x)) };
        if (map[field]) map[field](v);
    };

    const calcEMI = (P, r, n) => { const mr = r / 12 / 100; if (mr === 0) return P / n; return (P * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1); };

    const results = useMemo(() => {
        const n = tenure * 12;
        const fixedEMI = calcEMI(amount, fixedRate, n);
        const fixedTotal = fixedEMI * n;
        let floatingTotal = 0;
        let balance = amount;
        for (let year = 0; year < tenure; year++) {
            const currentRate = Math.min(floatingRate + rateHike * year, 25);
            const mr = currentRate / 12 / 100;
            const remainingMonths = (tenure - year) * 12;
            const emi = mr === 0 ? balance / remainingMonths : (balance * mr * Math.pow(1 + mr, remainingMonths)) / (Math.pow(1 + mr, remainingMonths) - 1);
            for (let m = 0; m < 12; m++) {
                const interest = balance * mr;
                const principal = emi - interest;
                balance -= principal;
                if (balance < 0) balance = 0;
                floatingTotal += emi;
            }
        }
        const savings = Math.abs(fixedTotal - floatingTotal);
        const winner = fixedTotal < floatingTotal ? 'fixed' : 'floating';
        return { fixedEMI, fixedTotal, floatingTotal, savings, winner };
    }, [amount, fixedRate, floatingRate, rateHike, tenure]);

    const fmt = (v) => '₹' + Math.round(v).toLocaleString('en-IN');

    return (
        <div className="page-wrapper container section tool-page">
            <Link to="/tools" className="back-link">← Back to Tools</Link>
            <div className="text-center mb-5" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="mb-2">Fixed vs Floating Rate</h1>
                <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    Compare fixed and floating interest rate options to find the better deal.
                </p>
            </div>
            <div className="tool-layout">
                <div className="card tool-input-panel">
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Loan Amount</label>
                            <EditableValue label={fmt(amount)} field="amount" value={amount} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={100000} max={10000000} step={50000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Fixed Rate (p.a.)</label>
                            <EditableValue label={`${fixedRate}%`} field="fixed_rate" value={fixedRate} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={5} max={20} step={0.25} value={fixedRate} onChange={(e) => setFixedRate(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Current Floating Rate (p.a.)</label>
                            <EditableValue label={`${floatingRate}%`} field="floating_rate" value={floatingRate} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={5} max={20} step={0.25} value={floatingRate} onChange={(e) => setFloatingRate(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Expected Annual Rate Hike</label>
                            <EditableValue label={`+${rateHike}%/yr`} field="rate_hike" value={rateHike} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={0} max={3} step={0.25} value={rateHike} onChange={(e) => setRateHike(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Tenure (years)</label>
                            <EditableValue label={`${tenure} yrs`} field="tenure" value={tenure} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={5} max={30} step={1} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                    </div>
                </div>
                <div>
                    <div className="comparison-grid mb-3">
                        <div className="card tool-result-card">
                            <FormulaTooltip formula="Fixed EMI = P x r x (1+r)^n / [(1+r)^n - 1] (constant)">
                                <div className="tool-big-label">Fixed Rate</div>
                                <div className="tool-big-result" style={{ fontSize: '1.5rem' }}>{fmt(results.fixedEMI)}/mo</div>
                            </FormulaTooltip>
                            <p className="text-light" style={{ fontSize: '0.8rem' }}>Total: {fmt(results.fixedTotal)}</p>
                            {results.winner === 'fixed' && <span className="better-badge">Better Deal</span>}
                        </div>
                        <div className="card tool-result-card">
                            <FormulaTooltip formula={`Floating: starts at ${floatingRate}%, increases by ${rateHike}% each year`}>
                                <div className="tool-big-label">Floating Rate</div>
                                <div className="tool-big-result" style={{ fontSize: '1.5rem' }}>Varies</div>
                            </FormulaTooltip>
                            <p className="text-light" style={{ fontSize: '0.8rem' }}>Total: {fmt(results.floatingTotal)}</p>
                            {results.winner === 'floating' && <span className="better-badge">Better Deal</span>}
                        </div>
                    </div>
                    <div className="card tool-result-card mb-3">
                        <div className="tool-big-label">You Save with {results.winner === 'fixed' ? 'Fixed' : 'Floating'}</div>
                        <div className="tool-big-result" style={{ color: '#16a34a', fontSize: '2rem' }}>{fmt(results.savings)}</div>
                    </div>
                    <div className="tool-note">Floating rate simulation assumes rate increases by {rateHike}% each year from {floatingRate}%. Actual rate changes depend on RBI repo rate and bank policies.</div>
                </div>
            </div>
            <InputDialog open={dialog.open} field={dialog.field} value={dialog.value} onClose={closeDialog} onConfirm={confirmDialog} />
        </div>
    );
};

export default FixedVsFloating;
