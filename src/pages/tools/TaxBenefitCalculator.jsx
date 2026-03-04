import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InputDialog, EditableValue, FormulaTooltip } from './ToolComponents';
import './ToolShared.css';

const TaxBenefitCalculator = () => {
    const [loanType, setLoanType] = useState('home');
    const [loanAmount, setLoanAmount] = useState(3000000);
    const [rate, setRate] = useState(9);
    const [taxBracket, setTaxBracket] = useState(30);
    const [principalPerYear, setPrincipalPerYear] = useState(150000);
    const [dialog, setDialog] = useState({ open: false, field: '', value: '' });

    const openDialog = (field, value) => setDialog({ open: true, field, value: String(value) });
    const closeDialog = () => setDialog({ open: false, field: '', value: '' });
    const confirmDialog = (field, v) => {
        const map = { loan_amount: setLoanAmount, rate: setRate, principal_per_year: setPrincipalPerYear };
        if (map[field]) map[field](v);
    };

    const results = useMemo(() => {
        const annualInterest = loanAmount * rate / 100;
        let interestDeduction, principalDeduction;
        if (loanType === 'home') {
            interestDeduction = Math.min(annualInterest, 200000);
            principalDeduction = Math.min(principalPerYear, 150000);
        } else {
            interestDeduction = annualInterest;
            principalDeduction = 0;
        }
        const totalDeduction = interestDeduction + principalDeduction;
        const taxSaved = totalDeduction * taxBracket / 100;
        const effectiveRate = ((annualInterest - taxSaved) / loanAmount) * 100;
        return { annualInterest, interestDeduction, principalDeduction, totalDeduction, taxSaved, effectiveRate };
    }, [loanType, loanAmount, rate, taxBracket, principalPerYear]);

    const fmt = (v) => '₹' + Math.round(v).toLocaleString('en-IN');

    return (
        <div className="page-wrapper container section tool-page">
            <Link to="/tools" className="back-link">← Back to Tools</Link>
            <div className="text-center mb-5" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="mb-2">Tax Benefit Calculator</h1>
                <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    See how much tax you save from loan interest deductions.
                </p>
            </div>
            <div className="tool-layout">
                <div className="card tool-input-panel">
                    <div className="tool-form-group">
                        <label>Loan Type</label>
                        <div className="toggle-row">
                            <button className={`toggle-btn ${loanType === 'home' ? 'active' : ''}`} onClick={() => setLoanType('home')}>Home Loan</button>
                            <button className={`toggle-btn ${loanType === 'business' ? 'active' : ''}`} onClick={() => setLoanType('business')}>Business Loan</button>
                        </div>
                    </div>
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
                        <label>Tax Bracket</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {[5, 10, 20, 30].map(t => (
                                <button key={t} className={`toggle-btn ${taxBracket === t ? 'active' : ''}`} onClick={() => setTaxBracket(t)}>{t}%</button>
                            ))}
                        </div>
                    </div>
                    {loanType === 'home' && (
                        <div className="tool-form-group">
                            <div className="tool-slider-header"><label>Annual Principal Repaid (for 80C)</label>
                                <EditableValue label={fmt(principalPerYear)} field="principal_per_year" value={principalPerYear} onEdit={openDialog} />
                            </div>
                            <input type="range" className="tool-range" min={0} max={300000} step={5000} value={principalPerYear} onChange={(e) => setPrincipalPerYear(Number(e.target.value))} />
                        </div>
                    )}
                </div>
                <div>
                    <div className="card tool-result-card mb-3">
                        <FormulaTooltip formula="Tax Saved = (Interest Deduction + Principal Deduction) x Tax Rate">
                            <div className="tool-big-label">Annual Tax Savings</div>
                            <div className="tool-big-result mb-3" style={{ color: '#16a34a' }}>{fmt(results.taxSaved)}</div>
                        </FormulaTooltip>
                        <div className="tool-summary-grid">
                            <div className="tool-summary-item"><span className="tool-summary-label">Annual Interest</span><span className="tool-summary-val">{fmt(results.annualInterest)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">Interest Deduction (Sec 24b)</span><span className="tool-summary-val">{fmt(results.interestDeduction)}</span></div>
                            {loanType === 'home' && <div className="tool-summary-item"><span className="tool-summary-label">Principal Deduction (Sec 80C)</span><span className="tool-summary-val">{fmt(results.principalDeduction)}</span></div>}
                            <div className="tool-summary-item"><span className="tool-summary-label">Total Deduction</span><span className="tool-summary-val">{fmt(results.totalDeduction)}</span></div>
                            <div className="tool-summary-item highlight"><span className="tool-summary-label">Effective Interest Rate (after tax)</span><span className="tool-summary-val">{results.effectiveRate.toFixed(2)}%</span></div>
                        </div>
                    </div>
                    <div className="tool-note">Home Loan: Interest deduction capped at Rs.2L (Sec 24b, self-occupied). Principal deduction capped at Rs.1.5L (Sec 80C). Business loan interest is fully deductible.</div>
                </div>
            </div>
            <InputDialog open={dialog.open} field={dialog.field} value={dialog.value} onClose={closeDialog} onConfirm={confirmDialog} />
        </div>
    );
};

export default TaxBenefitCalculator;
