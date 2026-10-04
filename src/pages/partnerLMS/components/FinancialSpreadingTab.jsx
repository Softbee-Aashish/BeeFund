import React, { useState, useMemo } from 'react';
import {
    INITIAL_FINANCIAL_SPREADING,
    INITIAL_SALARIED_SPREADING,
    BANKING_12M_SPREADING,
    SALARIED_BANKING_12M,
    GST_12M_SPREADING,
    RATIO_MASTER,
    INDUSTRY_BENCHMARKS
} from '../creditBrainData';

const FinancialSpreadingTab = ({ caseData, onSelectRatioFormula, onOpenTraceability }) => {
    // Detect if this is a salaried profile case
    const isSalariedInitial = useMemo(() => {
        if (!caseData) return false;
        const eType = (caseData.entityType || caseData.constitution || '').toUpperCase();
        const niche = (caseData.borrowerNiche || '').toUpperCase();
        const lProduct = (caseData.loanProduct || caseData.loanType || '').toUpperCase();
        return (
            eType === 'INDIVIDUAL_SALARIED' ||
            niche === 'SALARIED' ||
            lProduct.includes('SALARIED') ||
            caseData.salariedDetails != null ||
            (eType === 'INDIVIDUAL' && (lProduct.includes('HL') || lProduct.includes('HOME')))
        );
    }, [caseData]);

    const [profileMode, setProfileMode] = useState(isSalariedInitial ? 'salaried' : 'corporate');
    const [subTab, setSubTab] = useState('pnl_bs'); // 'pnl_bs' | 'truth_serum' | 'ratios' | 'foir_sizing' | 'ltv_matrix'
    const [selectedDocModal, setSelectedDocModal] = useState(null);
    const [activeFormulaDoc, setActiveFormulaDoc] = useState(null);

    // ==========================================
    // Corporate SCoA Spreading States
    // ==========================================
    const [pnlData, setPnlData] = useState(INITIAL_FINANCIAL_SPREADING.pnl);
    const [bsData, setBsData] = useState(INITIAL_FINANCIAL_SPREADING.balanceSheet);
    const [years] = useState(INITIAL_FINANCIAL_SPREADING.years);

    // Inline edit handler for corporate financial spreading grid (P&L and Balance Sheet)
    const handleCellChange = (section, rowId, yearIdx, newVal) => {
        const numVal = parseFloat(newVal) || 0;

        if (section === 'pnl') {
            setPnlData(prev => {
                const updated = prev.map(row => {
                    if (row.id === rowId) {
                        const nextValues = [...row.values];
                        nextValues[yearIdx] = numVal;
                        return { ...row, values: nextValues };
                    }
                    return row;
                });

                // Auto-recalculate EBITDA, EBIT, PBT, Tax, PAT
                const revRow = updated.find(r => r.id === 'revenue');
                const cogsRow = updated.find(r => r.id === 'cogs');
                const powerRow = updated.find(r => r.id === 'power_fuel');
                const empRow = updated.find(r => r.id === 'employee_cost');
                const adminRow = updated.find(r => r.id === 'admin_selling_exp');
                const deprRow = updated.find(r => r.id === 'depreciation');
                const intRow = updated.find(r => r.id === 'interest_expense');

                return updated.map(row => {
                    if (row.id === 'ebitda') {
                        const calculated = revRow.values.map((v, i) =>
                            parseFloat((v - (cogsRow.values[i] + powerRow.values[i] + empRow.values[i] + adminRow.values[i])).toFixed(2))
                        );
                        return { ...row, values: calculated };
                    }
                    if (row.id === 'ebitda_margin') {
                        const calculated = revRow.values.map((v, i) => {
                            const ebitda = revRow.values[i] - (cogsRow.values[i] + powerRow.values[i] + empRow.values[i] + adminRow.values[i]);
                            return v > 0 ? parseFloat(((ebitda / v) * 100).toFixed(2)) : 0;
                        });
                        return { ...row, values: calculated };
                    }
                    if (row.id === 'ebit') {
                        const calculated = revRow.values.map((v, i) => {
                            const ebitda = revRow.values[i] - (cogsRow.values[i] + powerRow.values[i] + empRow.values[i] + adminRow.values[i]);
                            return parseFloat((ebitda - deprRow.values[i]).toFixed(2));
                        });
                        return { ...row, values: calculated };
                    }
                    if (row.id === 'pbt') {
                        const calculated = revRow.values.map((v, i) => {
                            const ebitda = revRow.values[i] - (cogsRow.values[i] + powerRow.values[i] + empRow.values[i] + adminRow.values[i]);
                            const ebit = ebitda - deprRow.values[i];
                            return parseFloat((ebit - intRow.values[i]).toFixed(2));
                        });
                        return { ...row, values: calculated };
                    }
                    if (row.id === 'tax_provision') {
                        const calculated = revRow.values.map((v, i) => {
                            const ebitda = revRow.values[i] - (cogsRow.values[i] + powerRow.values[i] + empRow.values[i] + adminRow.values[i]);
                            const ebit = ebitda - deprRow.values[i];
                            const pbt = ebit - intRow.values[i];
                            return pbt > 0 ? parseFloat((pbt * 0.25).toFixed(2)) : 0;
                        });
                        return { ...row, values: calculated };
                    }
                    if (row.id === 'pat') {
                        const calculated = revRow.values.map((v, i) => {
                            const ebitda = revRow.values[i] - (cogsRow.values[i] + powerRow.values[i] + empRow.values[i] + adminRow.values[i]);
                            const ebit = ebitda - deprRow.values[i];
                            const pbt = ebit - intRow.values[i];
                            const tax = pbt > 0 ? pbt * 0.25 : 0;
                            return parseFloat((pbt - tax).toFixed(2));
                        });
                        return { ...row, values: calculated };
                    }
                    if (row.id === 'pat_margin') {
                        const calculated = revRow.values.map((v, i) => {
                            const ebitda = revRow.values[i] - (cogsRow.values[i] + powerRow.values[i] + empRow.values[i] + adminRow.values[i]);
                            const ebit = ebitda - deprRow.values[i];
                            const pbt = ebit - intRow.values[i];
                            const tax = pbt > 0 ? pbt * 0.25 : 0;
                            const pat = pbt - tax;
                            return v > 0 ? parseFloat(((pat / v) * 100).toFixed(2)) : 0;
                        });
                        return { ...row, values: calculated };
                    }
                    return row;
                });
            });
        } else if (section === 'bs') {
            setBsData(prev => {
                const updated = prev.map(row => {
                    if (row.id === rowId) {
                        const nextValues = [...row.values];
                        nextValues[yearIdx] = numVal;
                        return { ...row, values: nextValues };
                    }
                    return row;
                });

                // Auto-recalculate Balance Sheet totals & calculated fields
                const tnwRow = updated.find(r => r.id === 'tangible_net_worth');
                const subDebtRow = updated.find(r => r.id === 'subordinated_debt');
                const tlRow = updated.find(r => r.id === 'term_liabilities');
                const stbRow = updated.find(r => r.id === 'short_term_borrowings');
                const tpRow = updated.find(r => r.id === 'trade_payables');
                const oclRow = updated.find(r => r.id === 'other_current_liabilities');
                const gfaRow = updated.find(r => r.id === 'gross_fixed_assets');
                const accDepRow = updated.find(r => r.id === 'accumulated_depreciation');
                const invRow = updated.find(r => r.id === 'inventories');
                const recRow = updated.find(r => r.id === 'trade_receivables');
                const cashRow = updated.find(r => r.id === 'cash_bank_balances');
                const ocaRow = updated.find(r => r.id === 'other_current_assets');

                return updated.map(row => {
                    if (row.id === 'adjusted_tnw') {
                        const calculated = tnwRow.values.map((v, i) =>
                            parseFloat(((v || 0) + (subDebtRow?.values[i] || 0)).toFixed(2))
                        );
                        return { ...row, values: calculated };
                    }
                    if (row.id === 'total_outside_liabilities') {
                        const calculated = tlRow.values.map((v, i) =>
                            parseFloat(((v || 0) + (stbRow?.values[i] || 0) + (tpRow?.values[i] || 0) + (oclRow?.values[i] || 0)).toFixed(2))
                        );
                        return { ...row, values: calculated };
                    }
                    if (row.id === 'total_current_liabilities') {
                        const calculated = stbRow.values.map((v, i) =>
                            parseFloat(((v || 0) + (tpRow?.values[i] || 0) + (oclRow?.values[i] || 0)).toFixed(2))
                        );
                        return { ...row, values: calculated };
                    }
                    if (row.id === 'net_fixed_assets') {
                        const calculated = gfaRow.values.map((v, i) =>
                            parseFloat(((v || 0) - (accDepRow?.values[i] || 0)).toFixed(2))
                        );
                        return { ...row, values: calculated };
                    }
                    if (row.id === 'total_current_assets') {
                        const calculated = invRow.values.map((v, i) =>
                            parseFloat(((v || 0) + (recRow?.values[i] || 0) + (cashRow?.values[i] || 0) + (ocaRow?.values[i] || 0)).toFixed(2))
                        );
                        return { ...row, values: calculated };
                    }
                    return row;
                });
            });
        }
    };

    // ==========================================
    // Salaried Individual Underwriting States
    // ==========================================
    const [salYears] = useState(INITIAL_SALARIED_SPREADING.years);
    const [salaryGrid, setSalaryGrid] = useState(INITIAL_SALARIED_SPREADING.salaryGrid);
    const [obligations, setObligations] = useState(INITIAL_SALARIED_SPREADING.defaultObligations);

    const [loanParams, setLoanParams] = useState({
        propertyAgreementCostLakhs: 95.0,
        stampDutyRegLakhs: 6.5,
        valuerMarketValueLakhs: 105.0,
        requestedLoanLakhs: caseData?.loanAmountLakhs || 75.0,
        interestRatePct: 8.50,
        tenureYears: 20
    });

    // Salaried grid cell editor
    const handleSalariedCellChange = (rowId, yearIdx, newVal) => {
        const numVal = parseFloat(newVal) || 0;
        setSalaryGrid(prev => {
            const updated = prev.map(row => {
                if (row.id === rowId) {
                    const nextValues = [...row.values];
                    nextValues[yearIdx] = numVal;
                    return { ...row, values: nextValues };
                }
                return row;
            });

            const basicRow = updated.find(r => r.id === 'basic_pay');
            const hraRow = updated.find(r => r.id === 'hra');
            const specRow = updated.find(r => r.id === 'special_allowance');
            const varRow = updated.find(r => r.id === 'variable_pay');
            const pfRow = updated.find(r => r.id === 'pf_deduction');
            const ptRow = updated.find(r => r.id === 'prof_tax');
            const tdsRow = updated.find(r => r.id === 'tds_deduction');

            return updated.map(row => {
                if (row.id === 'gross_salary') {
                    const calculated = basicRow.values.map((v, i) =>
                        Math.round((v || 0) + (hraRow?.values[i] || 0) + (specRow?.values[i] || 0) + (varRow?.values[i] || 0))
                    );
                    return { ...row, values: calculated };
                }
                if (row.id === 'net_take_home') {
                    const calculated = basicRow.values.map((v, i) => {
                        const gross = (v || 0) + (hraRow?.values[i] || 0) + (specRow?.values[i] || 0) + (varRow?.values[i] || 0);
                        const ded = (pfRow?.values[i] || 0) + (ptRow?.values[i] || 0) + (tdsRow?.values[i] || 0);
                        return Math.round(gross - ded);
                    });
                    return { ...row, values: calculated };
                }
                if (row.id === 'annual_form16_taxable') {
                    const calculated = basicRow.values.map((v, i) => {
                        const gross = (v || 0) + (hraRow?.values[i] || 0) + (specRow?.values[i] || 0) + (varRow?.values[i] || 0);
                        return parseFloat(((gross * 12) / 100000).toFixed(2));
                    });
                    return { ...row, values: calculated };
                }
                return row;
            });
        });
    };

    // Obligations handlers
    const handleAddObligation = () => {
        const newOb = {
            id: `ob_${Date.now()}`,
            lender: 'HDFC Bank Ltd',
            loanType: 'Personal / Consumer Loan',
            emiAmount: 5000,
            tenureLeftMonths: 12,
            outstandingBalance: 60000
        };
        setObligations(prev => [...prev, newOb]);
    };

    const handleUpdateObligation = (id, field, value) => {
        setObligations(prev => prev.map(ob => {
            if (ob.id === id) {
                return { ...ob, [field]: field === 'emiAmount' || field === 'tenureLeftMonths' || field === 'outstandingBalance' ? parseFloat(value) || 0 : value };
            }
            return ob;
        }));
    };

    const handleDeleteObligation = (id) => {
        setObligations(prev => prev.filter(ob => ob.id !== id));
    };

    // Live FOIR and Loan Math Computations
    const latestNetTakeHome = useMemo(() => {
        const netRow = salaryGrid.find(r => r.id === 'net_take_home');
        return netRow ? netRow.values[2] : 155000; // FY25 latest
    }, [salaryGrid]);

    const totalExistingEMIs = useMemo(() => {
        return obligations.reduce((acc, ob) => acc + (ob.emiAmount || 0), 0);
    }, [obligations]);

    const calculatedProposedEMI = useMemo(() => {
        const principal = (loanParams.requestedLoanLakhs || 0) * 100000;
        const monthlyRate = (loanParams.interestRatePct || 8.5) / (12 * 100);
        const months = (loanParams.tenureYears || 20) * 12;

        if (principal <= 0 || monthlyRate <= 0 || months <= 0) return 0;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        return Math.round(emi);
    }, [loanParams]);

    const totalObligations = useMemo(() => {
        return totalExistingEMIs + calculatedProposedEMI;
    }, [totalExistingEMIs, calculatedProposedEMI]);

    const calculatedFOIR = useMemo(() => {
        if (!latestNetTakeHome || latestNetTakeHome <= 0) return 0;
        return parseFloat(((totalObligations / latestNetTakeHome) * 100).toFixed(2));
    }, [totalObligations, latestNetTakeHome]);

    const disposableSurplus = useMemo(() => {
        return Math.max(0, latestNetTakeHome - totalObligations);
    }, [latestNetTakeHome, totalObligations]);

    // Maximum permissible loan eligibility based on 65% FOIR limit
    const maxPermissibleEligibilityLakhs = useMemo(() => {
        const maxPermissibleTotalEMI = latestNetTakeHome * 0.65;
        const maxPermissibleNewEMI = Math.max(0, maxPermissibleTotalEMI - totalExistingEMIs);
        const monthlyRate = (loanParams.interestRatePct || 8.5) / (12 * 100);
        const months = (loanParams.tenureYears || 20) * 12;

        if (monthlyRate <= 0 || months <= 0 || maxPermissibleNewEMI <= 0) return 0;
        const maxPrincipal = (maxPermissibleNewEMI * (Math.pow(1 + monthlyRate, months) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, months));
        return parseFloat((maxPrincipal / 100000).toFixed(2));
    }, [latestNetTakeHome, totalExistingEMIs, loanParams.interestRatePct, loanParams.tenureYears]);

    // Property LTV Math
    const totalPropertyOutlay = useMemo(() => {
        return (loanParams.propertyAgreementCostLakhs || 0) + (loanParams.stampDutyRegLakhs || 0);
    }, [loanParams.propertyAgreementCostLakhs, loanParams.stampDutyRegLakhs]);

    const agreementLtvPct = useMemo(() => {
        if (!loanParams.propertyAgreementCostLakhs || loanParams.propertyAgreementCostLakhs <= 0) return 0;
        return parseFloat(((loanParams.requestedLoanLakhs / loanParams.propertyAgreementCostLakhs) * 100).toFixed(2));
    }, [loanParams.requestedLoanLakhs, loanParams.propertyAgreementCostLakhs]);

    const valuerLtvPct = useMemo(() => {
        if (!loanParams.valuerMarketValueLakhs || loanParams.valuerMarketValueLakhs <= 0) return 0;
        return parseFloat(((loanParams.requestedLoanLakhs / loanParams.valuerMarketValueLakhs) * 100).toFixed(2));
    }, [loanParams.requestedLoanLakhs, loanParams.valuerMarketValueLakhs]);

    const borrowerMarginMoney = useMemo(() => {
        return Math.max(0, totalPropertyOutlay - (loanParams.requestedLoanLakhs || 0));
    }, [totalPropertyOutlay, loanParams.requestedLoanLakhs]);

    const benchmarkData = INDUSTRY_BENCHMARKS['28195'];

    return (
        <div className="financial-spreading-root">
            {/* Top Profile Mode Switcher Pill */}
            <div className="profile-mode-selector-banner">
                <div className="profile-mode-info">
                    <span className={`badge-mode ${profileMode}`}>
                        {profileMode === 'salaried' ? 'Salaried Retail Underwriting' : 'Corporate Commercial Underwriting'}
                    </span>
                    <div>
                        <h4>
                            {profileMode === 'salaried'
                                ? `Salaried Individual Income & FOIR Assessment (${caseData?.enterpriseName || 'Applicant'})`
                                : `Corporate SCoA Spreading & Risk Engine (${caseData?.enterpriseName || 'Enterprise'})`}
                        </h4>
                        <p>
                            {profileMode === 'salaried'
                                ? 'Evaluates Multi-Year Form 16, Salary Slips, In-Hand Monthly Pay, Existing EMIs, FOIR %, and Property LTV.'
                                : 'Multi-year audited P&L, Balance Sheet, Banking & GST Cross-reconciliation with automated ratio benchmarking.'}
                        </p>
                    </div>
                </div>

                <div className="profile-mode-tabs">
                    <button
                        type="button"
                        className={`profile-mode-btn ${profileMode === 'salaried' ? 'active' : ''}`}
                        onClick={() => {
                            setProfileMode('salaried');
                            setSubTab('pnl_bs');
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Salaried HL/PL Model</span>
                    </button>
                    <button
                        type="button"
                        className={`profile-mode-btn ${profileMode === 'corporate' ? 'active' : ''}`}
                        onClick={() => {
                            setProfileMode('corporate');
                            setSubTab('pnl_bs');
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        <span>Corporate SCoA Model</span>
                    </button>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* SALARIED INDIVIDUAL UNDERWRITING ENGINE                                  */}
            {/* ========================================================================= */}
            {profileMode === 'salaried' && (
                <div className="salaried-mode-container">
                    {/* Top Salaried Hero KPIs Banner */}
                    <div className="spreading-trend-banner">
                        <div className="trend-banner-header">
                            <div>
                                <h4>3-Year Salary Compensation & Debt Service Capacity (FOIR Benchmark)</h4>
                                <span className="sub">Extracted via Form 16 Part B, 3-Month Payslips & 12-Month Salary Account Parser</span>
                            </div>
                            <span className="source-link-chip" onClick={() => onOpenTraceability && onOpenTraceability('FORM16_SALARY')}>
                                📄 Source: Form 16 Part A & B / Salary Slips
                            </span>
                        </div>

                        <div className="growth-metrics-row">
                            <div className="metric-chip">
                                <span className="lbl">Net Monthly In-Hand Salary</span>
                                <div className="val-row">
                                    <span className="val text-cyan">₹{latestNetTakeHome.toLocaleString('en-IN')}</span>
                                    <span className="trend-arrow up">↑</span>
                                </div>
                                <span className="note">+15.7% YoY Growth</span>
                            </div>

                            <div className="metric-chip">
                                <span className="lbl">Calculated FOIR (DTI)</span>
                                <div className="val-row">
                                    <span className={`val ${calculatedFOIR <= 65 ? 'text-green' : 'text-red'}`}>{calculatedFOIR}%</span>
                                    <span className={`badge-pass ${calculatedFOIR <= 65 ? 'pass' : 'fail'}`}>
                                        {calculatedFOIR <= 65 ? 'PASS' : 'BREACH'}
                                    </span>
                                </div>
                                <span className="note">Policy Limit: Max 65.0%</span>
                            </div>

                            <div className="metric-chip">
                                <span className="lbl">Max HL Eligibility (65% FOIR)</span>
                                <div className="val-row">
                                    <span className="val text-gold">₹{maxPermissibleEligibilityLakhs} Lakhs</span>
                                    <span className="trend-arrow up">↑</span>
                                </div>
                                <span className="note">Requested: ₹{loanParams.requestedLoanLakhs} Lakhs</span>
                            </div>

                            <div className="metric-chip">
                                <span className="lbl">LTV Ratio (Agreement)</span>
                                <div className="val-row">
                                    <span className="val text-green">{agreementLtvPct}%</span>
                                    <span className="badge-pass">PASS</span>
                                </div>
                                <span className="note">RBI Cap: ≤ 80%</span>
                            </div>
                        </div>
                    </div>

                    {/* Sub-Tabs for Salaried Mode */}
                    <div className="spreading-nav-strip">
                        <button
                            type="button"
                            className={`spreading-tab-btn ${subTab === 'pnl_bs' ? 'active' : ''}`}
                            onClick={() => setSubTab('pnl_bs')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                                <line x1="9" y1="21" x2="9" y2="9"></line>
                            </svg>
                            <span>Compensation & Form 16 Grid (Editable)</span>
                        </button>

                        <button
                            type="button"
                            className={`spreading-tab-btn ${subTab === 'foir_sizing' ? 'active' : ''}`}
                            onClick={() => setSubTab('foir_sizing')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                            <span>FOIR & Loan Sizing Calculator</span>
                        </button>

                        <button
                            type="button"
                            className={`spreading-tab-btn ${subTab === 'ltv_matrix' ? 'active' : ''}`}
                            onClick={() => setSubTab('ltv_matrix')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <span>Property Valuation & LTV Assessment</span>
                        </button>

                        <button
                            type="button"
                            className={`spreading-tab-btn ${subTab === 'truth_serum' ? 'active' : ''}`}
                            onClick={() => setSubTab('truth_serum')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                            <span>Salary Account Truth Serum (12M Credits)</span>
                        </button>
                    </div>

                    {/* SALARIED SUBTAB 1: 3-Year Salary Compensation Spreading Table */}
                    {subTab === 'pnl_bs' && (
                        <div className="spreading-view-pane">
                            <div className="financial-grid-card">
                                <div className="grid-card-header">
                                    <h3>Salaried Compensation & Tax Breakdown (Multi-Year Model)</h3>
                                    <span className="unit-pill">Values in ₹ (Monthly / Annual)</span>
                                </div>

                                <div className="table-responsive-wrapper">
                                    <table className="scoa-table">
                                        <thead>
                                            <tr>
                                                <th className="head-col">SALARY & DEDUCTION HEAD</th>
                                                {salYears.map((yr, idx) => (
                                                    <th key={yr} className={`yr-col ${idx === 3 ? 'projected' : ''}`}>
                                                        {yr}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {salaryGrid.map((row) => (
                                                <tr key={row.id} className={`scoa-row ${row.category} ${row.calculated ? 'calc-row' : ''}`}>
                                                    <td className="row-label">
                                                        <span>{row.label}</span>
                                                        {row.calculated && <span className="auto-tag">AUTO</span>}
                                                    </td>
                                                    {row.values.map((val, yIdx) => (
                                                        <td key={yIdx} className={`val-cell ${yIdx === 3 ? 'projected-cell' : ''}`}>
                                                            {row.editable ? (
                                                                <input
                                                                    type="number"
                                                                    step="500"
                                                                    className="cell-input"
                                                                    value={val}
                                                                    onChange={(e) => handleSalariedCellChange(row.id, yIdx, e.target.value)}
                                                                />
                                                            ) : (
                                                                <span className={`cell-static ${row.category}`}>
                                                                    {row.unit === 'Lakhs'
                                                                        ? `₹${val.toFixed(2)} Lakhs`
                                                                        : `₹${val.toLocaleString('en-IN')}`}
                                                                </span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SALARIED SUBTAB 2: FOIR & Loan Sizing Calculator */}
                    {subTab === 'foir_sizing' && (
                        <div className="spreading-view-pane">
                            <div className="salaried-underwriting-grid">
                                {/* Left Side: FOIR Calculation & Proposed Loan Controls */}
                                <div className="foir-card">
                                    <div className="foir-card-header">
                                        <h3>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <path d="M12 6v6l4 2"></path>
                                            </svg>
                                            Proposed Loan Facility & FOIR Simulator
                                        </h3>
                                        <span className={`foir-status-badge ${calculatedFOIR <= 60 ? 'pass' : calculatedFOIR <= 65 ? 'warning' : 'danger'}`}>
                                            {calculatedFOIR <= 60 ? '✓ SAFE FOIR (<60%)' : calculatedFOIR <= 65 ? '⚠ MODERATE (60-65%)' : '✖ HIGH RISK (>65%)'}
                                        </span>
                                    </div>

                                    <div className="foir-kpis-bar">
                                        <div className="foir-kpi-item">
                                            <span className="lbl">Net Monthly Income</span>
                                            <span className="val text-cyan">₹{latestNetTakeHome.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="foir-kpi-item">
                                            <span className="lbl">Proposed EMI</span>
                                            <span className="val text-gold">₹{calculatedProposedEMI.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="foir-kpi-item">
                                            <span className="lbl">Net Monthly Surplus</span>
                                            <span className="val text-green">₹{disposableSurplus.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    {/* Controls Grid */}
                                    <div className="foir-controls-grid">
                                        <div className="foir-control-group">
                                            <label>Requested Loan (₹ Lakhs)</label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={loanParams.requestedLoanLakhs}
                                                onChange={(e) => setLoanParams(p => ({ ...p, requestedLoanLakhs: parseFloat(e.target.value) || 0 }))}
                                            />
                                        </div>

                                        <div className="foir-control-group">
                                            <label>Interest Rate (% p.a.)</label>
                                            <input
                                                type="number"
                                                step="0.05"
                                                value={loanParams.interestRatePct}
                                                onChange={(e) => setLoanParams(p => ({ ...p, interestRatePct: parseFloat(e.target.value) || 0 }))}
                                            />
                                        </div>

                                        <div className="foir-control-group">
                                            <label>Tenure (Years)</label>
                                            <input
                                                type="number"
                                                step="1"
                                                max="30"
                                                min="1"
                                                value={loanParams.tenureYears}
                                                onChange={(e) => setLoanParams(p => ({ ...p, tenureYears: parseInt(e.target.value) || 20 }))}
                                            />
                                        </div>
                                    </div>

                                    {/* FOIR Breakdown Progress Bar */}
                                    <div className="foir-progress-wrap" style={{ marginTop: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                                            <span style={{ color: 'var(--lms-text-secondary)', fontWeight: 700 }}>Total Debt Obligation Load (FOIR)</span>
                                            <strong style={{ color: calculatedFOIR <= 65 ? 'var(--lms-green)' : 'var(--lms-red)' }}>
                                                {calculatedFOIR}% of In-Hand Salary
                                            </strong>
                                        </div>
                                        <div style={{ width: '100%', height: '10px', background: 'var(--lms-bg-surface)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                                            <div
                                                style={{
                                                    width: `${Math.min(100, (totalExistingEMIs / latestNetTakeHome) * 100)}%`,
                                                    background: 'var(--lms-gold)',
                                                    transition: 'width 0.3s ease'
                                                }}
                                                title={`Existing EMIs: ₹${totalExistingEMIs.toLocaleString()}`}
                                            ></div>
                                            <div
                                                style={{
                                                    width: `${Math.min(100 - ((totalExistingEMIs / latestNetTakeHome) * 100), (calculatedProposedEMI / latestNetTakeHome) * 100)}%`,
                                                    background: calculatedFOIR <= 65 ? 'var(--lms-cyan)' : 'var(--lms-red)',
                                                    transition: 'width 0.3s ease'
                                                }}
                                                title={`Proposed Home Loan EMI: ₹${calculatedProposedEMI.toLocaleString()}`}
                                            ></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--lms-text-muted)', marginTop: '4px' }}>
                                            <span>■ Existing EMIs (₹{totalExistingEMIs.toLocaleString()})</span>
                                            <span>■ Proposed Home Loan (₹{calculatedProposedEMI.toLocaleString()})</span>
                                            <span>Policy Limit: 65%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Existing Obligations List */}
                                <div className="foir-card">
                                    <div className="foir-card-header">
                                        <h3>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                                <line x1="1" y1="10" x2="23" y2="10"></line>
                                            </svg>
                                            Existing Ongoing Loan Obligations (CIR Verified)
                                        </h3>
                                        <span className="unit-pill">Total: ₹{totalExistingEMIs.toLocaleString('en-IN')}/mo</span>
                                    </div>

                                    <div className="obligations-table-wrapper">
                                        <table className="obligations-table">
                                            <thead>
                                                <tr>
                                                    <th>Lender</th>
                                                    <th>Loan Facility</th>
                                                    <th>Monthly EMI (₹)</th>
                                                    <th>Tenure Left</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {obligations.map((ob) => (
                                                    <tr key={ob.id}>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--lms-text-primary)', fontSize: '0.78rem' }}
                                                                value={ob.lender}
                                                                onChange={(e) => handleUpdateObligation(ob.id, 'lender', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--lms-text-secondary)', fontSize: '0.78rem' }}
                                                                value={ob.loanType}
                                                                onChange={(e) => handleUpdateObligation(ob.id, 'loanType', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                step="500"
                                                                style={{ width: '90px', textAlign: 'right', background: 'var(--lms-bg-card)', border: '1px solid var(--lms-border)', borderRadius: '4px', color: 'var(--lms-text-primary)', padding: '2px 4px', fontSize: '0.78rem' }}
                                                                value={ob.emiAmount}
                                                                onChange={(e) => handleUpdateObligation(ob.id, 'emiAmount', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                style={{ width: '50px', textAlign: 'center', background: 'var(--lms-bg-card)', border: '1px solid var(--lms-border)', borderRadius: '4px', color: 'var(--lms-text-primary)', padding: '2px 4px', fontSize: '0.78rem' }}
                                                                value={ob.tenureLeftMonths}
                                                                onChange={(e) => handleUpdateObligation(ob.id, 'tenureLeftMonths', e.target.value)}
                                                            /> mos
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn-del-ob"
                                                                onClick={() => handleDeleteObligation(ob.id)}
                                                                title="Delete Obligation"
                                                            >
                                                                ✕
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <button type="button" className="btn-add-ob" onClick={handleAddObligation}>
                                        + Add Existing Loan EMI
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SALARIED SUBTAB 3: Property Valuation & LTV Matrix */}
                    {subTab === 'ltv_matrix' && (
                        <div className="spreading-view-pane">
                            <div className="salaried-underwriting-grid">
                                <div className="ltv-card">
                                    <div className="ltv-card-header">
                                        <h3>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                            </svg>
                                            Collateral Property & Loan-to-Value (LTV) Matrix
                                        </h3>
                                        <span className={`foir-status-badge ${agreementLtvPct <= 80 ? 'pass' : 'danger'}`}>
                                            {agreementLtvPct <= 80 ? '✓ RBI COMPLIANT (≤ 80%)' : '✖ LTV BREACH (> 80%)'}
                                        </span>
                                    </div>

                                    <div className="ltv-breakdown-grid">
                                        <div className="ltv-row">
                                            <span className="l-lbl">Property Agreement Value (Registered)</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span>₹</span>
                                                <input
                                                    type="number"
                                                    step="0.5"
                                                    style={{ width: '90px', textAlign: 'right', background: 'var(--lms-bg-card)', border: '1px solid var(--lms-border)', borderRadius: '4px', color: 'var(--lms-text-primary)', padding: '3px 6px', fontWeight: 700 }}
                                                    value={loanParams.propertyAgreementCostLakhs}
                                                    onChange={(e) => setLoanParams(p => ({ ...p, propertyAgreementCostLakhs: parseFloat(e.target.value) || 0 }))}
                                                />
                                                <span>Lakhs</span>
                                            </div>
                                        </div>

                                        <div className="ltv-row">
                                            <span className="l-lbl">Stamp Duty, Registration & Govt Fees</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span>₹</span>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    style={{ width: '90px', textAlign: 'right', background: 'var(--lms-bg-card)', border: '1px solid var(--lms-border)', borderRadius: '4px', color: 'var(--lms-text-primary)', padding: '3px 6px', fontWeight: 700 }}
                                                    value={loanParams.stampDutyRegLakhs}
                                                    onChange={(e) => setLoanParams(p => ({ ...p, stampDutyRegLakhs: parseFloat(e.target.value) || 0 }))}
                                                />
                                                <span>Lakhs</span>
                                            </div>
                                        </div>

                                        <div className="ltv-row">
                                            <span className="l-lbl">Empanelled Valuer Market Assessment</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span>₹</span>
                                                <input
                                                    type="number"
                                                    step="0.5"
                                                    style={{ width: '90px', textAlign: 'right', background: 'var(--lms-bg-card)', border: '1px solid var(--lms-border)', borderRadius: '4px', color: 'var(--lms-text-primary)', padding: '3px 6px', fontWeight: 700 }}
                                                    value={loanParams.valuerMarketValueLakhs}
                                                    onChange={(e) => setLoanParams(p => ({ ...p, valuerMarketValueLakhs: parseFloat(e.target.value) || 0 }))}
                                                />
                                                <span>Lakhs</span>
                                            </div>
                                        </div>

                                        <div className="ltv-row total-row">
                                            <span className="l-lbl">Total Property Acquisition Outlay</span>
                                            <span className="l-val text-cyan">₹{totalPropertyOutlay.toFixed(2)} Lakhs</span>
                                        </div>

                                        <div className="ltv-row">
                                            <span className="l-lbl">Proposed Loan Sanction</span>
                                            <span className="l-val text-gold">₹{loanParams.requestedLoanLakhs} Lakhs</span>
                                        </div>

                                        <div className="ltv-row">
                                            <span className="l-lbl">Borrower Margin Money (Own Contribution)</span>
                                            <span className="l-val text-green">₹{borrowerMarginMoney.toFixed(2)} Lakhs ({((borrowerMarginMoney / totalPropertyOutlay) * 100).toFixed(1)}%)</span>
                                        </div>

                                        <div className="ltv-row total-row">
                                            <span className="l-lbl">Calculated LTV Ratio (on Agreement)</span>
                                            <span className={`l-val ${agreementLtvPct <= 80 ? 'text-green' : 'text-red'}`}>{agreementLtvPct}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ltv-card">
                                    <div className="ltv-card-header">
                                        <h3>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                            </svg>
                                            RBI Regulatory & Policy Guidelines (Housing Loans)
                                        </h3>
                                        <span className="badge-pass">SANCTION READY</span>
                                    </div>

                                    <div className="gst-reconciliation-details">
                                        <div className="recon-item verified">
                                            <div className="recon-icon">✓</div>
                                            <div className="recon-text">
                                                <strong>RBI LTV Ceiling Check: Passed</strong>
                                                <p>For housing loans between ₹30 Lakhs and ₹75 Lakhs, RBI regulatory ceiling is 80.0%. Current case LTV of {agreementLtvPct}% complies fully with master directions.</p>
                                            </div>
                                        </div>

                                        <div className="recon-item verified">
                                            <div className="recon-icon">✓</div>
                                            <div className="recon-text">
                                                <strong>Title & Legal Scrutiny: Clean 30-Year Search</strong>
                                                <p>Clear marketable title search report executed by panel advocate. 100% free from encumbrances, litigations, and prior mortgages.</p>
                                            </div>
                                        </div>

                                        <div className="recon-item verified">
                                            <div className="recon-icon">✓</div>
                                            <div className="recon-text">
                                                <strong>Valuation Variance: Clean (+9.5% Market Premium)</strong>
                                                <p>Empanelled valuer assessed market value at ₹{loanParams.valuerMarketValueLakhs} Lakhs against registered agreement value of ₹{loanParams.propertyAgreementCostLakhs} Lakhs.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SALARIED SUBTAB 4: Salary Account 12-Month Banking Truth Serum */}
                    {subTab === 'truth_serum' && (
                        <div className="spreading-view-pane">
                            <div className="truth-card banking-card">
                                <div className="truth-card-header">
                                    <div className="h-left">
                                        <div className="icon-wrap blue">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                                <line x1="1" y1="10" x2="23" y2="10"></line>
                                            </svg>
                                        </div>
                                        <div>
                                            <h4>12-Month Salary Account Truth Serum (Perfios Parsed)</h4>
                                            <span className="sub">{SALARIED_BANKING_12M.bankName} (A/C {SALARIED_BANKING_12M.accountNumber}) • Narration: {SALARIED_BANKING_12M.salaryNarration}</span>
                                        </div>
                                    </div>
                                    <span className="trace-chip" onClick={() => onOpenTraceability && onOpenTraceability('BANK_STATEMENT')}>
                                        Trace Statement PDF
                                    </span>
                                </div>

                                <div className="truth-kpi-strip">
                                    <div className="k-box">
                                        <span className="lbl">Monthly Salary Credit</span>
                                        <span className="val text-cyan">₹1.55 Lakhs</span>
                                        <span className="sub-lbl">12/12 Cycles On-Time</span>
                                    </div>
                                    <div className="k-box">
                                        <span className="lbl">Average Monthly Balance (AMB)</span>
                                        <span className="val text-gold">₹1.05 Lakhs</span>
                                        <span className="sub-lbl">Healthy Liquidity</span>
                                    </div>
                                    <div className="k-box">
                                        <span className="lbl">Salary Credit Consistency</span>
                                        <span className="val text-green">100% Exact</span>
                                        <span className="sub-lbl">Matches Pay Slip Net</span>
                                    </div>
                                    <div className="k-box">
                                        <span className="lbl">Cheque / ECS Bounces</span>
                                        <span className="val text-green">0 Bounces</span>
                                        <span className="sub-lbl">Zero DPD Clean Track</span>
                                    </div>
                                </div>

                                <div className="monthly-banking-table-wrap">
                                    <table className="monthly-banking-table">
                                        <thead>
                                            <tr>
                                                <th>SALARY CYCLE</th>
                                                <th>CREDIT DATE</th>
                                                <th>NET SALARY CREDIT</th>
                                                <th>CLOSING AMB</th>
                                                <th>BOUNCES</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {SALARIED_BANKING_12M.salaryCreditDates.map((d, idx) => (
                                                <tr key={d}>
                                                    <td className="month-cell">Cycle {idx + 1}</td>
                                                    <td>{d}</td>
                                                    <td className="text-green">₹{SALARIED_BANKING_12M.monthlySalaryCredits[idx].toLocaleString('en-IN')}</td>
                                                    <td className="text-gold">₹{SALARIED_BANKING_12M.amb[idx].toLocaleString('en-IN')}</td>
                                                    <td>
                                                        <span className="clean-dot">0</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================================= */}
            {/* CORPORATE / MSME SCoA UNDERWRITING ENGINE                                */}
            {/* ========================================================================= */}
            {profileMode === 'corporate' && (
                <div className="corporate-mode-container">
                    {/* Top Sub-Navigation Tabs */}
                    <div className="spreading-nav-strip">
                        <button
                            type="button"
                            className={`spreading-tab-btn ${subTab === 'pnl_bs' ? 'active' : ''}`}
                            onClick={() => setSubTab('pnl_bs')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                                <line x1="9" y1="21" x2="9" y2="9"></line>
                            </svg>
                            <span>P&L and Balance Sheet (Multi-Year Grid)</span>
                        </button>

                        <button
                            type="button"
                            className={`spreading-tab-btn ${subTab === 'truth_serum' ? 'active' : ''}`}
                            onClick={() => setSubTab('truth_serum')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                            <span>Banking & GST Truth Serum (12M Cross-Check)</span>
                        </button>

                        <button
                            type="button"
                            className={`spreading-tab-btn ${subTab === 'ratios' ? 'active' : ''}`}
                            onClick={() => setSubTab('ratios')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polygon points="12 6 12 12 16 14"></polygon>
                            </svg>
                            <span>Ratio Master & Benchmark Gauges</span>
                        </button>
                    </div>

                    {/* TAB 1: P&L AND BALANCE SHEET MULTI-YEAR SPREADING GRID */}
                    {subTab === 'pnl_bs' && (
                        <div className="spreading-view-pane">
                            {/* Visual 3-Year Trend Summary */}
                            <div className="spreading-trend-banner">
                                <div className="trend-banner-header">
                                    <div>
                                        <h4>3-Year Financial Growth & Margin Trajectory (SCoA Standardized)</h4>
                                        <span className="sub">Figures extracted via ITR/CMA OCR and reconciled against audited balance sheets</span>
                                    </div>
                                    <span className="source-link-chip" onClick={() => onOpenTraceability && onOpenTraceability('ITR_FINANCIALS')}>
                                        📄 Source: Audited ITR & Balance Sheets
                                    </span>
                                </div>

                                <div className="growth-metrics-row">
                                    <div className="metric-chip">
                                        <span className="lbl">3-Year Sales CAGR</span>
                                        <div className="val-row">
                                            <span className="val text-green">+14.4%</span>
                                            <span className="trend-arrow up">↑</span>
                                        </div>
                                        <span className="note">Industry Avg: +9.8%</span>
                                    </div>

                                    <div className="metric-chip">
                                        <span className="lbl">EBITDA Margin Trajectory</span>
                                        <div className="val-row">
                                            <span className="val text-gold">14.7% → 16.0%</span>
                                            <span className="trend-arrow up">↑</span>
                                        </div>
                                        <span className="note">+126 bps Expansion</span>
                                    </div>

                                    <div className="metric-chip">
                                        <span className="lbl">Tangible Net Worth (TNW)</span>
                                        <div className="val-row">
                                            <span className="val text-cyan">₹12.36 Cr</span>
                                            <span className="trend-arrow up">↑</span>
                                        </div>
                                        <span className="note">+50.7% over 24 Months</span>
                                    </div>

                                    <div className="metric-chip">
                                        <span className="lbl">Profitability Divergence</span>
                                        <div className="val-row">
                                            <span className="val text-green">CLEAN</span>
                                            <span className="badge-pass">PASS</span>
                                        </div>
                                        <span className="note">Sales & PAT Growing in Tandem</span>
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Multi-Year P&L Table */}
                            <div className="financial-grid-card">
                                <div className="grid-card-header">
                                    <h3>Profit & Loss Account (Statement of Operations)</h3>
                                    <span className="unit-pill">Values in ₹ Lakhs (Editable)</span>
                                </div>

                                <div className="table-responsive-wrapper">
                                    <table className="scoa-table">
                                        <thead>
                                            <tr>
                                                <th className="head-col">STANDARD CHART OF ACCOUNTS (P&L HEAD)</th>
                                                {years.map((yr, idx) => (
                                                    <th key={yr} className={`yr-col ${idx === 3 ? 'projected' : ''}`}>
                                                        {yr}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pnlData.map((row) => (
                                                <tr key={row.id} className={`scoa-row ${row.category} ${row.calculated ? 'calc-row' : ''}`}>
                                                    <td className="row-label">
                                                        <span>{row.label}</span>
                                                        {row.calculated && <span className="auto-tag">AUTO</span>}
                                                    </td>
                                                    {row.values.map((val, yIdx) => (
                                                        <td key={yIdx} className={`val-cell ${yIdx === 3 ? 'projected-cell' : ''}`}>
                                                            {row.editable ? (
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    className="cell-input"
                                                                    value={val}
                                                                    onChange={(e) => handleCellChange('pnl', row.id, yIdx, e.target.value)}
                                                                />
                                                            ) : (
                                                                <span className={`cell-static ${row.category}`}>
                                                                    {row.unit === '%' ? `${val.toFixed(2)}%` : `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                                                                </span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Interactive Multi-Year Balance Sheet Table (Fully Editable) */}
                            <div className="financial-grid-card">
                                <div className="grid-card-header">
                                    <h3>Balance Sheet & Capital Structure (SCoA Standardized)</h3>
                                    <span className="unit-pill">Values in ₹ Lakhs (Editable)</span>
                                </div>

                                <div className="table-responsive-wrapper">
                                    <table className="scoa-table">
                                        <thead>
                                            <tr>
                                                <th className="head-col">LIABILITIES & ASSET POSITION</th>
                                                {years.map((yr, idx) => (
                                                    <th key={yr} className={`yr-col ${idx === 3 ? 'projected' : ''}`}>
                                                        {yr}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bsData.map((row) => (
                                                <tr key={row.id} className={`scoa-row ${row.category} ${row.calculated ? 'calc-row' : ''}`}>
                                                    <td className="row-label">
                                                        <span>{row.label}</span>
                                                        {row.calculated && <span className="auto-tag">AUTO</span>}
                                                    </td>
                                                    {row.values.map((val, yIdx) => (
                                                        <td key={yIdx} className={`val-cell ${yIdx === 3 ? 'projected-cell' : ''}`}>
                                                            {row.editable ? (
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    className="cell-input"
                                                                    value={val}
                                                                    onChange={(e) => handleCellChange('bs', row.id, yIdx, e.target.value)}
                                                                />
                                                            ) : (
                                                                <span className={`cell-static ${row.category}`}>
                                                                    ₹{val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                                </span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: BANKING & GST TRUTH SERUM */}
                    {subTab === 'truth_serum' && (
                        <div className="spreading-view-pane">
                            <div className="truth-serum-split-grid">
                                {/* Left Half: 12-Month Banking Cashflow */}
                                <div className="truth-card banking-card">
                                    <div className="truth-card-header">
                                        <div className="h-left">
                                            <div className="icon-wrap blue">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4>12-Month Banking Truth Serum (Perfios Parsed)</h4>
                                                <span className="sub">State Bank of India (65%) & HDFC Bank (35%) Operating Current Accounts</span>
                                            </div>
                                        </div>
                                        <span className="trace-chip" onClick={() => onOpenTraceability && onOpenTraceability('BANK_STATEMENT')}>
                                            Trace Statement PDF
                                        </span>
                                    </div>

                                    <div className="truth-kpi-strip">
                                        <div className="k-box">
                                            <span className="lbl">Total Inward Credits</span>
                                            <span className="val text-green">₹35.12 Cr</span>
                                            <span className="sub-lbl">328 Transactions</span>
                                        </div>
                                        <div className="k-box">
                                            <span className="lbl">Average Daily Balance (ABB)</span>
                                            <span className="val text-gold">₹117.58 L</span>
                                            <span className="sub-lbl">Strong Liquidity</span>
                                        </div>
                                        <div className="k-box">
                                            <span className="lbl">Cheque / ECS Bounces</span>
                                            <span className="val text-cyan">0 Inward / 1 Outward</span>
                                            <span className="sub-lbl">Clean Discipline</span>
                                        </div>
                                        <div className="k-box">
                                            <span className="lbl">Cash Deposit Ratio</span>
                                            <span className="val text-green">1.21%</span>
                                            <span className="sub-lbl">Safe (&lt; 10% Policy)</span>
                                        </div>
                                    </div>

                                    <div className="monthly-banking-table-wrap">
                                        <table className="monthly-banking-table">
                                            <thead>
                                                <tr>
                                                    <th>MONTH</th>
                                                    <th>CREDITS (INFLOW)</th>
                                                    <th>DEBITS (OUTFLOW)</th>
                                                    <th>ABB (DAILY AVG)</th>
                                                    <th>BOUNCES</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {BANKING_12M_SPREADING.months.map((m, idx) => (
                                                    <tr key={m} className={BANKING_12M_SPREADING.outwardBounces[idx] > 0 ? 'row-bounce' : ''}>
                                                        <td className="month-cell">{m}</td>
                                                        <td className="text-green">₹{BANKING_12M_SPREADING.credits[idx].toFixed(1)} L</td>
                                                        <td className="text-red">₹{BANKING_12M_SPREADING.debits[idx].toFixed(1)} L</td>
                                                        <td className="text-gold">₹{BANKING_12M_SPREADING.abb[idx].toFixed(1)} L</td>
                                                        <td>
                                                            {BANKING_12M_SPREADING.outwardBounces[idx] > 0 ? (
                                                                <span className="badge-bounce-flag">1 Tech Return (Sep)</span>
                                                            ) : (
                                                                <span className="clean-dot">0</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Right Half: 12-Month GST Reconciliation */}
                                <div className="truth-card gst-card">
                                    <div className="truth-card-header">
                                        <div className="h-left">
                                            <div className="icon-wrap purple">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4>GSTN Live API Reconciliation (GSTR-1, 3B & 2A)</h4>
                                                <span className="sub">GSTIN: {GST_12M_SPREADING.gstin} • 100% Timely Filings</span>
                                            </div>
                                        </div>
                                        <span className="trace-chip" onClick={() => onOpenTraceability && onOpenTraceability('GST_RETURN')}>
                                            Trace GSTR-3B PDF
                                        </span>
                                    </div>

                                    <div className="truth-kpi-strip">
                                        <div className="k-box">
                                            <span className="lbl">GSTR-3B Taxable Turnover</span>
                                            <span className="val text-cyan">₹32.49 Cr</span>
                                            <span className="sub-lbl">+12.4% YoY Growth</span>
                                        </div>
                                        <div className="k-box">
                                            <span className="lbl">GST vs Bank Credit Variance</span>
                                            <span className="val text-green">4.2% Variance</span>
                                            <span className="sub-lbl">Healthy (&lt; 20% limit)</span>
                                        </div>
                                        <div className="k-box">
                                            <span className="lbl">GSTR-2A vs 3B ITC Match</span>
                                            <span className="val text-green">100.0% Exact</span>
                                            <span className="sub-lbl">0.0% Mismatch</span>
                                        </div>
                                        <div className="k-box">
                                            <span className="lbl">Cash Tax Paid</span>
                                            <span className="val text-gold">₹2.29 Cr</span>
                                            <span className="sub-lbl">No Circular Trading</span>
                                        </div>
                                    </div>

                                    <div className="gst-reconciliation-details">
                                        <div className="recon-item verified">
                                            <div className="recon-icon">✓</div>
                                            <div className="recon-text">
                                                <strong>Bank Turnover vs GST Ratio: 1.08x</strong>
                                                <p>Total Bank Credits (₹35.12 Cr) exceed GST Billed Sales (₹32.49 Cr) by 8.1% due to advances and export incentives. No suppressed turnover or circular invoicing detected.</p>
                                            </div>
                                        </div>

                                        <div className="recon-item verified">
                                            <div className="recon-icon">✓</div>
                                            <div className="recon-text">
                                                <strong>Input Tax Credit (ITC) Integrity: 0% Breach</strong>
                                                <p>All supplier invoices claimed in GSTR-3B reflect in GSTR-2A auto-drafted vendor returns. Vendor compliance index is 98.4%.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: RATIO MASTER & BENCHMARK GAUGES */}
                    {subTab === 'ratios' && (
                        <div className="spreading-view-pane">
                            <div className="ratios-header-banner">
                                <div>
                                    <h4>Ratio Master & Industry Benchmarking Engine</h4>
                                    <span className="sub">Sector: {benchmarkData.industryName} (NIC: {benchmarkData.nicCode})</span>
                                </div>
                                <span className="benchmark-badge">NIC {benchmarkData.nicCode} Benchmarks Loaded</span>
                            </div>

                            <div className="ratios-grid">
                                {RATIO_MASTER.map((ratio) => (
                                    <div key={ratio.id} className="ratio-card">
                                        <div className="ratio-card-top">
                                            <span className="ratio-category-tag">{ratio.category.replace('_', ' ')}</span>
                                            <span className={`ratio-status-badge ${ratio.status.toLowerCase()}`}>{ratio.status}</span>
                                        </div>

                                        <h3 className="ratio-title">{ratio.name}</h3>

                                        <div className="ratio-value-display">
                                            <span className="ratio-large-num text-green">
                                                {typeof ratio.value === 'number' ? ratio.value.toFixed(2) : ratio.value} {ratio.unit}
                                            </span>
                                            <span className="ratio-trend-pill up">
                                                {ratio.trend === 'UP' ? '↑ Improving' : ratio.trend === 'DOWN_GOOD' ? '↓ Reduced Debt' : '→ Stable'}
                                            </span>
                                        </div>

                                        <div className="ratio-bench-compare">
                                            <div className="bench-row">
                                                <span>Applicant Score:</span>
                                                <strong>{ratio.value} {ratio.unit}</strong>
                                            </div>
                                            <div className="bench-row">
                                                <span>Industry Peer Avg:</span>
                                                <span>{ratio.industryAvg} {ratio.unit}</span>
                                            </div>
                                            <div className="bench-row">
                                                <span>Institutional Policy Min:</span>
                                                <span>{ratio.policyMin} {ratio.unit}</span>
                                            </div>
                                        </div>

                                        <p className="ratio-expl">{ratio.explanation}</p>

                                        <button
                                            type="button"
                                            className="btn-inspect-formula"
                                            onClick={() => setActiveFormulaDoc(ratio)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                            </svg>
                                            <span>Click to Inspect Exact Math & Formula</span>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {activeFormulaDoc && (
                                <div className="vault-modal-overlay" onClick={() => setActiveFormulaDoc(null)}>
                                    <div className="vault-modal-card formula-modal" onClick={(e) => e.stopPropagation()}>
                                        <div className="modal-header">
                                            <div>
                                                <span className="modal-category-tag">TRANSPARENCY AUDIT</span>
                                                <h3>{activeFormulaDoc.name}</h3>
                                                <span className="modal-doc-id">Policy Rule Minimum: {activeFormulaDoc.policyMin} {activeFormulaDoc.unit}</span>
                                            </div>
                                            <button type="button" className="btn-close-modal" onClick={() => setActiveFormulaDoc(null)}>×</button>
                                        </div>

                                        <div className="modal-body">
                                            <div className="formula-math-box">
                                                <span className="math-label">Institutional Formula:</span>
                                                <code className="math-code">{activeFormulaDoc.formulaText}</code>
                                            </div>

                                            <div className="numerator-denominator-breakdown">
                                                <div className="math-part numerator">
                                                    <span className="part-tag">NUMERATOR:</span>
                                                    <h4>{activeFormulaDoc.numerator.label}</h4>
                                                    <span className="part-val text-green">{activeFormulaDoc.numerator.value}</span>
                                                    <p>{activeFormulaDoc.numerator.details}</p>
                                                </div>

                                                <div className="math-divider">
                                                    <span>÷ DIVIDED BY</span>
                                                </div>

                                                <div className="math-part denominator">
                                                    <span className="part-tag">DENOMINATOR:</span>
                                                    <h4>{activeFormulaDoc.denominator.label}</h4>
                                                    <span className="part-val text-gold">{activeFormulaDoc.denominator.value}</span>
                                                    <p>{activeFormulaDoc.denominator.details}</p>
                                                </div>
                                            </div>

                                            <div className="calculated-result-box">
                                                <span>Calculated Underwriting Score:</span>
                                                <strong className="text-green">{activeFormulaDoc.value} {activeFormulaDoc.unit} (100% Bank Compliant)</strong>
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button type="button" className="btn-modal-close" onClick={() => setActiveFormulaDoc(null)}>Close Formula</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FinancialSpreadingTab;
