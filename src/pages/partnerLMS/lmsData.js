/**
 * Master Datasets & Sample Cases for partnerLMS
 * Bank-Grade Underwriting & Case Management Architecture
 */

export const PARTNER_LMS_CREDENTIALS = {
    email: 'dsa@beefund.in',
    password: 'partnerlms123'
};

export const DEFAULT_PARTNER_PROFILE = {
    facilitatorId: '15141',
    leadId: '21006',
    name: 'Apex Credit Advisors Private Limited',
    primaryContact: 'Rohit Shishodia',
    email: 'dsa@beefund.in',
    phone: '9871221173',
    pan: 'ABACA0921G',
    address: 'First Floor A 709-710, IT Park Tower, Sector 62, Noida - 201301',
    tier: 'Platinum Institutional Partner',
    walletBalance: 8500,
    activeCases: 9,
    disbursedVolume: '₹48.5 Cr',
    sanctionRatio: '86.4%'
};

export const LMS_PRICING_MATRIX = {
    cibil: { name: 'CIBIL Commercial & Consumer CIR Pull', cost: 50 },
    bsa6: { name: 'Bank Statement Analysis (6M per Account)', cost: 30 },
    bsa12: { name: 'Bank Statement Analysis (12M per Account)', cost: 45 },
    gst12: { name: 'GST Turnover & ITC Reconciliation (12M)', cost: 40 },
    gst24: { name: 'GST Turnover & ITC Reconciliation (24M)', cost: 60 }
};

