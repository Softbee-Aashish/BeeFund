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
    walletBalance: 8500, // ₹8,500 initial dummy wallet balance
    activeCases: 6,
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

// Initial Seed Cases
export const INITIAL_LMS_CASES = [
    {
        id: '1105604',
        ackNo: 'ACKNO202681891105604',
        submissionDate: '29/09/2026',
        enterpriseName: 'APEX PRECISION POLYMERS LLP',
        constitution: 'Partnership',
        pan: 'ABNFA3331Q',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Manufacturing',
        msmeCategory: 'SMALL',
        udyamNo: 'UDYAM-UP-29-0013890',
        udyamDate: '18/02/2021',
        loanType: 'Rupee Term Loan (Plant & Machinery)',
        loanAmountLakhs: 375.0,
        loanAmountFormatted: '₹3.75 Cr',
        projectCostLakhs: 500.0,
        projectCostFormatted: '₹5.00 Cr',
        targetLender: 'State Bank of India (MSME Desk)',
        status: 'SANCTIONED', // DRAFT | SUBMITTED | UNDER_REVIEW | SANCTIONED | DISBURSED | QUERIED
        scorecard: 88,
        cibilScore: 758,
        contactEmail: 'contact@apexpolymers.in',
        contactMobile: '9873096337',
        registeredOffice: 'Industrial Complex Phase 1, Ghaziabad, Uttar Pradesh - 201001',
        factoryAddressExisting: 'Industrial Complex Phase 1, Ghaziabad, Uttar Pradesh',
        factoryAddressProposed: 'Plot 45, Ecotech Industrial Park, Greater Noida, Uttar Pradesh',
        dccoDate: '31/03/2027',
        moratoriumMonths: 6,
        repaymentMonths: 84,
        projectCostBreakdown: {
            land: { incurred: 85.0, toIncur: 0.0, total: 85.0 },
            building: { incurred: 40.0, toIncur: 75.0, total: 115.0 },
            machineryIndigenous: { incurred: 25.0, toIncur: 275.0, total: 300.0 },
            total: { incurred: 150.0, toIncur: 350.0, total: 500.0 }
        },
        meansOfFinance: {
            promoterCapital: { raised: 85.0, proposed: 0.0, total: 85.0 },
            unsecuredLoans: { raised: 40.0, proposed: 0.0, total: 40.0 },
            termLoan: { raised: 0.0, proposed: 375.0, total: 375.0 },
            total: { raised: 125.0, proposed: 375.0, total: 500.0 }
        },
        securities: [
            {
                type: 'Industrial Land & Factory Building',
                nature: 'Primary',
                owner: 'Apex Precision Polymers LLP',
                marketValueLakhs: 180.0,
                chargeOffered: '1st Exclusive Charge to Lender'
            },
            {
                type: 'Plant & Machinery Hypothecation',
                nature: 'Primary',
                owner: 'Apex Precision Polymers LLP',
                marketValueLakhs: 300.0,
                chargeOffered: '1st Hypothecation Charge'
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
            { name: 'Shivani Mittal', pan: 'ASUPA1336P', netWorthLakhs: 215.0 },
            { name: 'Harshit Garg', pan: 'BESPG1392G', netWorthLakhs: 320.0 }
        ],
        pastFinancials: {
            sales: { past1: 820.5, past2: 980.2, currentEst: 1240.0, nextProj: 1680.0 },
            netProfit: { past1: 38.4, past2: 52.1, currentEst: 76.5, nextProj: 118.0 },
            netWorth: { past1: 145.0, past2: 197.1, currentEst: 273.6, nextProj: 391.6 }
        },
        promoters: [
            { name: 'Rohit Shishodia', pan: 'BTRPS0101H', designation: 'Managing Partner', shareholding: 40.0, mobile: '9873096337' },
            { name: 'Shivani Mittal', pan: 'ASUPA1336P', designation: 'Partner', shareholding: 30.0, mobile: '9910600368' },
            { name: 'Harshit Garg', pan: 'BESPG1392G', designation: 'Partner', shareholding: 30.0, mobile: '8130308150' }
        ],
        bankAccounts: [
            { bankName: 'HDFC Bank', accountNo: 'XXXXXX4920', type: 'Current Account', bsaRun: true, abb: '₹22.5 Lakhs', bounces: 0 },
            { bankName: 'State Bank of India', accountNo: 'XXXXXX8812', type: 'Cash Credit Account', bsaRun: true, abb: '₹38.2 Lakhs', bounces: 0 }
        ],
        strategicPlan: {
            fundDeploymentTarget: '3-Phase machinery procurement and plant commissioning within 6 months.',
            projectedDSCR: 2.15,
            targetRevenueGrowth: '35% YoY driven by industrial polymer injection demand.',
            breakEvenTimeline: 'Operational break-even in Month 4 of full commercial operations.'
        },
        redFlags: [
            { severity: 'LOW', title: 'Seasonal Inflow Peak in Q3', desc: 'Higher revenue during festive packaging seasons, normal for polymer packaging industry.' }
        ]
    },
    {
        id: '1105605',
        ackNo: 'ACKNO202681891105605',
        submissionDate: '26/09/2026',
        enterpriseName: 'ZENITH TECHNO CRAFTS LLP',
        constitution: 'LLP',
        pan: 'AAALK2910M',
        yearsOfOperation: 'Enterprise having 3 years ITR or more',
        industry: 'Manufacturing',
        msmeCategory: 'MEDIUM',
        udyamNo: 'UDYAM-DL-02-0044912',
        udyamDate: '12/04/2020',
        loanType: 'Working Capital Cash Credit (OD/CC)',
        loanAmountLakhs: 225.0,
        loanAmountFormatted: '₹2.25 Cr',
        projectCostLakhs: 300.0,
        projectCostFormatted: '₹3.00 Cr',
        targetLender: 'Punjab National Bank',
        status: 'UNDER_REVIEW',
        scorecard: 79,
        cibilScore: 732,
        contactEmail: 'contact@zenithcrafts.in',
        contactMobile: '9810144921',
        registeredOffice: 'Industrial Area Phase 2, Mayapuri, New Delhi - 110064',
        securities: [
            { type: 'Industrial Shed & Book Debts', nature: 'Primary', owner: 'Zenith Techno Crafts LLP', marketValueLakhs: 280.0, chargeOffered: '1st Hypothecation & Mortgage Charge' }
        ],
        guarantors: [
            { name: 'Kalyan Aggarwal', pan: 'ABCPA9921K', netWorthLakhs: 260.0 }
        ],
        pastFinancials: {
            sales: { past1: 620.0, past2: 750.0, currentEst: 920.0, nextProj: 1200.0 },
            netProfit: { past1: 28.0, past2: 39.0, currentEst: 54.0, nextProj: 78.0 },
            netWorth: { past1: 110.0, past2: 149.0, currentEst: 203.0, nextProj: 281.0 }
        },
        promoters: [
            { name: 'Kalyan Aggarwal', pan: 'ABCPA9921K', designation: 'Designated Partner', shareholding: 60.0, mobile: '9810144921' },
            { name: 'Sunil Aggarwal', pan: 'ABCPA8812S', designation: 'Designated Partner', shareholding: 40.0, mobile: '9810144922' }
        ],
        bankAccounts: [
            { bankName: 'Punjab National Bank', accountNo: 'XXXXXX1044', type: 'Current Account', bsaRun: true, abb: '₹14.2 Lakhs', bounces: 0 }
        ],
        strategicPlan: {
            fundDeploymentTarget: 'Immediate replenishment of steel raw material inventory and supplier discounting.',
            projectedDSCR: 1.95,
            targetRevenueGrowth: '25% YoY expansion with enhanced drawing power.',
            breakEvenTimeline: 'Immediate working capital rotation cycles of 45 days.'
        },
        redFlags: []
    }
];
