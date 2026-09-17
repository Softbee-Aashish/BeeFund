import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/HexagonBackground';
import { exportToExcel, formatINR, formatNumberINR } from '../../utils/excelExport';
import { generateODStatementPDF } from '../../utils/loanPdfExport';
import './ODCCCalculator.css';
import './ToolShared.css';

const ODCCCalculator = () => {
    const [activeTab, setActiveTab] = useState('od'); // 'od' | 'cc' | 'convert'
    const [odMode, setOdMode] = useState('variable'); // 'variable' | 'quick'

    // ---- QUICK OD STATE ----
    const [odLimit, setOdLimit] = useState(1000000);
    const [odUtilized, setOdUtilized] = useState(500000);
    const [odRate, setOdRate] = useState(10.5);
    const [odTenureDays, setOdTenureDays] = useState(30);
    const [odProcessingFeePct, setOdProcessingFeePct] = useState(0.5);

    // ---- VARIABLE TIME-GAP OD STATE ----
    const [variableEntries, setVariableEntries] = useState([
        { id: 1, fromDate: '2026-10-01', toDate: '2026-10-12', days: 12, balance: 300000, rate: 10.5 },
        { id: 2, fromDate: '2026-10-13', toDate: '2026-10-20', days: 8, balance: 650000, rate: 10.5 },
        { id: 3, fromDate: '2026-10-21', toDate: '2026-10-31', days: 11, balance: 250000, rate: 10.5 },
    ]);

    // ---- CREDIT CARD STATE ----
    const [ccBalance, setCcBalance] = useState(75000);
    const [ccMonthlyRate, setCcMonthlyRate] = useState(3.5); // 3.5% per month (42% p.a.)
    const [ccDays, setCcDays] = useState(30);
    const [ccPaymentMade, setCcPaymentMade] = useState(3750); // 5% minimum
    const [ccCashAdvance, setCcCashAdvance] = useState(0);
    const [ccLateFee, setCcLateFee] = useState(0);

    // ---- EMI CONVERTER STATE ----
    const [convertAmount, setConvertAmount] = useState(200000);
    const [convertTenureMonths, setConvertTenureMonths] = useState(12);
    const [convertEmiRate, setConvertEmiRate] = useState(13); // Bank personal loan / EMI rate

    // ========================================================
    // CALCULATIONS
    // ========================================================

    // Quick OD Calc
    const quickOdResults = useMemo(() => {
        const dailyInterest = (odUtilized * (odRate / 100)) / 365;
        const totalInterest = dailyInterest * odTenureDays;
        const processingFee = (odLimit * (odProcessingFeePct / 100));
        const unutilized = Math.max(0, odLimit - odUtilized);
        const totalPayable = odUtilized + totalInterest + processingFee;

        return {
            dailyInterest,
            totalInterest,
            processingFee,
            unutilized,
            totalPayable
        };
    }, [odLimit, odUtilized, odRate, odTenureDays, odProcessingFeePct]);

    // Variable Time-Gap Entries Calc
    const variableSummary = useMemo(() => {
        let totalDays = 0;
        let totalInterest = 0;
        let weightedBalanceSum = 0;

        const processedEntries = variableEntries.map((row) => {
            const days = parseInt(row.days) || 0;
            const balance = parseFloat(row.balance) || 0;
            const rate = parseFloat(row.rate) || 0;
            const dailyInt = (balance * (rate / 100)) / 365;
            const periodInt = dailyInt * days;

            totalDays += days;
            totalInterest += periodInt;
            weightedBalanceSum += balance * days;

            return {
                ...row,
                dailyInterest: dailyInt,
                periodInterest: periodInt
            };
        });

        const avgDailyBalance = totalDays > 0 ? weightedBalanceSum / totalDays : 0;

        return {
            entries: processedEntries,
            totalDays,
            totalInterest,
            avgDailyBalance
        };
    }, [variableEntries]);

    // Variable Entries Handlers
    const addVariableEntry = () => {
        const newId = Date.now();
        setVariableEntries(prev => [
            ...prev,
            { id: newId, fromDate: '', toDate: '', days: 10, balance: 200000, rate: odRate }
        ]);
    };

    const removeVariableEntry = (id) => {
        setVariableEntries(prev => prev.filter(r => r.id !== id));
    };

    const updateVariableEntry = (id, field, value) => {
        setVariableEntries(prev => prev.map(r => {
            if (r.id !== id) return r;
            const updated = { ...r, [field]: value };

            // Auto-calculate days if dates are updated
            if (field === 'fromDate' || field === 'toDate') {
                const f = field === 'fromDate' ? value : r.fromDate;
                const t = field === 'toDate' ? value : r.toDate;
                if (f && t) {
                    const diffTime = new Date(t) - new Date(f);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    if (diffDays > 0) updated.days = diffDays;
                }
            }
            return updated;
        }));
    };

    // Credit Card Calc
    const ccResults = useMemo(() => {
        const annualRate = ccMonthlyRate * 12;
        const revolvingBalance = Math.max(0, ccBalance - ccPaymentMade);
        // Revolving Interest = (Outstanding Balance × Monthly Rate) × Days in Cycle / 30
        const revolvingInterest = (revolvingBalance * (ccMonthlyRate / 100) * ccDays) / 30;

        // Cash advance fee: 2.5% or ₹500
        const cashAdvanceFee = ccCashAdvance > 0 ? Math.max(500, ccCashAdvance * 0.025) : 0;
        const cashAdvanceInterest = (ccCashAdvance * (annualRate / 100) * ccDays) / 365;

        // 18% GST on all finance charges
        const financeCharges = revolvingInterest + cashAdvanceFee + cashAdvanceInterest + ccLateFee;
        const gst = financeCharges * 0.18;

        // Effective Annual Rate (EAR) = (1 + r/12)^12 - 1
        const monthlyRateDecimal = ccMonthlyRate / 100;
        const ear = (Math.pow(1 + monthlyRateDecimal, 12) - 1) * 100;

        const totalDue = revolvingBalance + financeCharges + gst;

        return {
            annualRate,
            revolvingBalance,
            revolvingInterest,
            cashAdvanceFee,
            cashAdvanceInterest,
            gst,
            ear,
            totalDue,
            financeCharges
        };
    }, [ccBalance, ccMonthlyRate, ccDays, ccPaymentMade, ccCashAdvance, ccLateFee]);

    // EMI Converter Calc
    const convertResults = useMemo(() => {
        // Reducing balance EMI
        const r = convertEmiRate / 12 / 100;
        const n = convertTenureMonths;
        const emi = (convertAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalEmiPayment = emi * n;
        const totalEmiInterest = totalEmiPayment - convertAmount;

        // Compare with paying 3.5% monthly revolving CC interest for same duration
        const revolvingMonthlyInt = convertAmount * (ccMonthlyRate / 100);
        const totalRevolvingInterest = revolvingMonthlyInt * n;
        const interestSaved = Math.max(0, totalRevolvingInterest - totalEmiInterest);

        return {
            emi,
            totalEmiPayment,
            totalEmiInterest,
            totalRevolvingInterest,
            interestSaved
        };
    }, [convertAmount, convertTenureMonths, convertEmiRate, ccMonthlyRate]);

    // ========================================================
    // EXPORT HANDLERS
    // ========================================================

    const handleExportExcelOD = () => {
        const headers = [
            'Entry #',
            'From Date',
            'To Date',
            'Number of Days',
            'Utilized Balance (INR)',
            'ROI (% p.a.)',
            'Daily Interest (INR)',
            'Period Total Interest (INR)'
        ];

        const rows = variableSummary.entries.map((row, idx) => [
            `Entry ${idx + 1}`,
            row.fromDate || 'N/A',
            row.toDate || 'N/A',
            row.days,
            Math.round(row.balance),
            row.rate + '%',
            row.dailyInterest.toFixed(2),
            row.periodInterest.toFixed(2)
        ]);

        // Add summary rows
        rows.push([]);
        rows.push(['SUMMARY TOTALS', '', '', `${variableSummary.totalDays} Total Days`, `Avg Balance: ${Math.round(variableSummary.avgDailyBalance)}`, '', '', `Total Interest: ₹${Math.round(variableSummary.totalInterest)}`]);

        exportToExcel('BeeFund_OD_Variable_Interest_Statement', headers, rows);
    };

    const handleExportPdfOD = () => {
        generateODStatementPDF({
            accountTitle: 'Commercial Overdraft (OD) Facility',
            summary: variableSummary,
            entries: variableSummary.entries,
            fileName: 'BeeFund_OD_Interest_Statement.pdf'
        });
    };

    return (
        <div className="page-wrapper container section odcc-page">
            <HexagonBackground opacity={0.05} />

            <Link to="/tools" className="back-link">
                ← Back to Financial Tools
            </Link>

            <div className="text-center mb-4 odcc-header">
                <div className="tool-badge">
                    <span>⚡ Overdraft & Credit Card Intelligence</span>
                </div>
                <h1 className="mb-2">
                    OD & CC <span className="text-highlight">Interest Calculator</span>
                </h1>
                <p className="text-light" style={{ maxWidth: '660px', margin: '0 auto' }}>
                    Calculate accurate daily interest on Overdraft accounts with variable balances, analyze revolving credit card charges, and export detailed schedules directly to Excel.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="odcc-tabs">
                <button
                    type="button"
                    className={`odcc-tab-btn ${activeTab === 'od' ? 'active' : ''}`}
                    onClick={() => setActiveTab('od')}
                >
                    Overdraft (OD) Calculator
                </button>
                <button
                    type="button"
                    className={`odcc-tab-btn ${activeTab === 'cc' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cc')}
                >
                    Credit Card (CC) Interest
                </button>
                <button
                    type="button"
                    className={`odcc-tab-btn ${activeTab === 'convert' ? 'active' : ''}`}
                    onClick={() => setActiveTab('convert')}
                >
                    Convert OD/CC to Fixed EMI
                </button>
            </div>

            {/* ========================================================
                TAB 1: OVERDRAFT (OD) CALCULATOR
               ======================================================== */}
            {activeTab === 'od' && (
                <div className="odcc-tab-content">
                    {/* Mode Sub-Toggle */}
                    <div className="od-mode-toggle">
                        <button
                            type="button"
                            className={`od-mode-btn ${odMode === 'variable' ? 'active' : ''}`}
                            onClick={() => setOdMode('variable')}
                        >
                            📊 Variable / Random Time-Gap Balance Tracker (Recommended)
                        </button>
                        <button
                            type="button"
                            className={`od-mode-btn ${odMode === 'quick' ? 'active' : ''}`}
                            onClick={() => setOdMode('quick')}
                        >
                            ⚡ Quick Flat OD Interest
                        </button>
                    </div>

                    {/* VARIABLE TIME-GAP CALCULATOR */}
                    {odMode === 'variable' ? (
                        <div className="variable-od-container">
                            <div className="card variable-table-card">
                                <div className="card-header-flex">
                                    <div>
                                        <h2>Utilized Balance Ledger Entries</h2>
                                        <p className="card-desc">
                                            Add multiple entries representing random date intervals and varying utilized balances.
                                        </p>
                                    </div>
                                    <div className="export-action-btns">
                                        <button
                                            type="button"
                                            className="btn-export-excel"
                                            onClick={handleExportExcelOD}
                                            title="Export table directly to Microsoft Excel format"
                                        >
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="8" y1="13" x2="16" y2="13" />
                                                <line x1="8" y1="17" x2="16" y2="17" />
                                            </svg>
                                            Export to Excel (.csv)
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-export-pdf"
                                            onClick={handleExportPdfOD}
                                            title="Export branded PDF statement"
                                        >
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                            Export PDF
                                        </button>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="od-entry-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>From Date</th>
                                                <th>To Date</th>
                                                <th>Days Gap</th>
                                                <th>Utilized Balance (₹)</th>
                                                <th>ROI (% p.a.)</th>
                                                <th>Daily Interest</th>
                                                <th>Period Interest</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {variableSummary.entries.map((row, idx) => (
                                                <tr key={row.id}>
                                                    <td className="row-num">{idx + 1}</td>
                                                    <td>
                                                        <input
                                                            type="date"
                                                            value={row.fromDate}
                                                            onChange={(e) => updateVariableEntry(row.id, 'fromDate', e.target.value)}
                                                            className="table-input"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="date"
                                                            value={row.toDate}
                                                            onChange={(e) => updateVariableEntry(row.id, 'toDate', e.target.value)}
                                                            className="table-input"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={row.days}
                                                            onChange={(e) => updateVariableEntry(row.id, 'days', e.target.value)}
                                                            className="table-input input-narrow"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            step="5000"
                                                            value={row.balance}
                                                            onChange={(e) => updateVariableEntry(row.id, 'balance', e.target.value)}
                                                            className="table-input"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={row.rate}
                                                            onChange={(e) => updateVariableEntry(row.id, 'rate', e.target.value)}
                                                            className="table-input input-narrow"
                                                        />
                                                    </td>
                                                    <td className="font-semibold text-gray-700">
                                                        {formatINR(row.dailyInterest)}
                                                    </td>
                                                    <td className="font-bold text-amber-600">
                                                        {formatINR(row.periodInterest)}
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn-remove-row"
                                                            onClick={() => removeVariableEntry(row.id)}
                                                            disabled={variableSummary.entries.length <= 1}
                                                            title="Delete Entry"
                                                        >
                                                            ✕
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="table-footer-actions">
                                    <button
                                        type="button"
                                        className="btn-add-entry"
                                        onClick={addVariableEntry}
                                    >
                                        + Add Utilization Interval
                                    </button>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="od-summary-grid">
                                <div className="od-metric-card">
                                    <span className="metric-label">Total Days Calculated</span>
                                    <span className="metric-value">{variableSummary.totalDays} Days</span>
                                    <span className="metric-sub">Across {variableSummary.entries.length} interval entries</span>
                                </div>
                                <div className="od-metric-card">
                                    <span className="metric-label">Average Daily Balance</span>
                                    <span className="metric-value">{formatINR(variableSummary.avgDailyBalance)}</span>
                                    <span className="metric-sub">Weighted daily average</span>
                                </div>
                                <div className="od-metric-card highlight">
                                    <span className="metric-label">Total Accumulated Interest</span>
                                    <span className="metric-value text-amber-500">{formatINR(variableSummary.totalInterest)}</span>
                                    <span className="metric-sub">Sum of all intervals</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* QUICK OD MODE */
                        <div className="calc-grid">
                            <div className="card calc-input-panel">
                                <h3 className="mb-4">Overdraft Parameters</h3>

                                <div className="form-group mb-4">
                                    <label>Sanctioned OD Limit (₹)</label>
                                    <input
                                        type="number"
                                        value={odLimit}
                                        onChange={(e) => setOdLimit(Number(e.target.value))}
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label>Average Utilized Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={odUtilized}
                                        onChange={(e) => setOdUtilized(Number(e.target.value))}
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label>Annual Interest Rate (% p.a.)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={odRate}
                                        onChange={(e) => setOdRate(Number(e.target.value))}
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label>Calculation Period (Days)</label>
                                    <input
                                        type="number"
                                        value={odTenureDays}
                                        onChange={(e) => setOdTenureDays(Number(e.target.value))}
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label>Annual Renewal / Processing Fee (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={odProcessingFeePct}
                                        onChange={(e) => setOdProcessingFeePct(Number(e.target.value))}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="card calc-result-panel">
                                <h3>Calculation Results</h3>
                                <div className="result-metric">
                                    <span>Daily Interest</span>
                                    <strong>{formatINR(quickOdResults.dailyInterest)} / day</strong>
                                </div>
                                <div className="result-metric highlight">
                                    <span>Total Period Interest ({odTenureDays} days)</span>
                                    <strong>{formatINR(quickOdResults.totalInterest)}</strong>
                                </div>
                                <div className="result-metric">
                                    <span>Unutilized OD Limit</span>
                                    <strong>{formatINR(quickOdResults.unutilized)}</strong>
                                </div>
                                <div className="result-metric">
                                    <span>Annual Renewal Fee ({odProcessingFeePct}%)</span>
                                    <strong>{formatINR(quickOdResults.processingFee)}</strong>
                                </div>
                                <div className="result-metric total">
                                    <span>Total Cost (Interest + Fee)</span>
                                    <strong>{formatINR(quickOdResults.totalInterest + quickOdResults.processingFee)}</strong>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================
                TAB 2: CREDIT CARD (CC) CALCULATOR
               ======================================================== */}
            {activeTab === 'cc' && (
                <div className="odcc-tab-content">
                    <div className="calc-grid">
                        <div className="card calc-input-panel">
                            <h3 className="mb-4">Credit Card Billing Inputs</h3>

                            <div className="form-group mb-4">
                                <label>Total Statement Outstanding (₹)</label>
                                <input
                                    type="number"
                                    value={ccBalance}
                                    onChange={(e) => setCcBalance(Number(e.target.value))}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group mb-4">
                                <label>Monthly Finance Charge / Interest (% per month)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={ccMonthlyRate}
                                    onChange={(e) => setCcMonthlyRate(Number(e.target.value))}
                                    className="form-control"
                                />
                                <small className="helper-text">
                                    Annualized Rate (APR): {(ccMonthlyRate * 12).toFixed(1)}% p.a.
                                </small>
                            </div>

                            <div className="form-group mb-4">
                                <label>Partial Payment Made (₹)</label>
                                <input
                                    type="number"
                                    value={ccPaymentMade}
                                    onChange={(e) => setCcPaymentMade(Number(e.target.value))}
                                    className="form-control"
                                />
                                <small className="helper-text">
                                    Minimum Amount Due (5%): {formatINR(ccBalance * 0.05)}
                                </small>
                            </div>

                            <div className="form-group mb-4">
                                <label>Days Revolving</label>
                                <input
                                    type="number"
                                    value={ccDays}
                                    onChange={(e) => setCcDays(Number(e.target.value))}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group mb-4">
                                <label>ATM Cash Advance (₹, if any)</label>
                                <input
                                    type="number"
                                    value={ccCashAdvance}
                                    onChange={(e) => setCcCashAdvance(Number(e.target.value))}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group mb-4">
                                <label>Late Payment Charges (₹, if applicable)</label>
                                <input
                                    type="number"
                                    value={ccLateFee}
                                    onChange={(e) => setCcLateFee(Number(e.target.value))}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="card calc-result-panel">
                            <h3>Revolving Charges Breakdown</h3>

                            <div className="result-metric">
                                <span>Revolving Outstanding</span>
                                <strong>{formatINR(ccResults.revolvingBalance)}</strong>
                            </div>

                            <div className="result-metric highlight">
                                <span>Revolving Interest ({ccDays} days)</span>
                                <strong>{formatINR(ccResults.revolvingInterest)}</strong>
                            </div>

                            {ccCashAdvance > 0 && (
                                <>
                                    <div className="result-metric">
                                        <span>Cash Advance Fee + Interest</span>
                                        <strong>{formatINR(ccResults.cashAdvanceFee + ccResults.cashAdvanceInterest)}</strong>
                                    </div>
                                </>
                            )}

                            <div className="result-metric">
                                <span>18% GST on Finance Charges</span>
                                <strong>{formatINR(ccResults.gst)}</strong>
                            </div>

                            <div className="result-metric">
                                <span>Effective Annual Rate (EAR)</span>
                                <strong className="text-red-500">{ccResults.ear.toFixed(1)}% p.a.</strong>
                            </div>

                            <div className="result-metric total">
                                <span>Total Payable Next Month</span>
                                <strong>{formatINR(ccResults.totalDue)}</strong>
                            </div>

                            <div className="info-callout">
                                ⚠️ <strong>Important Tip:</strong> Revolving credit card balances incur up to <strong>{ccResults.ear.toFixed(1)}% effective interest</strong> per year. Consider converting to a low-cost personal loan or term EMI.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================
                TAB 3: OD/CC TO EMI CONVERTER
               ======================================================== */}
            {activeTab === 'convert' && (
                <div className="odcc-tab-content">
                    <div className="calc-grid">
                        <div className="card calc-input-panel">
                            <h3 className="mb-4">Debt Consolidation Inputs</h3>

                            <div className="form-group mb-4">
                                <label>Debt Amount to Convert (₹)</label>
                                <input
                                    type="number"
                                    value={convertAmount}
                                    onChange={(e) => setConvertAmount(Number(e.target.value))}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group mb-4">
                                <label>Desired Tenure (Months)</label>
                                <input
                                    type="number"
                                    value={convertTenureMonths}
                                    onChange={(e) => setConvertTenureMonths(Number(e.target.value))}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group mb-4">
                                <label>New Loan / EMI Interest Rate (% p.a.)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={convertEmiRate}
                                    onChange={(e) => setConvertEmiRate(Number(e.target.value))}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="card calc-result-panel">
                            <h3>Comparison & Savings</h3>

                            <div className="result-metric">
                                <span>New Monthly EMI</span>
                                <strong>{formatINR(convertResults.emi)} / mo</strong>
                            </div>

                            <div className="result-metric">
                                <span>Total Interest under EMI</span>
                                <strong>{formatINR(convertResults.totalEmiInterest)}</strong>
                            </div>

                            <div className="result-metric">
                                <span>Total Interest under Revolving ({ccMonthlyRate}%/mo)</span>
                                <strong className="text-red-500">{formatINR(convertResults.totalRevolvingInterest)}</strong>
                            </div>

                            <div className="result-metric total text-green-600">
                                <span>Total Money Saved by Converting</span>
                                <strong className="text-emerald-500">{formatINR(convertResults.interestSaved)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ODCCCalculator;
