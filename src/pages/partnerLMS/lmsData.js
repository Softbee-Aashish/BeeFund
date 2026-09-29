/**
 * Master Datasets & Sample Cases for partnerLMS
 * Includes institutional project finance case structure (e.g. SIDBI ₹36 Cr Project / ₹27 Cr Loan)
 */

export const PARTNER_LMS_CREDENTIALS = {
    email: 'dsa@beefund.in',
    password: 'partnerlms123'
};

export const DEFAULT_PARTNER_PROFILE = {
    facilitatorId: '15141',
    leadId: '21006',
    name: 'Aadyashiv Consulting Private Limited',
    primaryContact: 'Rohit Shishodia',
    email: 'dsa@beefund.in',
    phone: '9871221173',
    pan: 'ABACA0921G',
    address: 'First Floor A 709 710, Gharoli Road, Mayur Vihar Phase 3, East Delhi 110096',
    tier: 'Platinum Institutional Partner',
    walletBalance: 8500, // ₹8,500 initial dummy wallet balance
    activeCases: 8,
    disbursedVolume: '₹142.5 Cr',
    sanctionRatio: '84.2%'
};

export const LMS_PRICING_MATRIX = {
    cibil: { name: 'CIBIL Bureau Deep CIR Pull', cost: 50 },
    bsa6: { name: 'Bank Statement Analysis (6M per Account)', cost: 30 },
    bsa12: { name: 'Bank Statement Analysis (12M per Account)', cost: 45 },
    gst12: { name: 'GST Turnover & ITC Reconciliation (12M)', cost: 40 },
    gst24: { name: 'GST Turnover & ITC Reconciliation (24M)', cost: 60 }
};

