import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePartnerLMS } from './PartnerLMSAuthContext';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2GSTInfo from './steps/Step2GSTInfo';
import Step3ITRUpload from './steps/Step3ITRUpload';
import Step4BankUpload from './steps/Step4BankUpload';
import Step5Promoters from './steps/Step5Promoters';
import Step6ProjectCost from './steps/Step6ProjectCost';
import Step7FacilityDetails from './steps/Step7FacilityDetails';
import Step8SecurityDetails from './steps/Step8SecurityDetails';
import Step9PastEstimates from './steps/Step9PastEstimates';
import Step10GreenFinance from './steps/Step10GreenFinance';
import Step11Annexures from './steps/Step11Annexures';
import './PartnerLMSCaseNew.css';

const STEPS = [
    { id: 1, label: 'Applicant Basic Information' },
    { id: 2, label: 'GST Information' },
    { id: 3, label: 'ITR Statement Upload' },
    { id: 4, label: 'Bank Statement Upload' },
    { id: 5, label: 'Promoters Details' },
    { id: 6, label: 'Project Cost & Means of Finance' },
    { id: 7, label: 'Facility Details' },
    { id: 8, label: 'Security Details' },
    { id: 9, label: 'Past Performance & Governance' },
    { id: 10, label: '4E / Green Finance & IFC' },
    { id: 11, label: 'Annexures & Declarations' }
];

const PartnerLMSCaseNew = () => {
    const navigate = useNavigate();
    const { isAuthenticated, createCase, partnerProfile } = usePartnerLMS();
    const [currentStep, setCurrentStep] = useState(1);

    // Master Form State
    const [formData, setFormData] = useState({
        enterpriseName: 'AMBESTEN PACKAGINGS',
        constitution: 'Partnership',
        pan: 'ABNFA3331Q',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Manufacturing',
        msmeCategory: 'SMALL',
        udyamNo: 'UDYAM-UP-29-0013890',
        registeredOffice: 'BASEMENT 116 NAVYUG MARKET, GHAZIABAD, UTTAR PRADESH',
        pincode: '201001',
        cityState: 'Ghaziabad, Uttar Pradesh',
        factoryAddressProposed: 'KHASRA NUMBER 313 RAVAN URF BADGAON TEHSIL KHEKDA BADGAON ROAD NEAR NATIONAL PERIPHERAL EXPRESSWAY, DISTRICT BAGHPAT',
        targetLender: 'SIDBI New Delhi Branch',
        loanType: 'Rupee Term Loan (Project Finance)',
        loanAmountFormatted: '₹27.00 Cr',
        projectCostFormatted: '₹36.00 Cr',
        termLoanLakhs: 2700.0,
        projectCostLakhs: 3600.0
    });

    const updateFormData = (fields) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    if (!isAuthenticated) {
        navigate('/partnerLMS/login');
        return null;
    }

    const handleNext = () => {
        if (currentStep < 11) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmitCase = () => {
        const created = createCase(formData);
        navigate(`/partnerLMS/case/${created.id}`);
    };

    return (
        <div className="lms-wizard-root">
            {/* Top Bar */}
            <header className="wizard-top-header">
                <div className="wizard-top-inner">
                    <div className="wizard-title-group">
                        <Link to="/partnerLMS/dashboard" className="btn-back-dash">← Back to Dashboard</Link>
                        <span className="sep-pipe">|</span>
                        <div className="case-title-meta">
                            <strong>{formData.enterpriseName || 'New Case Proposal'}</strong>
                            <span className="case-limit-badge">Limit: ₹1L to ₹10000L</span>
                        </div>
                    </div>

                    <div className="wizard-top-actions">
                        <button type="button" onClick={handleBack} disabled={currentStep === 1} className="btn-wiz-nav">
                            ← Previous Step
                        </button>
                        {currentStep < 11 ? (
                            <button type="button" onClick={handleNext} className="btn-wiz-next">
                                Save & Continue (Step {currentStep + 1}/11) →
                            </button>
                        ) : (
                            <button type="button" onClick={handleSubmitCase} className="btn-wiz-submit">
                                ✓ Submit Case Proposal to LMS
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Layout Body: Left Step Nav + Right Form Content */}
            <div className="wizard-layout-body">
                {/* Left Steps Navigation */}
                <aside className="wizard-sidebar">
                    <div className="sidebar-header">
                        <span>11-STEP PROPOSAL MATRIX</span>
                    </div>
                    <ul className="wizard-steps-list">
                        {STEPS.map(step => (
                            <li
                                key={step.id}
                                className={`step-nav-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                                onClick={() => setCurrentStep(step.id)}
                            >
                                <span className="step-num-circle">
                                    {currentStep > step.id ? '✓' : step.id}
                                </span>
                                <span className="step-label-text">{step.label}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Right Step Canvas */}
                <main className="wizard-main-canvas">
                    {currentStep === 1 && <Step1BasicInfo formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 2 && <Step2GSTInfo formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 3 && <Step3ITRUpload formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 4 && <Step4BankUpload formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 5 && <Step5Promoters formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 6 && <Step6ProjectCost formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 7 && <Step7FacilityDetails formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 8 && <Step8SecurityDetails formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 9 && <Step9PastEstimates formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 10 && <Step10GreenFinance formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 11 && <Step11Annexures formData={formData} updateFormData={updateFormData} />}

                    {/* Bottom Action Bar */}
                    <div className="wizard-bottom-bar">
                        <button type="button" onClick={handleBack} disabled={currentStep === 1} className="btn-wiz-nav">
                            ← Previous Step
                        </button>
                        <div className="bottom-save-info">
                            <span>Auto-saved to Partner Drafts • Step {currentStep} of 11</span>
                        </div>
                        {currentStep < 11 ? (
                            <button type="button" onClick={handleNext} className="btn-wiz-next">
                                Save & Continue →
                            </button>
                        ) : (
                            <button type="button" onClick={handleSubmitCase} className="btn-wiz-submit">
                                ✓ Complete & Submit Case to LMS
                            </button>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PartnerLMSCaseNew;
