import React from 'react';

const StepMachineryDetails = ({ formData, updateFormData }) => {
    const machinery = formData.machineryDetails || [
        { id: 1, name: 'CNC Automatic Laser Cutting Machine (12kW)', supplier: 'Apex Industrial Automation Ltd', origin: 'Indigenous', costLakhs: 85.0, status: 'Proforma Invoice Uploaded' },
        { id: 2, name: 'Hydraulic Press Brake & Bending Unit', supplier: 'Precision Techno Equipments', origin: 'Indigenous', costLakhs: 45.0, status: 'Quotation Received' }
    ];

    const updateMachineryItem = (index, field, value) => {
        const updated = [...machinery];
        updated[index][field] = field === 'costLakhs' ? (parseFloat(value) || 0) : value;
        updateFormData({ machineryDetails: updated });
    };

    const addMachineryItem = () => {
        const newItem = {
            id: Date.now(),
            name: '',
            supplier: '',
            origin: 'Indigenous',
            costLakhs: 25.0,
            status: 'Quotation Attached'
        };
        updateFormData({ machineryDetails: [...machinery, newItem] });
    };

    const removeMachineryItem = (index) => {
        const updated = machinery.filter((_, i) => i !== index);
        updateFormData({ machineryDetails: updated });
    };

    const totalMachineryCost = machinery.reduce((sum, m) => sum + (m.costLakhs || 0), 0);
    const promoterMargin = totalMachineryCost * 0.20; // 20% standard promoter contribution
    const proposedLoan = totalMachineryCost - promoterMargin;

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step: Plant & Machinery Specifications & Supplier Quotations</h3>
                <p>Add specific machinery items to be financed, OEM supplier quotations, and 80:20 Capex financing split.</p>
            </div>

            <div className="finance-table-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4>Machinery Breakdown & Proforma Invoices</h4>
                    <button type="button" onClick={addMachineryItem} className="btn-add-partner-row">
                        + Add Machine
                    </button>
                </div>

                <table className="finance-data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Machine Description</th>
                            <th>OEM Supplier</th>
                            <th>Origin</th>
                            <th>Cost (₹ Lakhs)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {machinery.map((item, idx) => (
                            <tr key={item.id}>
                                <td>{idx + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        className="table-cell-input"
                                        value={item.name}
                                        onChange={(e) => updateMachineryItem(idx, 'name', e.target.value)}
                                        placeholder="e.g. 5-Axis CNC Milling Machine"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="table-cell-input"
                                        value={item.supplier}
                                        onChange={(e) => updateMachineryItem(idx, 'supplier', e.target.value)}
                                        placeholder="e.g. LMW / Mazak India"
                                    />
                                </td>
                                <td>
                                    <select
                                        className="table-cell-input"
                                        value={item.origin}
                                        onChange={(e) => updateMachineryItem(idx, 'origin', e.target.value)}
                                    >
                                        <option value="Indigenous">Indigenous</option>
                                        <option value="Imported">Imported</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="table-cell-input"
                                        value={item.costLakhs}
                                        onChange={(e) => updateMachineryItem(idx, 'costLakhs', e.target.value)}
                                    />
                                </td>
                                <td>
                                    {machinery.length > 1 && (
                                        <button type="button" onClick={() => removeMachineryItem(idx)} className="btn-table-remove">✕</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Machinery Cost Split Summary */}
            <div className="finance-balance-banner balanced" style={{ marginTop: '1.5rem' }}>
                <div className="balance-col">
                    <span>Total Machinery Invoices</span>
                    <h3>₹{totalMachineryCost.toFixed(2)} Lakhs</h3>
                </div>
                <div className="balance-col">
                    <span>Promoter Margin (20%)</span>
                    <h3>₹{promoterMargin.toFixed(2)} Lakhs</h3>
                </div>
                <div className="balance-col text-right">
                    <span>Eligible Machinery Term Loan</span>
                    <h3 className="text-gold">₹{proposedLoan.toFixed(2)} Lakhs</h3>
                </div>
            </div>
        </div>
    );
};

export default StepMachineryDetails;
