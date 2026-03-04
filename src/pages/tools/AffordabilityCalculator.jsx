import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InputDialog, EditableValue, FormulaTooltip } from './ToolComponents';
import './ToolShared.css';

const AffordabilityCalculator = () => {
    const [monthlyIncome, setMonthlyIncome] = useState(100000);
    const [monthlyExpenses, setMonthlyExpenses] = useState(30000);
    const [downPayment, setDownPayment] = useState(500000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [dialog, setDialog] = useState({ open: false, field: '', value: '' });

    const openDialog = (field, value) => setDialog({ open: true, field, value: String(value) });
    const closeDialog = () => setDialog({ open: false, field: '', value: '' });
    const confirmDialog = (field, v) => {
        const map = { monthly_income: setMonthlyIncome, monthly_expenses: setMonthlyExpenses, down_payment: setDownPayment, rate: setRate, tenure: (x) => setTenure(Math.round(x)) };
        if (map[field]) map[field](v);
    };

    const results = useMemo(() => {
        const disposable = monthlyIncome - monthlyExpenses;
        const maxEMI = disposable * 0.5;
        if (maxEMI <= 0) return { maxLoan: 0, maxProperty: 0, maxEMI: 0 };
        const r = rate / 12 / 100;
        const n = tenure * 12;
        const maxLoan = r === 0 ? maxEMI * n : maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
        return { maxLoan: Math.round(maxLoan), maxProperty: Math.round(maxLoan + downPayment), maxEMI: Math.round(maxEMI) };
    }, [monthlyIncome, monthlyExpenses, downPayment, rate, tenure]);

    const fmt = (v) => '₹' + Math.round(v).toLocaleString('en-IN');

    return (
        <div className="page-wrapper container section tool-page">
            <Link to="/tools" className="back-link">← Back to Tools</Link>
            <div className="text-center mb-5" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="mb-2">Affordability Calculator</h1>
                <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    Determine the maximum property price you can comfortably afford.
                </p>
            </div>
            <div className="tool-layout">
                <div className="card tool-input-panel">
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Monthly Income</label>
                            <EditableValue label={fmt(monthlyIncome)} field="monthly_income" value={monthlyIncome} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={20000} max={500000} step={5000} value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Monthly Expenses (incl. EMIs)</label>
                            <EditableValue label={fmt(monthlyExpenses)} field="monthly_expenses" value={monthlyExpenses} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={0} max={300000} step={5000} value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Down Payment Available</label>
                            <EditableValue label={fmt(downPayment)} field="down_payment" value={downPayment} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={0} max={5000000} step={50000} value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Interest Rate (p.a.)</label>
                            <EditableValue label={`${rate}%`} field="rate" value={rate} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={5} max={15} step={0.25} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Tenure (years)</label>
                            <EditableValue label={`${tenure} yrs`} field="tenure" value={tenure} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={5} max={30} step={1} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                    </div>
                </div>
                <div>
                    <div className="card tool-result-card">
                        <FormulaTooltip formula="Max EMI = (Income - Expenses) x 50% | Loan = EMI x [(1+r)^n - 1] / [r(1+r)^n] | Property = Loan + Down Payment">
                            <div className="tool-big-label">Max Property Price</div>
                            <div className="tool-big-result mb-3">{fmt(results.maxProperty)}</div>
                        </FormulaTooltip>
                        <div className="tool-summary-grid">
                            <div className="tool-summary-item"><span className="tool-summary-label">Max Loan Eligible</span><span className="tool-summary-val">{fmt(results.maxLoan)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">Down Payment</span><span className="tool-summary-val">{fmt(downPayment)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">Max Affordable EMI</span><span className="tool-summary-val">{fmt(results.maxEMI)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">FOIR Used</span><span className="tool-summary-val">50%</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <InputDialog open={dialog.open} field={dialog.field} value={dialog.value} onClose={closeDialog} onConfirm={confirmDialog} />
        </div>
    );
};

export default AffordabilityCalculator;
