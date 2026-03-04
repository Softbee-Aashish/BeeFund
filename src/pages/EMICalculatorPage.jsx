import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './CalculatorPage.css';
import '../pages/tools/ToolShared.css';

const CalculatorPage = () => {
    // Solve-for mode: which variable to calculate
    const [solveFor, setSolveFor] = useState('emi'); // 'emi' | 'amount' | 'rate' | 'tenure'

    const [amount, setAmount] = useState(500000);
    const [rate, setRate] = useState(10);
    const [tenure, setTenure] = useState(24);
    const [emiInput, setEmiInput] = useState(23073); // used when solving for amount/rate/tenure

    // Dialog & Schedule state
    const [dialog, setDialog] = useState({ open: false, field: '', value: '' });
    const [showSchedule, setShowSchedule] = useState(false);

    const openDialog = (field) => {
        const vals = { amount, rate, tenure, emi: Math.round(emiInput) };
        setDialog({ open: true, field, value: String(vals[field]) });
    };

    const closeDialog = () => setDialog({ open: false, field: '', value: '' });

    const confirmDialog = () => {
        const v = parseFloat(dialog.value);
        if (isNaN(v) || v <= 0) { closeDialog(); return; }
        switch (dialog.field) {
            case 'amount': setAmount(v); break;
            case 'rate': setRate(v); break;
            case 'tenure': setTenure(Math.round(v)); break;
            case 'emi': setEmiInput(v); break;
        }
        closeDialog();
    };

    // ---- CALCULATIONS ----

    // Standard EMI formula
    const calcEMI = (P, r, n) => {
        const mr = r / 12 / 100;
        if (mr === 0) return P / n;
        return (P * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
    };

    // Solve for Amount: P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
    const calcAmount = (emi, r, n) => {
        const mr = r / 12 / 100;
        if (mr === 0) return emi * n;
        return emi * (Math.pow(1 + mr, n) - 1) / (mr * Math.pow(1 + mr, n));
    };

    // Solve for Tenure: n = -log(1 - P*r/EMI) / log(1+r)
    const calcTenure = (P, r, emi) => {
        const mr = r / 12 / 100;
        if (mr === 0) return Math.round(P / emi);
        const val = 1 - (P * mr) / emi;
        if (val <= 0) return -1; // impossible
        return Math.ceil(-Math.log(val) / Math.log(1 + mr));
    };

    // Solve for Rate (iterative Newton-Raphson)
    const calcRate = (P, n, emi) => {
        let lo = 0.001, hi = 50;
        for (let iter = 0; iter < 200; iter++) {
            const mid = (lo + hi) / 2;
            const testEmi = calcEMI(P, mid, n);
            if (Math.abs(testEmi - emi) < 0.5) return mid;
            if (testEmi < emi) lo = mid;
            else hi = mid;
        }
        return (lo + hi) / 2;
    };

    // Derived values based on solveFor mode
    const results = useMemo(() => {
        let finalEmi, finalAmount, finalRate, finalTenure;

        switch (solveFor) {
            case 'emi':
                finalAmount = amount; finalRate = rate; finalTenure = tenure;
                finalEmi = calcEMI(amount, rate, tenure);
                break;
            case 'amount':
                finalEmi = emiInput; finalRate = rate; finalTenure = tenure;
                finalAmount = calcAmount(emiInput, rate, tenure);
                break;
            case 'tenure':
                finalEmi = emiInput; finalRate = rate; finalAmount = amount;
                finalTenure = calcTenure(amount, rate, emiInput);
                if (finalTenure < 0) finalTenure = 0;
                break;
            case 'rate':
                finalEmi = emiInput; finalAmount = amount; finalTenure = tenure;
                finalRate = calcRate(amount, tenure, emiInput);
                break;
            default:
                finalAmount = amount; finalRate = rate; finalTenure = tenure;
                finalEmi = calcEMI(amount, rate, tenure);
        }

        const totalPayment = finalEmi * finalTenure;
        const totalInterest = totalPayment - finalAmount;

        // Amortization schedule
        const schedule = [];
        let balance = finalAmount;
        const mr = finalRate / 12 / 100;
        const startDate = new Date();
        for (let m = 1; m <= finalTenure; m++) {
            const interestPart = balance * mr;
            const principalPart = finalEmi - interestPart;
            balance -= principalPart;
            if (balance < 0) balance = 0;
            const rowDate = new Date(startDate.getFullYear(), startDate.getMonth() + m, 1);
            const monthLabel = rowDate.toLocaleString('default', { month: 'short', year: 'numeric' });
            schedule.push({ month: m, monthLabel, emi: finalEmi, principal: principalPart, interest: interestPart, balance });
        }

        return { emi: finalEmi, amount: finalAmount, rate: finalRate, tenure: finalTenure, totalPayment, totalInterest, schedule };
    }, [solveFor, amount, rate, tenure, emiInput]);

    const formatCurrency = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
    const interestPercent = results.totalPayment > 0 ? (results.totalInterest / results.totalPayment) * 100 : 0;

    const formatCurrencyPDF = (v) => 'Rs. ' + Math.round(v).toLocaleString('en-IN');

    // PDF Export
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('BEEFUND - Loan Repayment Schedule', 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Loan Amount: ${formatCurrencyPDF(results.amount)}`, 14, 34);
        doc.text(`Interest Rate: ${results.rate.toFixed(2)}% p.a.`, 14, 41);
        doc.text(`Tenure: ${results.tenure} months (${(results.tenure / 12).toFixed(1)} years)`, 14, 48);
        doc.text(`Monthly EMI: ${formatCurrencyPDF(results.emi)}`, 14, 55);
        doc.text(`Total Interest: ${formatCurrencyPDF(results.totalInterest)}`, 14, 62);
        doc.text(`Total Payment: ${formatCurrencyPDF(results.totalPayment)}`, 14, 69);

        autoTable(doc, {
            startY: 78,
            head: [['Month', 'EMI', 'Principal', 'Interest', 'Balance']],
            body: results.schedule.map(r => [
                r.month,
                formatCurrencyPDF(r.emi),
                formatCurrencyPDF(r.principal),
                formatCurrencyPDF(r.interest),
                formatCurrencyPDF(r.balance),
            ]),
            styles: { fontSize: 8, cellPadding: 2, font: 'helvetica' },
            headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [255, 251, 235] },
        });

        doc.save('BEEFUND_Repayment_Schedule.pdf');
    };

    const solveOptions = [
        { key: 'emi', label: 'Find EMI' },
        { key: 'amount', label: 'Find Loan Amount' },
        { key: 'rate', label: 'Find Interest Rate' },
        { key: 'tenure', label: 'Find Tenure' },
    ];

    // Helper: is this field editable (i.e. NOT the solve-for target)?
    const isEditable = (field) => field !== solveFor;

    return (
        <div className="page-wrapper container section calc-page">
            <Link to="/tools" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', textDecoration: 'none', marginBottom: '1.5rem' }}>← Back to Tools</Link>
            <div className="text-center mb-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="mb-2">Loan Calculator</h1>
                <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    Adjust any value. Pick what to solve for.
                </p>
            </div>

            {/* SOLVE-FOR SELECTOR */}
            <div className="solve-for-bar mb-5">
                {solveOptions.map(opt => (
                    <label key={opt.key} className={`solve-option ${solveFor === opt.key ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="solveFor"
                            value={opt.key}
                            checked={solveFor === opt.key}
                            onChange={() => setSolveFor(opt.key)}
                        />
                        <span>{opt.label}</span>
                    </label>
                ))}
            </div>

            <div className="calc-grid">
                {/* INPUT PANEL */}
                <div className="card calc-input-panel">
                    <h3 className="mb-4">Parameters</h3>

                    {/* Loan Amount */}
                    <div className={`form-group mb-4 ${!isEditable('amount') ? 'computed' : ''}`}>
                        <div className="slider-header">
                            <label>Loan Amount</label>
                            <span className="slider-value clickable" onClick={() => isEditable('amount') && openDialog('amount')}>
                                {formatCurrency(isEditable('amount') ? amount : results.amount)}
                                {isEditable('amount') && <span className="edit-icon">✏️</span>}
                                {!isEditable('amount') && <span className="computed-badge">Calculated</span>}
                            </span>
                        </div>
                        {isEditable('amount') && (
                            <>
                                <input type="range" min={50000} max={10000000} step={10000} value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))} className="range-slider" />
                                <div className="range-labels"><span>₹50K</span><span>₹1Cr</span></div>
                            </>
                        )}
                    </div>

                    {/* Interest Rate */}
                    <div className={`form-group mb-4 ${!isEditable('rate') ? 'computed' : ''}`}>
                        <div className="slider-header">
                            <label>Interest Rate (p.a.)</label>
                            <span className="slider-value clickable" onClick={() => isEditable('rate') && openDialog('rate')}>
                                {(isEditable('rate') ? rate : results.rate).toFixed(2)}%
                                {isEditable('rate') && <span className="edit-icon">✏️</span>}
                                {!isEditable('rate') && <span className="computed-badge">Calculated</span>}
                            </span>
                        </div>
                        {isEditable('rate') && (
                            <>
                                <input type="range" min={1} max={30} step={0.25} value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))} className="range-slider" />
                                <div className="range-labels"><span>1%</span><span>30%</span></div>
                            </>
                        )}
                    </div>

                    {/* Tenure */}
                    <div className={`form-group mb-4 ${!isEditable('tenure') ? 'computed' : ''}`}>
                        <div className="slider-header">
                            <label>Loan Tenure</label>
                            <span className="slider-value clickable" onClick={() => isEditable('tenure') && openDialog('tenure')}>
                                {isEditable('tenure') ? tenure : results.tenure} months
                                {isEditable('tenure') && <span className="edit-icon">✏️</span>}
                                {!isEditable('tenure') && <span className="computed-badge">Calculated</span>}
                            </span>
                        </div>
                        {isEditable('tenure') && (
                            <>
                                <input type="range" min={3} max={360} step={1} value={tenure}
                                    onChange={(e) => setTenure(Number(e.target.value))} className="range-slider" />
                                <div className="range-labels"><span>3 mo</span><span>360 mo</span></div>
                            </>
                        )}
                    </div>

                    {/* EMI (editable when solving for something else) */}
                    <div className={`form-group mb-4 ${!isEditable('emi') ? 'computed' : ''}`}>
                        <div className="slider-header">
                            <label>Monthly EMI</label>
                            <span className="slider-value clickable" onClick={() => isEditable('emi') && openDialog('emi')}>
                                {formatCurrency(isEditable('emi') ? emiInput : results.emi)}
                                {isEditable('emi') && <span className="edit-icon">✏️</span>}
                                {!isEditable('emi') && <span className="computed-badge">Calculated</span>}
                            </span>
                        </div>
                        {isEditable('emi') && (
                            <>
                                <input type="range" min={1000} max={500000} step={500} value={emiInput}
                                    onChange={(e) => setEmiInput(Number(e.target.value))} className="range-slider" />
                                <div className="range-labels"><span>₹1K</span><span>₹5L</span></div>
                            </>
                        )}
                    </div>
                </div>

                {/* RESULT PANEL */}
                <div className="calc-result-panel">
                    <div className="card result-card">
                        <h3 className="mb-3">Loan Summary</h3>

                        <div className="result-highlight mb-3">
                            <span className="result-label">
                                {solveFor === 'emi' && 'Monthly EMI'}
                                {solveFor === 'amount' && 'Loan Amount'}
                                {solveFor === 'rate' && 'Interest Rate'}
                                {solveFor === 'tenure' && 'Loan Tenure'}
                            </span>
                            <span className="result-big-val">
                                {solveFor === 'emi' && formatCurrency(results.emi)}
                                {solveFor === 'amount' && formatCurrency(results.amount)}
                                {solveFor === 'rate' && `${results.rate.toFixed(2)}% p.a.`}
                                {solveFor === 'tenure' && `${results.tenure} months`}
                            </span>
                        </div>

                        {/* Breakdown bar */}
                        <div className="breakdown-bar mb-2">
                            <div className="bar-principal" style={{ width: `${Math.max(0, 100 - interestPercent)}%` }} />
                            <div className="bar-interest" style={{ width: `${Math.min(100, interestPercent)}%` }} />
                        </div>
                        <div className="breakdown-legend mb-4">
                            <span className="legend-item"><span className="dot principal-dot" /> Principal</span>
                            <span className="legend-item"><span className="dot interest-dot" /> Interest</span>
                        </div>

                        <div className="summary-grid">
                            <div className="summary-item">
                                <span className="summary-label">Principal</span>
                                <span className="summary-val">{formatCurrency(results.amount)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Interest</span>
                                <span className="summary-val">{formatCurrency(results.totalInterest)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">EMI</span>
                                <span className="summary-val">{formatCurrency(results.emi)}</span>
                            </div>
                            <div className="summary-item highlight">
                                <span className="summary-label">Total Payment</span>
                                <span className="summary-val">{formatCurrency(results.totalPayment)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* REPAYMENT SCHEDULE TOGGLE */}
            {results.tenure > 0 && results.tenure <= 600 && (
                <div className="text-center mt-5 mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '0.8rem 2rem', fontSize: '1.05rem', fontWeight: 'bold' }}
                        onClick={() => setShowSchedule(!showSchedule)}>
                        {showSchedule ? 'Hide EMI Schedule' : 'Show me the EMI schedule'}
                    </button>
                </div>
            )}

            {/* REPAYMENT SCHEDULE */}
            {showSchedule && results.tenure > 0 && results.tenure <= 600 && (
                <div className="schedule-section">
                    <div className="schedule-header">
                        <h3>Detailed Repayment Schedule</h3>
                        <button className="btn btn-outline btn-sm" onClick={exportPDF}>
                            Export PDF
                        </button>
                    </div>
                    <div className="schedule-table-wrap">
                        <table className="schedule-table premium-schedule">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Month / Year</th>
                                    <th>EMI</th>
                                    <th>Principal Component</th>
                                    <th>Interest Component</th>
                                    <th>Balance Outstanding</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.schedule.map((row) => (
                                    <tr key={row.month}>
                                        <td>{row.month}</td>
                                        <td>{row.monthLabel}</td>
                                        <td>{formatCurrency(row.emi)}</td>
                                        <td>{formatCurrency(row.principal)}</td>
                                        <td>{formatCurrency(row.interest)}</td>
                                        <td>{formatCurrency(row.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* DIALOG BOX */}
            {dialog.open && (
                <div className="dialog-overlay" onClick={closeDialog}>
                    <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit {dialog.field === 'emi' ? 'EMI' : dialog.field.charAt(0).toUpperCase() + dialog.field.slice(1)}</h3>
                        <input
                            type="number"
                            className="dialog-input"
                            value={dialog.value}
                            onChange={(e) => setDialog({ ...dialog, value: e.target.value })}
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && confirmDialog()}
                        />
                        <div className="dialog-actions">
                            <button className="btn btn-outline btn-sm" onClick={closeDialog}>Cancel</button>
                            <button className="btn btn-primary btn-sm" onClick={confirmDialog}>Apply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalculatorPage;
