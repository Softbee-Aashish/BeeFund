/**
 * Credit Brain Engine: Auto-Spreading, Ratio Master, Benchmarking & Stress Testing
 * Institutional Underwriting Standard Chart of Accounts (SCoA) & Risk Logic
 */

// Standard Chart of Accounts (SCoA) Template & Multi-Year Financial Spreading Model
export const INITIAL_FINANCIAL_SPREADING = {
    // Multi-Year P&L and Balance Sheet (Figures in ₹ Lakhs for precision)
    years: ['FY23 (Audited)', 'FY24 (Audited)', 'FY25 (Audited)', 'FY26 (Projected)'],
    pnl: [
        { id: 'revenue', label: 'Gross Revenue from Operations', values: [2480.50, 2890.00, 3249.20, 3950.00], editable: true, category: 'topline' },
        { id: 'other_income', label: 'Other Operating Income', values: [18.20, 24.50, 31.80, 35.00], editable: true, category: 'topline' },
        { id: 'cogs', label: 'Cost of Goods Sold (Raw Materials & Direct Spares)', values: [1562.70, 1820.70, 2014.50, 2410.00], editable: true, category: 'expense' },
        { id: 'power_fuel', label: 'Power, Fuel & Utilities', values: [148.80, 173.40, 194.90, 237.00], editable: true, category: 'expense' },
        { id: 'employee_cost', label: 'Employee Salaries & Wages', values: [223.20, 260.10, 292.40, 355.50], editable: true, category: 'expense' },
        { id: 'admin_selling_exp', label: 'Administrative, Selling & General Expenses', values: [198.40, 231.20, 259.90, 316.00], editable: true, category: 'expense' },
        { id: 'ebitda', label: 'EBITDA (Operating Profit)', values: [365.60, 429.10, 519.30, 666.50], calculated: true, category: 'profit' },
        { id: 'ebitda_margin', label: 'EBITDA Margin (%)', values: [14.74, 14.85, 15.98, 16.87], calculated: true, unit: '%', category: 'ratio' },
        { id: 'depreciation', label: 'Depreciation & Amortization', values: [62.00, 72.50, 81.20, 115.00], editable: true, category: 'non_cash' },
        { id: 'ebit', label: 'EBIT (Operating Earnings)', values: [303.60, 356.60, 438.10, 551.50], calculated: true, category: 'profit' },
        { id: 'interest_expense', label: 'Interest & Finance Charges (Term Loan + WC)', values: [98.50, 112.00, 128.40, 185.00], editable: true, category: 'finance' },
        { id: 'pbt', label: 'Profit Before Tax (PBT)', values: [205.10, 244.60, 309.70, 366.50], calculated: true, category: 'profit' },
        { id: 'tax_provision', label: 'Income Tax Provision (25%)', values: [51.28, 61.15, 77.43, 91.63], calculated: true, category: 'tax' },
        { id: 'pat', label: 'Profit After Tax (PAT / Net Profit)', values: [153.82, 183.45, 232.27, 274.87], calculated: true, category: 'net_profit' },
        { id: 'pat_margin', label: 'PAT Margin (%)', values: [6.20, 6.35, 7.15, 6.96], calculated: true, unit: '%', category: 'ratio' }
    ],
    balanceSheet: [
        { id: 'tangible_net_worth', label: 'Tangible Net Worth (Paid-up Capital + Reserves)', values: [820.00, 1003.45, 1235.72, 1510.59], editable: true, category: 'equity' },
        { id: 'subordinated_debt', label: 'Quasi-Equity / Subordinated Unsecured Loans', values: [120.00, 120.00, 120.00, 150.00], editable: true, category: 'equity' },
        { id: 'adjusted_tnw', label: 'Adjusted Tangible Net Worth (ATNW)', values: [940.00, 1123.45, 1355.72, 1660.59], calculated: true, category: 'equity' },
        { id: 'term_liabilities', label: 'Long-Term Borrowings / Term Loans', values: [680.00, 750.00, 920.00, 1850.00], editable: true, category: 'liability' },
        { id: 'short_term_borrowings', label: 'Short-Term Bank Borrowings (OD/CC/WC)', values: [420.00, 480.00, 560.00, 750.00], editable: true, category: 'liability' },
        { id: 'trade_payables', label: 'Trade Payables / Sundry Creditors', values: [290.00, 335.00, 385.00, 460.00], editable: true, category: 'liability' },
        { id: 'other_current_liabilities', label: 'Other Current Liabilities & Provisions', values: [115.00, 132.00, 154.00, 180.00], editable: true, category: 'liability' },
        { id: 'total_outside_liabilities', label: 'Total Outside Liabilities (TOL)', values: [1505.00, 1697.00, 2019.00, 3240.00], calculated: true, category: 'liability' },
        { id: 'total_current_liabilities', label: 'Total Current Liabilities (TCL)', values: [825.00, 947.00, 1099.00, 1390.00], calculated: true, category: 'liability' },
        { id: 'gross_fixed_assets', label: 'Gross Fixed Assets (Plant & Machinery, Land)', values: [1150.00, 1380.00, 1690.00, 2850.00], editable: true, category: 'asset' },
        { id: 'accumulated_depreciation', label: 'Less: Accumulated Depreciation', values: [180.00, 252.50, 333.70, 448.70], editable: true, category: 'asset' },
        { id: 'net_fixed_assets', label: 'Net Fixed Assets', values: [970.00, 1127.50, 1356.30, 2401.30], calculated: true, category: 'asset' },
        { id: 'inventories', label: 'Inventories (Raw Materials, WIP, Finished Goods)', values: [410.00, 485.00, 565.00, 710.00], editable: true, category: 'asset' },
        { id: 'trade_receivables', label: 'Trade Receivables / Sundry Debtors', values: [580.00, 675.00, 780.00, 960.00], editable: true, category: 'asset' },
        { id: 'cash_bank_balances', label: 'Cash & Bank Balances / Liquid Investments', values: [95.00, 118.00, 142.00, 190.00], editable: true, category: 'asset' },
        { id: 'other_current_assets', label: 'Other Current Assets & Advances', values: [145.00, 170.00, 195.00, 240.00], editable: true, category: 'asset' },
        { id: 'total_current_assets', label: 'Total Current Assets (TCA)', values: [1230.00, 1448.00, 1682.00, 2100.00], calculated: true, category: 'asset' }
    ]
};

