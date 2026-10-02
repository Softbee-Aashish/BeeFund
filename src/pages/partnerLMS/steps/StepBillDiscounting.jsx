import React from 'react';

const StepBillDiscounting = ({ formData, updateFormData }) => {
    const invoices = formData.invoices && formData.invoices.length > 0 ? formData.invoices : [
        {
            id: 1,
            buyerName: 'Tata Motors Limited (Commercial Vehicle Division)',
            buyerGst: '27AAACT2727Q1ZB',
            invoiceNo: 'INV/2026-27/0891',
            invoiceDate: '12/09/2026',
            poNo: 'PO-TML-CV-88219',
            grossAmount: 4850000,
            gstAmount: 873000,
            netReceivable: 5723000,
            dueDate: '12/12/2026',
            tenureDays: 90,
            transporterLr: 'VRL-LOG-891024',
            podStatus: 'VERIFIED_POD'
        }
    ];

    const handleInvoiceChange = (index, field, value) => {
        const updated = [...invoices];
        updated[index] = { ...updated[index], [field]: value };
        updateFormData({ invoices: updated });
    };

    const addInvoice = () => {
        const newInvoice = {
            id: Date.now(),
            buyerName: '',
            buyerGst: '',
            invoiceNo: '',
            invoiceDate: '',
            poNo: '',
            grossAmount: 0,
            gstAmount: 0,
            netReceivable: 0,
            dueDate: '',
            tenureDays: 90,
            transporterLr: '',
            podStatus: 'PENDING_POD'
        };
        updateFormData({ invoices: [...invoices, newInvoice] });
    };

    const removeInvoice = (index) => {
        if (invoices.length <= 1) return;
        const updated = invoices.filter((_, i) => i !== index);
        updateFormData({ invoices: updated });
    };

    const totalInvoiceValue = invoices.reduce((sum, inv) => sum + Number(inv.netReceivable || 0), 0);
    const advanceRate = formData.discountingAdvanceRate || 80;
    const eligibleAdvance = (totalInvoiceValue * advanceRate) / 100;

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step: Commercial Invoice & Bill Discounting Details</h3>
                <p>Provide accepted commercial invoices, Purchase Orders (PO), delivery challans (POD), and GSTR-1 matching records for immediate bill discounting.</p>
            </div>

            {/* Invoices Sizing Summary */}
            <div className="finance-balance-banner balanced">
                <div className="balance-col">
                    <span>Total Discountable Receivables</span>
                    <h3>₹{(totalInvoiceValue / 100000).toFixed(2)} Lakhs (₹{(totalInvoiceValue / 10000000).toFixed(2)} Cr)</h3>
                </div>
                <div className="balance-col">
                    <span>Discounting Advance Rate</span>
                    <h3>{advanceRate}% Advance Sizing</h3>
                </div>
                <div className="balance-col text-right">
                    <span>Net Disbursable Liquidity</span>
                    <h3 style={{ color: 'var(--wiz-accent)' }}>₹{(eligibleAdvance / 100000).toFixed(2)} Lakhs</h3>
                </div>
            </div>

            {/* Invoices Table & Card List */}
            <div className="finance-table-box">
                <div className="table-box-header">
                    <h4>Trade Receivables & Accepted Commercial Invoices ({invoices.length})</h4>
                    <span className="badge-stat-right">e-Invoice IRN & GSTR-1 Matched</span>
                </div>

                <div className="promoters-grid-list">
                    {invoices.map((inv, idx) => (
                        <div key={inv.id || idx} className="promoter-card-box">
                            <div className="promoter-card-top">
                                <span className="promoter-badge">
                                    Invoice #{idx + 1} — {inv.invoiceNo || 'New Bill'}
                                </span>
                                {invoices.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeInvoice(idx)}
                                        className="btn-remove-tbl"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            <div className="promoter-fields-grid">
                                <div className="field-group">
                                    <label>Corporate Buyer Name *</label>
                                    <input
                                        type="text"
                                        value={inv.buyerName || ''}
                                        onChange={(e) => handleInvoiceChange(idx, 'buyerName', e.target.value)}
                                        placeholder="e.g. Tata Motors / L&T"
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Buyer GSTIN *</label>
                                    <input
                                        type="text"
                                        value={inv.buyerGst || ''}
                                        onChange={(e) => handleInvoiceChange(idx, 'buyerGst', e.target.value.toUpperCase())}
                                        placeholder="15-digit GSTIN"
                                        maxLength="15"
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Invoice Number *</label>
                                    <input
                                        type="text"
                                        value={inv.invoiceNo || ''}
                                        onChange={(e) => handleInvoiceChange(idx, 'invoiceNo', e.target.value)}
                                        placeholder="e.g. INV-2026-901"
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Purchase Order (PO) Ref *</label>
                                    <input
                                        type="text"
                                        value={inv.poNo || ''}
                                        onChange={(e) => handleInvoiceChange(idx, 'poNo', e.target.value)}
                                        placeholder="e.g. PO-8921"
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Gross Invoice Value (₹) *</label>
                                    <input
                                        type="number"
                                        value={inv.grossAmount || 0}
                                        onChange={(e) => {
                                            const gross = Number(e.target.value);
                                            const gst = Number(inv.gstAmount || 0);
                                            handleInvoiceChange(idx, 'grossAmount', gross);
                                            handleInvoiceChange(idx, 'netReceivable', gross + gst);
                                        }}
                                        placeholder="Gross Amount"
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>GST Tax Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={inv.gstAmount || 0}
                                        onChange={(e) => {
                                            const gst = Number(e.target.value);
                                            const gross = Number(inv.grossAmount || 0);
                                            handleInvoiceChange(idx, 'gstAmount', gst);
                                            handleInvoiceChange(idx, 'netReceivable', gross + gst);
                                        }}
                                        placeholder="GST Tax"
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Transporter Lorry Receipt (LR) / Challan</label>
                                    <input
                                        type="text"
                                        value={inv.transporterLr || ''}
                                        onChange={(e) => handleInvoiceChange(idx, 'transporterLr', e.target.value)}
                                        placeholder="e.g. VRL-89210"
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Proof of Delivery (POD) Status</label>
                                    <select
                                        value={inv.podStatus || 'VERIFIED_POD'}
                                        onChange={(e) => handleInvoiceChange(idx, 'podStatus', e.target.value)}
                                    >
                                        <option value="VERIFIED_POD">Buyer Accepted & Verified POD</option>
                                        <option value="GOODS_IN_TRANSIT">Goods in Transit (LR Attached)</option>
                                        <option value="PENDING_POD">Pending Acceptance</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addInvoice}
                    className="btn-add-table-row"
                >
                    + Add Commercial Invoice for Discounting
                </button>
            </div>
        </div>
    );
};

export default StepBillDiscounting;
