import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InputDialog, EditableValue, FormulaTooltip } from './ToolComponents';
import './ToolShared.css';

const ROICalculator = () => {
    const [investment, setInvestment] = useState(1000000);
    const [annualReturn, setAnnualReturn] = useState(300000);
    const [loanRate, setLoanRate] = useState(11);
    const [tenure, setTenure] = useState(5);
    const [dialog, setDialog] = useState({ open: false, field: '', value: '' });

    const openDialog = (field, value) => setDialog({ open: true, field, value: String(value) });
    const closeDialog = () => setDialog({ open: false, field: '', value: '' });
    const confirmDialog = (field, v) => {
        const map = { investment: setInvestment, annual_return: setAnnualReturn, loan_rate: setLoanRate, tenure: (x) => setTenure(Math.round(x)) };
        if (map[field]) map[field](v);
    };

    const results = useMemo(() => {
        const mr = loanRate / 12 / 100;
        const n = tenure * 12;
        const emi = mr === 0 ? investment / n : (investment * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
        const totalLoanCost = emi * n;
        const totalReturn = annualReturn * tenure;
        const netProfit = totalReturn - totalLoanCost;
        const roi = (netProfit / investment) * 100;
        const breakEvenMonths = totalLoanCost / (annualReturn / 12);
        return { emi, totalLoanCost, totalReturn, netProfit, roi, breakEvenMonths: Math.ceil(breakEvenMonths) };
    }, [investment, annualReturn, loanRate, tenure]);

    const fmt = (v) => '₹' + Math.round(v).toLocaleString('en-IN');

    return (
        <div className="page-wrapper container section tool-page">
            <Link to="/tools" className="back-link">← Back to Tools</Link>
            <div className="text-center mb-5" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="mb-2">ROI Calculator</h1>
                <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    Evaluate if a loan-funded business investment makes financial sense.
                </p>
            </div>
            <div className="tool-layout">
                <div className="card tool-input-panel">
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Investment / Loan Amount</label>
                            <EditableValue label={fmt(investment)} field="investment" value={investment} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={50000} max={10000000} step={50000} value={investment} onChange={(e) => setInvestment(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Expected Annual Return</label>
                            <EditableValue label={fmt(annualReturn)} field="annual_return" value={annualReturn} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={10000} max={5000000} step={10000} value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Loan Interest Rate (p.a.)</label>
                            <EditableValue label={`${loanRate}%`} field="loan_rate" value={loanRate} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={5} max={25} step={0.5} value={loanRate} onChange={(e) => setLoanRate(Number(e.target.value))} />
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Tenure (years)</label>
                            <EditableValue label={`${tenure} yrs`} field="tenure" value={tenure} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={1} max={10} step={1} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                    </div>
                </div>
                <div>
                    <div className="card tool-result-card mb-3">
                        <FormulaTooltip formula="Net Profit = (Annual Return x Years) - (EMI x Months) | ROI = Net Profit / Investment x 100">
                            <div className="tool-big-label">Net Profit / (Loss)</div>
                            <div className="tool-big-result mb-3" style={{ color: results.netProfit >= 0 ? '#16a34a' : '#ef4444' }}>{fmt(results.netProfit)}</div>
                        </FormulaTooltip>
                        <div className="tool-summary-grid">
                            <div className="tool-summary-item"><span className="tool-summary-label">Monthly EMI</span><span className="tool-summary-val">{fmt(results.emi)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">Total Loan Cost</span><span className="tool-summary-val">{fmt(results.totalLoanCost)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">Total Return ({tenure} yrs)</span><span className="tool-summary-val">{fmt(results.totalReturn)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">ROI</span><span className="tool-summary-val" style={{ color: results.roi >= 0 ? '#16a34a' : '#ef4444' }}>{results.roi.toFixed(1)}%</span></div>
                            <div className="tool-summary-item highlight"><span className="tool-summary-label">Break-even Period</span><span className="tool-summary-val">{results.breakEvenMonths} months</span></div>
                        </div>
                    </div>
                    <div className="tool-note">{results.netProfit >= 0 ? 'This investment appears profitable after loan costs.' : 'This investment may not cover loan costs. Consider higher returns or lower interest rates.'}</div>
                </div>
            </div>
            <InputDialog open={dialog.open} field={dialog.field} value={dialog.value} onClose={closeDialog} onConfirm={confirmDialog} />
        </div>
    );
};

export default ROICalculator;
