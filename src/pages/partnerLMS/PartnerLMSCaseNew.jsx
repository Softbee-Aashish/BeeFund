import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usePartnerLMS } from './PartnerLMSAuthContext';
import LeadCategoryModal, { LOAN_PRODUCT_CONFIGS } from './LeadCategoryModal';

// Step Component Imports
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
import { validateStep } from './lmsValidator';

import './PartnerLMSCaseNew.css';

// Dynamic Step Generator based on Loan Product & Niche
export const getTailoredSteps = (loanType, borrowerNiche) => {
    switch (loanType) {
        case 'UNSECURED_BUSINESS':
            return [
                { id: 1, key: 'basic_info', label: 'Enterprise Profile & Applicant KYC' },
                { id: 2, key: 'promoters', label: 'Promoters / Signatory & CIBIL Profile' },
                { id: 3, key: 'gst', label: 'GST Turnover & Filing Regularity' },
                { id: 4, key: 'bank_upload', label: '12-Month Banking Statement Analyzer' },
                { id: 5, key: 'itr', label: '2-3 Year ITR & Financial Statements' },
                { id: 6, key: 'facility', label: 'Loan Sizing & EMI Debt Obligations' },
                { id: 7, key: 'annexures', label: 'Statutory Declarations & E-Sign' }
            ];

        case 'WORKING_CAPITAL':
            return [
                { id: 1, key: 'basic_info', label: 'Enterprise Profile & Udyam KYC' },
                { id: 2, key: 'promoters', label: 'Promoters & Management Shareholding' },
                { id: 3, key: 'gst', label: 'GST Turnover & ITC Reconciliation' },
                { id: 4, key: 'bank_upload', label: 'Current Account 12M Bank Statement' },
                { id: 5, key: 'wc_stock', label: 'Stock, Book Debts & Drawing Power' },
                { id: 6, key: 'financials', label: 'Past Performance & Operating Estimates' },
                { id: 7, key: 'facility', label: 'OD / CC Limit Sizing & Sub-Limits' },
                { id: 8, key: 'security', label: 'Stock Hypothecation & Collateral Security' },
                { id: 9, key: 'annexures', label: 'Annexures & Facilitator E-Sign' }
            ];

        case 'MACHINERY_TERM':
            return [
                { id: 1, key: 'basic_info', label: 'Enterprise Profile & Factory Location' },
                { id: 2, key: 'promoters', label: 'Promoters & Management Profile' },
                { id: 3, key: 'machinery', label: 'Machinery Specifications & Supplier Quotations' },
                { id: 4, key: 'capex_means', label: 'Cost of Capex & Means of Finance' },
                { id: 5, key: 'bank_upload', label: '12M Bank Statement & GST Filings' },
                { id: 6, key: 'strategic_plan', label: 'Operating DSCR Projections & Execution Plan' },
                { id: 7, key: 'security', label: 'Machinery Hypothecation & Collateral' },
                { id: 8, key: 'annexures', label: 'Annexures & Facilitator Sign-Off' }
            ];

        case 'PROJECT_FINANCE':
            return [
                { id: 1, key: 'basic_info', label: 'Enterprise Profile & Project Sizing' },
                { id: 2, key: 'promoters', label: 'Promoters KYC & Shareholding Pattern' },
                { id: 3, key: 'project_cost', label: 'Full Project Cost & Means of Finance' },
                { id: 4, key: 'bank_upload', label: 'Multi-Bank Statement Analysis' },
                { id: 5, key: 'gst', label: 'GST Turnover & ITR Verification' },
                { id: 6, key: 'financials', label: 'Financial Track Record & CMA Projections' },
                { id: 7, key: 'security', label: 'Primary & Collateral Security Matrix' },
                { id: 8, key: 'strategic_plan', label: 'Milestone Execution & DCCO Roadmap' },
                { id: 9, key: 'annexures', label: 'Annexures, Statutory Declarations & Sign' }
            ];

        case 'HOME_LAP':
            if (borrowerNiche === 'SALARIED') {
                return [
                    { id: 1, key: 'personal_kyc', label: 'Applicant & Co-Applicant Personal KYC' },
                    { id: 2, key: 'salaried_income', label: 'Employer Details & Monthly Salary Profile' },
                    { id: 3, key: 'bank_upload', label: 'Salary Account 6-Month Bank Statement' },
                    { id: 4, key: 'property', label: 'Property Identification & Legal Valuation' },
                    { id: 5, key: 'facility', label: 'Home Loan / LAP Sizing & FOIR Calculation' },
                    { id: 6, key: 'annexures', label: 'Borrower Declarations & E-Sign' }
                ];
            } else if (borrowerNiche === 'SEP') {
                return [
                    { id: 1, key: 'personal_kyc', label: 'Professional Applicant KYC & Identity' },
                    { id: 2, key: 'professional_profile', label: 'Medical / CA / Legal Council Credentials' },
                    { id: 3, key: 'itr', label: '3-Year Professional ITR & Gross Receipts' },
                    { id: 4, key: 'bank_upload', label: '12-Month Professional & Savings Banking' },
                    { id: 5, key: 'property', label: 'Property Collateral Title Deeds & Valuation' },
                    { id: 6, key: 'facility', label: 'Facility Sizing, LTV & Debt Obligations' },
                    { id: 7, key: 'annexures', label: 'Declarations & Facilitator E-Sign' }
                ];
            } else {
                // SENP (Self Employed Non-Professional)
                return [
                    { id: 1, key: 'basic_info', label: 'Business Enterprise & Applicant KYC' },
                    { id: 2, key: 'gst', label: 'GST Turnover & Compliance Profile' },
                    { id: 3, key: 'itr', label: '3-Year Business ITR & Computation' },
                    { id: 4, key: 'bank_upload', label: '12-Month Business Current Account Banking' },
                    { id: 5, key: 'property', label: 'Mortgage Property Valuation & Sanction Plan' },
                    { id: 6, key: 'facility', label: 'Loan Sizing, LTV & Existing Debt Burden' },
                    { id: 7, key: 'annexures', label: 'Declarations & Facilitator E-Sign' }
                ];
            }

        case 'AUTO_CV':
            if (borrowerNiche === 'SALARIED') {
                return [
                    { id: 1, key: 'personal_kyc', label: 'Applicant KYC & Residence Proof' },
                    { id: 2, key: 'salaried_income', label: 'Employer & Net Monthly Salary Profile' },
                    { id: 3, key: 'bank_upload', label: 'Salary Account 6-Month Bank Statement' },
                    { id: 4, key: 'vehicle', label: 'Vehicle Model, Dealer Quotation & Down Payment' },
                    { id: 5, key: 'facility', label: 'Auto Loan Sizing & EMI Repayment Match' },
                    { id: 6, key: 'annexures', label: 'Declarations & E-Sign' }
                ];
            } else {
                // Commercial Vehicle / Fleet / SENP
                return [
                    { id: 1, key: 'basic_info', label: 'Transport Firm / Enterprise KYC' },
                    { id: 2, key: 'vehicle', label: 'Commercial Vehicle Specifications & Fleet Profile' },
                    { id: 3, key: 'bank_upload', label: '12-Month Operational Bank Statement' },
                    { id: 4, key: 'gst', label: 'GST Turnover & Tax Filings' },
                    { id: 5, key: 'facility', label: 'Vehicle Loan Sizing & Route Cash Flow Match' },
                    { id: 6, key: 'annexures', label: 'Declarations & Facilitator E-Sign' }
                ];
            }

        case 'PERSONAL_GOLD':
            if (borrowerNiche === 'SALARIED') {
                return [
                    { id: 1, key: 'personal_kyc', label: 'Borrower KYC & Identification' },
                    { id: 2, key: 'salaried_income', label: 'Employer & Monthly Salary Verification' },
                    { id: 3, key: 'bank_upload', label: '3-6 Month Salary Bank Statement' },
                    { id: 4, key: 'facility', label: 'Personal Loan Sizing, Tenure & FOIR' },
                    { id: 5, key: 'annexures', label: 'Borrower Declarations & E-Sign' }
                ];
            } else {
                return [
                    { id: 1, key: 'personal_kyc', label: 'Borrower & Business/Professional KYC' },
                    { id: 2, key: 'itr', label: '2-Year ITR & Income Computation' },
                    { id: 3, key: 'bank_upload', label: '6-12 Month Bank Statement' },
                    { id: 4, key: 'facility', label: 'Loan Sizing & Debt Burden' },
                    { id: 5, key: 'annexures', label: 'Declarations & Facilitator E-Sign' }
                ];
            }

        default:
            return [
                { id: 1, key: 'basic_info', label: 'Applicant Basic Information & KYC' },
                { id: 2, key: 'gst', label: 'GST Turnover & Compliance' },
                { id: 3, key: 'itr', label: 'ITR Returns & Tax Profiling' },
                { id: 4, key: 'bank_upload', label: 'Bank Statement Analyzer (BSA)' },
                { id: 5, key: 'promoters', label: 'Promoters & Shareholding' },
                { id: 6, key: 'project_cost', label: 'Project Cost & Means of Finance' },
                { id: 7, key: 'facility', label: 'Facility Details & Sizing' },
                { id: 8, key: 'security', label: 'Security & Asset Hypothecation' },
                { id: 9, key: 'financials', label: 'Past Performance & Financials' },
                { id: 10, key: 'strategic_plan', label: 'Strategic Plan & Execution Targets' },
                { id: 11, key: 'annexures', label: 'Annexures & Facilitator Sign-Off' }
            ];
    }
};

