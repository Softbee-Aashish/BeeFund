import React, { useState, useMemo } from 'react';
import { calculateStressScenario } from '../creditBrainData';

const StressTestingTab = ({ caseData }) => {
    // Sensitivity Sliders State
    const [salesGrowthPct, setSalesGrowthPct] = useState(0); // -50% to +50%
    const [ebitdaMarginDelta, setEbitdaMarginDelta] = useState(0); // -10% to +10%
    const [interestRateDelta, setInterestRateDelta] = useState(0); // 0% to +5%

    // Calculate stressed scenario metrics
    const stressResult = useMemo(() => {
        return calculateStressScenario({
            salesGrowthPct,
            ebitdaMarginDelta,
            interestRateDelta
        });
    }, [salesGrowthPct, ebitdaMarginDelta, interestRateDelta]);

    // Scenario preset handlers
    const applyPreset = (preset) => {
        if (preset === 'base') {
            setSalesGrowthPct(0);
            setEbitdaMarginDelta(0);
            setInterestRateDelta(0);
        } else if (preset === 'best') {
            setSalesGrowthPct(20);
            setEbitdaMarginDelta(2);
            setInterestRateDelta(0);
        } else if (preset === 'worst') {
            setSalesGrowthPct(-30);
            setEbitdaMarginDelta(-5);
            setInterestRateDelta(2);
        }
    };

    const isBase = salesGrowthPct === 0 && ebitdaMarginDelta === 0 && interestRateDelta === 0;
    const isBest = salesGrowthPct === 20 && ebitdaMarginDelta === 2 && interestRateDelta === 0;
    const isWorst = salesGrowthPct === -30 && ebitdaMarginDelta === -5 && interestRateDelta === 2;

    return (
        <div className="stress-testing-root">
            {/* Header Banner */}
            <div className="stress-header-banner">
                <div className="h-left">
                    <div className="stress-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                    </div>
                    <div>
                        <h3>"What-If" Sensitivity & Macro Stress Testing Engine</h3>
                        <span className="sub">Simulate recessionary shocks, input commodity price hikes, and interest rate spikes in real-time</span>
                    </div>
                </div>

                <div className="scenario-presets-group">
                    <span className="preset-lbl">Macro Scenarios:</span>
                    <button
                        type="button"
                        className={`btn-preset ${isBase ? 'active' : ''}`}
                        onClick={() => applyPreset('base')}
                    >
                        Base Case (Current)
                    </button>
                    <button
                        type="button"
                        className={`btn-preset best ${isBest ? 'active' : ''}`}
                        onClick={() => applyPreset('best')}
                    >
                        Best Case (+20% Growth)
                    </button>
                    <button
                        type="button"
                        className={`btn-preset worst ${isWorst ? 'active' : ''}`}
                        onClick={() => applyPreset('worst')}
                    >
                        Worst Case (-30% Shock)
                    </button>
                </div>
            </div>

            {/* Top Section: Sensitivity Sliders */}
            <div className="sliders-card">
                <div className="sliders-grid">
                    {/* Slider 1: Sales Growth */}
                    <div className="slider-item">
                        <div className="slider-label-row">
                            <span className="s-label">Sales Revenue Degradation / Growth:</span>
                            <span className={`s-val ${salesGrowthPct > 0 ? 'text-green' : salesGrowthPct < 0 ? 'text-red' : ''}`}>
                                {salesGrowthPct > 0 ? `+${salesGrowthPct}%` : `${salesGrowthPct}%`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="-50"
                            max="50"
                            step="5"
                            value={salesGrowthPct}
                            onChange={(e) => setSalesGrowthPct(parseInt(e.target.value))}
                            className="slider-input"
                        />
                        <div className="slider-ticks">
                            <span>-50% (Severe Shock)</span>
                            <span>0% (Base)</span>
                            <span>+50% (High Growth)</span>
                        </div>
                    </div>

                    {/* Slider 2: EBITDA Margin Delta */}
                    <div className="slider-item">
                        <div className="slider-label-row">
                            <span className="s-label">Operating Margin Compression / Expansion:</span>
                            <span className={`s-val ${ebitdaMarginDelta > 0 ? 'text-green' : ebitdaMarginDelta < 0 ? 'text-red' : ''}`}>
                                {ebitdaMarginDelta > 0 ? `+${ebitdaMarginDelta}%` : `${ebitdaMarginDelta}%`} ({stressResult.stressedMarginPct.toFixed(1)}% Margin)
                            </span>
                        </div>
                        <input
                            type="range"
                            min="-10"
                            max="10"
                            step="0.5"
                            value={ebitdaMarginDelta}
                            onChange={(e) => setEbitdaMarginDelta(parseFloat(e.target.value))}
                            className="slider-input"
                        />
                        <div className="slider-ticks">
                            <span>-10% (Margin Erosion)</span>
                            <span>0% (16.0%)</span>
                            <span>+10% (Efficiency Gain)</span>
                        </div>
                    </div>

                    {/* Slider 3: Interest Rate Hike */}
                    <div className="slider-item">
                        <div className="slider-label-row">
                            <span className="s-label">RBI Repo Rate / Bank Lending Rate Hike:</span>
                            <span className={`s-val ${interestRateDelta > 0 ? 'text-gold' : ''}`}>
                                +{interestRateDelta.toFixed(1)}% ({(10.5 + interestRateDelta).toFixed(1)}% p.a.)
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.25"
                            value={interestRateDelta}
                            onChange={(e) => setInterestRateDelta(parseFloat(e.target.value))}
                            className="slider-input"
                        />
                        <div className="slider-ticks">
                            <span>Base (10.5%)</span>
                            <span>+2.5%</span>
                            <span>+5.0% (Severe Tightening)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recalculated Key Ratios & KPI Dashboard */}
            <div className="stressed-kpi-grid">
                <div className={`stressed-kpi-card ${stressResult.stressedDSCR >= 1.33 ? 'pass' : 'fail'}`}>
                    <div className="card-top">
                        <span className="lbl">Stressed DSCR</span>
                        <span className={`badge ${stressResult.stressedDSCR >= 1.33 ? 'pass' : 'fail'}`}>
                            {stressResult.stressedDSCR >= 1.33 ? 'COVENANT PASS' : 'COVENANT BREACH'}
                        </span>
                    </div>
                    <div className="val-row">
                        <span className={`num ${stressResult.stressedDSCR >= 1.33 ? 'text-green' : 'text-red'}`}>
                            {stressResult.stressedDSCR.toFixed(2)}x
                        </span>
                        <span className="policy-bench">Policy Min: 1.33x</span>
                    </div>
                    <div className="meter-track">
                        <div
                            className={`meter-fill ${stressResult.stressedDSCR >= 1.33 ? 'green' : 'red'}`}
                            style={{ width: `${Math.min(100, (stressResult.stressedDSCR / 3.0) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className={`stressed-kpi-card ${stressResult.stressedISCR >= 2.0 ? 'pass' : 'fail'}`}>
                    <div className="card-top">
                        <span className="lbl">Stressed ISCR</span>
                        <span className={`badge ${stressResult.stressedISCR >= 2.0 ? 'pass' : 'fail'}`}>
                            {stressResult.stressedISCR >= 2.0 ? 'PASS' : 'RISK'}
                        </span>
                    </div>
                    <div className="val-row">
                        <span className={`num ${stressResult.stressedISCR >= 2.0 ? 'text-green' : 'text-red'}`}>
                            {stressResult.stressedISCR.toFixed(2)}x
                        </span>
                        <span className="policy-bench">Policy Min: 2.00x</span>
                    </div>
                    <div className="meter-track">
                        <div
                            className={`meter-fill ${stressResult.stressedISCR >= 2.0 ? 'green' : 'red'}`}
                            style={{ width: `${Math.min(100, (stressResult.stressedISCR / 5.0) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="stressed-kpi-card info">
                    <div className="card-top">
                        <span className="lbl">Break-Even Sales Revenue</span>
                        <span className="badge info">SAFETY METRIC</span>
                    </div>
                    <div className="val-row">
                        <span className="num text-gold">₹{(stressResult.breakEvenSales / 100).toFixed(2)} Cr</span>
                        <span className="policy-bench">Margin of Safety: {stressResult.marginOfSafetyPct.toFixed(1)}%</span>
                    </div>
                    <div className="meter-track">
                        <div
                            className="meter-fill gold"
                            style={{ width: `${Math.min(100, stressResult.marginOfSafetyPct)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="stressed-kpi-card info">
                    <div className="card-top">
                        <span className="lbl">Stressed Annual PAT</span>
                        <span className="badge info">NET SURPLUS</span>
                    </div>
                    <div className="val-row">
                        <span className={`num ${stressResult.stressedPat >= 0 ? 'text-cyan' : 'text-red'}`}>
                            ₹{(stressResult.stressedPat / 100).toFixed(2)} Cr
                        </span>
                        <span className="policy-bench">Reinvestable Cash</span>
                    </div>
                    <div className="meter-track">
                        <div
                            className="meter-fill cyan"
                            style={{ width: `${Math.min(100, Math.max(0, (stressResult.stressedPat / 300) * 100))}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* 5-Year Cash Flow Waterfall under Stressed Scenario */}
            <div className="waterfall-card">
                <div className="waterfall-header">
                    <h4>5-Year Projected Debt Servicing & Cash Surplus (Waterfall Analysis)</h4>
                    <span className="sub">Simulated cash available after paying stressed interest, principal amortization, and maintenance capex</span>
                </div>

                <div className="waterfall-table-wrapper">
                    <table className="waterfall-table">
                        <thead>
                            <tr>
                                <th>YEAR</th>
                                <th>STRESSED EBITDA (INFLOW)</th>
                                <th>DEBT AMORTIZATION (TL+WC)</th>
                                <th>MAINTENANCE CAPEX</th>
                                <th>NET CASH SURPLUS (RETAINED)</th>
                                <th>SOLVENCY STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stressResult.waterfallProjection.map((w) => {
                                const isSolvent = w.netSurplus > 0;
                                return (
                                    <tr key={w.year} className={isSolvent ? 'solvent-row' : 'deficit-row'}>
                                        <td className="yr-col">{w.year}</td>
                                        <td className="text-green">₹{(w.operatingCash / 100).toFixed(2)} Cr</td>
                                        <td className="text-red">₹{(w.debtService / 100).toFixed(2)} Cr</td>
                                        <td className="text-gold">₹{(w.capex / 100).toFixed(2)} Cr</td>
                                        <td className={isSolvent ? 'text-cyan font-bold' : 'text-red font-bold'}>
                                            ₹{(w.netSurplus / 100).toFixed(2)} Cr
                                        </td>
                                        <td>
                                            <span className={`solvency-pill ${isSolvent ? 'pass' : 'fail'}`}>
                                                {isSolvent ? '✓ Cash Surplus' : '⚠ Debt Deficit'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sam's Logic Alert & Recommendation Box */}
            <div className={`sam-logic-alert-box ${stressResult.warnings.length > 0 ? 'alert-critical' : 'alert-safe'}`}>
                <div className="alert-top">
                    <div className="alert-icon">
                        {stressResult.warnings.length > 0 ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                <polyline points="9 12 11 14 15 10"></polyline>
                            </svg>
                        )}
                    </div>
                    <div>
                        <h4>
                            {stressResult.warnings.length > 0
                                ? `Credit Committee Warning: ${stressResult.warnings.length} Risk Triggers Breached`
                                : 'Stress Solvency Confirmed: Model Resilient to Shock'}
                        </h4>
                        <span className="sub">Automated institutional risk assessment based on RBI macro-stress prudential guidelines</span>
                    </div>
                </div>

                <div className="alert-body">
                    {stressResult.warnings.length > 0 ? (
                        <div className="warnings-list">
                            {stressResult.warnings.map((w, i) => (
                                <div key={i} className="warning-item">
                                    <span className="w-tag">{w.title}:</span>
                                    <p className="w-desc">{w.text}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="safe-desc">
                            Even under conservative stress testing parameters, the borrower maintains an adequate DSCR of {stressResult.stressedDSCR.toFixed(2)}x and a comfortable margin of safety ({stressResult.marginOfSafetyPct.toFixed(1)}%). The enterprise has sufficient operating cash flow to service bank debt without debt restructuring.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StressTestingTab;
