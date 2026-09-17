import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { exportToExcel, formatINR, formatNumberINR } from '../utils/excelExport';
import { generateLoanSchedulePDF } from '../utils/loanPdfExport';
import './CalculatorPage.css';
import '../pages/tools/ToolShared.css';

const AMOUNT_PRESETS = [
    { label: '₹5L', value: 500000 },
    { label: '₹25L', value: 2500000 },
    { label: '₹50L', value: 5000000 },
    { label: '₹1Cr', value: 10000000 },
    { label: '₹5Cr', value: 50000000 },
    { label: '₹25Cr', value: 250000000 }
];

const TENURE_PRESETS = [
    { label: '1 Yr', value: 12 },
    { label: '3 Yrs', value: 36 },
    { label: '5 Yrs', value: 60 },
    { label: '10 Yrs', value: 120 },
    { label: '15 Yrs', value: 180 },
    { label: '20 Yrs', value: 240 },
    { label: '25 Yrs', value: 300 },
    { label: '30 Yrs', value: 360 }
];

const CalculatorPage = () => {
    // Solve-for mode: which variable to calculate
    const [solveFor, setSolveFor] = useState('emi'); // 'emi' | 'amount' | 'rate' | 'tenure'

    const [amount, setAmount] = useState(500000);
    const [rate, setRate] = useState(10);
    const [tenure, setTenure] = useState(24);
    const [emiInput, setEmiInput] = useState(23073); // used when solving for amount/rate/tenure

    // Schedule & Filter state
    const [showSchedule, setShowSchedule] = useState(false);
    const [scheduleFilterYear, setScheduleFilterYear] = useState('all');
    const scheduleRef = useRef(null);

    // Format helpers
    const formatCurrency = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
    const formatCurrencyPDF = (v) => 'Rs. ' + Math.round(v).toLocaleString('en-IN');

    const formatIndianWords = (num) => {
        if (!num || isNaN(num) || num <= 0) return '';
        if (num >= 10000000) {
            return `₹${(num / 10000000).toFixed(2)} Crore`;
        }
        if (num >= 100000) {
            return `₹${(num / 100000).toFixed(2)} Lakh`;
        }
        if (num >= 1000) {
            return `₹${(num / 1000).toFixed(1)} K`;
        }
        return `₹${Number(num).toLocaleString('en-IN')}`;
    };

    // Dynamic slider bounds
    const maxAmountSlider = Math.max(10000000, amount <= 100000000 ? 100000000 : Math.ceil(amount * 1.25));
    const maxRateSlider = Math.max(30, Math.ceil(rate * 1.25));
    const maxTenureSlider = Math.max(360, Math.ceil(tenure * 1.2));
    const maxEmiSlider = Math.max(500000, Math.ceil(emiInput * 1.5));

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

    const interestPercent = results.totalPayment > 0 ? (results.totalInterest / results.totalPayment) * 100 : 0;

    // Filtered schedule rows
    const displayedSchedule = useMemo(() => {
        if (scheduleFilterYear === 'all') return results.schedule;
        const yNum = Number(scheduleFilterYear);
        return results.schedule.slice((yNum - 1) * 12, yNum * 12);
    }, [results.schedule, scheduleFilterYear]);

    // Total years count in schedule
    const totalScheduleYears = Math.ceil(results.schedule.length / 12);

    // Toggle Schedule & Smooth Scroll
    const handleToggleSchedule = () => {
        setShowSchedule(prev => {
            const next = !prev;
            if (next) {
                setTimeout(() => {
                    scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
            return next;
        });
    };

    // PDF Export (Bank-Grade Amortization Dossier with Dark Blue Violet & Amber Gold Theme)
    const exportPDF = () => {
        const firstMonth = results.schedule[0]?.monthLabel || '';
        const lastMonth = results.schedule[results.schedule.length - 1]?.monthLabel || '';

        generateLoanSchedulePDF({
            loanTitle: 'Official Loan Amortization Schedule',
            loanName: 'Standard Term Loan Facility',
            principal: results.amount,
            annualRate: results.rate,
            rateStructure: 'Reducing Balance',
            tenureMonths: results.tenure,
            effectiveEmi: results.emi,
            totalInterest: results.totalInterest,
            totalPayment: results.totalPayment,
            startDateLabel: firstMonth,
            endDateLabel: lastMonth,
            scheduleRows: results.schedule.map(r => ({
                month: r.month,
                dateLabel: r.monthLabel,
                openingPos: r.balance + r.principal,
                emi: r.emi,
                principal: r.principal,
                interest: r.interest,
                closingPos: r.balance
            })),
            fileName: 'BeeFund_Loan_Amortization_Schedule.pdf'
        });
    };

    // Excel Export
    const exportExcel = () => {
        const headers = [
            'Month #',
            'Month / Year',
            'EMI (INR)',
            'Principal Component (INR)',
            'Interest Component (INR)',
            'Balance Outstanding (INR)'
        ];

        const rows = results.schedule.map(r => [
            r.month,
            r.monthLabel,
            Math.round(r.emi),
            Math.round(r.principal),
            Math.round(r.interest),
            Math.round(r.balance)
        ]);

        // Append metadata
        rows.push([]);
        rows.push(['LOAN SUMMARY', '', '', '', '', '']);
        rows.push(['Loan Amount', `INR ${formatNumberINR(results.amount)}`]);
        rows.push(['Interest Rate', `${results.rate.toFixed(2)}% p.a.`]);
        rows.push(['Tenure', `${results.tenure} Months (${(results.tenure / 12).toFixed(1)} Years)`]);
        rows.push(['Monthly EMI', `INR ${formatNumberINR(results.emi)}`]);
        rows.push(['Total Interest Payable', `INR ${formatNumberINR(results.totalInterest)}`]);
        rows.push(['Total Amount Payable', `INR ${formatNumberINR(results.totalPayment)}`]);

        exportToExcel('BeeFund_Loan_Repayment_Schedule', headers, rows);
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
            <Link to="/tools" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', textDecoration: 'none', marginBottom: '1.5rem' }}>← Back to Financial Tools</Link>
            <div className="text-center mb-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="mb-2">Loan Calculator</h1>
                <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    Adjust any value using sliders or type any custom amount directly. Pick what to solve for.
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
                        <div className="param-header-flex">
                            <div className="param-label-wrap">
                                <label>Loan Amount</label>
                                {isEditable('amount') && formatIndianWords(amount) && (
                                    <span className="param-badge-words">{formatIndianWords(amount)}</span>
                                )}
                            </div>
                            {isEditable('amount') ? (
                                <div className="param-input-wrap">
                                    <span className="param-currency-symbol">₹</span>
                                    <input
                                        type="number"
                                        min={1000}
                                        value={amount}
                                        onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                                        className="param-direct-input"
                                        placeholder="Enter amount (e.g. 250000000)"
                                    />
                                </div>
                            ) : (
                                <span className="slider-value computed">
                                    {formatCurrency(results.amount)}
                                    <span className="computed-badge">Calculated</span>
                                </span>
                            )}
                        </div>

                        {isEditable('amount') && (
                            <>
                                <input
                                    type="range"
                                    min={10000}
                                    max={maxAmountSlider}
                                    step={amount > 10000000 ? 500000 : 25000}
                                    value={Math.min(amount, maxAmountSlider)}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="range-slider"
                                />
                                <div className="range-labels">
                                    <span>₹10K</span>
                                    <span>{formatIndianWords(maxAmountSlider)}</span>
                                </div>
                                <div className="quick-preset-row mt-2">
                                    {AMOUNT_PRESETS.map((p) => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            className={`btn-preset ${amount === p.value ? 'active' : ''}`}
                                            onClick={() => setAmount(p.value)}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Interest Rate */}
                    <div className={`form-group mb-4 ${!isEditable('rate') ? 'computed' : ''}`}>
                        <div className="param-header-flex">
                            <div className="param-label-wrap">
                                <label>Interest Rate (p.a.)</label>
                            </div>
                            {isEditable('rate') ? (
                                <div className="param-input-wrap">
                                    <input
                                        type="number"
                                        step="0.05"
                                        min="0.1"
                                        value={rate}
                                        onChange={(e) => setRate(Math.max(0.1, Number(e.target.value)))}
                                        className="param-direct-input"
                                    />
                                    <span className="param-suffix">%</span>
                                </div>
                            ) : (
                                <span className="slider-value computed">
                                    {results.rate.toFixed(2)}%
                                    <span className="computed-badge">Calculated</span>
                                </span>
                            )}
                        </div>

                        {isEditable('rate') && (
                            <>
                                <input
                                    type="range"
                                    min={1}
                                    max={maxRateSlider}
                                    step={0.1}
                                    value={Math.min(rate, maxRateSlider)}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="range-slider"
                                />
                                <div className="range-labels">
                                    <span>1%</span>
                                    <span>{maxRateSlider}%</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Tenure */}
                    <div className={`form-group mb-4 ${!isEditable('tenure') ? 'computed' : ''}`}>
                        <div className="param-header-flex">
                            <div className="param-label-wrap">
                                <label>Loan Tenure</label>
                                <span className="param-badge-words">{((isEditable('tenure') ? tenure : results.tenure) / 12).toFixed(1)} Years</span>
                            </div>
                            {isEditable('tenure') ? (
                                <div className="param-input-wrap">
                                    <input
                                        type="number"
                                        min="1"
                                        max="600"
                                        value={tenure}
                                        onChange={(e) => setTenure(Math.max(1, Number(e.target.value)))}
                                        className="param-direct-input"
                                    />
                                    <span className="param-suffix">mo</span>
                                </div>
                            ) : (
                                <span className="slider-value computed">
                                    {results.tenure} months
                                    <span className="computed-badge">Calculated</span>
                                </span>
                            )}
                        </div>

                        {isEditable('tenure') && (
                            <>
                                <input
                                    type="range"
                                    min={1}
                                    max={maxTenureSlider}
                                    step={1}
                                    value={Math.min(tenure, maxTenureSlider)}
                                    onChange={(e) => setTenure(Number(e.target.value))}
                                    className="range-slider"
                                />
                                <div className="range-labels">
                                    <span>1 mo</span>
                                    <span>{maxTenureSlider} mo</span>
                                </div>
                                <div className="quick-preset-row mt-2">
                                    {TENURE_PRESETS.map((tp) => (
                                        <button
                                            key={tp.value}
                                            type="button"
                                            className={`btn-preset ${tenure === tp.value ? 'active' : ''}`}
                                            onClick={() => setTenure(tp.value)}
                                        >
                                            {tp.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* EMI (editable when solving for something else) */}
                    <div className={`form-group mb-4 ${!isEditable('emi') ? 'computed' : ''}`}>
                        <div className="param-header-flex">
                            <div className="param-label-wrap">
                                <label>Monthly EMI</label>
                                {isEditable('emi') && formatIndianWords(emiInput) && (
                                    <span className="param-badge-words">{formatIndianWords(emiInput)}</span>
                                )}
                            </div>
                            {isEditable('emi') ? (
                                <div className="param-input-wrap">
                                    <span className="param-currency-symbol">₹</span>
                                    <input
                                        type="number"
                                        min="500"
                                        value={emiInput}
                                        onChange={(e) => setEmiInput(Math.max(0, Number(e.target.value)))}
                                        className="param-direct-input"
                                        placeholder="Enter EMI"
                                    />
                                </div>
                            ) : (
                                <span className="slider-value computed">
                                    {formatCurrency(results.emi)}
                                    <span className="computed-badge">Calculated</span>
                                </span>
                            )}
                        </div>

                        {isEditable('emi') && (
                            <>
                                <input
                                    type="range"
                                    min={1000}
                                    max={maxEmiSlider}
                                    step={500}
                                    value={Math.min(emiInput, maxEmiSlider)}
                                    onChange={(e) => setEmiInput(Number(e.target.value))}
                                    className="range-slider"
                                />
                                <div className="range-labels">
                                    <span>₹1K</span>
                                    <span>{formatIndianWords(maxEmiSlider)}</span>
                                </div>
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
                                <span className="summary-label">Principal Amount</span>
                                <span className="summary-val">{formatCurrency(results.amount)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Interest</span>
                                <span className="summary-val">{formatCurrency(results.totalInterest)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Monthly EMI</span>
                                <span className="summary-val">{formatCurrency(results.emi)}</span>
                            </div>
                            <div className="summary-item highlight">
                                <span className="summary-label">Total Amount Payable</span>
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
                        className="btn btn-primary btn-toggle-schedule"
                        onClick={handleToggleSchedule}
                    >
                        {showSchedule ? '▲ Hide EMI Schedule' : '▼ Show Detailed EMI Schedule'}
                    </button>
                </div>
            )}

            {/* REPAYMENT SCHEDULE */}
            {showSchedule && results.tenure > 0 && results.tenure <= 600 && (
                <div className="schedule-section mt-4" ref={scheduleRef}>
                    <div className="schedule-header">
                        <div>
                            <h3>Detailed Repayment Schedule</h3>
                            <p className="text-xs text-gray-500 m-0">
                                Month-by-month principal and interest breakdown over {results.tenure} months.
                            </p>
                        </div>

                        <div className="schedule-actions-flex">
                            {totalScheduleYears > 1 && (
                                <select
                                    value={scheduleFilterYear}
                                    onChange={(e) => setScheduleFilterYear(e.target.value)}
                                    className="form-control select-schedule-year"
                                >
                                    <option value="all">Show All {results.schedule.length} Months</option>
                                    {Array.from({ length: totalScheduleYears }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            Year {i + 1} (Months {i * 12 + 1} – {Math.min((i + 1) * 12, results.schedule.length)})
                                        </option>
                                    ))}
                                </select>
                            )}
                            <button
                                type="button"
                                className="btn-export-excel-small"
                                onClick={exportExcel}
                                title="Download schedule in Microsoft Excel format"
                            >
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="8" y1="13" x2="16" y2="13" />
                                    <line x1="8" y1="17" x2="16" y2="17" />
                                </svg>
                                Export Excel (.csv)
                            </button>
                            <button
                                type="button"
                                className="btn-export-pdf-small"
                                onClick={exportPDF}
                                title="Download PDF schedule"
                            >
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Export PDF
                            </button>
                        </div>
                    </div>

                    {/* SCROLLABLE TABLE CONTAINER WITH STICKY HEADER */}
                    <div className="schedule-table-wrap">
                        <table className="schedule-table premium-schedule">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Month / Year</th>
                                    <th>EMI (₹)</th>
                                    <th>Principal Component (₹)</th>
                                    <th>Interest Component (₹)</th>
                                    <th>Balance Outstanding (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedSchedule.map((row) => (
                                    <tr key={row.month}>
                                        <td>{row.month}</td>
                                        <td>{row.monthLabel}</td>
                                        <td>{formatCurrency(row.emi)}</td>
                                        <td className="text-emerald-600 font-semibold">{formatCurrency(row.principal)}</td>
                                        <td className="text-amber-600 font-semibold">{formatCurrency(row.interest)}</td>
                                        <td className="font-bold text-blue-600">{formatCurrency(row.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalculatorPage;
