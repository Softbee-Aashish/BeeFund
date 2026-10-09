import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usePartnerLMS } from './PartnerLMSAuthContext';
import { LOAN_PRODUCTS, BORROWER_NICHES, ENTITY_TYPES } from './masterDocMatrix';

// Step Component Imports
import StepUniversalKYC from './steps/StepUniversalKYC';
import Step2ProductFacility from './steps/Step2ProductFacility';
import StepDynamicDocVault from './steps/StepDynamicDocVault';
import StepBillDiscounting from './steps/StepBillDiscounting';
import Step1BasicInfo from './steps/Step1BasicInfo';
import StepPersonalKYC from './steps/StepPersonalKYC';
import StepSalariedIncome from './steps/StepSalariedIncome';
import StepProfessionalProfile from './steps/StepProfessionalProfile';
import StepWorkingCapitalStock from './steps/StepWorkingCapitalStock';
import StepMachineryDetails from './steps/StepMachineryDetails';
import StepPropertyCollateral from './steps/StepPropertyCollateral';
import StepVehicleDetails from './steps/StepVehicleDetails';
import Step2GSTInfo from './steps/Step2GSTInfo';
import Step3ITRUpload from './steps/Step3ITRUpload';
import Step4BankUpload from './steps/Step4BankUpload';
import Step5Promoters from './steps/Step5Promoters';
import Step6ProjectCost from './steps/Step6ProjectCost';
import Step7FacilityDetails from './steps/Step7FacilityDetails';
import Step8SecurityDetails from './steps/Step8SecurityDetails';
import Step9PastEstimates from './steps/Step9PastEstimates';
import Step10StrategicPlan from './steps/Step10StrategicPlan';
import Step11Annexures from './steps/Step11Annexures';
import ValidationErrorModal from './components/ValidationErrorModal';
import PartnerThemeToggle from './components/PartnerThemeToggle';
import { validateStep } from './lmsValidator';

import './PartnerLMSCaseNew.css';

/**
 * Dynamic Step Generator based on 9 Master Loan Products x Entity Type x Loan Sizing
 */