// 12-Month Banking Data Spreading Aggregates (Truth Serum)
export const BANKING_12M_SPREADING = {
    accounts: [
        { bankName: 'State Bank of India', accNumber: '...8849', accType: 'Current Account', shareOfBanking: '65%' },
        { bankName: 'HDFC Bank Ltd', accNumber: '...3092', accType: 'Current Account', shareOfBanking: '35%' }
    ],
    months: ['Apr-24', 'May-24', 'Jun-24', 'Jul-24', 'Aug-24', 'Sep-24', 'Oct-24', 'Nov-24', 'Dec-24', 'Jan-25', 'Feb-25', 'Mar-25'],
    credits: [248.5, 265.0, 252.3, 278.9, 290.4, 284.1, 310.8, 305.2, 298.6, 320.4, 315.8, 342.1], // Total ₹3,512.1 L = ₹35.12 Cr
    debits: [240.1, 258.4, 249.0, 271.2, 282.0, 279.5, 302.1, 299.8, 291.0, 312.5, 308.2, 334.6],  // Total ₹3,428.4 L
    abb: [98.4, 105.2, 102.1, 112.5, 118.0, 114.2, 125.6, 122.8, 120.4, 128.5, 124.9, 138.2],      // Avg Daily Balance ₹117.6 L
    amb: [102.0, 108.5, 106.0, 116.2, 121.5, 118.0, 129.0, 126.5, 124.0, 132.0, 128.5, 142.0],
    inwardBounces: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Clean 0 inward returns
    outwardBounces: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // 1 technical outward bounce in Sep-24 (rectified)
    cashDepositsTotal: 42.50, // ₹42.50 Lakhs (1.2% of total turnover - Healthy, < 10% limit)
    singleDayCashHigh: 4.80,  // Max single day cash ₹4.80L (< ₹10L threshold)
    summary: {
        totalCredits: 3512.10, // ₹35.12 Cr
        totalDebits: 3428.40,
        averageBankBalance: 117.58, // ₹1.18 Cr
        totalBounces: 1,
        cashDepositPercentage: 1.21,
        bankTurnoverVsGSTRatio: 1.08 // Bank / GST = ₹35.12 Cr / ₹32.49 Cr = 1.08 (Healthy, cash/non-GST receipts within limit)
    }
};