const PartnerLMSCaseNew = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, createCase } = usePartnerLMS();

    // Configuration from navigation state or defaults
    const [loanConfig, setLoanConfig] = useState(() => {
        const state = location.state;
        return {
            loanType: state?.loanType || 'UNSECURED_BUSINESS',
            loanTypeTitle: state?.loanTypeTitle || 'Unsecured Business Loan (BL)',
            borrowerNiche: state?.borrowerNiche || 'BUSINESS_ENTITY',
            borrowerName: state?.borrowerName || 'Apex Precision Polymers LLP',
            estimatedAmountLakhs: state?.estimatedAmountLakhs || 50.0
        };
    });

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);

    // Compute tailored steps
    const steps = getTailoredSteps(loanConfig.loanType, loanConfig.borrowerNiche);

    // Master Form State
    const [formData, setFormData] = useState({
        enterpriseName: loanConfig.borrowerName,
        applicantName: loanConfig.borrowerName,
        constitution: 'Partnership',
        pan: 'ABNFA3331Q',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Manufacturing',
        msmeCategory: 'SMALL',
        udyamNo: 'UDYAM-UP-29-0013890',
        registeredOffice: 'Industrial Complex Phase 1, Ghaziabad, Uttar Pradesh',
        pincode: '201001',
        cityState: 'Ghaziabad, Uttar Pradesh',
        factoryAddressProposed: 'Plot 45, Ecotech Industrial Park, Greater Noida, Uttar Pradesh',
        targetLender: 'State Bank of India (MSME Desk)',
        loanType: loanConfig.loanTypeTitle,
        loanCategoryCode: loanConfig.loanType,
        borrowerNiche: loanConfig.borrowerNiche,
        loanAmountFormatted: `₹${(loanConfig.estimatedAmountLakhs / 100).toFixed(2)} Cr`,
        projectCostFormatted: `₹${((loanConfig.estimatedAmountLakhs * 1.33) / 100).toFixed(2)} Cr`,
        termLoanLakhs: loanConfig.estimatedAmountLakhs,
        loanAmountLakhs: loanConfig.estimatedAmountLakhs,
        projectCostLakhs: loanConfig.estimatedAmountLakhs * 1.33
    });

    const updateFormData = (fields) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const handleSwitchCategory = (newConfig) => {
        setLoanConfig(newConfig);
        setIsCategoryModalOpen(false);
        setCurrentStep(1);
        setFormData(prev => ({
            ...prev,
            enterpriseName: newConfig.borrowerName || prev.enterpriseName,
            applicantName: newConfig.borrowerName || prev.applicantName,
            loanType: newConfig.loanTypeTitle,
            loanCategoryCode: newConfig.loanType,
            borrowerNiche: newConfig.borrowerNiche,
            loanAmountLakhs: newConfig.estimatedAmountLakhs,
            termLoanLakhs: newConfig.estimatedAmountLakhs,
            loanAmountFormatted: `₹${(newConfig.estimatedAmountLakhs / 100).toFixed(2)} Cr`
        }));
    };

    if (!isAuthenticated) {
        navigate('/partnerLMS/login');
        return null;
    }

    const currentStepObj = steps[currentStep - 1] || steps[0];

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
                return <Step1BasicInfo formData={formData} updateFormData={updateFormData} />;
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
                            <strong>{formData.enterpriseName || formData.applicantName || 'New Case Proposal'}</strong>
                            <span className="case-limit-badge">{loanConfig.loanTypeTitle}</span>
                            {loanConfig.borrowerNiche !== 'BUSINESS_ENTITY' && (
                                <span className="niche-active-pill">{loanConfig.borrowerNiche}</span>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="btn-switch-product-gate"
                                title="Change Loan Product or Niche"
                            >
                                ⇄ Switch Product
                            </button>
                        </div>
                    </div>

                    <div className="wizard-top-actions">
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
                        <span>{steps.length}-STEP UNDERWRITING FLOW</span>
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

                    {/* Bottom Action Bar */}
                    <div className="wizard-bottom-bar">
                        <button type="button" onClick={handleBack} disabled={currentStep === 1} className="btn-wiz-nav">
                            ← Previous Step
                        </button>
                        <div className="bottom-save-info">
                            <span>Auto-saved to Partner Drafts • Step {currentStep} of {steps.length}</span>
                        </div>
                        {currentStep < steps.length ? (
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

            {/* Switch Product / Niche Modal */}
            <LeadCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSelectCategory={handleSwitchCategory}
            />

            {/* Validation Restriction Alert Modal */}
            <ValidationErrorModal
                isOpen={isValidationModalOpen}
                errors={validationErrors}
                onClose={() => setIsValidationModalOpen(false)}
            />
        </div>
    );
};

export default PartnerLMSCaseNew;