// Initial Seed Cases covering all 9 Master Loan Products
export const INITIAL_LMS_CASES = [
    {
        id: '1105601',
        ackNo: 'ACKNO202681891105601',
        submissionDate: '30/09/2026',
        enterpriseName: 'Rohit & Neha Sharma (Home Loan)',
        applicantName: 'Rohit Sharma',
        constitution: 'Individual (Salaried)',
        entityType: 'INDIVIDUAL_SALARIED',
        borrowerNiche: 'SALARIED',
        pan: 'BQZPS4819M',
        yearsOfOperation: 'Salaried (8+ Years MNC)',
        industry: 'IT & Software Services',
        loanProduct: 'HL',
        loanType: 'Home Loan (Purchase & Construction)',
        loanAmountLakhs: 75.0,
        loanAmountFormatted: '₹75.00 Lakhs',
        propertyValueFormatted: '₹1.05 Cr',
        propertyAgreementCostLakhs: 95.0,
        valuerMarketValueLakhs: 105.0,
        targetLender: 'HDFC Bank (Retail Mortgage Desk)',
        status: 'SANCTIONED',
        scorecard: 91,
        cibilScore: 782,
        contactEmail: 'rohit.sharma@techcorp.in',
        contactMobile: '9811029381',
        registeredOffice: 'Tower B-1402, DLF Cyber City, Sector 25, Gurugram, Haryana - 122002',
        foir: 52.0,
        ltv: 71.4,
        salariedDetails: {
            monthlyGross: 183000,
            monthlyNet: 155000,
            existingEMIs: 25000,
            proposedEMI: 55600
        },
        securities: [
            {
                type: 'Residential Apartment (3-BHK Freehold)',
                nature: 'Primary',
                owner: 'Rohit Sharma & Neha Sharma',
                marketValueLakhs: 105.0,
                chargeOffered: 'Equitable Mortgage with 1st Exclusive Charge'
            }
        ],
        guarantors: [
            { name: 'Neha Sharma', pan: 'BQZPS4820N', netWorthLakhs: 45.0 }
        ],
        promoters: [
            { name: 'Rohit Sharma', pan: 'BQZPS4819M', designation: 'Primary Applicant', shareholding: 60.0, mobile: '9811029381' },
            { name: 'Neha Sharma', pan: 'BQZPS4820N', designation: 'Co-Applicant', shareholding: 40.0, mobile: '9811029382' }
        ],
        bankAccounts: [
            { bankName: 'HDFC Bank Ltd', accountNo: 'XXXXXX9482', type: 'Salary Savings Account', bsaRun: true, abb: '₹1.05 Lakhs', bounces: 0 }
        ],
        strategicPlan: {
            fundDeploymentTarget: 'Disbursal towards developer milestone demand note for unit B-1402.',
            projectedDSCR: 1.92,
            targetRevenueGrowth: '12% Annual increment track record.',
            breakEvenTimeline: 'N/A (Retail Mortgage)'
        },
        redFlags: []
    },
    {
        id: '1105602',
        ackNo: 'ACKNO202681891105602',
        submissionDate: '28/09/2026',
        enterpriseName: 'VARDHMAN LOGISTICS & WAREHOUSING LLP',
        constitution: 'LLP',
        entityType: 'LLP',
        borrowerNiche: 'SENP',
        pan: 'AABFV9821K',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Logistics & Warehousing',
        loanProduct: 'LAP',
        loanType: 'Loan Against Property (LAP)',
        loanAmountLakhs: 180.0,
        loanAmountFormatted: '₹1.80 Cr',
        propertyValueFormatted: '₹3.20 Cr',
        valuerMarketValueLakhs: 320.0,
        targetLender: 'Axis Bank (Mortgage Desk)',
        status: 'UNDER_REVIEW',
        scorecard: 84,
        cibilScore: 746,
        contactEmail: 'contact@vardhmanlogistics.com',
        contactMobile: '9820019283',
        registeredOffice: 'Logistics Park Phase 2, Bhiwandi, Maharashtra - 421302',
        ltv: 56.25,
        dscr: 1.88,
        securities: [
            {
                type: 'Commercial Warehouse & Freehold Plot (40,000 sq ft)',
                nature: 'Primary',
                owner: 'Vardhman Logistics & Warehousing LLP',
                marketValueLakhs: 320.0,
                chargeOffered: '1st Equitable Mortgage & Title Deposit'
            }
        ],
        guarantors: [
            { name: 'Praveen Vardhman', pan: 'ABVPV1120K', netWorthLakhs: 380.0 }
        ],
        pastFinancials: {
            sales: { past1: 520.0, past2: 680.0, currentEst: 840.0, nextProj: 1100.0 },
            netProfit: { past1: 34.0, past2: 48.0, currentEst: 65.0, nextProj: 89.0 },
            netWorth: { past1: 180.0, past2: 240.0, currentEst: 310.0, nextProj: 405.0 }
        },
        promoters: [
            { name: 'Praveen Vardhman', pan: 'ABVPV1120K', designation: 'Designated Partner', shareholding: 70.0, mobile: '9820019283' },
            { name: 'Sanjay Jain', pan: 'ABVPJ8812M', designation: 'Partner', shareholding: 30.0, mobile: '9820019284' }
        ],
        bankAccounts: [
            { bankName: 'Axis Bank', accountNo: 'XXXXXX5012', type: 'Current Account', bsaRun: true, abb: '₹28.4 Lakhs', bounces: 0 }
        ],
        strategicPlan: {
            fundDeploymentTarget: 'Consolidation of existing high-cost liabilities and fleet expansion.',
            projectedDSCR: 1.88,
            targetRevenueGrowth: '24% YoY growth driven by 3PL ecommerce warehousing.',
            breakEvenTimeline: 'Immediate operational surplus.'
        },
        redFlags: []
    },
    {
        id: '1105603',
        ackNo: 'ACKNO202681891105603',
        submissionDate: '29/09/2026',
        enterpriseName: 'APEX PRECISION POLYMERS LLP',
        constitution: 'Partnership',
        entityType: 'PARTNERSHIP',
        borrowerNiche: 'SENP',
        pan: 'ABNFA3331Q',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Manufacturing',
        msmeCategory: 'SMALL',
        udyamNo: 'UDYAM-UP-29-0013890',
        udyamDate: '18/02/2021',
        loanProduct: 'ML',
        loanType: 'Rupee Term Loan (Plant & Machinery)',
        loanAmountLakhs: 375.0,
        loanAmountFormatted: '₹3.75 Cr',
        capexCostLakhs: 500.0,
        capexCostFormatted: '₹5.00 Cr',
        projectCostLakhs: 500.0,
        projectCostFormatted: '₹5.00 Cr',
        targetLender: 'State Bank of India (MSME Desk)',
        status: 'SANCTIONED',
        scorecard: 88,
        cibilScore: 758,
        contactEmail: 'contact@apexpolymers.in',
        contactMobile: '9873096337',
        registeredOffice: 'Industrial Complex Phase 1, Ghaziabad, Uttar Pradesh - 201001',
        dscr: 2.15,
        facr: 1.33,
        securities: [
            {
                type: 'Plant & Machinery Hypothecation',
                nature: 'Primary',
                owner: 'Apex Precision Polymers LLP',
                marketValueLakhs: 500.0,
                chargeOffered: '1st Exclusive Hypothecation Charge'
            },
            {
                type: 'Fixed Deposit Receipt (FDR)',
                nature: 'Collateral',
                owner: 'Apex Precision Polymers LLP',
                marketValueLakhs: 45.0,
                chargeOffered: 'Lien Marking on Bank FDR'
            }
        ],
        guarantors: [
            { name: 'Rohit Shishodia', pan: 'BTRPS0101H', netWorthLakhs: 285.0 },
            { name: 'Shivani Mittal', pan: 'ASUPA1336P', netWorthLakhs: 215.0 }
        ],
        pastFinancials: {
            sales: { past1: 820.5, past2: 980.2, currentEst: 1240.0, nextProj: 1680.0 },
            netProfit: { past1: 38.4, past2: 52.1, currentEst: 76.5, nextProj: 118.0 },
            netWorth: { past1: 145.0, past2: 197.1, currentEst: 273.6, nextProj: 391.6 }
        },
        promoters: [
            { name: 'Rohit Shishodia', pan: 'BTRPS0101H', designation: 'Managing Partner', shareholding: 50.0, mobile: '9873096337' },
            { name: 'Shivani Mittal', pan: 'ASUPA1336P', designation: 'Partner', shareholding: 50.0, mobile: '9910600368' }
        ],
        bankAccounts: [
            { bankName: 'HDFC Bank', accountNo: 'XXXXXX4920', type: 'Current Account', bsaRun: true, abb: '₹22.5 Lakhs', bounces: 0 },
            { bankName: 'State Bank of India', accountNo: 'XXXXXX8812', type: 'Cash Credit Account', bsaRun: true, abb: '₹38.2 Lakhs', bounces: 0 }
        ],
        strategicPlan: {
            fundDeploymentTarget: 'Commissioning of 3-Phase Japanese Injection Molding lines within 4 months.',
            projectedDSCR: 2.15,
            targetRevenueGrowth: '35% YoY expansion with export orders.',
            breakEvenTimeline: 'Break-even in Month 3 of commercial run.'
        },
        redFlags: []
    },
    {
        id: '1105604',
        ackNo: 'ACKNO202681891105604',
        submissionDate: '27/09/2026',
        enterpriseName: 'SHANTI RETAIL & EXPORTS INDIA PVT LTD',
        constitution: 'Private Limited',
        entityType: 'PVT_LTD',
        borrowerNiche: 'SENP',
        pan: 'AACCS8821B',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Textile & Garment Exports',
        msmeCategory: 'SMALL',
        udyamNo: 'UDYAM-DL-03-0081290',
        loanProduct: 'BL',
        loanType: 'Business Loan (Unsecured MSME Growth)',
        loanAmountLakhs: 65.0,
        loanAmountFormatted: '₹65.00 Lakhs',
        turnoverFormatted: '₹8.40 Cr',
        turnoverLakhs: 840.0,
        targetLender: 'ICICI Bank (SME Banking)',
        status: 'UNDER_REVIEW',
        scorecard: 82,
        cibilScore: 742,
        contactEmail: 'accounts@shantieexports.in',
        contactMobile: '9810882109',
        registeredOffice: 'Okhla Industrial Area Phase 3, New Delhi - 110020',
        dscr: 1.92,
        tolTnw: 1.45,
        securities: [
            {
                type: 'Business Movable Assets & Personal Guarantee',
                nature: 'Primary',
                owner: 'Shanti Retail & Exports India Pvt Ltd',
                marketValueLakhs: 85.0,
                chargeOffered: 'Hypothecation + Directors Personal Guarantee (CGTMSE Covered)'
            }
        ],
        guarantors: [
            { name: 'Anil Mehra', pan: 'AABPA9910K', netWorthLakhs: 210.0 }
        ],
        pastFinancials: {
            sales: { past1: 540.0, past2: 690.0, currentEst: 840.0, nextProj: 1050.0 },
            netProfit: { past1: 29.0, past2: 41.0, currentEst: 58.0, nextProj: 76.0 },
            netWorth: { past1: 120.0, past2: 165.0, currentEst: 228.0, nextProj: 304.0 }
        },
        promoters: [
            { name: 'Anil Mehra', pan: 'AABPA9910K', designation: 'Managing Director', shareholding: 65.0, mobile: '9810882109' },
            { name: 'Pooja Mehra', pan: 'AABPM4412S', designation: 'Director', shareholding: 35.0, mobile: '9810882110' }
        ],
        bankAccounts: [
            { bankName: 'ICICI Bank', accountNo: 'XXXXXX0921', type: 'Current Account', bsaRun: true, abb: '₹19.4 Lakhs', bounces: 0 }
        ],
        strategicPlan: {
            fundDeploymentTarget: 'Festive season raw material fabric procurement & European export fulfillment.',
            projectedDSCR: 1.92,
            targetRevenueGrowth: '28% YoY increase in export billings.',
            breakEvenTimeline: 'Immediate working capital rotation.'
        },
        redFlags: []
    },
    {
        id: '1105605',
        ackNo: 'ACKNO202681891105605',
        submissionDate: '01/10/2026',
        enterpriseName: 'Vikramaditya Singhania (Personal Loan)',
        applicantName: 'Vikramaditya Singhania',
        constitution: 'Individual (Salaried)',
        entityType: 'INDIVIDUAL_SALARIED',
        borrowerNiche: 'SALARIED',
        pan: 'AJYPS1920L',
        yearsOfOperation: 'Salaried (10+ Years)',
        industry: 'Financial Services & Investment Banking',
        loanProduct: 'PL',
        loanType: 'Instant Unsecured Personal Loan',
        loanAmountLakhs: 25.0,
        loanAmountFormatted: '₹25.00 Lakhs',
        monthlySalaryFormatted: '₹1.75 L/mo',
        monthlyNetSalary: 175000,
        targetLender: 'Kotak Mahindra Bank (Retail Asset Desk)',
        status: 'SANCTIONED',
        scorecard: 89,
        cibilScore: 790,
        contactEmail: 'vikram.singhania@goldman.com',
        contactMobile: '9920194821',
        registeredOffice: 'Flat 901, Raheja Heights, Malad East, Mumbai - 400097',
        foir: 42.8,
        disposableSurplusFormatted: '₹98,500/mo',
        salariedDetails: {
            monthlyGross: 215000,
            monthlyNet: 175000,
            existingEMIs: 28000,
            proposedEMI: 47000
        },
        securities: [
            {
                type: 'Clean / Unsecured Personal Credit Facility',
                nature: 'Unsecured',
                owner: 'Vikramaditya Singhania',
                marketValueLakhs: 0.0,
                chargeOffered: 'Zero Asset Charge / 100% Unsecured Personal Loan'
            }
        ],
        promoters: [
            { name: 'Vikramaditya Singhania', pan: 'AJYPS1920L', designation: 'Primary Applicant (VP Finance)', shareholding: 100.0, mobile: '9920194821' }
        ],
        bankAccounts: [
            { bankName: 'Kotak Mahindra Bank', accountNo: 'XXXXXX3821', type: 'Salary Account', bsaRun: true, abb: '₹1.45 Lakhs', bounces: 0 }
        ],
        strategicPlan: {
            fundDeploymentTarget: 'Executive overseas education and family medical liquidity buffer.',
            projectedDSCR: 2.30,
            targetRevenueGrowth: '15% annual bonus increment.',
            breakEvenTimeline: 'N/A'
        },
        redFlags: []
    },
    {
        id: '1105606',
        ackNo: 'ACKNO202681891105606',
        submissionDate: '25/09/2026',
        enterpriseName: 'KALKA ROADWAYS & FLEET LOGISTICS',
        constitution: 'Proprietorship',
        entityType: 'PROPRIETORSHIP',
        borrowerNiche: 'SENP',
        pan: 'AECPK9901M',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Commercial Transport & Fleet Operations',
        loanProduct: 'AL',
        loanType: 'Auto Loan / Commercial Vehicle (AL)',
        loanAmountLakhs: 85.0,
        loanAmountFormatted: '₹85.00 Lakhs',
        vehicleValuationFormatted: '₹1.05 Cr',
        vehicleCostLakhs: 105.0,
        targetLender: 'Tata Capital Financial Services',
        status: 'UNDER_REVIEW',
        scorecard: 80,
        cibilScore: 738,
        contactEmail: 'kalkaroadways@gmail.com',
        contactMobile: '9818819201',
        registeredOffice: 'Transport Nagar Phase 1, Kanpur, Uttar Pradesh - 208023',
        ltv: 81.0,
        dscr: 2.05,
        securities: [
            {
                type: 'Commercial Vehicle Fleet (6 Heavy Commercial Trucks)',
                nature: 'Primary',
                owner: 'Kalka Roadways',
                marketValueLakhs: 105.0,
                chargeOffered: 'Exclusive RTO Form 34 Hypothecation Lien'
            }
        ],
        guarantors: [
            { name: 'Kripal Singh', pan: 'AECPS1190K', netWorthLakhs: 145.0 }
        ],
        pastFinancials: {
            sales: { past1: 380.0, past2: 490.0, currentEst: 620.0, nextProj: 810.0 },
            netProfit: { past1: 22.0, past2: 31.0, currentEst: 44.0, nextProj: 62.0 },
            netWorth: { past1: 75.0, past2: 105.0, currentEst: 148.0, nextProj: 210.0 }
        },
        promoters: [
            { name: 'Kripal Singh', pan: 'AECPS1190K', designation: 'Sole Proprietor', shareholding: 100.0, mobile: '9818819201' }
        ],
        bankAccounts: [
            { bankName: 'Bank of Baroda', accountNo: 'XXXXXX8120', type: 'Current Account', bsaRun: true, abb: '₹12.8 Lakhs', bounces: 0 }
        ],
        strategicPlan: {
            fundDeploymentTarget: 'Delivery of 6 Tata Prima multi-axle freight trucks under national highway contract.',
            projectedDSCR: 2.05,
            targetRevenueGrowth: '32% fleet capacity increase.',
            breakEvenTimeline: 'Break-even in Month 2 of fleet deployment.'
        },
        redFlags: []
    },
    {
        id: '1105607',
        ackNo: 'ACKNO202681891105607',
        submissionDate: '22/09/2026',
        enterpriseName: 'BHARAT BIO-CHEMICALS & AGRO COMPLEX LTD',
        constitution: 'Public Limited',
        entityType: 'PUBLIC_LTD',
        borrowerNiche: 'SENP',
        pan: 'AABCB9122K',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Specialty Bio-Chemicals & Agro Processing',
        loanProduct: 'PROJECT',
        loanType: 'Project Funding (Greenfield Agro-Chemical Plant)',
        loanAmountLakhs: 2250.0,
        loanAmountFormatted: '₹22.50 Cr',
        projectCostLakhs: 3000.0,
        projectCostFormatted: '₹30.00 Cr',
        targetLender: 'State Bank of India (Project Finance Division)',
        status: 'UNDER_REVIEW',
        scorecard: 86,
        cibilScore: 765,
        contactEmail: 'corporate@bharatbiochem.com',
        contactMobile: '9871109482',
        registeredOffice: 'Industrial Growth Centre, Dahej, Gujarat - 392130',
        dscr: 2.18,
        debtEquity: '2.33:1 (75:25)',
        projectCostBreakdown: {
            land: { incurred: 450.0, toIncur: 0.0, total: 450.0 },
            building: { incurred: 200.0, toIncur: 550.0, total: 750.0 },
            machineryIndigenous: { incurred: 100.0, toIncur: 1700.0, total: 1800.0 },
            total: { incurred: 750.0, toIncur: 2250.0, total: 3000.0 }
        },
        meansOfFinance: {
            promoterCapital: { raised: 550.0, proposed: 0.0, total: 550.0 },
            unsecuredLoans: { raised: 200.0, proposed: 0.0, total: 200.0 },
            termLoan: { raised: 0.0, proposed: 2250.0, total: 2250.0 },
            total: { raised: 750.0, proposed: 2250.0, total: 3000.0 }
        },
        securities: [
            {
                type: '15-Acre Industrial Land & Factory Infrastructure',
                nature: 'Primary',
                owner: 'Bharat Bio-Chemicals Ltd',
                marketValueLakhs: 1200.0,
                chargeOffered: '1st Exclusive Equitable Mortgage'
            },
            {
                type: 'Continuous Chemical Processing Plant Lines',
                nature: 'Primary',
                owner: 'Bharat Bio-Chemicals Ltd',
                marketValueLakhs: 1800.0,
                chargeOffered: '1st Hypothecation Charge'
            }
        ],
        guarantors: [
            { name: 'Dr. Mukul Chandra', pan: 'AACCM8192L', netWorthLakhs: 1250.0 }
        ],
        pastFinancials: {
            sales: { past1: 4200.0, past2: 5600.0, currentEst: 7200.0, nextProj: 11500.0 },
            netProfit: { past1: 310.0, past2: 440.0, currentEst: 610.0, nextProj: 1120.0 },
            netWorth: { past1: 1800.0, past2: 2450.0, currentEst: 3400.0, nextProj: 5100.0 }
        },
        promoters: [
            { name: 'Dr. Mukul Chandra', pan: 'AACCM8192L', designation: 'Chairman & Managing Director', shareholding: 55.0, mobile: '9871109482' },
            { name: 'Aarti Chandra', pan: 'AACCA9910Q', designation: 'Executive Director', shareholding: 45.0, mobile: '9871109483' }
        ],
        bankAccounts: [
            { bankName: 'State Bank of India', accountNo: 'XXXXXX1982', type: 'Current Account', bsaRun: true, abb: '₹142.0 Lakhs', bounces: 0 }
        ],
        strategicPlan: {
            fundDeploymentTarget: 'Civil construction completion, import of German catalytic reactors & COD by Dec 2027.',
            projectedDSCR: 2.18,
            targetRevenueGrowth: '60% revenue step-jump post commissioning.',
            breakEvenTimeline: 'Break-even in Month 6 of full production.'
        },
        redFlags: []
    },
    {
        id: '1105608',
        ackNo: 'ACKNO202681891105608',
        submissionDate: '26/09/2026',
        enterpriseName: 'ZENITH TECHNO CRAFTS LLP',
        constitution: 'LLP',
        entityType: 'LLP',
        borrowerNiche: 'SENP',
        pan: 'AAALK2910M',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Manufacturing',
        msmeCategory: 'MEDIUM',
        udyamNo: 'UDYAM-DL-02-0044912',
        udyamDate: '12/04/2020',
        loanProduct: 'OD_CC',
        loanType: 'Working Capital Cash Credit (OD/CC)',
        loanAmountLakhs: 225.0,
        loanAmountFormatted: '₹2.25 Cr',
        mpbfFormatted: '₹2.40 Cr',
        mpbfLakhs: 240.0,
        turnoverFormatted: '₹12.50 Cr',
        turnoverLakhs: 1250.0,
        targetLender: 'Punjab National Bank (MSME Desk)',
        status: 'SANCTIONED',
        scorecard: 85,
        cibilScore: 748,
        contactEmail: 'contact@zenithcrafts.in',
        contactMobile: '9810144921',
        registeredOffice: 'Industrial Area Phase 2, Mayapuri, New Delhi - 110064',
        currentRatio: 1.38,
        securities: [
            {
                type: 'Raw Materials, Work-in-Progress & Finished Goods',
                nature: 'Primary',
                owner: 'Zenith Techno Crafts LLP',
                marketValueLakhs: 185.0,
                chargeOffered: '1st Exclusive Hypothecation Charge'
            },
            {
                type: 'Book Debts / Sundry Receivables (< 90 Days)',
                nature: 'Primary',
                owner: 'Zenith Techno Crafts LLP',
                marketValueLakhs: 160.0,
                chargeOffered: '1st Hypothecation Charge on Receivables'
            }
        ],
        guarantors: [
            { name: 'Kalyan Aggarwal', pan: 'ABCPA9921K', netWorthLakhs: 260.0 }
        ],
        pastFinancials: {
            sales: { past1: 620.0, past2: 890.0, currentEst: 1250.0, nextProj: 1600.0 },
            netProfit: { past1: 28.0, past2: 46.0, currentEst: 72.0, nextProj: 98.0 },
            netWorth: { past1: 110.0, past2: 172.0, currentEst: 258.0, nextProj: 356.0 }
        },
        promoters: [
            { name: 'Kalyan Aggarwal', pan: 'ABCPA9921K', designation: 'Designated Partner', shareholding: 60.0, mobile: '9810144921' },
            { name: 'Sunil Aggarwal', pan: 'ABCPA8812S', designation: 'Designated Partner', shareholding: 40.0, mobile: '9810144922' }
        ],
        bankAccounts: [
            { bankName: 'Punjab National Bank', accountNo: 'XXXXXX1044', type: 'Cash Credit Account', bsaRun: true, abb: '₹34.2 Lakhs', bounces: 0 }
        ],
        strategicPlan: {
            fundDeploymentTarget: 'Replenishment of steel inventory and discounting supplier bills within 30-day cycle.',
            projectedDSCR: 2.10,
            targetRevenueGrowth: '30% YoY expansion backed by enhanced drawing power.',
            breakEvenTimeline: 'Ongoing operating profitability.'
        },
        redFlags: []
    },
    {
        id: '1105609',
        ackNo: 'ACKNO202681891105609',
        submissionDate: '24/09/2026',
        enterpriseName: 'DYNAMIC AUTO COMPONENTS PVT LTD',
        constitution: 'Private Limited',
        entityType: 'PVT_LTD',
        borrowerNiche: 'SENP',
        pan: 'AADCD7712Q',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Tier-1 Automotive Ancillary',
        msmeCategory: 'MEDIUM',
        udyamNo: 'UDYAM-HR-05-0019482',
        loanProduct: 'BILL_DISCOUNTING',
        loanType: 'Bill / Commercial Invoice Discounting',
        loanAmountLakhs: 150.0,
        loanAmountFormatted: '₹1.50 Cr',
        eligibleInvoicesFormatted: '₹2.10 Cr',
        invoicesBookLakhs: 210.0,
        advanceRate: 80.0,
        debtorTenorDays: 45,
        targetLender: 'Hero Fincorp (Supply Chain Finance)',
        status: 'UNDER_REVIEW',
        scorecard: 87,
        cibilScore: 760,
        contactEmail: 'finance@dynamicauto.in',
        contactMobile: '9811492019',
        registeredOffice: 'Sector 8, IMT Manesar, Gurugram, Haryana - 122050',
        securities: [
            {
                type: 'Verified Commercial Invoices & Supply Bills',
                nature: 'Primary',
                owner: 'Dynamic Auto Components Pvt Ltd',
                marketValueLakhs: 210.0,
                chargeOffered: 'Absolute Assignment of Accepted Receivables with Escrow Mandate'
            }
        ],
        guarantors: [
            { name: 'Devendra Malik', pan: 'AABPM7710R', netWorthLakhs: 310.0 }
        ],
        pastFinancials: {
            sales: { past1: 890.0, past2: 1180.0, currentEst: 1540.0, nextProj: 2100.0 },
            netProfit: { past1: 45.0, past2: 68.0, currentEst: 96.0, nextProj: 142.0 },
            netWorth: { past1: 210.0, past2: 310.0, currentEst: 440.0, nextProj: 610.0 }
        },
        promoters: [
            { name: 'Devendra Malik', pan: 'AABPM7710R', designation: 'Managing Director', shareholding: 75.0, mobile: '9811492019' },
            { name: 'Naveen Malik', pan: 'AABPN8812S', designation: 'Director', shareholding: 25.0, mobile: '9811492020' }
        ],
        bankAccounts: [
            { bankName: 'Hero Fincorp Escrow / HDFC Bank', accountNo: 'XXXXXX7721', type: 'Current Account', bsaRun: true, abb: '₹26.5 Lakhs', bounces: 0 }
        ],
        strategicPlan: {
            fundDeploymentTarget: 'Immediate liquidity against OEM Tier-1 component delivery invoices with 45-day cycle.',
            projectedDSCR: 2.25,
            targetRevenueGrowth: '35% billing velocity.',
            breakEvenTimeline: 'Immediate working capital cycle compression.'
        },
        redFlags: []
    }
];
