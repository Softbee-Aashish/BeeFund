import React, { useState, useMemo } from 'react';
import { INITIAL_FINANCIAL_SPREADING, BANKING_12M_SPREADING, GST_12M_SPREADING, RATIO_MASTER, INDUSTRY_BENCHMARKS } from '../creditBrainData';

const FinancialSpreadingTab = ({ caseData, onSelectRatioFormula, onOpenTraceability }) => {
    const [subTab, setSubTab] = useState('pnl_bs'); // 'pnl_bs' | 'truth_serum' | 'ratios'
    const [pnlData, setPnlData] = useState(INITIAL_FINANCIAL_SPREADING.pnl);
    const [bsData, setBsData] = useState(INITIAL_FINANCIAL_SPREADING.balanceSheet);
    const [years] = useState(INITIAL_FINANCIAL_SPREADING.years);
    const [selectedDocModal, setSelectedDocModal] = useState(null);
    const [activeFormulaDoc, setActiveFormulaDoc] = useState(null);

    // Inline edit handler for financial spreading grid
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
                            v - (cogsRow.values[i] + powerRow.values[i] + empRow.values[i] + adminRow.values[i])
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
                            return ebitda - deprRow.values[i];
                        });
                        return { ...row, values: calculated };
                    }
                    if (row.id === 'pbt') {
                        const calculated = revRow.values.map((v, i) => {
                            const ebitda = revRow.values[i] - (cogsRow.values[i] + powerRow.values[i] + empRow.values[i] + adminRow.values[i]);
                            const ebit = ebitda - deprRow.values[i];
                            return ebit - intRow.values[i];
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
        }
    };

    const benchmarkData = INDUSTRY_BENCHMARKS['28195'];

    return (
        <div className="financial-spreading-root">
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
                            <span className="unit-pill">Values in ₹ Lakhs</span>
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

                    {/* Interactive Balance Sheet Table */}
                    <div className="financial-grid-card">
                        <div className="grid-card-header">
                            <h3>Balance Sheet & Capital Structure (SCoA Standardized)</h3>
                            <span className="unit-pill">Values in ₹ Lakhs</span>
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
                                                    <span className={`cell-static ${row.category}`}>
                                                        ₹{val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </span>
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
                    {/* Split Screen Truth Serum */}
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

                            {/* Monthly Bar Table Chart */}
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

                            {/* Reconciliation Comparative Bar */}
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

                    {/* Gauges & Cards Grid */}
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

                                {/* Benchmark comparison bar */}
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

                                {/* Formula Transparency Trigger */}
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

                    {/* Formula Inspector Modal */}
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
    );
};

export default FinancialSpreadingTab;