// 12-Month GST Reconciliation & Spreading Matrix
export const GST_12M_SPREADING = {
    gstin: '07AAEPK8812M1Z5',
    legalName: 'Apex Precision Engineering LLP',
    filingStatus: '100% On-Time (12/12 Filed Before Due Date)',
    months: ['Apr-24', 'May-24', 'Jun-24', 'Jul-24', 'Aug-24', 'Sep-24', 'Oct-24', 'Nov-24', 'Dec-24', 'Jan-25', 'Feb-25', 'Mar-25'],
    gstr1Sales: [230.5, 245.0, 238.2, 260.4, 272.1, 265.8, 288.4, 282.0, 275.5, 295.2, 290.1, 306.0], // Total ₹3,249.2 L = ₹32.49 Cr
    gstr3bTaxable: [230.5, 245.0, 238.2, 260.4, 272.1, 265.8, 288.4, 282.0, 275.5, 295.2, 290.1, 306.0],
    gstr2aPurchases: [142.1, 151.2, 146.8, 160.5, 168.0, 164.2, 178.0, 174.5, 170.0, 182.4, 179.0, 189.5],
    gstr3bItcClaimed: [25.58, 27.22, 26.42, 28.89, 30.24, 29.56, 32.04, 31.41, 30.60, 32.83, 32.22, 34.11],
    gstr2aItcAvailable: [25.58, 27.22, 26.42, 28.89, 30.24, 29.56, 32.04, 31.41, 30.60, 32.83, 32.22, 34.11],
    taxPaidCash: [15.91, 16.88, 16.46, 17.98, 18.74, 18.28, 19.87, 19.35, 18.99, 20.31, 19.98, 20.97],
    summary: {
        totalGSTR1Sales: 3249.20, // ₹32.49 Cr
        totalGSTR3BSales: 3249.20,
        gstr1Vs3bVariancePct: 0.0, // 0.0% Exact Match
        totalItcClaimed: 359.18,
        totalItcAvailable2A: 359.18,
        itcMismatchPct: 0.0, // 0% Mismatch (< 5% Threshold)
        turnoverGrowthYoY: 12.42 // +12.42%
    }
};

// Industry Benchmark Master Table by NIC Code
export const INDUSTRY_BENCHMARKS = {
    '28195': {
        nicCode: '28195',
        industryName: 'Manufacture of Precision Machine Tools & Industrial Components',
        sector: 'Light Engineering & Manufacturing',
        benchmarkEbitdaMargin: { min: 11.5, avg: 13.2, max: 16.5 },
        benchmarkPatMargin: { min: 4.5, avg: 5.8, max: 8.0 },
        benchmarkDSCR: { min: 1.33, avg: 1.55, max: 2.20 },
        benchmarkTOL_TNW: { min: 1.5, avg: 2.4, max: 3.5 },
        benchmarkCurrentRatio: { min: 1.25, avg: 1.42, max: 1.80 },
        benchmarkDebtorDays: { min: 45, avg: 68, max: 90 },
        benchmarkInventoryDays: { min: 60, avg: 85, max: 120 },
        benchmarkCreditorDays: { min: 30, avg: 52, max: 75 },
        industryCagr3Y: 9.8
    }
};

