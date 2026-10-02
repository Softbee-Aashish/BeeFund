import React from 'react';

const TraceabilityDrawer = ({ isOpen, docType, onClose, caseData }) => {
    if (!isOpen) return null;

    const getDocDetails = () => {
        if (docType === 'GST_RETURN') {
            return {
                title: 'GSTR-3B Monthly Return Filing (GSTN API Direct)',
                docId: 'DOC_GST_12M',
                source: 'GSTN Official Portal (API Ingested)',
                highlightedField: 'Table 3.1(a) - Total Taxable Turnover: ₹32,49,20,118',
                timestamp: 'Filed on 18-Apr-2025 • ARN: AA0704250089128',
                checksum: 'SHA256: 8f9b4c2e71d3a6e8f0b1234cde56789a',
                extractedFields: [
                    { label: 'GSTIN', val: '07AAEPK8812M1Z5' },
                    { label: 'Legal Name', val: 'Apex Precision Engineering LLP' },
                    { label: 'Annual Taxable Turnover', val: '₹32.49 Crores' },
                    { label: 'IGST Paid', val: '₹1.18 Crores' },
                    { label: 'CGST + SGST Paid', val: '₹2.36 Crores' },
                    { label: 'Eligible ITC Claimed', val: '₹3.59 Crores (100% 2A Match)' }
                ]
            };
        }
        if (docType === 'BANK_STATEMENT') {
            return {
                title: '12-Month Bank Statement (Perfios Parsed)',
                docId: 'DOC_BSA_12M',
                source: 'Account Aggregator / Perfios Netbanking API',
                highlightedField: 'Total Annual Inward Credits: ₹35,12,10,450',
                timestamp: 'Parsed on 02-Oct-2026 • Reference: PERF-2026-99120',
                checksum: 'SHA256: 4e7d2a1b9c8f0e3d5a6b7c8d9e0f1a2b',
                extractedFields: [
                    { label: 'Primary Operating Bank', val: 'State Bank of India (65% Volume)' },
                    { label: 'Secondary Bank', val: 'HDFC Bank Ltd (35% Volume)' },
                    { label: 'Average Daily Balance (ABB)', val: '₹117.58 Lakhs' },
                    { label: 'Peak Monthly Balance', val: '₹142.00 Lakhs (Mar-25)' },
                    { label: 'Inward Bounces', val: '0 (Zero Returns)' },
                    { label: 'High Cash Deposits (>₹10L)', val: '0 Detected (1.2% Total Cash)' }
                ]
            };
        }
        return {
            title: '3-Year Audited Annual Financial Statements',
            docId: 'DOC_ITR_FINANCIALS',
            source: 'Income Tax Department (ITD e-Filing) & CA Certified Balance Sheet',
            highlightedField: 'FY25 Revenue: ₹32.49 Cr | Net Profit (PAT): ₹2.32 Cr',
            timestamp: 'Acknowledged on 28-Jul-2025 • ITR-V Ack: 9918230981',
            checksum: 'SHA256: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
            extractedFields: [
                { label: 'Assessment Year', val: 'AY 2025-26 (FY 2024-25)' },
                { label: 'Auditor Name & M.No.', val: 'M/s V. K. Aggarwal & Co. (M# 084920)' },
                { label: 'Gross Revenue', val: '₹3,249.20 Lakhs' },
                { label: 'EBITDA (Operating Profit)', val: '₹519.30 Lakhs (16.0% Margin)' },
                { label: 'Tangible Net Worth (TNW)', val: '₹1,235.72 Lakhs' },
                { label: 'Auditor Opinion', val: 'Unqualified / Clean Audit Report' }
            ]
        };
    };

    const info = getDocDetails();

    return (
        <div className="trace-drawer-overlay" onClick={onClose}>
            <div className="trace-drawer-card" onClick={(e) => e.stopPropagation()}>
                <div className="trace-drawer-header">
                    <div>
                        <span className="trace-tag">AUDIT TRACEABILITY PROOF</span>
                        <h3>{info.title}</h3>
                        <span className="trace-id">{info.docId}</span>
                    </div>
                    <button type="button" className="btn-close-drawer" onClick={onClose}>×</button>
                </div>

                <div className="trace-drawer-body">
                    <div className="trace-highlight-box">
                        <div className="hl-tag">HIGHLIGHTED AUDIT POINT:</div>
                        <div className="hl-val">{info.highlightedField}</div>
                        <span className="hl-meta">{info.timestamp}</span>
                    </div>

                    <div className="trace-source-box">
                        <span className="lbl">Verified Data Ingestion Pipeline:</span>
                        <div className="src-val">
                            <span className="dot-green"></span>
                            <strong>{info.source}</strong>
                        </div>
                    </div>

                    <div className="trace-fields-list">
                        <h4>Regulatory Extracted Key-Value Audit Matrix</h4>
                        <div className="fields-grid">
                            {info.extractedFields.map((f, i) => (
                                <div key={i} className="field-row">
                                    <span className="f-lbl">{f.label}:</span>
                                    <strong className="f-val">{f.val}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="trace-crypto-proof">
                        <span className="lbl">Cryptographic SHA-256 Tamper Proof:</span>
                        <code>{info.checksum}</code>
                    </div>
                </div>

                <div className="trace-drawer-footer">
                    <button type="button" className="btn-close-trace" onClick={onClose}>Close Source View</button>
                </div>
            </div>
        </div>
    );
};

export default TraceabilityDrawer;
