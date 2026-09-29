import React from 'react';
import { usePartnerLMS } from '../PartnerLMSAuthContext';

const Step11Annexures = ({ formData, updateFormData }) => {
    const { partnerProfile } = usePartnerLMS();

    const annexures = formData.annexures || [
        { id: 1, name: 'Annexure 1 - Proof of KYC of Promoters & Guarantors', status: 'Uploaded & Verified' },
        { id: 2, name: 'Annexure 2 - Proof of KYC of Applicant Enterprise (PAN, GST)', status: 'Uploaded & Verified' },
        { id: 3, name: 'Annexure 3 - Last 3 Years Annual Audited Accounts', status: 'Uploaded & Verified' },
        { id: 4, name: 'Annexure 4 - Partnership Deed / MOA & AOA', status: 'Uploaded & Verified' },
        { id: 5, name: 'Annexure 5 - List of Existing & Proposed Shareholding Pattern', status: 'Uploaded & Verified' },
        { id: 6, name: 'Annexure 6 - MSME Udyam Registration Certificate', status: 'Uploaded & Verified' },
        { id: 7, name: 'Annexure 7 - Authorised Signatory Resolution for E-Signing', status: 'Uploaded & Verified' }
    ];

    const isDeclared = formData.isDeclared || true;

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step 11: Annexures, Statutory Declarations & Facilitator E-Sign</h3>
                <p>Verify attached dossier annexures, confirm statutory borrower declarations, and log case submission timestamp.</p>
            </div>

            {/* Annexures Checklist */}
            <div className="finance-table-box">
                <h4>Mandatory Annexures Dossier</h4>
                <table className="finance-data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Particulars</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {annexures.map((ann, idx) => (
                            <tr key={ann.id}>
                                <td>{idx + 1}</td>
                                <td>{ann.name}</td>
                                <td><span className="pill-balanced">✓ {ann.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Statutory Declaration */}
            <div className="finance-table-box" style={{ marginTop: '1.5rem' }}>
                <h4>Borrower & Channel Partner Declarations</h4>
                <div className="declaration-scroll-box">
                    <p>• I/We hereby certify that all information furnished above in this Financial Assistance Application & Project Report are true and correct to the best of my/our knowledge and belief.</p>
                    <p>• I/We have no objection if SIDBI / Target Banks furnish the information submitted by me/us to CIBIL / RBI / Credit Information Bureaus for evaluating financial assistance.</p>
                    <p>• I/We are not involved in any illegal production, weapon/munition trade, coal-related restricted activities, or hazardous chemical manufacture violating environmental conventions.</p>
                    <p>• I/We understand that this application is submitted electronically through the BeeFund Partner LMS platform.</p>
                </div>

                <label className="checkbox-declaration">
                    <input
                        type="checkbox"
                        checked={isDeclared}
                        onChange={(e) => updateFormData({ isDeclared: e.target.checked })}
                    />
                    <span><strong>I confirm all data entries are verified against original documents.</strong></span>
                </label>
            </div>

            {/* Facilitator Details & Sign Stamp */}
            <div className="facilitator-sign-stamp-box">
                <div className="fac-meta-left">
                    <span className="fac-badge">LOGGED BY LICENSED FACILITATOR</span>
                    <h4>{partnerProfile.name}</h4>
                    <p>Facilitator ID: <strong>{partnerProfile.facilitatorId}</strong> | Lead ID: <strong>{partnerProfile.leadId}</strong></p>
                    <p>Address: {partnerProfile.address}</p>
                </div>
                <div className="fac-sign-right">
                    <div className="digital-sign-card">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <div>
                            <strong>Digitally Verified by Facilitator</strong>
                            <span>{new Date().toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step11Annexures;