// Ratio Master Table with Formulas, Current Figures & Mathematical Breakdown
export const RATIO_MASTER = [
    {
        id: 'dscr',
        name: 'Debt Service Coverage Ratio (DSCR)',
        category: 'TERM_LOAN',
        formulaText: '(PAT + Depreciation + Interest on Term Loan) / (Interest on TL + Principal Repayment)',
        value: 2.05,
        historicalValue: 1.84,
        unit: 'x',
        policyMin: 1.33,
        industryAvg: 1.55,
        status: 'PASS',
        trend: 'UP',
        numerator: { label: 'Cash Flow Available for Debt Service (CFADS)', value: '₹441.87 Lakhs', details: 'PAT (₹232.27L) + Depr (₹81.20L) + TL Interest (₹128.40L)' },
        denominator: { label: 'Total Debt Service Obligations', value: '₹215.50 Lakhs', details: 'TL Interest (₹128.40L) + Annual Principal Repayment (₹87.10L)' },
        gaugeZones: { min: 0, redMax: 1.10, yellowMax: 1.33, greenMax: 3.00 },
        explanation: 'Strong cash buffer. The enterprise generates ₹2.05 of debt servicing cash for every ₹1.00 of term liability obligation.'
    },
    {
        id: 'iscr',
        name: 'Interest Service Coverage Ratio (ISCR)',
        category: 'TERM_LOAN',
        formulaText: 'EBIT / Total Interest Expense',
        value: 3.41,
        historicalValue: 3.18,
        unit: 'x',
        policyMin: 2.00,
        industryAvg: 2.80,
        status: 'PASS',
        trend: 'UP',
        numerator: { label: 'Operating Profit (EBIT)', value: '₹438.10 Lakhs', details: 'Revenue minus Operating Expenses & Depreciation' },
        denominator: { label: 'Total Interest Expense', value: '₹128.40 Lakhs', details: 'Term Loan Interest + Working Capital Interest' },
        gaugeZones: { min: 0, redMax: 1.50, yellowMax: 2.00, greenMax: 5.00 },
        explanation: 'Exceptional interest servicing capability. Operating earnings cover finance charges 3.41 times.'
    },
    {
        id: 'tol_tnw',
        name: 'Total Outside Liabilities to Net Worth (TOL/TNW)',
        category: 'LEVERAGE',
        formulaText: '(Total Outside Liabilities) / (Tangible Net Worth + Subordinated Unsecured Loans)',
        value: 1.49,
        historicalValue: 1.51,
        unit: 'x',
        policyMin: 3.00,
        isMaxCeiling: true,
        industryAvg: 2.40,
        status: 'PASS',
        trend: 'DOWN_GOOD',
        numerator: { label: 'Total Outside Liabilities (TOL)', value: '₹2,019.00 Lakhs', details: 'Term Loans (₹920L) + WC (₹560L) + Payables & Provisions (₹539L)' },
        denominator: { label: 'Adjusted Tangible Net Worth (ATNW)', value: '₹1,355.72 Lakhs', details: 'TNW (₹1,235.72L) + Subordinated Promoter Debt (₹120.00L)' },
        gaugeZones: { min: 0, greenMax: 2.50, yellowMax: 3.00, redMax: 5.00 },
        explanation: 'Low leverage profile. TOL/TNW of 1.49x is significantly superior to the institutional policy limit of 3.00x.'
    },
    {
        id: 'current_ratio',
        name: 'Current Ratio (Liquidity)',
        category: 'LIQUIDITY',
        formulaText: 'Total Current Assets / Total Current Liabilities',
        value: 1.53,
        historicalValue: 1.53,
        unit: 'x',
        policyMin: 1.33,
        industryAvg: 1.42,
        status: 'PASS',
        trend: 'STABLE',
        numerator: { label: 'Total Current Assets (TCA)', value: '₹1,682.00 Lakhs', details: 'Inventory (₹565L) + Receivables (₹780L) + Cash (₹142L) + Advances (₹195L)' },
        denominator: { label: 'Total Current Liabilities (TCL)', value: '₹1,099.00 Lakhs', details: 'Bank CC/OD (₹560L) + Sundry Creditors (₹385L) + Provisions (₹154L)' },
        gaugeZones: { min: 0, redMax: 1.10, yellowMax: 1.33, greenMax: 2.50 },
        explanation: 'Healthy liquidity cushion. Short-term assets exceed short-term obligations by 53%.'
    },
    {
        id: 'mpbf',
        name: 'MPBF (Tandon Committee Method II)',
        category: 'WORKING_CAPITAL',
        formulaText: '0.75 * [Current Assets - Current Liabilities (excluding bank borrowings)]',
        value: 857.25,
        unit: '₹ Lakhs',
        policyMin: 560.00,
        industryAvg: 750.00,
        status: 'PASS',
        trend: 'UP',
        numerator: { label: 'Working Capital Gap (WCG)', value: '₹1,143.00 Lakhs', details: 'Current Assets (₹1,682L) - Non-Bank Current Liabilities (₹539L)' },
        denominator: { label: 'Promoter Margin Contribution (25%)', value: '₹285.75 Lakhs', details: '25% of WCG funded through long-term net working capital' },
        gaugeZones: { min: 0, redMax: 400, yellowMax: 600, greenMax: 1200 },
        explanation: 'Assessed MPBF limit is ₹8.57 Cr against current bank facility of ₹5.60 Cr. No excess borrowing; room for limit enhancement.'
    },
    {
        id: 'wcc',
        name: 'Working Capital Cycle (WCC)',
        category: 'WORKING_CAPITAL',
        formulaText: 'Debtor Days (88) + Inventory Days (102) - Creditor Days (70)',
        value: 120,
        historicalValue: 124,
        unit: 'Days',
        policyMin: 135,
        isMaxCeiling: true,
        industryAvg: 101,
        status: 'PASS',
        trend: 'DOWN_GOOD',
        numerator: { label: 'Gross Operating Cycle', value: '190 Days', details: 'Debtor Days (88 Days) + Inventory Holding Period (102 Days)' },
        denominator: { label: 'Supplier Trade Credit Cushion', value: '70 Days', details: 'Average payable turnaround to raw material suppliers' },
        gaugeZones: { min: 0, greenMax: 110, yellowMax: 135, redMax: 180 },
        explanation: 'Operating cycle of 120 days is fully aligned with 120-day working capital sub-limits.'
    }
];

