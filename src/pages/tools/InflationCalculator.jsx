import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InputDialog, EditableValue, FormulaTooltip } from './ToolComponents';
import './ToolShared.css';

const InflationCalculator = () => {
    const [loanAmount, setLoanAmount] = useState(2000000);
    const [rate, setRate] = useState(10);
    const [tenure, setTenure] = useState(10);
    const [inflation, setInflation] = useState(6);
    const [dialog, setDialog] = useState({ open: false, field: '', value: '' });

    const openDialog = (field, value) => setDialog({ open: true, field, value: String(value) });
    const closeDialog = () => setDialog({ open: false, field: '', value: '' });
    const confirmDialog = (field, v) => {
        const map = { loan_amount: setLoanAmount, rate: setRate, tenure: (x) => setTenure(Math.round(x)), inflation: setInflation };
        if (map[field]) map[field](v);
    };

    const results = useMemo(() => {
        const mr = rate / 12 / 100;
        const n = tenure * 12;
        const emi = mr === 0 ? loanAmount / n : (loanAmount * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
        const nominalTotal = emi * n;
        const monthlyInflation = Math.pow(1 + inflation / 100, 1 / 12) - 1;
        let realTotal = 0;
        for (let m = 1; m <= n; m++) realTotal += emi / Math.pow(1 + monthlyInflation, m);
        const realLastEMI = emi / Math.pow(1 + inflation / 100, tenure);
        const savingsFromInflation = nominalTotal - realTotal;
        return { emi, nominalTotal, realTotal, realLastEMI, savingsFromInflation };
    }, [loanAmount, rate, tenure, inflation]);

    const fmt = (v) => '₹' + Math.round(v).toLocaleString('en-IN');

    return (
        <div className="page-wrapper container section tool-page">
            <Link to="/tools" className="back-link">← Back to Tools</Link>
            <div className="text-center mb-5" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="mb-2">Inflation Impact Calculator</h1>
                <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    See how inflation reduces the real burden of your loan over time.
                </p>
            </div>
            <div className="tool-layout">
                <div className="card tool-input-panel">
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Loan Amount</label>
                            <EditableValue label={fmt(loanAmount)} field="loan_amount" value={loanAmount} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={100000} max={10000000} step={50000} value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Interest Rate (p.a.)</label>
                            <EditableValue label={`${rate}%`} field="rate" value={rate} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={5} max={20} step={0.25} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Tenure (years)</label>
                            <EditableValue label={`${tenure} yrs`} field="tenure" value={tenure} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={1} max={30} step={1} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Expected Inflation Rate (p.a.)</label>
                            <EditableValue label={`${inflation}%`} field="inflation" value={inflation} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={1} max={15} step={0.5} value={inflation} onChange={(e) => setInflation(Number(e.target.value))} />
                    </div>
                </div>
                <div>
                    <div className="card tool-result-card mb-3">
                        <FormulaTooltip formula="Real EMI(m) = EMI / (1 + inflation)^(m/12) | Real Total = Sum of all Real EMIs">
                            <div className="tool-big-label">Monthly EMI</div>
                            <div className="tool-big-result mb-3">{fmt(results.emi)}</div>
                        </FormulaTooltip>
                        <div className="tool-summary-grid">
                            <div className="tool-summary-item"><span className="tool-summary-label">Nominal Total Repayment</span><span className="tool-summary-val">{fmt(results.nominalTotal)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">Real Total (inflation-adjusted)</span><span className="tool-summary-val">{fmt(results.realTotal)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">Last EMI's Real Value</span><span className="tool-summary-val">{fmt(results.realLastEMI)}</span></div>
                            <div className="tool-summary-item highlight"><span className="tool-summary-label">Inflation Benefit (reduction in real cost)</span><span className="tool-summary-val" style={{ color: '#16a34a' }}>{fmt(results.savingsFromInflation)}</span></div>
                        </div>
                    </div>
                    <div className="tool-note">Your last EMI of {fmt(results.emi)} will feel like only {fmt(results.realLastEMI)} in today's money after {tenure} years of {inflation}% inflation.</div>
                </div>
            </div>
            <InputDialog open={dialog.open} field={dialog.field} value={dialog.value} onClose={closeDialog} onConfirm={confirmDialog} />
        </div>
    );
};

export default InflationCalculator;