// Initial Seed Cases
export const INITIAL_LMS_CASES = [
    {
        id: '1105604',
        ackNo: 'ACKNO202681891105604',
        submissionDate: '29/09/2026',
        enterpriseName: 'AMBESTEN PACKAGINGS',
        constitution: 'Partnership',
        pan: 'ABNFA3331Q',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Manufacturing',
        msmeCategory: 'SMALL',
        udyamNo: 'UDYAM-UP-29-0013890',
        udyamDate: '18/02/2021',
        loanType: 'Rupee Term Loan (Project Finance)',
        loanAmountLakhs: 2700.0,
        loanAmountFormatted: '₹27.00 Cr',
        projectCostLakhs: 3600.0,
        projectCostFormatted: '₹36.00 Cr',
        targetLender: 'SIDBI New Delhi Branch',
        status: 'SANCTIONED', // DRAFT | SUBMITTED | UNDER_REVIEW | SANCTIONED | DISBURSED | QUERIED
        scorecard: 88,
        cibilScore: 758,
        contactEmail: 'rohitshi2712@gmail.com',
        contactMobile: '9873096337',
        registeredOffice: 'Basement 116 Navyug Market, Ghaziabad, Uttar Pradesh - 201001',
        factoryAddressExisting: 'Basement 116 Navyug Market, Ghaziabad, Uttar Pradesh',
        factoryAddressProposed: 'Khasra Number 313 Ravan Urf Badgaon, Tehsil Khekda, Badgaon Road, Near National Peripheral Express Highway, District Baghpat',
        dccoDate: '30/09/2027',
        moratoriumMonths: 12,
        repaymentMonths: 108,
        projectCostBreakdown: {
            land: { incurred: 600.0, toIncur: 0.0, total: 600.0 },
            building: { incurred: 200.0, toIncur: 800.0, total: 1000.0 },
            machineryIndigenous: { incurred: 100.0, toIncur: 1900.0, total: 2000.0 },
            total: { incurred: 900.0, toIncur: 2700.0, total: 3600.0 }
        },
        meansOfFinance: {
            promoterCapital: { raised: 600.0, proposed: 0.0, total: 600.0 },
            unsecuredLoans: { raised: 300.0, proposed: 0.0, total: 300.0 },
            termLoan: { raised: 0.0, proposed: 2700.0, total: 2700.0 },
            total: { raised: 900.0, proposed: 2700.0, total: 3600.0 }
        },
        securities: [
            {
                type: 'Land & Civil Works',
                nature: 'Primary',
                owner: 'Ambesten Packagings',
                marketValueLakhs: 600.0,
                chargeOffered: '1st Exclusive Charge to SIDBI'
            },
            {
                type: 'Cash Collateral (FDR)',
                nature: 'Collateral',
                owner: 'Ambesten Packagings',
                marketValueLakhs: 300.0,
                chargeOffered: '1st Charge on FDR'
            }
        ],
        guarantors: [
            { name: 'Rohit Shishodia', pan: 'BTRPS0101H', netWorthLakhs: 550.0 },
            { name: 'Shivani Mittal', pan: 'ASUPA1336P', netWorthLakhs: 445.0 },
            { name: 'Harshit Garg', pan: 'BESPG1392G', netWorthLakhs: 648.0 },
            { name: 'Pranshul Mittal', pan: 'ANIPM1001A', netWorthLakhs: 738.0 }
        ],
        pastFinancials: {
            sales: { past1: 3024.27, past2: 2743.11, currentEst: 3249.42, nextProj: 5282.79 },
            netProfit: { past1: 29.21, past2: 40.84, currentEst: 52.20, nextProj: 153.86 },
            netWorth: { past1: 177.13, past2: 479.23, currentEst: 488.07, nextProj: 1056.12 }
        },
        promoters: [
            { name: 'Pranshul Mittal', pan: 'ANIPM1001A', designation: 'Partner', shareholding: 7.34, mobile: '9910614222' },
            { name: 'Shivani Mittal', pan: 'ASUPA1336P', designation: 'Partner', shareholding: 26.0, mobile: '9910600368' },
            { name: 'Rohit Shishodia', pan: 'BTRPS0101H', designation: 'Partner (Chief Signatory)', shareholding: 33.33, mobile: '9873096337' },
            { name: 'Harshit Garg', pan: 'BESPG1392G', designation: 'Partner', shareholding: 33.33, mobile: '8130308150' }
        ],
        bankAccounts: [
            { bankName: 'HDFC Bank', accountNo: 'XXXXXX4920', type: 'Current Account', bsaRun: true, abb: '₹34.2 Lakhs', bounces: 0 },
            { bankName: 'State Bank of India', accountNo: 'XXXXXX8812', type: 'Cash Credit Account', bsaRun: true, abb: '₹82.5 Lakhs', bounces: 0 }
        ],
        redFlags: [
            { severity: 'LOW', title: 'Seasonal Revenue Peak in Q3', desc: 'Higher revenue during festive packaging seasons, normal for Corrugated Box industry.' }
        ]
    },
    {
        id: '1105605',
        ackNo: 'ACKNO202681891105605',
        submissionDate: '26/09/2026',
        enterpriseName: 'KALYAN STEEL PROFILES LLP',
        constitution: 'LLP',
        pan: 'AAALK2910M',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Manufacturing',
        msmeCategory: 'MEDIUM',
        udyamNo: 'UDYAM-DL-02-0044912',
        udyamDate: '12/04/2020',
        loanType: 'Working Capital Cash Credit (OD/CC)',
        loanAmountLakhs: 850.0,
        loanAmountFormatted: '₹8.50 Cr',
        projectCostLakhs: 1100.0,
        projectCostFormatted: '₹11.00 Cr',
        targetLender: 'Punjab National Bank',
        status: 'UNDER_REVIEW',
        scorecard: 79,
        cibilScore: 732,
        contactEmail: 'contact@kalyansteel.in',
        contactMobile: '9810144921',
        registeredOffice: 'Industrial Area Phase 2, Mayapuri, New Delhi - 110064',
        securities: [
            { type: 'Industrial Shed & Stocks', nature: 'Primary', owner: 'Kalyan Steel Profiles LLP', marketValueLakhs: 950.0, chargeOffered: '1st Pari-passu Charge' }
        ],
        guarantors: [
            { name: 'Kalyan Aggarwal', pan: 'ABCPA9921K', netWorthLakhs: 410.0 }
        ],
        pastFinancials: {
            sales: { past1: 1820.0, past2: 2150.0, currentEst: 2600.0, nextProj: 3400.0 },
            netProfit: { past1: 42.0, past2: 61.0, currentEst: 78.0, nextProj: 110.0 },
            netWorth: { past1: 320.0, past2: 381.0, currentEst: 459.0, nextProj: 569.0 }
        },
        promoters: [
            { name: 'Kalyan Aggarwal', pan: 'ABCPA9921K', designation: 'Designated Partner', shareholding: 60.0, mobile: '9810144921' },
            { name: 'Sunil Aggarwal', pan: 'ABCPA8812S', designation: 'Designated Partner', shareholding: 40.0, mobile: '9810144922' }
        ],
        bankAccounts: [
            { bankName: 'Punjab National Bank', accountNo: 'XXXXXX1044', type: 'Current Account', bsaRun: true, abb: '₹18.4 Lakhs', bounces: 0 }
        ],
        redFlags: []
    }
];