// Recalculator helper for "What-If" Sensitivity Stress Testing Engine
export const calculateStressScenario = ({ salesGrowthPct = 0, ebitdaMarginDelta = 0, interestRateDelta = 0, baseSpreading = INITIAL_FINANCIAL_SPREADING }) => {
    const baseRev = 3249.20; // FY25 Revenue in ₹ Lakhs
    const baseEbitdaMargin = 15.98;
    const baseTL = 920.00;
    const baseWC = 560.00;
    const baseInterestRate = 10.5; // Base 10.5% p.a.
    const baseDepr = 81.20;
    const basePrincipal = 87.10;
    const baseTNW = 1235.72;
    const baseTOL = 2019.00;

    // Stressed calculations
    const stressedSales = baseRev * (1 + salesGrowthPct / 100);
    const stressedMarginPct = Math.max(1, baseEbitdaMargin + ebitdaMarginDelta);
    const stressedEbitda = stressedSales * (stressedMarginPct / 100);
    const stressedEbit = Math.max(0, stressedEbitda - baseDepr);

    const stressedInterestRate = baseInterestRate + interestRateDelta;
    const totalBorrowings = baseTL + baseWC;
    const stressedInterestExpense = (totalBorrowings * (stressedInterestRate / 100));

    const stressedPbt = stressedEbit - stressedInterestExpense;
    const stressedTax = stressedPbt > 0 ? stressedPbt * 0.25 : 0;
    const stressedPat = stressedPbt - stressedTax;

    // Recalculated Ratios
    const stressedCFADS = stressedPat + baseDepr + (stressedInterestExpense * (baseTL / totalBorrowings));
    const stressedDebtService = (stressedInterestExpense * (baseTL / totalBorrowings)) + basePrincipal;
    const stressedDSCR = stressedDebtService > 0 ? Math.max(0, (stressedCFADS / stressedDebtService)) : 0;
    const stressedISCR = stressedInterestExpense > 0 ? Math.max(0, (stressedEbit / stressedInterestExpense)) : 0;
    const stressedTOL_TNW = (baseTOL + Math.max(0, -stressedPat)) / baseTNW;

    // Break-even and Margin of Safety
    const fixedCosts = baseDepr + stressedInterestExpense + 292.40 + 259.90; // Fixed salaries & admin
    const variableCostRatio = 1 - (stressedMarginPct / 100);
    const breakEvenSales = fixedCosts / (1 - variableCostRatio);
    const marginOfSafetyPct = stressedSales > breakEvenSales ? ((stressedSales - breakEvenSales) / stressedSales) * 100 : 0;

    // Generate 5-Year Cash Flow Waterfall projection under stressed scenario
    const waterfallProjection = [
        { year: 'Year 1', operatingCash: stressedEbitda, debtService: stressedDebtService, capex: 60.0, netSurplus: stressedEbitda - stressedDebtService - 60.0 },
        { year: 'Year 2', operatingCash: stressedEbitda * 1.06, debtService: stressedDebtService * 0.95, capex: 40.0, netSurplus: (stressedEbitda * 1.06) - (stressedDebtService * 0.95) - 40.0 },
        { year: 'Year 3', operatingCash: stressedEbitda * 1.12, debtService: stressedDebtService * 0.88, capex: 30.0, netSurplus: (stressedEbitda * 1.12) - (stressedDebtService * 0.88) - 30.0 },
        { year: 'Year 4', operatingCash: stressedEbitda * 1.18, debtService: stressedDebtService * 0.75, capex: 25.0, netSurplus: (stressedEbitda * 1.18) - (stressedDebtService * 0.75) - 25.0 },
        { year: 'Year 5', operatingCash: stressedEbitda * 1.25, debtService: stressedDebtService * 0.60, capex: 20.0, netSurplus: (stressedEbitda * 1.25) - (stressedDebtService * 0.60) - 20.0 }
    ];

    // Policy Rule Warnings
    const warnings = [];
    if (stressedDSCR < 1.33) {
        warnings.push({
            severity: 'CRITICAL',
            title: 'DSCR Covenant Breach',
            text: `Under this stress condition, DSCR falls to ${stressedDSCR.toFixed(2)}x (breaching policy minimum 1.33x). Recommendation: Increase promoter margin by ₹50L or stipulate 20% additional collateral security.`
        });
    }
    if (stressedISCR < 2.00) {
        warnings.push({
            severity: 'WARNING',
            title: 'ISCR Margin Compression',
            text: `Interest coverage drops to ${stressedISCR.toFixed(2)}x (policy min: 2.00x). Sensitivity to rate hike is elevated.`
        });
    }
    if (marginOfSafetyPct < 20) {
        warnings.push({
            severity: 'CRITICAL',
            title: 'High Operating Risk',
            text: `Margin of safety drops to ${marginOfSafetyPct.toFixed(1)}% (below 20% safe zone). Enterprise is vulnerable to fixed cost overheads.`
        });
    }

    return {
        stressedSales,
        stressedEbitda,
        stressedMarginPct,
        stressedEbit,
        stressedInterestExpense,
        stressedPat,
        stressedDSCR,
        stressedISCR,
        stressedTOL_TNW,
        breakEvenSales,
        marginOfSafetyPct,
        waterfallProjection,
        warnings
    };
};