export const getTailoredSteps = (productType = 'BL', entityType = 'PROPRIETORSHIP', borrowerNiche = 'SENP') => {
    const isSalaried = entityType === 'INDIVIDUAL_SALARIED' || borrowerNiche === 'SALARIED';

    // Universal Base Steps for every case
    const baseSteps = [
        { key: 'universal_kyc', label: '1. Applicant & Promoter KYC' },
        { key: 'product_facility', label: '2. Loan Facility & Product Sizing' }
    ];

    let middleSteps = [];

    switch (productType) {
        case 'HL':
            if (isSalaried) {
                middleSteps = [
                    { key: 'salaried_income', label: '3. Salary Income & Employer Profile' },
                    { key: 'bank_upload', label: '4. Salary Account Bank Statements' },
                    { key: 'property', label: '5. Property Identification & Title Deeds' },
                    { key: 'facility', label: '6. Home Loan Sizing & FOIR' }
                ];
            } else {
                middleSteps = [
                    { key: 'gst', label: '3. GST Turnover & Compliance' },
                    { key: 'itr', label: '4. 3-Year ITR & Financial Statements' },
                    { key: 'bank_upload', label: '5. 12M Operating Bank Statement' },
                    { key: 'property', label: '6. Property Title Deeds & Valuation' },
                    { key: 'facility', label: '7. Home Loan Sizing & Repayment' }
                ];
            }
            break;

        case 'LAP':
            middleSteps = [
                { key: 'gst', label: '3. GST Turnover & ITC Reconciliation' },
                { key: 'itr', label: '4. 2–3 Year Audited Financials & ITR' },
                { key: 'bank_upload', label: '5. 12-Month Banking Statement Analyzer' },
                { key: 'property', label: '6. Mortgage Property Valuation & Legal EC' },
                { key: 'security', label: '7. Collateral Security & Guarantees' },
                { key: 'facility', label: '8. LAP Sizing, LTV & Debt Burden' }
            ];
            break;

        case 'ML':
            middleSteps = [
                { key: 'machinery', label: '3. Machinery Specifications & Supplier Quotations' },
                { key: 'capex_means', label: '4. Cost of Capex & Means of Finance' },
                { key: 'gst', label: '5. GST Turnover & Compliance' },
                { key: 'bank_upload', label: '6. 12M Operating Bank Statement' },
                { key: 'financials', label: '7. Operating DSCR & 5-Year Projections' },
                { key: 'security', label: '8. Machinery Hypothecation & Security' }
            ];
            break;

        case 'BL':
            middleSteps = [
                { key: 'gst', label: '3. GST Turnover & Regularity' },
                { key: 'bank_upload', label: '4. 12-Month Banking Statement Analyzer' },
                { key: 'itr', label: '5. 2–3 Year ITR & Financial Statements' },
                { key: 'facility', label: '6. Loan Sizing & EMI Obligations' }
            ];
            break;

        case 'PL':
            middleSteps = [
                { key: 'salaried_income', label: '3. Employer Profile & Monthly Payslips' },
                { key: 'bank_upload', label: '4. 6-Month Salary Bank Statement' },
                { key: 'facility', label: '5. Personal Loan Sizing & Net FOIR' }
            ];
            break;

        case 'AL':
            middleSteps = [
                { key: 'vehicle', label: '3. Vehicle Model & Dealer Proforma Invoice' },
                isSalaried ? { key: 'salaried_income', label: '4. Salary Income Verification' } : { key: 'gst', label: '4. GST & Business Financials' },
                { key: 'bank_upload', label: '5. 6–12 Month Bank Statement' },
                { key: 'facility', label: '6. Auto Loan Sizing & Repayment Tenure' }
            ];
            break;

        case 'PROJECT':
            middleSteps = [
                { key: 'project_cost', label: '3. Detailed Project Cost & Means of Finance' },
                { key: 'gst', label: '4. GST Turnover & Invoicing Track' },
                { key: 'bank_upload', label: '5. Multi-Bank Cash Flow Analyzer' },
                { key: 'financials', label: '6. Past Performance & CMA Projections' },
                { key: 'security', label: '7. Primary & Collateral Security Matrix' },
                { key: 'strategic_plan', label: '8. Milestone Execution, TEV & DCCO Roadmap' }
            ];
            break;

        case 'OD_CC':
            middleSteps = [
                { key: 'wc_stock', label: '3. Stock, Book Debts & Tandon MPBF' },
                { key: 'gst', label: '4. GST Turnover & ITC Reconciliation' },
                { key: 'bank_upload', label: '5. 12M Current Account Banking' },
                { key: 'financials', label: '6. Audited Financials & Operating Estimates' },
                { key: 'facility', label: '7. OD / CC Limit Sizing & Sub-Limits' },
                { key: 'security', label: '8. Stock Hypothecation & Collateral' }
            ];
            break;

        case 'BILL_DISCOUNTING':
            middleSteps = [
                { key: 'bill_discounting', label: '3. Commercial Invoices, PO & POD Details' },
                { key: 'gst', label: '4. GSTR-1 Invoicing Reconciliation' },
                { key: 'bank_upload', label: '5. 12M Banking & Credit Inflows' },
                { key: 'financials', label: '6. Financial Track Record & ITR' }
            ];
            break;

        default:
            middleSteps = [
                { key: 'gst', label: '3. GST Turnover & Compliance' },
                { key: 'bank_upload', label: '4. 12M Bank Statement Analysis' },
                { key: 'itr', label: '5. ITR & Financial Statements' },
                { key: 'facility', label: '6. Loan Sizing & Debt Burden' }
            ];
    }

    const finalSteps = [
        { key: 'annexures', label: 'Statutory Declarations & E-Sign' }
    ];

    const allSteps = [...baseSteps, ...middleSteps, ...finalSteps];
    return allSteps.map((step, idx) => ({
        ...step,
        id: idx + 1,
        label: step.label.startsWith(`${idx + 1}.`) ? step.label : `${idx + 1}. ${step.label}`
    }));
};

