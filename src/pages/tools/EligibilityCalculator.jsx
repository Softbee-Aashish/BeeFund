import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InputDialog, EditableValue, FormulaTooltip } from './ToolComponents';
import './ToolShared.css';

const EligibilityCalculator = () => {
    const [income, setIncome] = useState(80000);
    const [existingEMI, setExistingEMI] = useState(10000);
    const [loanType, setLoanType] = useState('home');
    const [tenure, setTenure] = useState(20);
    const [dialog, setDialog] = useState({ open: false, field: '', value: '' });

    const loanConfig = {
        home: { name: 'Home Loan', foir: 0.50, rate: 8.5, maxTenure: 30 },
        personal: { name: 'Personal Loan', foir: 0.50, rate: 12, maxTenure: 5 },
        business: { name: 'Business Loan', foir: 0.45, rate: 11, maxTenure: 7 },
        car: { name: 'Car Loan', foir: 0.50, rate: 9, maxTenure: 7 },
    };

    const cfg = loanConfig[loanType];

    const openDialog = (field, value) => setDialog({ open: true, field, value: String(value) });
    const closeDialog = () => setDialog({ open: false, field: '', value: '' });
    const confirmDialog = (field, v) => {
        switch (field) {
            case 'income': setIncome(v); break;
            case 'existing_emi': setExistingEMI(v); break;
            case 'tenure': setTenure(Math.round(v)); break;
        }
    };

    const results = useMemo(() => {
        const maxEMI = income * cfg.foir - existingEMI;
        if (maxEMI <= 0) return { eligible: 0, emi: 0, maxEMI: 0 };
        const r = cfg.rate / 12 / 100;
        const n = tenure * 12;
        const eligible = r === 0 ? maxEMI * n : maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
        return { eligible: Math.round(eligible), emi: Math.round(maxEMI), maxEMI: Math.round(maxEMI) };
    }, [income, existingEMI, loanType, tenure, cfg]);

    const fmt = (v) => '₹' + Math.round(v).toLocaleString('en-IN');

    return (
        <div className="page-wrapper container section tool-page">
            <Link to="/tools" className="back-link">← Back to Tools</Link>
            <div className="text-center mb-5" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="mb-2">Loan Eligibility Calculator</h1>
                <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    Estimate how much loan you may qualify for based on your income and obligations.
                </p>
            </div>

            <div className="tool-layout">
                <div className="card tool-input-panel">
                    <div className="tool-form-group">
                        <label>Loan Type</label>
                        <select className="tool-select" value={loanType} onChange={(e) => { setLoanType(e.target.value); if (tenure > loanConfig[e.target.value].maxTenure) setTenure(loanConfig[e.target.value].maxTenure); }}>
                            {Object.entries(loanConfig).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                        </select>
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Monthly Income</label>
                            <EditableValue label={fmt(income)} field="income" value={income} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={10000} max={500000} step={5000} value={income} onChange={(e) => setIncome(Number(e.target.value))} />
                        <div className="tool-range-labels"><span>₹10K</span><span>₹5L</span></div>
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Existing Monthly EMIs</label>
                            <EditableValue label={fmt(existingEMI)} field="existing_emi" value={existingEMI} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={0} max={200000} step={1000} value={existingEMI} onChange={(e) => setExistingEMI(Number(e.target.value))} />
                        <div className="tool-range-labels"><span>₹0</span><span>₹2L</span></div>
                    </div>
                    <div className="tool-form-group">
                        <div className="tool-slider-header"><label>Tenure (years)</label>
                            <EditableValue label={`${tenure} yrs`} field="tenure" value={tenure} onEdit={openDialog} />
                        </div>
                        <input type="range" className="tool-range" min={1} max={cfg.maxTenure} step={1} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                        <div className="tool-range-labels"><span>1</span><span>{cfg.maxTenure}</span></div>
                    </div>
                </div>

                <div>
                    <div className="card tool-result-card mb-4">
                        <FormulaTooltip formula={`Max EMI = Income x ${cfg.foir * 100}% - Existing EMIs | Loan = EMI x [(1+r)^n - 1] / [r(1+r)^n]`}>
                            <div className="tool-big-label">Estimated Eligible Amount</div>
                            <div className="tool-big-result mb-3">{fmt(results.eligible)}</div>
                        </FormulaTooltip>
                        <div className="tool-summary-grid">
                            <div className="tool-summary-item"><span className="tool-summary-label">Max Affordable EMI</span><span className="tool-summary-val">{fmt(results.maxEMI)}</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">Interest Rate ({cfg.name})</span><span className="tool-summary-val">{cfg.rate}%</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">FOIR Used</span><span className="tool-summary-val">{(cfg.foir * 100)}%</span></div>
                            <div className="tool-summary-item"><span className="tool-summary-label">Tenure</span><span className="tool-summary-val">{tenure} years</span></div>
                        </div>
                    </div>
                    <div className="tool-note">This is an indicative estimate. Actual eligibility depends on credit score, bank policies, and documentation.</div>
                </div>
            </div>

            <InputDialog open={dialog.open} field={dialog.field} value={dialog.value} onClose={closeDialog} onConfirm={confirmDialog} />
        </div>
    );
};

export default EligibilityCalculator;
