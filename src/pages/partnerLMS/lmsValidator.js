/**
 * Institutional Credit Underwriting Validation Engine
 * Validates fields according to strict Indian banking & regulatory guidelines.
 */

export const REGEX_PATTERNS = {
    PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    PINCODE: /^[1-9][0-9]{5}$/,
    MOBILE: /^[6-9]\d{9}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    GSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    UDYAM: /^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$/i
};

export const validateStep = (stepKey, formData, loanConfig) => {
    const errors = [];

    switch (stepKey) {
        case 'basic_info': {
            const name = formData.enterpriseName || formData.applicantName || '';
            if (!name.trim() || name.trim().length < 3) {
                errors.push({
                    field: 'Enterprise / Applicant Legal Name',
                    value: name || '(Empty)',
                    message: 'Legal entity or applicant name must be at least 3 characters long.',
                    example: 'e.g. APEX PRECISION POLYMERS LLP or RAJESH KUMAR SHARMA'
                });
            }

            const pan = (formData.pan || '').trim().toUpperCase();
            if (!pan || !REGEX_PATTERNS.PAN.test(pan)) {
                errors.push({
                    field: 'Enterprise PAN Number',
                    value: pan || '(Empty)',
                    message: 'PAN must be exactly 10 alphanumeric characters (5 uppercase letters, 4 digits, 1 uppercase letter).',
                    example: 'e.g. ABNFA3331Q or ABCDE1234F'
                });
            }

            const pincode = (formData.pincode || '').trim();
            if (!pincode || !REGEX_PATTERNS.PINCODE.test(pincode)) {
                errors.push({
                    field: 'Registered Pincode',
                    value: pincode || '(Empty)',
                    message: 'Pincode must be a valid 6-digit Indian postal code (starting with 1-9).',
                    example: 'e.g. 201001, 110001, 400001'
                });
            }

            const address = (formData.registeredOffice || '').trim();
            if (!address || address.length < 5) {
                errors.push({
                    field: 'Registered Office / Operating Address',
                    value: address || '(Empty)',
                    message: 'Please provide complete registered office address.',
                    example: 'e.g. Industrial Complex Phase 1, Ghaziabad, Uttar Pradesh'
                });
            }

            const udyam = (formData.udyamNo || '').trim();
            if (udyam && !REGEX_PATTERNS.UDYAM.test(udyam)) {
                errors.push({
                    field: 'MSME Udyam Registration No.',
                    value: udyam,
                    message: 'Udyam number must follow the format: UDYAM-XX-00-0000000.',
                    example: 'e.g. UDYAM-UP-29-0013890'
                });
            }
            break;
        }

        case 'personal_kyc': {
            const name = formData.applicantName || formData.enterpriseName || '';
            if (!name.trim() || name.trim().length < 3) {
                errors.push({
                    field: 'Full Legal Name',
                    value: name || '(Empty)',
                    message: 'Primary applicant full legal name is required (as per PAN).',
                    example: 'e.g. Rajesh Kumar Sharma'
                });
            }

            const pan = (formData.pan || '').trim().toUpperCase();
            if (!pan || !REGEX_PATTERNS.PAN.test(pan)) {
                errors.push({
                    field: 'Individual PAN Number',
                    value: pan || '(Empty)',
                    message: 'Individual PAN must be 10 characters (5 letters, 4 digits, 1 letter).',
                    example: 'e.g. ABCPS1234F'
                });
            }

            const mobile = (formData.contactMobile || '').trim();
            if (mobile && !REGEX_PATTERNS.MOBILE.test(mobile)) {
                errors.push({
                    field: 'Mobile Number',
                    value: mobile,
                    message: 'Mobile number must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.',
                    example: 'e.g. 9810144921'
                });
            }

            const email = (formData.contactEmail || '').trim();
            if (email && !REGEX_PATTERNS.EMAIL.test(email)) {
                errors.push({
                    field: 'Email Address',
                    value: email,
                    message: 'Please provide a valid email format.',
                    example: 'e.g. rajesh.sharma@gmail.com'
                });
            }

            const pincode = (formData.pincode || '').trim();
            if (pincode && !REGEX_PATTERNS.PINCODE.test(pincode)) {
                errors.push({
                    field: 'Residential Pincode',
                    value: pincode,
                    message: 'Pincode must be a valid 6-digit postal code.',
                    example: 'e.g. 201014'
                });
            }
            break;
        }

        case 'salaried_income': {
            const sal = formData.salariedDetails || {};
            const empName = (sal.employerName || '').trim();
            if (!empName || empName.length < 2) {
                errors.push({
                    field: 'Employer / Corporate Name',
                    value: empName || '(Empty)',
                    message: 'Please enter a valid employer or corporate organization name.',
                    example: 'e.g. Tata Consultancy Services Ltd / Infosys / Government of India'
                });
            }

            const netSalary = parseFloat(sal.netMonthlySalary) || 0;
            if (netSalary < 10000) {
                errors.push({
                    field: 'Net Monthly Salary (₹)',
                    value: `₹${netSalary}`,
                    message: 'Net in-hand monthly salary must be at least ₹10,000 for salaried loan processing.',
                    example: 'e.g. ₹50,000 or ₹1,25,000'
                });
            }
            break;
        }

        case 'professional_profile': {
            const prof = formData.professionalDetails || {};
            const qual = (prof.qualification || '').trim();
            if (!qual || qual.length < 2) {
                errors.push({
                    field: 'Professional Qualification Degree',
                    value: qual || '(Empty)',
                    message: 'Please specify your highest professional qualification.',
                    example: 'e.g. MBBS, MD / FCA / B.Arch / LL.B'
                });
            }

            const regNo = (prof.councilRegistrationNumber || '').trim();
            if (!regNo || regNo.length < 3) {
                errors.push({
                    field: 'Council / Statutory Registration No.',
                    value: regNo || '(Empty)',
                    message: 'Valid council or statutory registration number is mandatory for professionals.',
                    example: 'e.g. MCI-78219 (Medical) or ICAI-092811 (CA)'
                });
            }
            break;
        }

        case 'gst': {
            const gst = (formData.gstin || formData.gstNumber || '').trim().toUpperCase();
            if (gst && !REGEX_PATTERNS.GSTIN.test(gst)) {
                errors.push({
                    field: 'GSTIN Identification Number',
                    value: gst,
                    message: 'GSTIN must be 15 characters (State code + PAN + entity code + Z + checksum).',
                    example: 'e.g. 07ABNFA3331Q1Z5'
                });
            }
            break;
        }

        case 'promoters': {
            const promoters = formData.promoters || [];
            if (promoters.length === 0) {
                errors.push({
                    field: 'Promoters & Shareholding',
                    value: '0 Promoters Listed',
                    message: 'At least one key promoter or partner must be declared.',
                    example: 'Add at least 1 promoter with name, PAN, and equity share'
                });
            } else {
                const totalShare = promoters.reduce((sum, p) => sum + (parseFloat(p.shareholding) || 0), 0);
                if (Math.abs(totalShare - 100) > 1.0) {
                    errors.push({
                        field: 'Total Equity Shareholding (%)',
                        value: `${totalShare.toFixed(2)}%`,
                        message: 'Total promoter shareholding must equal 100.00%.',
                        example: 'Ensure sum of all promoter share percentages = 100%'
                    });
                }

                promoters.forEach((p, idx) => {
                    const pan = (p.pan || '').trim().toUpperCase();
                    if (pan && !REGEX_PATTERNS.PAN.test(pan)) {
                        errors.push({
                            field: `Promoter #${idx + 1} (${p.name || 'Signatory'}) PAN`,
                            value: pan,
                            message: 'Promoter PAN must follow 10-character alphanumeric format.',
                            example: 'e.g. BTRPS0101H'
                        });
                    }
                });
            }
            break;
        }

        case 'property': {
            const prop = formData.propertyDetails || {};
            const address = (prop.propertyAddress || '').trim();
            if (!address || address.length < 5) {
                errors.push({
                    field: 'Mortgage Property Address',
                    value: address || '(Empty)',
                    message: 'Complete registered property address is required.',
                    example: 'e.g. Flat 1204, Tower 4, ATS Greens, Sector 50, Noida'
                });
            }

            const marketVal = parseFloat(prop.estimatedMarketValueLakhs) || 0;
            if (marketVal < 5.0) {
                errors.push({
                    field: 'Estimated Market Valuation (₹ Lakhs)',
                    value: `₹${marketVal} Lakhs`,
                    message: 'Property market valuation must be at least ₹5 Lakhs.',
                    example: 'e.g. 85.0 (for ₹85 Lakhs) or 145.0 (for ₹1.45 Cr)'
                });
            }
            break;
        }

        case 'vehicle': {
            const veh = formData.vehicleDetails || {};
            const make = (veh.makeAndModel || '').trim();
            if (!make || make.length < 3) {
                errors.push({
                    field: 'Vehicle Make & Model',
                    value: make || '(Empty)',
                    message: 'Please specify the exact vehicle make, chassis model, or commercial fleet name.',
                    example: 'e.g. Tata Signa 4825.TK or Ashok Leyland Ecomet'
                });
            }

            const onRoad = parseFloat(veh.onRoadPriceLakhs) || 0;
            const downPay = parseFloat(veh.downPaymentLakhs) || 0;
            if (onRoad <= 0) {
                errors.push({
                    field: 'Vehicle On-Road Price (₹ Lakhs)',
                    value: `₹${onRoad} Lakhs`,
                    message: 'On-road quotation price must be greater than zero.',
                    example: 'e.g. 54.0 (for ₹54 Lakhs)'
                });
            } else if (downPay >= onRoad) {
                errors.push({
                    field: 'Customer Down Payment (₹ Lakhs)',
                    value: `₹${downPay} Lakhs (On-Road: ₹${onRoad}L)`,
                    message: 'Customer down payment cannot be equal to or exceed the total on-road price.',
                    example: 'Down payment should typically be 10% to 25% of on-road price'
                });
            }
            break;
        }

        case 'project_cost':
        case 'capex_means': {
            const costItems = formData.projectCostItems || [];
            const meansItems = formData.meansItems || [];
            if (costItems.length > 0 && meansItems.length > 0) {
                const totalCost = costItems.reduce((sum, c) => sum + (parseFloat(c.incurred) || 0) + (parseFloat(c.toIncur) || 0), 0);
                const totalMeans = meansItems.reduce((sum, m) => sum + (parseFloat(m.raised) || 0) + (parseFloat(m.proposed) || 0), 0);
                if (Math.abs(totalCost - totalMeans) > 0.1) {
                    errors.push({
                        field: 'Project Cost vs Means of Finance Balance',
                        value: `Cost: ₹${totalCost.toFixed(2)}L vs Means: ₹${totalMeans.toFixed(2)}L (Diff: ₹${Math.abs(totalCost - totalMeans).toFixed(2)}L)`,
                        message: 'Total Project Cost must balance with Total Means of Finance.',
                        example: 'Adjust promoter equity, debt, or capex lines so Total Cost = Total Means'
                    });
                }
            }
            break;
        }

        case 'facility': {
            const loanAmount = parseFloat(formData.termLoanLakhs || formData.loanAmountLakhs) || 0;
            if (loanAmount <= 0) {
                errors.push({
                    field: 'Requested Loan Amount (₹ Lakhs)',
                    value: `₹${loanAmount} Lakhs`,
                    message: 'Please specify a positive requested loan amount.',
                    example: 'e.g. 35.0 (for ₹35 Lakhs) or 375.0 (for ₹3.75 Cr)'
                });
            }
            break;
        }

        default:
            break;
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