const PartnerLMSCaseNew = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, createCase } = usePartnerLMS();

    // Default configuration: begins directly with Universal KYC
    const [loanConfig, setLoanConfig] = useState(() => {
        const state = location.state || {};
        return {
            loanProduct: state.loanProduct || state.loanType || 'BL',
            entityType: state.entityType || 'PROPRIETORSHIP',
            borrowerNiche: state.borrowerNiche || 'SENP',
            loanAmountLakhs: state.loanAmountLakhs || 50.0
        };
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    // Master Form State
    const [formData, setFormData] = useState(() => {
        const state = location.state || {};
        const amt = state.loanAmountLakhs || 50.0;
        const formattedAmt = state.loanAmountFormatted || (amt >= 100 ? `₹${(amt / 100).toFixed(2)} Cr` : `₹${amt.toFixed(2)} Lakhs`);
        const eName = state.enterpriseName || '';
        const aName = state.applicantName || '';

        return {
            enterpriseName: eName,
            applicantName: aName,
            entityType: state.entityType || 'PROPRIETORSHIP',
            loanProduct: state.loanProduct || 'BL',
            loanType: state.loanType || 'Business Loan (BL)',
            constitution: state.entityType === 'INDIVIDUAL_SALARIED' ? 'Individual (Salaried)' : state.entityType === 'INDIVIDUAL_SELF_EMPLOYED' ? 'Individual (Self-Employed)' : 'Partnership',
            pan: '',
            aadhaarNo: '',
            udyamNo: '',
            yearsOfOperation: 'Enterprise having 3 years ITR or more',
            industry: 'Manufacturing & Processing',
            msmeCategory: 'MICRO / SMALL',
            targetLender: 'State Bank of India (MSME Desk)',
            loanAmountLakhs: amt,
            loanAmountFormatted: formattedAmt,
            loanTenureMonths: 60,
            borrowerNiche: state.borrowerNiche || 'SENP',
            registeredOffice: '',
            residentialAddress: '',
            cityState: 'New Delhi, Delhi',
            pincode: '110001',
            contactMobile: '',
            contactEmail: '',
            loanPurpose: 'Business expansion & working capital procurement',
            promoters: [
                {
                    id: 1,
                    name: aName || eName || 'Primary Applicant / Promoter',
                    pan: '',
                    aadhaar: '',
                    shareholding: 100,
                    cibil: 758,
                    netWorthLakhs: 150.0,
                    designation: state.entityType === 'INDIVIDUAL_SALARIED' ? 'Primary Applicant' : 'Managing Director / Partner'
                }
            ],
            documentStatuses: {}
        };
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/partnerLMS/login');
        }
    }, [isAuthenticated, navigate]);

    const updateFormData = (fields) => {
        setFormData(prev => {
            const next = { ...prev, ...fields };
            // Update loanConfig if loanProduct, entityType or borrowerNiche changes
            if (fields.loanProduct || fields.entityType || fields.borrowerNiche || fields.loanAmountLakhs) {
                setLoanConfig(c => ({
                    ...c,
                    loanProduct: fields.loanProduct || c.loanProduct,
                    entityType: fields.entityType || c.entityType,
                    borrowerNiche: fields.borrowerNiche || c.borrowerNiche,
                    loanAmountLakhs: fields.loanAmountLakhs || c.loanAmountLakhs
                }));
            }
            return next;
        });
    };

    // Calculate dynamic steps
    const steps = getTailoredSteps(formData.loanProduct || 'BL', formData.entityType || 'PROPRIETORSHIP', formData.borrowerNiche || 'SENP');
    const currentStepObj = steps[currentStep - 1] || steps[0];

    const currentProductMeta = LOAN_PRODUCTS.find(p => p.id === (formData.loanProduct || 'BL')) || LOAN_PRODUCTS[3];

    const handleNext = () => {
        const validation = validateStep(currentStepObj.key, formData, loanConfig);
        if (!validation.isValid) {
            setValidationErrors(validation.errors);
            setIsValidationModalOpen(true);
            return;
        }

        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleStepClick = (targetStepId) => {
        if (targetStepId > currentStep) {
            const validation = validateStep(currentStepObj.key, formData, loanConfig);
            if (!validation.isValid) {
                setValidationErrors(validation.errors);
                setIsValidationModalOpen(true);
                return;
            }
        }
        setCurrentStep(targetStepId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmitCase = () => {
        const validation = validateStep(currentStepObj.key, formData, loanConfig);
        if (!validation.isValid) {
            setValidationErrors(validation.errors);
            setIsValidationModalOpen(true);
            return;
        }

        const created = createCase(formData);
        navigate(`/partnerLMS/case/${created.id}`);
    };

    // Render step component dynamically
    const renderStepContent = (stepKey) => {
        switch (stepKey) {
            case 'universal_kyc':
                return <StepUniversalKYC formData={formData} updateFormData={updateFormData} />;
            case 'product_facility':
                return <Step2ProductFacility formData={formData} updateFormData={updateFormData} />;
            case 'bill_discounting':
                return <StepBillDiscounting formData={formData} updateFormData={updateFormData} />;
            case 'doc_vault':
                return <StepDynamicDocVault formData={formData} updateFormData={updateFormData} />;
            case 'basic_info':
                return <Step1BasicInfo formData={formData} updateFormData={updateFormData} />;
            case 'personal_kyc':
                return <StepPersonalKYC formData={formData} updateFormData={updateFormData} />;
            case 'salaried_income':
                return <StepSalariedIncome formData={formData} updateFormData={updateFormData} />;
            case 'professional_profile':
                return <StepProfessionalProfile formData={formData} updateFormData={updateFormData} />;
            case 'wc_stock':
                return <StepWorkingCapitalStock formData={formData} updateFormData={updateFormData} />;
            case 'machinery':
                return <StepMachineryDetails formData={formData} updateFormData={updateFormData} />;
            case 'property':
                return <StepPropertyCollateral formData={formData} updateFormData={updateFormData} />;
            case 'vehicle':
                return <StepVehicleDetails formData={formData} updateFormData={updateFormData} />;
            case 'promoters':
                return <Step5Promoters formData={formData} updateFormData={updateFormData} />;
            case 'project_cost':
            case 'capex_means':
                return <Step6ProjectCost formData={formData} updateFormData={updateFormData} />;
            case 'gst':
                return <Step2GSTInfo formData={formData} updateFormData={updateFormData} />;
            case 'itr':
                return <Step3ITRUpload formData={formData} updateFormData={updateFormData} />;
            case 'bank_upload':
                return <Step4BankUpload formData={formData} updateFormData={updateFormData} />;
            case 'financials':
                return <Step9PastEstimates formData={formData} updateFormData={updateFormData} />;
            case 'facility':
                return <Step7FacilityDetails formData={formData} updateFormData={updateFormData} />;
            case 'security':
                return <Step8SecurityDetails formData={formData} updateFormData={updateFormData} />;
            case 'strategic_plan':
                return <Step10StrategicPlan formData={formData} updateFormData={updateFormData} />;
            case 'annexures':
                return <Step11Annexures formData={formData} updateFormData={updateFormData} />;
            default:
                return <StepUniversalKYC formData={formData} updateFormData={updateFormData} />;
        }
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
                            <strong>{formData.enterpriseName || formData.applicantName || 'New Credit Proposal'}</strong>
                            <span className="case-limit-badge">{currentProductMeta.name}</span>
                            <span className="niche-active-pill">{formData.entityType}</span>
                        </div>
                    </div>

                    <div className="wizard-top-actions">
                        <PartnerThemeToggle />
                        <button type="button" onClick={handleBack} disabled={currentStep === 1} className="btn-wiz-nav">
                            ← Previous
                        </button>
                        {currentStep < steps.length ? (
                            <button type="button" onClick={handleNext} className="btn-wiz-next">
                                Save & Continue (Step {currentStep + 1}/{steps.length}) →
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
                        <span>{steps.length}-STEP DYNAMIC INGESTION FLOW</span>
                    </div>
                    <ul className="wizard-steps-list">
                        {steps.map(step => (
                            <li
                                key={step.id}
                                className={`step-nav-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                                onClick={() => handleStepClick(step.id)}
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
                    {renderStepContent(currentStepObj.key)}

                    {/* Bottom Step Actions */}
                    <div className="wizard-bottom-bar">
                        <div className="bottom-save-info">
                            <span>Step {currentStep} of {steps.length}: <strong>{currentStepObj.label}</strong></span>
                        </div>
                        <div className="wizard-top-actions">
                            <button type="button" onClick={handleBack} disabled={currentStep === 1} className="btn-wiz-nav">
                                ← Back
                            </button>
                            {currentStep < steps.length ? (
                                <button type="button" onClick={handleNext} className="btn-wiz-next">
                                    Save & Continue →
                                </button>
                            ) : (
                                <button type="button" onClick={handleSubmitCase} className="btn-wiz-submit">
                                    ✓ Submit Case Proposal
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Validation Error Modal */}
            <ValidationErrorModal
                isOpen={isValidationModalOpen}
                onClose={() => setIsValidationModalOpen(false)}
                errors={validationErrors}
                stepTitle={currentStepObj.label}
            />
        </div>
    );
};

export default PartnerLMSCaseNew;
