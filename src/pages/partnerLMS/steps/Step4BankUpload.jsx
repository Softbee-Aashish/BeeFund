import React from 'react';

const Step4BankUpload = ({ formData, updateFormData }) => {
    const bankAccounts = formData.bankAccounts || [
        { id: 1, bankName: 'HDFC Bank', accountNo: 'XXXXXX4920', type: 'Current Account', ifsc: 'HDFC0001202', abb: '₹34.20 Lakhs', bsaPeriod: '12M', selectedForBSA: true },
        { id: 2, bankName: 'State Bank of India', accountNo: 'XXXXXX8812', type: 'Cash Credit Account', ifsc: 'SBIN0004081', abb: '₹82.50 Lakhs', bsaPeriod: '12M', selectedForBSA: true }
    ];

    const toggleAccountBSA = (index) => {
        const updated = [...bankAccounts];
        updated[index].selectedForBSA = !updated[index].selectedForBSA;
        updateFormData({ bankAccounts: updated });
    };

    const addAccount = () => {
        const newAcc = {
            id: Date.now(),
            bankName: 'ICICI Bank',
            accountNo: 'XXXXXX' + Math.floor(1000 + Math.random() * 9000),
            type: 'Current Account',
            ifsc: 'ICIC0000491',
            abb: '₹12.00 Lakhs',
            bsaPeriod: '12M',
            selectedForBSA: false
        };
        updateFormData({ bankAccounts: [...bankAccounts, newAcc] });
    };

    const removeAccount = (index) => {
        const updated = bankAccounts.filter((_, i) => i !== index);
        updateFormData({ bankAccounts: updated });
    };

    const selectedCount = bankAccounts.filter(a => a.selectedForBSA).length;

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 4: Operational Bank Accounts & BSA Configuration</h3>
                <p>Configure client's operating bank accounts. Select which accounts to run BSA parsing on (Wallet deduction: ₹30 for 6M / ₹45 for 12M per account).</p>
            </div>

            <div className="bsa-config-summary">
                <span>Selected Accounts for Deep BSA Parsing: <strong>{selectedCount} Account(s)</strong></span>
                <span className="wallet-deduct-pill">Est. Wallet Deduction: <strong>₹{selectedCount * 45}</strong></span>
            </div>

            <div className="bank-accounts-list">
                {bankAccounts.map((acc, idx) => (
                    <div key={acc.id || idx} className={`bank-card-item ${acc.selectedForBSA ? 'selected' : ''}`}>
                        <div className="bank-card-header">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={acc.selectedForBSA}
                                    onChange={() => toggleAccountBSA(idx)}
                                />
                                <strong>{acc.bankName}</strong> ({acc.type})
                            </label>
                            <button type="button" onClick={() => removeAccount(idx)} className="btn-remove-row">×</button>
                        </div>

                        <div className="bank-card-grid">
                            <div>
                                <span className="lbl">A/C Number:</span>
                                <span className="val">{acc.accountNo}</span>
                            </div>
                            <div>
                                <span className="lbl">IFSC Code:</span>
                                <span className="val">{acc.ifsc}</span>
                            </div>
                            <div>
                                <span className="lbl">6M/12M ABB (Approx):</span>
                                <span className="val text-gold">{acc.abb}</span>
                            </div>
                            <div>
                                <span className="lbl">BSA Period:</span>
                                <span className="val">{acc.bsaPeriod}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button type="button" onClick={addAccount} className="btn-add-table-row">
                + Add Operational Bank Account
            </button>
        </div>
    );
};

export default Step4BankUpload;
