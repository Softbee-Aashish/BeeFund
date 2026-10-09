import React, { useState } from 'react';
import './CaseKYCTab.css';

const CaseKYCTab = ({ caseData, onUpdateCase }) => {
    // Determine initial persona (Salaried vs Businessman / Self-Employed)
    const initialIsSalaried = (() => {
        if (!caseData) return true;
        const eType = (caseData.entityType || caseData.constitution || '').toUpperCase();
        const niche = (caseData.borrowerNiche || '').toUpperCase();
        if (eType.includes('SALARIED') || niche === 'SALARIED' || caseData.salariedDetails != null) {
            return true;
        }
        if (eType.includes('PROPRIETOR') || eType.includes('PARTNERSHIP') || eType.includes('PVT') || eType.includes('LLP') || niche === 'SENP' || niche === 'SEP') {
            return false;
        }
        return true;
    })();

    const [borrowerType, setBorrowerType] = useState(initialIsSalaried ? 'SALARIED' : 'BUSINESS');
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Form state initialized from caseData
    const [kycData, setKycData] = useState({
        // Personal KYC
        fullName: caseData?.applicantName || caseData?.promoters?.[0]?.name || caseData?.enterpriseName || 'Rajesh Kumar Sharma',
        dob: caseData?.dob || caseData?.promoters?.[0]?.dob || '14/08/1988',
        gender: caseData?.gender || 'Male',
        maritalStatus: caseData?.maritalStatus || 'Married',
        fatherOrSpouseName: caseData?.fatherOrSpouseName || 'Shri Rameshwar Dayal Sharma',
        pan: caseData?.pan || caseData?.promoters?.[0]?.pan || 'BQZPS4819M',
        aadhaar: caseData?.aadhaar || caseData?.promoters?.[0]?.aadhaar || 'XXXX-XXXX-4921',
        mobile: caseData?.contactMobile || caseData?.promoters?.[0]?.mobile || '9811029381',
        altMobile: caseData?.altMobile || '9871029482',
        email: caseData?.contactEmail || 'rajesh.sharma@gmail.com',
        ckycNumber: caseData?.ckycNumber || '902188401928',

        // Residential Address
        currentAddress: caseData?.registeredOffice || 'Flat 804, Tower B, Supertech Emerald Court, Sector 93A, Noida, Uttar Pradesh',
        currentCity: caseData?.city || 'Noida',
        currentState: caseData?.state || 'Uttar Pradesh',
        currentPincode: caseData?.pincode || '201304',
        residenceOwnership: caseData?.residenceOwnership || 'Owned (Self / Family)',
        residenceVintageYears: caseData?.residenceVintageYears || 6,
        permanentAddress: caseData?.permanentAddress || 'Flat 804, Tower B, Supertech Emerald Court, Sector 93A, Noida, UP - 201304',

        // Salaried Profile Details (Where he works, salary, designation)
        employerName: caseData?.salariedDetails?.employerName || 'Tata Consultancy Services Limited',
        employerCategory: caseData?.salariedDetails?.employerCategory || 'Category A / Listed Super-Prime MNC',
        designation: caseData?.salariedDetails?.designation || caseData?.promoters?.[0]?.designation || 'Lead Solutions Architect',
        totalExperienceYears: caseData?.salariedDetails?.totalWorkExperienceYears || 9,
        currentCompanyVintageYears: caseData?.salariedDetails?.currentCompanyVintageYears || 4,
        officeAddress: caseData?.salariedDetails?.officeAddress || 'TCS Tech Ridge, Sector 135, Expressway, Noida, UP - 201305',
        officialEmail: caseData?.salariedDetails?.officialEmail || 'rajesh.sharma@tcs.com',
        grossMonthlySalary: caseData?.salariedDetails?.monthlyGross || 183000,
        netMonthlySalary: caseData?.salariedDetails?.monthlyNet || caseData?.monthlyNetSalary || 155000,
        salaryMode: caseData?.salariedDetails?.salaryMode || 'Direct Bank Transfer (NEFT/RTGS)',
        salaryBankName: caseData?.bankAccounts?.[0]?.bankName || 'HDFC Bank Ltd',
        salaryAccountNo: caseData?.bankAccounts?.[0]?.accountNo || 'XXXXXX9482',
        form16IncomeAY1: caseData?.salariedDetails?.form16AY1 || 1980000,
        form16IncomeAY2: caseData?.salariedDetails?.form16AY2 || 2250000,

        // Businessman / Self-Employed Profile Details
        businessName: caseData?.enterpriseName || 'Sharma Precision & Industrial Solutions',
        constitution: caseData?.constitution || 'Sole Proprietorship',
        businessPan: caseData?.pan || 'BQZPS4819M',
        gstin: caseData?.gstin || '09BQZPS4819M1Z8',
        businessVintageYears: caseData?.yearsOfOperation ? parseInt(caseData.yearsOfOperation) || 5 : 5,
        industryType: caseData?.industry || 'IT Consulting & Industrial Automation',
        annualTurnover: caseData?.turnoverLakhs || (caseData?.pastFinancials?.sales?.currentEst) || 85.0,
        netAnnualProfit: caseData?.netProfitLakhs || (caseData?.pastFinancials?.netProfit?.currentEst) || 16.5,
        businessAddress: caseData?.registeredOffice || 'Shop 14, Commercial Complex, Sector 62, Noida - 201301',
        businessBankName: caseData?.bankAccounts?.[0]?.bankName || 'ICICI Bank Ltd',
        businessAccountNo: caseData?.bankAccounts?.[0]?.accountNo || 'XXXXXX7721',

        // Loan Facility & Banking Details
        requestedLoanAmount: caseData?.loanAmountLakhs || 15.0,
        loanPurpose: caseData?.loanPurpose || 'Debt Consolidation & Home Refurbishment',
        desiredTenureMonths: caseData?.tenureMonths || 48,
        existingMonthlyEMIs: caseData?.salariedDetails?.existingEMIs || 25000,
        disbursalBankName: caseData?.bankAccounts?.[0]?.bankName || 'HDFC Bank Ltd',
        disbursalAccountNo: caseData?.bankAccounts?.[0]?.accountNo || 'XXXXXX9482',
        disbursalIfsc: caseData?.bankAccounts?.[0]?.ifsc || 'HDFC0001422'
    });

    const handleChange = (field, value) => {
        setKycData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setIsEditing(false);
        setSaveSuccess(true);
        if (onUpdateCase) {
            onUpdateCase({
                ...caseData,
                applicantName: kycData.fullName,
                enterpriseName: borrowerType === 'SALARIED' ? `${kycData.fullName} (Personal Loan)` : kycData.businessName,
                pan: kycData.pan,
                contactMobile: kycData.mobile,
                contactEmail: kycData.email,
                registeredOffice: kycData.currentAddress,
                loanAmountLakhs: parseFloat(kycData.requestedLoanAmount) || caseData.loanAmountLakhs,
                salariedDetails: {
                    ...caseData?.salariedDetails,
                    employerName: kycData.employerName,
                    designation: kycData.designation,
                    monthlyGross: parseFloat(kycData.grossMonthlySalary) || 0,
                    monthlyNet: parseFloat(kycData.netMonthlySalary) || 0,
                    existingEMIs: parseFloat(kycData.existingMonthlyEMIs) || 0,
                    officialEmail: kycData.officialEmail
                }
            });
        }
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    return (
        <div className="case-kyc-tab-root">
            {/* Top KYC Header Banner */}
            <div className="kyc-hero-header">
                <div className="kyc-hero-left">
                    <div className="kyc-title-row">
                        <span className="kyc-section-badge">UNIVERSAL STAGE 1</span>
                        <h2 className="kyc-main-heading">KYC & Applicant Master Profile</h2>
                    </div>
                    <p className="kyc-subtitle">
                        Pre-filled from application ingestion with verified regulatory checks (NSDL, UIDAI e-KYC, CKYC Registry).
                    </p>
                </div>

                <div className="kyc-hero-right">
                    {/* Persona Selector (Salaried vs Businessman) */}
                    <div className="borrower-persona-toggle-group">
                        <span className="persona-label">Borrower Persona:</span>
                        <div className="persona-toggle-pills">
                            <button
                                type="button"
                                className={`persona-pill-btn ${borrowerType === 'SALARIED' ? 'active' : ''}`}
                                onClick={() => setBorrowerType('SALARIED')}
                            >
                                <span className="persona-icon">💼</span>
                                <span>Salaried Professional</span>
                            </button>
                            <button
                                type="button"
                                className={`persona-pill-btn ${borrowerType === 'BUSINESS' ? 'active' : ''}`}
                                onClick={() => setBorrowerType('BUSINESS')}
                            >
                                <span className="persona-icon">🏢</span>
                                <span>Businessman / Self-Employed</span>
                            </button>
                        </div>
                    </div>

                    <div className="kyc-action-buttons">
                        {isEditing ? (
                            <>
                                <button type="button" className="btn-kyc-cancel" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn-kyc-save" onClick={handleSave}>
                                    Save Profile Updates
                                </button>
                            </>
                        ) : (
                            <button type="button" className="btn-kyc-edit" onClick={() => setIsEditing(true)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                <span>Edit KYC Data</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {saveSuccess && (
                <div className="kyc-success-banner">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>KYC Profile details successfully updated and synchronized across underwriter rules!</span>
                </div>
            )}

            {/* Verification Status KPI Ribbon */}
            <div className="kyc-verification-ribbon">
                <div className="ribbon-card ribbon-verified">
                    <div className="ribbon-icon">✓</div>
                    <div className="ribbon-text">
                        <span className="ribbon-title">NSDL PAN Verification</span>
                        <span className="ribbon-status">100% Match ({kycData.pan})</span>
                    </div>
                </div>

                <div className="ribbon-card ribbon-verified">
                    <div className="ribbon-icon">✓</div>
                    <div className="ribbon-text">
                        <span className="ribbon-title">UIDAI Aadhaar e-KYC</span>
                        <span className="ribbon-status">OTP & Demographic Match</span>
                    </div>
                </div>

                <div className="ribbon-card ribbon-verified">
                    <div className="ribbon-icon">✓</div>
                    <div className="ribbon-text">
                        <span className="ribbon-title">CKYC Identifier</span>
                        <span className="ribbon-status">CKYC: {kycData.ckycNumber}</span>
                    </div>
                </div>

                <div className="ribbon-card ribbon-active">
                    <div className="ribbon-icon">★</div>
                    <div className="ribbon-text">
                        <span className="ribbon-title">KYC Compliance Score</span>
                        <span className="ribbon-status">100% Ready for Underwriting</span>
                    </div>
                </div>
            </div>

            {/* MAIN KYC CARDS GRID */}
            <div className="kyc-cards-grid">
                {/* 1. PERSONAL & IDENTITY DETAILS CARD */}
                <div className="kyc-card">
                    <div className="kyc-card-header">
                        <div className="card-header-title">
                            <span className="card-idx-pill">1</span>
                            <h3>Customer Identity & Personal KYC</h3>
                        </div>
                        <span className="card-status-badge success">Verified</span>
                    </div>

                    <div className="kyc-card-body">
                        <div className="kyc-field-grid">
                            <div className="kyc-field">
                                <label>Full Applicant Name (As per PAN/Aadhaar)</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={kycData.fullName}
                                        onChange={(e) => handleChange('fullName', e.target.value)}
                                    />
                                ) : (
                                    <div className="field-value-box highlight-strong">{kycData.fullName}</div>
                                )}
                            </div>

                            <div className="kyc-field">
                                <label>Father's / Spouse's Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={kycData.fatherOrSpouseName}
                                        onChange={(e) => handleChange('fatherOrSpouseName', e.target.value)}
                                    />
                                ) : (
                                    <div className="field-value-box">{kycData.fatherOrSpouseName}</div>
                                )}
                            </div>

                            <div className="kyc-field">
                                <label>Date of Birth & Age</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={kycData.dob}
                                        onChange={(e) => handleChange('dob', e.target.value)}
                                    />
                                ) : (
                                    <div className="field-value-box">{kycData.dob} (Age: 38 Yrs)</div>
                                )}
                            </div>

                            <div className="kyc-field">
                                <label>Gender & Marital Status</label>
                                {isEditing ? (
                                    <div className="dual-inputs">
                                        <input
                                            type="text"
                                            value={kycData.gender}
                                            onChange={(e) => handleChange('gender', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={kycData.maritalStatus}
                                            onChange={(e) => handleChange('maritalStatus', e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div className="field-value-box">{kycData.gender} • {kycData.maritalStatus}</div>
                                )}
                            </div>

                            <div className="kyc-field">
                                <label>PAN Card Number</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={kycData.pan}
                                        onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                                    />
                                ) : (
                                    <div className="field-value-box mono-badge">
                                        <strong>{kycData.pan}</strong>
                                        <span className="mini-check">✓ NSDL Valid</span>
                                    </div>
                                )}
                            </div>

                            <div className="kyc-field">
                                <label>Aadhaar Number (UIDAI e-KYC)</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={kycData.aadhaar}
                                        onChange={(e) => handleChange('aadhaar', e.target.value)}
                                    />
                                ) : (
                                    <div className="field-value-box mono-badge">
                                        <strong>{kycData.aadhaar}</strong>
                                        <span className="mini-check">✓ e-KYC OK</span>
                                    </div>
                                )}
                            </div>

                            <div className="kyc-field">
                                <label>Mobile Contact</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={kycData.mobile}
                                        onChange={(e) => handleChange('mobile', e.target.value)}
                                    />
                                ) : (
                                    <div className="field-value-box">
                                        +91 {kycData.mobile}
                                        {kycData.altMobile && <span className="alt-text">(Alt: {kycData.altMobile})</span>}
                                    </div>
                                )}
                            </div>

                            <div className="kyc-field">
                                <label>Personal Email ID</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={kycData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                    />
                                ) : (
                                    <div className="field-value-box">{kycData.email}</div>
                                )}
                            </div>

                            <div className="kyc-field col-span-2">
                                <label>Current Residential Address (With Stability)</label>
                                {isEditing ? (
                                    <textarea
                                        rows="2"
                                        value={kycData.currentAddress}
                                        onChange={(e) => handleChange('currentAddress', e.target.value)}
                                    />
                                ) : (
                                    <div className="field-value-box">
                                        <span>{kycData.currentAddress}</span>
                                        <div className="residence-meta-chips">
                                            <span className="res-chip">Type: {kycData.residenceOwnership}</span>
                                            <span className="res-chip">Vintage: {kycData.residenceVintageYears} Years at address</span>
                                            <span className="res-chip">PIN: {kycData.currentPincode}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. EMPLOYMENT & SALARY KYC (Where he works, salary, designation) */}
                {borrowerType === 'SALARIED' && (
                    <div className="kyc-card kyc-card-highlight">
                        <div className="kyc-card-header">
                            <div className="card-header-title">
                                <span className="card-idx-pill">2</span>
                                <div>
                                    <h3>Salaried Employment, Workplace & Income KYC</h3>
                                    <span className="card-header-sub">Employer Verification, Net Salary Credits & Corporate Track</span>
                                </div>
                            </div>
                            <span className="card-status-badge premium">Category A Super-Prime</span>
                        </div>

                        <div className="kyc-card-body">
                            <div className="kyc-field-grid">
                                <div className="kyc-field col-span-2">
                                    <label>Where Customer Works (Employer / Company Name)</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={kycData.employerName}
                                            onChange={(e) => handleChange('employerName', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box highlight-strong employer-box">
                                            <span className="employer-icon">🏢</span>
                                            <div>
                                                <strong>{kycData.employerName}</strong>
                                                <span className="employer-badge">{kycData.employerCategory}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>Designation / Job Role</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={kycData.designation}
                                            onChange={(e) => handleChange('designation', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box">
                                            <strong>{kycData.designation}</strong>
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>Total Experience & Current Company Vintage</label>
                                    {isEditing ? (
                                        <div className="dual-inputs">
                                            <input
                                                type="number"
                                                placeholder="Total Years"
                                                value={kycData.totalExperienceYears}
                                                onChange={(e) => handleChange('totalExperienceYears', e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Company Years"
                                                value={kycData.currentCompanyVintageYears}
                                                onChange={(e) => handleChange('currentCompanyVintageYears', e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="field-value-box">
                                            {kycData.totalExperienceYears} Years Total • {kycData.currentCompanyVintageYears} Years at Current Firm
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>Net In-Hand Monthly Take-Home Salary (₹)</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={kycData.netMonthlySalary}
                                            onChange={(e) => handleChange('netMonthlySalary', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box salary-highlight">
                                            <span className="salary-val">₹{Number(kycData.netMonthlySalary).toLocaleString('en-IN')}</span>
                                            <span className="salary-lbl">/ Month (In-Hand Bank Credit)</span>
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>Gross Monthly CTC Salary (₹)</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={kycData.grossMonthlySalary}
                                            onChange={(e) => handleChange('grossMonthlySalary', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box">
                                            ₹{Number(kycData.grossMonthlySalary).toLocaleString('en-IN')} / Month (Pre-Tax)
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>Official Work Email Address</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={kycData.officialEmail}
                                            onChange={(e) => handleChange('officialEmail', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box mono-badge">
                                            {kycData.officialEmail}
                                            <span className="mini-check">✓ Domain Verified</span>
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>Salary Mode & Primary Salary Bank Account</label>
                                    {isEditing ? (
                                        <div className="dual-inputs">
                                            <input
                                                type="text"
                                                placeholder="Bank Name"
                                                value={kycData.salaryBankName}
                                                onChange={(e) => handleChange('salaryBankName', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="A/c Number"
                                                value={kycData.salaryAccountNo}
                                                onChange={(e) => handleChange('salaryAccountNo', e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="field-value-box">
                                            {kycData.salaryMode} • <strong>{kycData.salaryBankName}</strong> ({kycData.salaryAccountNo})
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field col-span-2">
                                    <label>Workplace / Corporate Office Address</label>
                                    {isEditing ? (
                                        <textarea
                                            rows="2"
                                            value={kycData.officeAddress}
                                            onChange={(e) => handleChange('officeAddress', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box">{kycData.officeAddress}</div>
                                    )}
                                </div>

                                <div className="kyc-field col-span-2">
                                    <label>Form 16 Taxable Income Track (ITD e-Filing Verification)</label>
                                    <div className="form16-grid">
                                        <div className="form16-box">
                                            <span className="f16-lbl">AY 2024-25 Gross Taxable:</span>
                                            <span className="f16-val">₹{(Number(kycData.form16IncomeAY1) / 100000).toFixed(2)} Lakhs</span>
                                        </div>
                                        <div className="form16-box">
                                            <span className="f16-lbl">AY 2025-26 Gross Taxable:</span>
                                            <span className="f16-val">₹{(Number(kycData.form16IncomeAY2) / 100000).toFixed(2)} Lakhs</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. BUSINESS & ENTERPRISE DETAILS (Shown for Businessman / Self-Employed PL) */}
                {borrowerType === 'BUSINESS' && (
                    <div className="kyc-card kyc-card-highlight">
                        <div className="kyc-card-header">
                            <div className="card-header-title">
                                <span className="card-idx-pill">2</span>
                                <div>
                                    <h3>Businessman / Self-Employed Enterprise KYC</h3>
                                    <span className="card-header-sub">Business Vintage, GST Returns & Operating Cashflow</span>
                                </div>
                            </div>
                            <span className="card-status-badge success">Active GST Registered</span>
                        </div>

                        <div className="kyc-card-body">
                            <div className="kyc-field-grid">
                                <div className="kyc-field col-span-2">
                                    <label>Business / Enterprise Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={kycData.businessName}
                                            onChange={(e) => handleChange('businessName', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box highlight-strong employer-box">
                                            <span className="employer-icon">🏭</span>
                                            <div>
                                                <strong>{kycData.businessName}</strong>
                                                <span className="employer-badge">{kycData.constitution}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>GSTIN Number</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={kycData.gstin}
                                            onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                                        />
                                    ) : (
                                        <div className="field-value-box mono-badge">
                                            <strong>{kycData.gstin}</strong>
                                            <span className="mini-check">✓ GST Active</span>
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>Business Vintage (Years of Operation)</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={kycData.businessVintageYears}
                                            onChange={(e) => handleChange('businessVintageYears', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box">
                                            {kycData.businessVintageYears}+ Years In Business Track
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>Annual Business Turnover (₹)</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={kycData.annualTurnover}
                                            onChange={(e) => handleChange('annualTurnover', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box salary-highlight">
                                            <span className="salary-val">₹{Number(kycData.annualTurnover).toFixed(2)} Lakhs</span>
                                            <span className="salary-lbl">/ Year (GSTR-3B Matched)</span>
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>Net Annual Profit (PAT as per ITR)</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={kycData.netAnnualProfit}
                                            onChange={(e) => handleChange('netAnnualProfit', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box">
                                            ₹{Number(kycData.netAnnualProfit).toFixed(2)} Lakhs (Filed ITR)
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>Industry / Nature of Business</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={kycData.industryType}
                                            onChange={(e) => handleChange('industryType', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box">{kycData.industryType}</div>
                                    )}
                                </div>

                                <div className="kyc-field">
                                    <label>Operating Current Account Bank</label>
                                    {isEditing ? (
                                        <div className="dual-inputs">
                                            <input
                                                type="text"
                                                placeholder="Bank Name"
                                                value={kycData.businessBankName}
                                                onChange={(e) => handleChange('businessBankName', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="A/c Number"
                                                value={kycData.businessAccountNo}
                                                onChange={(e) => handleChange('businessAccountNo', e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="field-value-box">
                                            <strong>{kycData.businessBankName}</strong> ({kycData.businessAccountNo})
                                        </div>
                                    )}
                                </div>

                                <div className="kyc-field col-span-2">
                                    <label>Registered Business / Factory / Shop Address</label>
                                    {isEditing ? (
                                        <textarea
                                            rows="2"
                                            value={kycData.businessAddress}
                                            onChange={(e) => handleChange('businessAddress', e.target.value)}
                                        />
                                    ) : (
                                        <div className="field-value-box">{kycData.businessAddress}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. LOAN REQUIREMENT & DISBURSAL BANKING KYC */}
                <div className="kyc-card">
                    <div className="kyc-card-header">
                        <div className="card-header-title">
                            <span className="card-idx-pill">3</span>
                            <h3>Personal Loan Sizing & Disbursal Banking KYC</h3>
                        </div>
                        <span className="card-status-badge cyan">Clean Unsecured</span>
                    </div>

                    <div className="kyc-card-body">
                        <div className="kyc-field-grid">
                            <div className="kyc-field">
                                <label>Requested Loan Amount</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={kycData.requestedLoanAmount}
                                        onChange={(e) => handleChange('requestedLoanAmount', e.target.value)}
                                    />
                                ) : (
                                    <div className="field-value-box highlight-strong loan-amount-box">
                                        <span className="loan-amount-val">₹{Number(kycData.requestedLoanAmount).toFixed(2)} Lakhs</span>
                                    </div>
                                )}
                            </div>

                            <div className="kyc-field">
                                <label>Loan Purpose / Usage End-Use</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={kycData.loanPurpose}
                                        onChange={(e) => handleChange('loanPurpose', e.target.value)}
                                    />
                                ) : (
                                    <div className="field-value-box">{kycData.loanPurpose}</div>
                                )}
                            </div>

                            <div className="kyc-field">
                                <label>Desired Tenure & Monthly Existing EMIs</label>
                                {isEditing ? (
                                    <div className="dual-inputs">
                                        <input
                                            type="number"
                                            placeholder="Tenure (Months)"
                                            value={kycData.desiredTenureMonths}
                                            onChange={(e) => handleChange('desiredTenureMonths', e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Existing EMIs (₹)"
                                            value={kycData.existingMonthlyEMIs}
                                            onChange={(e) => handleChange('existingMonthlyEMIs', e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div className="field-value-box">
                                        {kycData.desiredTenureMonths} Months • Existing EMIs: ₹{Number(kycData.existingMonthlyEMIs).toLocaleString('en-IN')}/mo
                                    </div>
                                )}
                            </div>

                            <div className="kyc-field">
                                <label>Disbursal Bank & IFSC Code</label>
                                {isEditing ? (
                                    <div className="dual-inputs">
                                        <input
                                            type="text"
                                            placeholder="Bank Name"
                                            value={kycData.disbursalBankName}
                                            onChange={(e) => handleChange('disbursalBankName', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="IFSC"
                                            value={kycData.disbursalIfsc}
                                            onChange={(e) => handleChange('disbursalIfsc', e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div className="field-value-box mono-badge">
                                        <strong>{kycData.disbursalBankName}</strong> • IFSC: {kycData.disbursalIfsc}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. KYC VERIFICATION ARTIFACTS & CHECKLIST */}
                <div className="kyc-card">
                    <div className="kyc-card-header">
                        <div className="card-header-title">
                            <span className="card-idx-pill">4</span>
                            <h3>KYC Ingestion & Document Verification Checklist</h3>
                        </div>
                        <span className="card-status-badge success">All Primary Uploads Verified</span>
                    </div>

                    <div className="kyc-card-body">
                        <div className="kyc-checklist-grid">
                            <div className="checklist-tile verified">
                                <div className="chk-icon">✓</div>
                                <div className="chk-info">
                                    <strong>PAN Card Document</strong>
                                    <span>NSDL e-PAN Match (100%)</span>
                                </div>
                                <span className="chk-tag">Verified</span>
                            </div>

                            <div className="checklist-tile verified">
                                <div className="chk-icon">✓</div>
                                <div className="chk-info">
                                    <strong>Aadhaar Card / e-KYC XML</strong>
                                    <span>UIDAI OTP e-KYC Verified</span>
                                </div>
                                <span className="chk-tag">Verified</span>
                            </div>

                            <div className="checklist-tile verified">
                                <div className="chk-icon">✓</div>
                                <div className="chk-info">
                                    <strong>Current Residence Proof</strong>
                                    <span>Electricity Bill / Rent Agreement</span>
                                </div>
                                <span className="chk-tag">Verified</span>
                            </div>

                            <div className="checklist-tile verified">
                                <div className="chk-icon">✓</div>
                                <div className="chk-info">
                                    <strong>{borrowerType === 'SALARIED' ? '3-6 Months Salary Payslips' : '2-Year ITR & Computation'}</strong>
                                    <span>Employer / Tax Department Matched</span>
                                </div>
                                <span className="chk-tag">Verified</span>
                            </div>

                            <div className="checklist-tile verified">
                                <div className="chk-icon">✓</div>
                                <div className="chk-info">
                                    <strong>6-Month Bank Statement (BSA)</strong>
                                    <span>Salary Credits / Operating Inflows OK</span>
                                </div>
                                <span className="chk-tag">Verified</span>
                            </div>

                            <div className="checklist-tile verified">
                                <div className="chk-icon">✓</div>
                                <div className="chk-info">
                                    <strong>{borrowerType === 'SALARIED' ? 'Company ID / Offer Letter' : 'GST Registration Certificate'}</strong>
                                    <span>Employment / Enterprise Track OK</span>
                                </div>
                                <span className="chk-tag">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseKYCTab;
