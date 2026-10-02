/**
 * Master Document Matrix & Dynamic Ingestion Rules Engine
 * Supports 9 Loan Products x Entity Types x Loan Amount Tiers x Niches
 */

export const LOAN_PRODUCTS = [
    {
        id: 'HL',
        code: 'HL',
        name: 'Home Loan',
        category: 'Retail Mortgage',
        tagline: 'Home Purchase, Resale, Construction & Plot + Construction',
        typicalTicket: '₹15 Lakhs – ₹10 Crores',
        minAmount: 500000,
        maxAmount: 100000000,
        defaultTenure: 240,
        applicableEntities: ['INDIVIDUAL_SALARIED', 'INDIVIDUAL_SELF_EMPLOYED', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD']
    },
    {
        id: 'LAP',
        code: 'LAP',
        name: 'Loan Against Property (LAP)',
        category: 'Secured Mortgage',
        tagline: 'Commercial & Residential Property Mortgage for Business / Personal Use',
        typicalTicket: '₹25 Lakhs – ₹25 Crores',
        minAmount: 1000000,
        maxAmount: 250000000,
        defaultTenure: 180,
        applicableEntities: ['INDIVIDUAL_SALARIED', 'INDIVIDUAL_SELF_EMPLOYED', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD']
    },
    {
        id: 'ML',
        code: 'ML',
        name: 'Machinery Loan / Equipment Finance',
        category: 'Asset Backed Capex',
        tagline: 'Plant & Machinery, Industrial Equipment, Medical & CNC Technology',
        typicalTicket: '₹20 Lakhs – ₹30 Crores',
        minAmount: 1000000,
        maxAmount: 300000000,
        defaultTenure: 84,
        applicableEntities: ['PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD', 'INDIVIDUAL_SELF_EMPLOYED']
    },
    {
        id: 'BL',
        code: 'BL',
        name: 'Business Loan (Unsecured / Secured)',
        category: 'MSME Growth Capital',
        tagline: 'Collateral-Free Term Loans for Traders, Manufacturers & Service Providers',
        typicalTicket: '₹10 Lakhs – ₹5 Crores',
        minAmount: 500000,
        maxAmount: 50000000,
        defaultTenure: 48,
        applicableEntities: ['PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD', 'INDIVIDUAL_SELF_EMPLOYED']
    },
    {
        id: 'PL',
        code: 'PL',
        name: 'Personal Loan',
        category: 'Unsecured Retail',
        tagline: 'Instant Unsecured Cash Loan for Salaried Employees & Executives',
        typicalTicket: '₹1 Lakh – ₹40 Lakhs',
        minAmount: 100000,
        maxAmount: 4000000,
        defaultTenure: 60,
        applicableEntities: ['INDIVIDUAL_SALARIED']
    },
    {
        id: 'AL',
        code: 'AL',
        name: 'Auto Loan / Commercial Vehicle (AL)',
        category: 'Vehicle Finance',
        tagline: 'Passenger Cars, Commercial Trucks, Buses & Fleet Operations',
        typicalTicket: '₹5 Lakhs – ₹3 Crores',
        minAmount: 300000,
        maxAmount: 30000000,
        defaultTenure: 60,
        applicableEntities: ['INDIVIDUAL_SALARIED', 'INDIVIDUAL_SELF_EMPLOYED', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD']
    },
    {
        id: 'PROJECT',
        code: 'PROJECT',
        name: 'Project Funding',
        category: 'Structured Corporate Finance',
        tagline: 'Greenfield, Brownfield, Infrastructure & Industrial Manufacturing Units',
        typicalTicket: '₹5 Crores – ₹100 Crores',
        minAmount: 50000000,
        maxAmount: 1000000000,
        defaultTenure: 120,
        applicableEntities: ['PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD']
    },
    {
        id: 'OD_CC',
        code: 'OD_CC',
        name: 'Overdraft / Cash Credit (OD/CC)',
        category: 'Working Capital Facility',
        tagline: 'Revolving Credit Limit against Stock, Book Debts & Drawing Power (MPBF)',
        typicalTicket: '₹25 Lakhs – ₹50 Crores',
        minAmount: 2500000,
        maxAmount: 500000000,
        defaultTenure: 12,
        applicableEntities: ['PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD', 'INDIVIDUAL_SELF_EMPLOYED']
    },
    {
        id: 'BILL_DISCOUNTING',
        code: 'BILL_DISCOUNTING',
        name: 'Bill / Invoice Discounting',
        category: 'Supply Chain Finance',
        tagline: 'Immediate Liquidity against Accepted Commercial Invoices, PO & Verified Delivery',
        typicalTicket: '₹15 Lakhs – ₹20 Crores',
        minAmount: 1500000,
        maxAmount: 200000000,
        defaultTenure: 3,
        applicableEntities: ['PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD']
    }
];

export const ENTITY_TYPES = [
    { id: 'INDIVIDUAL_SALARIED', label: 'Individual (Salaried Employee)' },
    { id: 'INDIVIDUAL_SELF_EMPLOYED', label: 'Individual (Self-Employed / Professional)' },
    { id: 'PROPRIETORSHIP', label: 'Sole Proprietorship' },
    { id: 'PARTNERSHIP', label: 'Partnership Firm' },
    { id: 'LLP', label: 'Limited Liability Partnership (LLP)' },
    { id: 'PVT_LTD', label: 'Private Limited Company' },
    { id: 'PUBLIC_LTD', label: 'Public Limited Company' },
    { id: 'TRUST_SOCIETY', label: 'Trust / Society / Educational Body' }
];

export const BORROWER_NICHES = [
    { id: 'SALARIED', label: 'Salaried Professional (MNC / Corporate / Govt / PSU)' },
    { id: 'SEP', label: 'Self-Employed Professional (Doctor / CA / Architect / Lawyer)' },
    { id: 'SENP', label: 'Self-Employed Non-Professional (Trader / Retailer / MSME)' },
    { id: 'MANUFACTURING', label: 'MSME Manufacturing & Processing Unit' },
    { id: 'SERVICES_TRADING', label: 'Wholesale Trader, Distributor or Service Provider' },
    { id: 'FLEET_OPERATOR', label: 'Commercial Fleet Operator / Transport Logistics' },
    { id: 'LARGE_CORPORATE', label: 'Large Corporate / Industrial EPC Enterprise' }
];

/**
 * Master Document Table Definition (Phase 1)
 */
export const MASTER_DOCUMENT_TABLE = [
    // ---------------- KYC Category ----------------
    {
        docId: 'DOC_PAN_APPLICANT',
        docName: 'Applicant / Corporate Entity PAN Card',
        category: 'KYC',
        applicableProducts: ['ALL'],
        applicableEntities: ['ALL'],
        inputType: 'OCR / API Verification / PDF Upload',
        isMandatory: true,
        description: 'Mandatory PAN card copy or verified NSDL PAN status.'
    },
    {
        docId: 'DOC_AADHAAR_APPLICANT',
        docName: 'Aadhaar Card (Applicant / Key Signatory)',
        category: 'KYC',
        applicableProducts: ['ALL'],
        applicableEntities: ['INDIVIDUAL_SALARIED', 'INDIVIDUAL_SELF_EMPLOYED', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD'],
        inputType: 'UIDAI OTP / PDF Upload',
        isMandatory: true,
        description: '12-digit Aadhaar card with masked number or QR verification.'
    },
    {
        docId: 'DOC_PHOTO_APPLICANT',
        docName: 'Passport Size Photograph & Signature Specimen',
        category: 'KYC',
        applicableProducts: ['HL', 'LAP', 'BL', 'PL', 'AL'],
        applicableEntities: ['ALL'],
        inputType: 'Image / PDF Upload',
        isMandatory: true,
        description: 'Recent photograph and signature specimen on plain white background.'
    },
    {
        docId: 'DOC_ADDRESS_PROOF',
        docName: 'Current Address Proof (Utility Bill / Passport / Lease)',
        category: 'KYC',
        applicableProducts: ['ALL'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Electricity bill (<2M old), Passport, or Registered Rent Agreement.'
    },
    {
        docId: 'DOC_BUSINESS_REG',
        docName: 'Business Registration Proof (GST / Udyam / Shop Act)',
        category: 'KYC',
        applicableProducts: ['LAP', 'ML', 'BL', 'PROJECT', 'OD_CC', 'BILL_DISCOUNTING'],
        applicableEntities: ['PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD', 'INDIVIDUAL_SELF_EMPLOYED'],
        inputType: 'API Pull / PDF Upload',
        isMandatory: true,
        description: 'GST Certificate, Udyam MSME Certificate, or Shop & Establishment License.'
    },
    {
        docId: 'DOC_CONSTITUTION_DEED',
        docName: 'Partnership Deed / MOA & AOA / LLP Agreement',
        category: 'KYC',
        applicableProducts: ['LAP', 'ML', 'BL', 'PROJECT', 'OD_CC', 'BILL_DISCOUNTING'],
        applicableEntities: ['PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Registered Partnership Deed or certified true copy of MOA & AOA with certificate of incorporation.'
    },
    {
        docId: 'DOC_BOARD_RESOLUTION',
        docName: 'Board Resolution & Shareholding Pattern',
        category: 'KYC',
        applicableProducts: ['LAP', 'ML', 'BL', 'PROJECT', 'OD_CC', 'BILL_DISCOUNTING'],
        applicableEntities: ['PVT_LTD', 'PUBLIC_LTD'],
        inputType: 'PDF Upload',
        isMandatory: true,
        conditionText: 'Mandatory for Private / Public Limited corporate borrowers.',
        description: 'Certified Board Resolution authorising loan borrowing & authorised signatories.'
    },

    // ---------------- Income & Financials Category ----------------
    {
        docId: 'DOC_SALARY_SLIPS_3M',
        docName: '3 Months Salary Slips',
        category: 'INCOME',
        applicableProducts: ['HL', 'PL', 'AL'],
        applicableEntities: ['INDIVIDUAL_SALARIED'],
        inputType: 'PDF Upload / OCR',
        isMandatory: true,
        description: 'Latest 3 consecutive months computer-generated salary pay slips.'
    },
    {
        docId: 'DOC_FORM16_2Y',
        docName: 'Form 16 / Part B (Last 2 Years)',
        category: 'INCOME',
        applicableProducts: ['HL', 'PL', 'AL'],
        applicableEntities: ['INDIVIDUAL_SALARIED'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Employer Form 16 TDS certificate with Part A & Part B for last 2 Assessment Years.'
    },
    {
        docId: 'DOC_EMPLOYMENT_PROOF',
        docName: 'Appointment Letter / Official Employee ID',
        category: 'INCOME',
        applicableProducts: ['PL', 'HL'],
        applicableEntities: ['INDIVIDUAL_SALARIED'],
        inputType: 'PDF Upload / Image',
        isMandatory: true,
        description: 'Official corporate work ID card and appointment / confirmation letter.'
    },
    {
        docId: 'DOC_ITR_FINANCIALS',
        docName: '2–3 Years ITR with Audited P&L, Balance Sheet & Audit Report',
        category: 'INCOME',
        applicableProducts: ['HL', 'LAP', 'ML', 'BL', 'AL', 'PROJECT', 'OD_CC', 'BILL_DISCOUNTING'],
        applicableEntities: ['INDIVIDUAL_SELF_EMPLOYED', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD'],
        inputType: 'PDF Upload / OCR Parser',
        isMandatory: true,
        getMandatoryText: (amount, product) => (product === 'LAP' && amount > 5000000) || (product === 'PROJECT') || (amount > 10000000) ? '3 Years Mandatory (Audited Financials)' : '2-3 Years Required',
        description: 'ITR-V acknowledgment with computation of income, tax audit report (3CD), audited Balance Sheet and P&L.'
    },
    {
        docId: 'DOC_PROMOTER_NETWORTH',
        docName: 'CA-Certified Promoter / Guarantor Net Worth Statements',
        category: 'INCOME',
        applicableProducts: ['LAP', 'ML', 'BL', 'PROJECT', 'OD_CC'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'CA certified Net worth statement with property, movable assets & liability schedule.'
    },
    {
        docId: 'DOC_CMA_PROJECTIONS',
        docName: 'CMA Data & 5–7 Year Financial Projections',
        category: 'INCOME',
        applicableProducts: ['ML', 'PROJECT', 'OD_CC'],
        applicableEntities: ['ALL'],
        inputType: 'Excel / PDF Upload',
        isMandatory: true,
        description: 'Credit Monitoring Arrangement (CMA) workbook with projected P&L, BS, DSCR & MPBF calculations.'
    },

    // ---------------- Banking & GST Category ----------------
    {
        docId: 'DOC_BANK_STATEMENT_12M',
        docName: '6–12 Months Bank Statements (All Operating Accounts)',
        category: 'BANKING',
        applicableProducts: ['ALL'],
        applicableEntities: ['ALL'],
        inputType: 'E-Statement PDF / Account Aggregator (AA) / Perfios Parser',
        isMandatory: true,
        description: 'Official password-free PDF e-statements of salary, current, and OD/CC accounts.'
    },
    {
        docId: 'DOC_GST_RETURNS_12M',
        docName: '12 Months GSTR-3B & GSTR-1 Filings',
        category: 'GST',
        applicableProducts: ['HL', 'LAP', 'ML', 'BL', 'PROJECT', 'OD_CC', 'BILL_DISCOUNTING'],
        applicableEntities: ['INDIVIDUAL_SELF_EMPLOYED', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD'],
        inputType: 'GSTN Portal API Pull / PDF Upload',
        isMandatory: true,
        description: '12-month GST filing returns with GSTR-2A/2B input tax credit reconciliation.'
    },
    {
        docId: 'DOC_EXISTING_SANCTION_LETTERS',
        docName: 'Sanction Letters & Repayment Track of Existing Loans',
        category: 'BANKING',
        applicableProducts: ['HL', 'LAP', 'ML', 'BL', 'PROJECT', 'OD_CC'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: false,
        description: 'Sanction letters and latest 6M loan account statement of existing bank limits / EMIs.'
    },

    // ---------------- Product Specific Category: OD/CC ----------------
    {
        docId: 'DOC_STOCK_DEBTORS_STATEMENT',
        docName: 'Latest Certified Stock Statement & Debtor Ageing (Tandon MPBF)',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['OD_CC'],
        applicableEntities: ['ALL'],
        inputType: 'PDF / Excel Upload',
        isMandatory: true,
        description: 'Stock position, raw materials, WIP, finished goods, and debtor ageing (>90 days excluded for Drawing Power).'
    },
    {
        docId: 'DOC_CREDITORS_LIST',
        docName: 'Sundry Creditors List & Advance from Customers',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['OD_CC'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'List of trade creditors, unpaid suppliers, and statutory dues.'
    },

    // ---------------- Product Specific Category: Machinery Loan ----------------
    {
        docId: 'DOC_MACHINERY_QUOTATION',
        docName: 'Supplier Proforma Invoice, Quotation & Technical Specs',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['ML'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Original supplier quotation, proforma invoice, import license & machine capacity specs.'
    },
    {
        docId: 'DOC_CIVIL_FOUNDATION_ESTIMATE',
        docName: 'Architect / Chartered Engineer Civil Foundation Estimate',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['ML', 'PROJECT'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: false,
        description: 'Civil engineer estimate for factory shed, machine foundation, and electrification.'
    },

    // ---------------- Product Specific Category: Home Loan & LAP ----------------
    {
        docId: 'DOC_PROPERTY_TITLE_CHAIN_30Y',
        docName: '30-Year Chain of Title Deeds & Registered Conveyance',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['HL', 'LAP'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Complete unbroken 30-year chain of title deeds, sale deed, mother deed, mutation extract.'
    },
    {
        docId: 'DOC_PROPERTY_AGREEMENT_SALE',
        docName: 'Agreement for Sale / Allotment Letter / Society NOC',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['HL', 'LAP'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Registered Sale Agreement, Builder Allotment Letter, Share Certificate and Society NOC.'
    },
    {
        docId: 'DOC_PROPERTY_APPROVED_PLAN_TAX',
        docName: 'Approved Sanctioned Building Plan & Latest Property Tax Receipt',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['HL', 'LAP'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Municipal sanctioned layout plan, CC/OC certificate, and property tax receipt.'
    },
    {
        docId: 'DOC_PROPERTY_VALUATION_ENCUMBRANCE',
        docName: 'Empanelled Valuer Inspection Report & 13-Year EC',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['LAP', 'HL'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Bank-empanelled technical valuation report and Sub-Registrar 13-30 year Encumbrance Certificate (EC).'
    },
    {
        docId: 'DOC_RENT_LEASE_AGREEMENTS',
        docName: 'Registered Rent / Lease Agreements (If Property Rented)',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['LAP'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: false,
        description: 'Registered lease agreement and rent credit bank proof for Lease Rental Discounting (LRD).'
    },

    // ---------------- Product Specific Category: Auto Loan ----------------
    {
        docId: 'DOC_VEHICLE_PROFORMA_INVOICE',
        docName: 'Authorized Dealer Vehicle Proforma Invoice & Price Quote',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['AL'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Official dealership proforma invoice with ex-showroom, RTO, TCS and insurance breakdown.'
    },
    {
        docId: 'DOC_DRIVING_LICENSE',
        docName: 'Driving License / Commercial Driver Badge',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['AL'],
        applicableEntities: ['ALL'],
        inputType: 'PDF / Image Upload',
        isMandatory: true,
        description: 'Valid Driving License of applicant / designated fleet driver.'
    },
    {
        docId: 'DOC_COMMERCIAL_ROUTE_PERMIT',
        docName: 'Commercial Route Permit & Fleet Fitness Certificate',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['AL'],
        applicableEntities: ['INDIVIDUAL_SELF_EMPLOYED', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD'],
        inputType: 'PDF Upload',
        isMandatory: false,
        description: 'National / State route permit, vehicle fitness certificate and existing fleet RC copies.'
    },

    // ---------------- Product Specific Category: Bill Discounting ----------------
    {
        docId: 'DOC_COMMERCIAL_INVOICE',
        docName: 'Original Accepted Commercial Tax Invoice',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['BILL_DISCOUNTING'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload / e-Invoice IRN Verification',
        isMandatory: true,
        description: 'Original GST tax invoice with e-Invoice QR/IRN matching GSTR-1 return.'
    },
    {
        docId: 'DOC_PURCHASE_ORDER_PO',
        docName: 'Buyer Official Purchase Order (PO) / Contract Copy',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['BILL_DISCOUNTING'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Formal purchase order issued by prime buyer / corporate with pricing terms.'
    },
    {
        docId: 'DOC_PROOF_OF_DELIVERY_POD',
        docName: 'Delivery Challan / Lorry Receipt (LR) & Buyer Accepted POD',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['BILL_DISCOUNTING'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Signed & stamped Proof of Delivery (POD) from buyer warehouse + transporter Lorry Receipt.'
    },

    // ---------------- Product Specific Category: Project Funding ----------------
    {
        docId: 'DOC_DETAILED_PROJECT_REPORT_DPR',
        docName: 'Detailed Project Report (DPR) & TEV Feasibility Study',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['PROJECT'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Comprehensive DPR covering project capacity, market demand, technology, financial viability & DSCR.'
    },
    {
        docId: 'DOC_STATUTORY_CLEARANCES',
        docName: 'Statutory Clearances (Pollution SPCB, Factory License, Fire NOC)',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['PROJECT', 'ML'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Consent to Establish (CTE), State Pollution Control Board (SPCB) consent, Factory Inspector license.'
    },
    {
        docId: 'DOC_LAND_NA_ORDER',
        docName: 'Industrial Land Conversion (NA Order) & Title Search',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['PROJECT'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: true,
        description: 'Section 143 / Non-Agricultural (NA) order, industrial zone zoning certificate and legal title report.'
    },
    {
        docId: 'DOC_OFFTAKE_EPC_CONTRACTS',
        docName: 'Off-Take Agreements / EPC Turnkey Contracts / Power Sanction',
        category: 'PRODUCT_SPECIFIC',
        applicableProducts: ['PROJECT'],
        applicableEntities: ['ALL'],
        inputType: 'PDF Upload',
        isMandatory: false,
        description: 'Power grid load sanction letter, raw material supply agreements, off-take buyer MOUs, and EPC contracts.'
    }
];

/**
 * Evaluates the required document checklist dynamically for a given case configuration.
 */
export const evaluateCaseDocumentChecklist = (caseConfig = {}) => {
    const {
        productType = 'BL',
        entityType = 'PROPRIETORSHIP',
        loanAmount = 2500000,
        borrowerNiche = 'SENP'
    } = caseConfig;

    const applicableDocs = MASTER_DOCUMENT_TABLE.filter(doc => {
        // Product matching
        const matchProduct = doc.applicableProducts.includes('ALL') || doc.applicableProducts.includes(productType);
        if (!matchProduct) return false;

        // Entity matching
        const matchEntity = doc.applicableEntities.includes('ALL') || doc.applicableEntities.includes(entityType);
        if (!matchEntity) return false;

        return true;
    }).map(doc => {
        // Evaluate dynamic rules
        let mandatory = doc.isMandatory;
        let ruleNotes = [];

        // Rule 1: LAP > 50 Lakhs -> 3 Years ITR mandatory
        if (productType === 'LAP' && loanAmount > 5000000 && doc.docId === 'DOC_ITR_FINANCIALS') {
            mandatory = true;
            ruleNotes.push('Rule Trigger: Loan > ₹50L requires 3 full years audited ITR & balance sheets.');
        }

        // Rule 2: Corporate Pvt Ltd / Public Ltd -> MOA, AOA, Board Resolution mandatory
        if (['PVT_LTD', 'PUBLIC_LTD'].includes(entityType) && ['DOC_CONSTITUTION_DEED', 'DOC_BOARD_RESOLUTION'].includes(doc.docId)) {
            mandatory = true;
            ruleNotes.push('Rule Trigger: Corporate Entity requires certified Board Resolution & MOA/AOA.');
        }

        // Rule 3: Salaried Applicant -> Payslips & Form 16
        if (entityType === 'INDIVIDUAL_SALARIED' && ['DOC_SALARY_SLIPS_3M', 'DOC_FORM16_2Y'].includes(doc.docId)) {
            mandatory = true;
        }

        // Rule 4: Project funding -> DPR and statutory clearances mandatory
        if (productType === 'PROJECT' && ['DOC_DETAILED_PROJECT_REPORT_DPR', 'DOC_STATUTORY_CLEARANCES', 'DOC_LAND_NA_ORDER'].includes(doc.docId)) {
            mandatory = true;
            ruleNotes.push('Rule Trigger: Project Finance requires comprehensive DPR & statutory permits.');
        }

        return {
            ...doc,
            isMandatory: mandatory,
            ruleNotes
        };
    });

    return applicableDocs;
};
