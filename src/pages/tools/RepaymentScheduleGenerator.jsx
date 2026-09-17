import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../../components/HexagonBackground';
import { exportToExcel, formatINR, formatNumberINR } from '../../utils/excelExport';
import { generateLoanSchedulePDF } from '../../utils/loanPdfExport';
import './RepaymentScheduleGenerator.css';
import './ToolShared.css';

const MONTH_NAMES = [
    { value: 1, label: 'January (01)' },
    { value: 2, label: 'February (02)' },
    { value: 3, label: 'March (03)' },
    { value: 4, label: 'April (04)' },
    { value: 5, label: 'May (05)' },
    { value: 6, label: 'June (06)' },
    { value: 7, label: 'July (07)' },
    { value: 8, label: 'August (08)' },
    { value: 9, label: 'September (09)' },
    { value: 10, label: 'October (10)' },
    { value: 11, label: 'November (11)' },
    { value: 12, label: 'December (12)' }
];

const RepaymentScheduleGenerator = () => {
    // ---- PRIMARY SANCTION LETTER INPUTS ----
    const [loanName, setLoanName] = useState('Home / Term Loan');
    const [principal, setPrincipal] = useState(25000000);
    const [annualRate, setAnnualRate] = useState(11.65);
    const [tenureMonths, setTenureMonths] = useState(120);
    const [tenureUnit, setTenureUnit] = useState('months'); // 'months' | 'years'
    const [startMonth, setStartMonth] = useState(6); // June
    const [startYear, setStartYear] = useState(2021); // 2021

    // ---- ADVANCED OPTIONS (COLLAPSED BY DEFAULT FOR SIMPLICITY) ----
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [moratoriumMonths, setMoratoriumMonths] = useState(1);
    const [processingFeePct, setProcessingFeePct] = useState(1.0);
    const [calcMethod, setCalcMethod] = useState('reducing'); // 'reducing' | 'flat'
    const [rateStructure, setRateStructure] = useState('fixed'); // 'fixed' | 'floating'
    const [floatingChangeMonth, setFloatingChangeMonth] = useState(12);
    const [floatingNewRate, setFloatingNewRate] = useState(12.0);
    const [emiMode, setEmiMode] = useState('auto'); // 'auto' | 'custom'
    const [customEmi, setCustomEmi] = useState(355214);

    // ---- INSPECTOR & TABLE VIEW STATE ----
    const [inspectMonth, setInspectMonth] = useState(12);
    const [tableTab, setTableTab] = useState('yearly'); // 'yearly' | 'monthly'
    const [selectedYear, setSelectedYear] = useState('all');

    // Synchronize tenure months if years unit selected
    const totalMonths = tenureUnit === 'years' ? tenureMonths * 12 : tenureMonths;

    // Helper: format large numbers in Indian Lakhs/Crores for easy human reading
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

    // ========================================================
    // REPAYMENT SCHEDULE ENGINE
    // ========================================================
    const scheduleData = useMemo(() => {
        const P = Math.max(1000, Number(principal) || 0);
        const n = Math.max(1, totalMonths);
        const morat = Math.min(n - 1, Math.max(0, Number(moratoriumMonths) || 0));

        const startYearNum = Number(startYear) || 2021;
        const startMonthNum = Number(startMonth) || 6;

        // Auto standard Reducing Balance EMI (excluding moratorium)
        const regularTenure = Math.max(1, n - morat);
        const baseMonthlyRate = annualRate / 12 / 100;

        let autoStandardEmi = 0;
        if (calcMethod === 'flat') {
            const totalFlatInt = (P * (annualRate / 100) * (n / 12));
            autoStandardEmi = (P + totalFlatInt) / n;
        } else {
            if (baseMonthlyRate === 0) {
                autoStandardEmi = P / regularTenure;
            } else {
                autoStandardEmi = (P * baseMonthlyRate * Math.pow(1 + baseMonthlyRate, regularTenure)) /
                    (Math.pow(1 + baseMonthlyRate, regularTenure) - 1);
            }
        }

        const effectiveEmi = emiMode === 'custom' && customEmi > 0 ? customEmi : autoStandardEmi;

        // Generate month-by-month rows
        const rows = [];
        let currentPos = P;
        let cumulativePrincipal = 0;
        let cumulativeInterest = 0;

        for (let m = 1; m <= n; m++) {
            // Determine active interest rate (fixed vs floating)
            let currentAnnualRate = annualRate;
            if (rateStructure === 'floating' && m > floatingChangeMonth) {
                currentAnnualRate = floatingNewRate;
            }
            const monthlyRate = currentAnnualRate / 12 / 100;

            // Date calculation (starts exactly from startMonth/startYear)
            const curDate = new Date(startYearNum, (startMonthNum - 1) + (m - 1), 1);
            const dateLabel = curDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            const openingPos = currentPos;
            let interestPart = 0;
            let principalPart = 0;
            let emiPaid = 0;

            if (m <= morat) {
                // Moratorium: interest-only payment, principal unchanged
                interestPart = openingPos * monthlyRate;
                principalPart = 0;
                emiPaid = interestPart;
            } else if (calcMethod === 'flat') {
                const totalFlatInt = (P * (annualRate / 100) * (n / 12));
                interestPart = totalFlatInt / n;
                principalPart = P / n;
                emiPaid = principalPart + interestPart;
                currentPos = Math.max(0, currentPos - principalPart);
            } else {
                // Standard reducing balance
                interestPart = openingPos * monthlyRate;
                principalPart = effectiveEmi - interestPart;

                // Handle last month rounding or balance clearing
                if (m === n || principalPart > openingPos) {
                    principalPart = openingPos;
                    emiPaid = principalPart + interestPart;
                    currentPos = 0;
                } else {
                    emiPaid = effectiveEmi;
                    currentPos = Math.max(0, openingPos - principalPart);
                }
            }

            cumulativePrincipal += principalPart;
            cumulativeInterest += interestPart;

            rows.push({
                month: m,
                dateLabel,
                openingPos,
                emi: emiPaid,
                principal: principalPart,
                interest: interestPart,
                closingPos: currentPos,
                cumulativePrincipal,
                cumulativeInterest,
                annualRate: currentAnnualRate
            });

            if (currentPos <= 0 && m >= morat + 1) break;
        }

        const totalInterestPayable = cumulativeInterest;
        const totalAmountPayable = P + totalInterestPayable;
        const processingFeeAmount = P * (processingFeePct / 100);
        const startDateLabel = rows[0]?.dateLabel || 'N/A';
        const endDateLabel = rows[rows.length - 1]?.dateLabel || 'N/A';

        return {
            rows,
            standardEmi: autoStandardEmi,
            effectiveEmi,
            totalInterestPayable,
            totalAmountPayable,
            processingFeeAmount,
            startDateLabel,
            endDateLabel,
            principal: P
        };
    }, [
        principal,
        annualRate,
        totalMonths,
        startMonth,
        startYear,
        rateStructure,
        floatingChangeMonth,
        floatingNewRate,
        calcMethod,
        emiMode,
        customEmi,
        moratoriumMonths,
        processingFeePct
    ]);

    // Yearly summary aggregation
    const yearlySummary = useMemo(() => {
        if (!scheduleData.rows.length) return [];
        const years = [];
        const totalY = Math.ceil(scheduleData.rows.length / 12);
        for (let y = 1; y <= totalY; y++) {
            const slice = scheduleData.rows.slice((y - 1) * 12, y * 12);
            if (!slice.length) continue;
            const openingPos = slice[0].openingPos;
            const closingPos = slice[slice.length - 1].closingPos;
            const emiTotal = slice.reduce((acc, r) => acc + r.emi, 0);
            const principalTotal = slice.reduce((acc, r) => acc + r.principal, 0);
            const interestTotal = slice.reduce((acc, r) => acc + r.interest, 0);
            const startLabel = slice[0].dateLabel;
            const endLabel = slice[slice.length - 1].dateLabel;
            years.push({
                yearNum: y,
                period: `${startLabel} - ${endLabel}`,
                openingPos,
                emiTotal,
                principalTotal,
                interestTotal,
                closingPos,
                monthCount: slice.length
            });
        }
        return years;
    }, [scheduleData.rows]);

    // Displayed monthly rows (filtered by selected year if applicable)
    const displayedMonthlyRows = useMemo(() => {
        if (selectedYear === 'all') return scheduleData.rows;
        const yNum = Number(selectedYear);
        return scheduleData.rows.slice((yNum - 1) * 12, yNum * 12);
    }, [scheduleData.rows, selectedYear]);

    // Inspector Row
    const inspectedRow = useMemo(() => {
        const idx = Math.min(Math.max(1, inspectMonth), scheduleData.rows.length) - 1;
        return scheduleData.rows[idx] || scheduleData.rows[0];
    }, [inspectMonth, scheduleData.rows]);

    // Principal & Interest percentages
    const pctPrincipalLeft = inspectedRow ? Math.max(0, (inspectedRow.closingPos / scheduleData.principal) * 100) : 0;
    const pctPrincipalPaid = 100 - pctPrincipalLeft;

    // ========================================================
    // EXPORT HANDLERS
    // ========================================================

    const handleExportExcel = () => {
        const headers = [
            'Month #',
            'Payment Date',
            'Opening POS (INR)',
            'EMI Amount (INR)',
            'Principal Paid (INR)',
            'Interest Paid (INR)',
            'Closing POS (INR)',
            'Cumulative Principal (INR)',
            'Cumulative Interest (INR)',
            'Applicable ROI (% p.a.)'
        ];

        const rows = scheduleData.rows.map(r => [
            r.month,
            r.dateLabel,
            Math.round(r.openingPos),
            Math.round(r.emi),
            Math.round(r.principal),
            Math.round(r.interest),
            Math.round(r.closingPos),
            Math.round(r.cumulativePrincipal),
            Math.round(r.cumulativeInterest),
            r.annualRate + '%'
        ]);

        // Add sanction metadata at bottom
        rows.push([]);
        rows.push(['SANCTION DETAILS', '', '', '', '', '', '', '', '', '']);
        rows.push(['Loan Product', loanName]);
        rows.push(['Sanctioned Amount', `INR ${formatNumberINR(scheduleData.principal)}`]);
        rows.push(['Initial ROI', `${annualRate}% p.a.`]);
        rows.push(['Total Tenure', `${totalMonths} Months`]);
        rows.push(['First EMI Date', scheduleData.startDateLabel]);
        rows.push(['Final Maturity Date', scheduleData.endDateLabel]);
        rows.push(['Total Interest Payable', `INR ${formatNumberINR(scheduleData.totalInterestPayable)}`]);
        rows.push(['Total Amount Payable', `INR ${formatNumberINR(scheduleData.totalAmountPayable)}`]);

        exportToExcel(`BeeFund_Repayment_Schedule_${loanName.replace(/\s+/g, '_')}`, headers, rows);
    };

    const handleExportPdf = () => {
        generateLoanSchedulePDF({
            loanTitle: 'Official Sanction Repayment Schedule',
            loanName: loanName,
            principal: scheduleData.principal,
            annualRate: annualRate,
            rateStructure: rateStructure === 'fixed' ? 'Fixed Rate' : 'Floating Rate',
            tenureMonths: totalMonths,
            effectiveEmi: scheduleData.effectiveEmi,
            totalInterest: scheduleData.totalInterestPayable,
            totalPayment: scheduleData.totalAmountPayable,
            startDateLabel: scheduleData.startDateLabel,
            endDateLabel: scheduleData.endDateLabel,
            moratoriumMonths: moratoriumMonths,
            processingFee: scheduleData.processingFeeAmount,
            scheduleRows: scheduleData.rows,
            fileName: `BeeFund_Repayment_Schedule_${loanName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        });
    };

    return (
        <div className="page-wrapper container section rsg-page">
            <HexagonBackground opacity={0.05} />

            <Link to="/tools" className="back-link">
                ← Back to Financial Tools
            </Link>

            {/* HEADER */}
            <div className="text-center mb-4 rsg-header">
                <div className="tool-badge">
                    <span>📑 Sanction Letter Amortization Tool</span>
                </div>
                <h1 className="mb-2">
                    Repayment <span className="text-highlight">Schedule Generator</span>
                </h1>
                <p className="text-light" style={{ maxWidth: '680px', margin: '0 auto' }}>
                    Enter your loan details from your Sanction Letter to instantly generate your month-by-month EMI and balance schedule. Simple, bank-accurate, and exportable to Excel or PDF.
                </p>
            </div>

            {/* TOP KPI CARDS */}
            <div className="rsg-top-kpis mb-4">
                <div className="kpi-box highlight">
                    <span className="kpi-label">Monthly EMI</span>
                    <span className="kpi-value text-amber-500">{formatINR(scheduleData.effectiveEmi)}</span>
                    <span className="kpi-sub">{totalMonths} monthly installments</span>
                </div>
                <div className="kpi-box">
                    <span className="kpi-label">Total Interest</span>
                    <span className="kpi-value">{formatINR(scheduleData.totalInterestPayable)}</span>
                    <span className="kpi-sub">{((scheduleData.totalInterestPayable / scheduleData.principal) * 100).toFixed(1)}% of loan amount</span>
                </div>
                <div className="kpi-box">
                    <span className="kpi-label">Total Amount Payable</span>
                    <span className="kpi-value">{formatINR(scheduleData.totalAmountPayable)}</span>
                    <span className="kpi-sub">Principal ({formatIndianWords(scheduleData.principal)}) + Interest</span>
                </div>
                <div className="kpi-box">
                    <span className="kpi-label">Loan Maturity Date</span>
                    <span className="kpi-value font-semibold text-blue-600">{scheduleData.endDateLabel}</span>
                    <span className="kpi-sub">Starts: {scheduleData.startDateLabel}</span>
                </div>
            </div>

            {/* MAIN TWO-COLUMN WORKBENCH */}
            <div className="rsg-layout-grid">
                {/* LEFT: LOAN DETAILS INPUTS */}
                <div className="card rsg-input-card">
                    <div className="card-section-title">
                        <div>
                            <h2>Loan Details</h2>
                            <p className="text-xs text-gray-500 m-0">Basic terms from your sanction letter</p>
                        </div>
                        <span className="badge-sanction">Bank Verified</span>
                    </div>

                    <div className="form-group">
                        <label>Loan Product / Purpose</label>
                        <input
                            type="text"
                            value={loanName}
                            onChange={(e) => setLoanName(e.target.value)}
                            placeholder="e.g. Home Loan, Business Term Loan, LAP"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <div className="flex-between mb-1">
                            <label className="m-0">Sanctioned Loan Amount (₹)</label>
                            {formatIndianWords(principal) && (
                                <span className="amount-preview-pill">{formatIndianWords(principal)}</span>
                            )}
                        </div>
                        <input
                            type="number"
                            step="25000"
                            value={principal}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                            className="form-control"
                        />
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label>Interest Rate (% p.a.)</label>
                            <input
                                type="number"
                                step="0.05"
                                value={annualRate}
                                onChange={(e) => setAnnualRate(Number(e.target.value))}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Tenure</label>
                            <div className="tenure-input-combo">
                                <input
                                    type="number"
                                    min="1"
                                    value={tenureMonths}
                                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                                    className="form-control"
                                />
                                <select
                                    value={tenureUnit}
                                    onChange={(e) => setTenureUnit(e.target.value)}
                                    className="form-control tenure-unit-select"
                                >
                                    <option value="months">Months</option>
                                    <option value="years">Years</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* FOOLPROOF MONTH & YEAR SELECTORS (ELIMINATES 1910/1920 DATE BUGS) */}
                    <div className="form-row-2">
                        <div className="form-group">
                            <label>First EMI Month</label>
                            <select
                                value={startMonth}
                                onChange={(e) => setStartMonth(Number(e.target.value))}
                                className="form-control"
                            >
                                {MONTH_NAMES.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>First EMI Year</label>
                            <input
                                type="number"
                                min="1990"
                                max="2060"
                                value={startYear}
                                onChange={(e) => setStartYear(Number(e.target.value))}
                                className="form-control"
                                placeholder="e.g. 2021"
                            />
                        </div>
                    </div>

                    {/* COLLAPSIBLE ADVANCED OPTIONS (CLEAN & NON-INTIMIDATING) */}
                    <div className="advanced-options-section mt-3">
                        <button
                            type="button"
                            className="advanced-toggle-btn"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            <span>⚙️ Advanced Options (Moratorium, Floating ROI, Fees)</span>
                            <span className="toggle-arrow">{showAdvanced ? '▲' : '▼'}</span>
                        </button>

                        {showAdvanced && (
                            <div className="advanced-options-body mt-3">
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Moratorium (Months)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="36"
                                            value={moratoriumMonths}
                                            onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                                            className="form-control"
                                        />
                                        <span className="helper-text">Interest-only payment period</span>
                                    </div>
                                    <div className="form-group">
                                        <label>Processing Fee (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={processingFeePct}
                                            onChange={(e) => setProcessingFeePct(Number(e.target.value))}
                                            className="form-control"
                                        />
                                        <span className="helper-text">{formatINR(scheduleData.processingFeeAmount)}</span>
                                    </div>
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Rate Structure</label>
                                        <select
                                            value={rateStructure}
                                            onChange={(e) => setRateStructure(e.target.value)}
                                            className="form-control"
                                        >
                                            <option value="fixed">Fixed Rate</option>
                                            <option value="floating">Floating Rate</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Calculation Method</label>
                                        <select
                                            value={calcMethod}
                                            onChange={(e) => setCalcMethod(e.target.value)}
                                            className="form-control"
                                        >
                                            <option value="reducing">Reducing Balance (Standard)</option>
                                            <option value="flat">Flat Rate</option>
                                        </select>
                                    </div>
                                </div>

                                {rateStructure === 'floating' && (
                                    <div className="floating-rate-box mb-3">
                                        <label className="font-semibold text-xs text-amber-700 block mb-1">
                                            🌊 Simulate Benchmark Revision
                                        </label>
                                        <div className="form-row-2">
                                            <div>
                                                <span className="text-xs text-gray-500">After Month:</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={totalMonths}
                                                    value={floatingChangeMonth}
                                                    onChange={(e) => setFloatingChangeMonth(Number(e.target.value))}
                                                    className="form-control input-sm"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500">New Rate (%):</span>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={floatingNewRate}
                                                    onChange={(e) => setFloatingNewRate(Number(e.target.value))}
                                                    className="form-control input-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>EMI Mode</label>
                                    <div className="radio-group-flex">
                                        <label className={`radio-pill ${emiMode === 'auto' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="emiMode"
                                                checked={emiMode === 'auto'}
                                                onChange={() => setEmiMode('auto')}
                                            />
                                            <span>Auto Compute EMI</span>
                                        </label>
                                        <label className={`radio-pill ${emiMode === 'custom' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="emiMode"
                                                checked={emiMode === 'custom'}
                                                onChange={() => setEmiMode('custom')}
                                            />
                                            <span>Custom Sanctioned EMI</span>
                                        </label>
                                    </div>
                                </div>

                                {emiMode === 'custom' && (
                                    <div className="form-group custom-emi-box">
                                        <label>Exact Sanctioned EMI from Letter (₹)</label>
                                        <input
                                            type="number"
                                            value={customEmi}
                                            onChange={(e) => setCustomEmi(Number(e.target.value))}
                                            className="form-control font-bold text-amber-600"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: VISUAL LOAN PROGRESS & MONTH INSPECTOR */}
                <div className="card rsg-progress-card">
                    <div className="card-section-title">
                        <div>
                            <h2>Loan Payoff Tracker</h2>
                            <p className="text-xs text-gray-500 m-0">Interactive monthly balance & interest tracking</p>
                        </div>
                        <span className="month-badge">Month {inspectMonth} ({inspectedRow?.dateLabel})</span>
                    </div>

                    {/* Visual Ratio Bar (Principal vs Total Interest) */}
                    <div className="principal-interest-ratio-box mb-4">
                        <div className="ratio-header">
                            <span className="ratio-item principal-indicator">
                                ● Principal: {formatINR(scheduleData.principal)} ({(scheduleData.principal / scheduleData.totalAmountPayable * 100).toFixed(1)}%)
                            </span>
                            <span className="ratio-item interest-indicator">
                                ● Interest: {formatINR(scheduleData.totalInterestPayable)} ({(scheduleData.totalInterestPayable / scheduleData.totalAmountPayable * 100).toFixed(1)}%)
                            </span>
                        </div>
                        <div className="ratio-bar">
                            <div
                                className="ratio-segment-principal"
                                style={{ width: `${(scheduleData.principal / scheduleData.totalAmountPayable) * 100}%` }}
                            />
                            <div
                                className="ratio-segment-interest"
                                style={{ width: `${(scheduleData.totalInterestPayable / scheduleData.totalAmountPayable) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Interactive Slider */}
                    <div className="slider-box mb-4">
                        <div className="slider-labels-flex">
                            <span>Month 1 ({scheduleData.startDateLabel})</span>
                            <span className="font-bold text-amber-600">Scrub Month: {inspectMonth} of {scheduleData.rows.length}</span>
                            <span>Month {scheduleData.rows.length} ({scheduleData.endDateLabel})</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max={scheduleData.rows.length}
                            value={inspectMonth}
                            onChange={(e) => setInspectMonth(Number(e.target.value))}
                            className="rsg-slider"
                        />
                    </div>

                    {/* Progress Bar for Inspected Month */}
                    <div className="progress-bar-group mb-4">
                        <div className="progress-label-row">
                            <span className="font-semibold text-xs">Principal Repaid ({pctPrincipalPaid.toFixed(1)}%)</span>
                            <span className="font-bold text-xs text-amber-600">
                                Remaining Balance ({pctPrincipalLeft.toFixed(1)}%): {formatINR(inspectedRow?.closingPos)}
                            </span>
                        </div>
                        <div className="progress-track">
                            <div
                                className="progress-fill-paid"
                                style={{ width: `${pctPrincipalPaid}%` }}
                                title={`Principal Paid: ${formatINR(inspectedRow?.cumulativePrincipal)}`}
                            />
                            <div
                                className="progress-fill-left"
                                style={{ width: `${pctPrincipalLeft}%` }}
                                title={`Principal Left: ${formatINR(inspectedRow?.closingPos)}`}
                            />
                        </div>
                    </div>

                    {/* Progress Metrics at Selected Month */}
                    <div className="inspect-metrics-row mb-4">
                        <div className="inspect-item">
                            <span className="inspect-title">Remaining Loan (POS)</span>
                            <strong className="text-blue-600">{formatINR(inspectedRow?.closingPos)}</strong>
                        </div>
                        <div className="inspect-item">
                            <span className="inspect-title">Principal Paid</span>
                            <strong className="text-emerald-600">{formatINR(inspectedRow?.cumulativePrincipal)}</strong>
                        </div>
                        <div className="inspect-item">
                            <span className="inspect-title">Interest Paid</span>
                            <strong className="text-amber-600">{formatINR(inspectedRow?.cumulativeInterest)}</strong>
                        </div>
                    </div>

                    {/* EXPORT ACTION BUTTONS */}
                    <div className="export-action-btns">
                        <button
                            type="button"
                            className="btn-export-excel"
                            onClick={handleExportExcel}
                            title="Download complete schedule to Microsoft Excel"
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
                            onClick={handleExportPdf}
                            title="Download complete schedule to PDF"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download PDF Schedule
                        </button>
                    </div>
                </div>
            </div>

            {/* ========================================================
                SIMPLIFIED REPAYMENT SCHEDULE TABLE (YEARLY & MONTHLY TABS)
               ======================================================== */}
            <div className="card rsg-schedule-card mt-5">
                <div className="card-header-flex">
                    <div>
                        <h2>Loan Amortization Schedule</h2>
                        <p className="card-desc">
                            View year-by-year debt reduction summary or examine the full month-by-month payment breakdown.
                        </p>
                    </div>

                    {/* TABS: YEARLY SUMMARY VS MONTHLY BREAKDOWN */}
                    <div className="table-tabs-container">
                        <div className="table-tabs">
                            <button
                                type="button"
                                className={`tab-pill ${tableTab === 'yearly' ? 'active' : ''}`}
                                onClick={() => setTableTab('yearly')}
                            >
                                📅 Yearly Summary ({yearlySummary.length} Years)
                            </button>
                            <button
                                type="button"
                                className={`tab-pill ${tableTab === 'monthly' ? 'active' : ''}`}
                                onClick={() => setTableTab('monthly')}
                            >
                                📋 Monthly Breakdown ({scheduleData.rows.length} Months)
                            </button>
                        </div>
                    </div>
                </div>

                {/* MONTHLY FILTER (WHEN IN MONTHLY TAB) */}
                {tableTab === 'monthly' && (
                    <div className="monthly-filter-bar mb-3">
                        <label className="text-xs font-semibold text-gray-500">Filter Year:</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="form-control select-year-filter"
                        >
                            <option value="all">Show All {scheduleData.rows.length} Months</option>
                            {yearlySummary.map((y) => (
                                <option key={y.yearNum} value={y.yearNum}>
                                    Year {y.yearNum} ({y.period})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* VIEW 1: YEARLY SUMMARY (HIGH LEVEL, EASY TO UNDERSTAND) */}
                {tableTab === 'yearly' && (
                    <div className="table-responsive">
                        <table className="rsg-table">
                            <thead>
                                <tr>
                                    <th>Year #</th>
                                    <th>Period</th>
                                    <th>Opening Balance (₹)</th>
                                    <th>EMI Paid (₹)</th>
                                    <th>Principal Paid (₹)</th>
                                    <th>Interest Paid (₹)</th>
                                    <th>Closing Balance (₹)</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {yearlySummary.map((yr) => (
                                    <tr key={yr.yearNum}>
                                        <td className="font-bold">Year {yr.yearNum}</td>
                                        <td className="font-semibold text-gray-600">{yr.period}</td>
                                        <td>{formatINR(yr.openingPos)}</td>
                                        <td className="font-bold text-gray-800">{formatINR(yr.emiTotal)}</td>
                                        <td className="text-emerald-600 font-semibold">{formatINR(yr.principalTotal)}</td>
                                        <td className="text-amber-600 font-semibold">{formatINR(yr.interestTotal)}</td>
                                        <td className="font-bold text-blue-600">{formatINR(yr.closingPos)}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn-view-year-months"
                                                onClick={() => {
                                                    setSelectedYear(String(yr.yearNum));
                                                    setTableTab('monthly');
                                                }}
                                            >
                                                View Months →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="2" className="font-bold">Total Loan Term</td>
                                    <td>-</td>
                                    <td className="font-bold">{formatINR(scheduleData.totalAmountPayable)}</td>
                                    <td className="font-bold text-emerald-600">{formatINR(scheduleData.principal)}</td>
                                    <td className="font-bold text-amber-600">{formatINR(scheduleData.totalInterestPayable)}</td>
                                    <td className="font-bold text-blue-600">₹0</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                {/* VIEW 2: MONTHLY BREAKDOWN */}
                {tableTab === 'monthly' && (
                    <div className="table-responsive">
                        <table className="rsg-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Payment Date</th>
                                    <th>Opening POS (₹)</th>
                                    <th>EMI (₹)</th>
                                    <th>Principal (₹)</th>
                                    <th>Interest (₹)</th>
                                    <th>Closing POS (₹)</th>
                                    <th>Cumul. Principal</th>
                                    <th>Cumul. Interest</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedMonthlyRows.map((row) => (
                                    <tr
                                        key={row.month}
                                        className={row.month === inspectMonth ? 'row-inspected' : ''}
                                    >
                                        <td className="row-num">{row.month}</td>
                                        <td className="font-semibold">{row.dateLabel}</td>
                                        <td>{formatINR(row.openingPos)}</td>
                                        <td className="font-bold text-gray-800">{formatINR(row.emi)}</td>
                                        <td className="text-emerald-600 font-semibold">{formatINR(row.principal)}</td>
                                        <td className="text-amber-600 font-semibold">{formatINR(row.interest)}</td>
                                        <td className="font-bold text-blue-600">{formatINR(row.closingPos)}</td>
                                        <td className="text-gray-500 text-xs">{formatINR(row.cumulativePrincipal)}</td>
                                        <td className="text-gray-500 text-xs">{formatINR(row.cumulativeInterest)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="font-bold">Total Amortization Sums</td>
                                    <td className="font-bold">{formatINR(scheduleData.totalAmountPayable)}</td>
                                    <td className="font-bold text-emerald-600">{formatINR(scheduleData.principal)}</td>
                                    <td className="font-bold text-amber-600">{formatINR(scheduleData.totalInterestPayable)}</td>
                                    <td className="font-bold text-blue-600">₹0</td>
                                    <td colSpan="2"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepaymentScheduleGenerator;
