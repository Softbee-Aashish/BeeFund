/**
 * ==============================================================================
 * BEEFUND - PRODUCTION DECENTRO CREDIT BUREAU PROXY SERVER
 * ==============================================================================
 * Use this server for standalone Node/Express production deployments.
 * 
 * To run:
 * 1. Install dependencies (if not already): npm install express cors dotenv
 * 2. Start proxy: node server/decentroProxy.js
 * ==============================================================================
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory rate limiting and cooling-off map: prevent repeated queries on same PAN
const cooldownMap = new Map();

app.post('/api/decentro/credit-report', async (req, res) => {
  try {
    const {
      reference_id,
      consent,
      consent_purpose,
      name,
      mobile,
      inquiry_purpose,
      date_of_birth,
      address_type,
      address,
      pincode,
      document_type,
      document_id,
      bureau_code,
      generate_pdf
    } = req.body;

    // Strict validation before touching Decentro
    if (!document_id || !mobile || !name || !consent) {
      return res.status(400).json({
        status: 'FAILURE',
        message: 'Missing mandatory fields: document_id (PAN), mobile, name, or consent.'
      });
    }

    const clientId = process.env.DECENTRO_CLIENT_ID;
    const clientSecret = process.env.DECENTRO_CLIENT_SECRET;
    const moduleSecret = process.env.DECENTRO_MODULE_SECRET;
    const decentroEnv = process.env.DECENTRO_ENV || 'staging';
    const mockMode = process.env.VITE_DECENTRO_MOCK_MODE === 'true';

    // Anti-drain protection: 1 request per PAN per 10 minutes
    const now = Date.now();
    const lastHit = cooldownMap.get(document_id);
    if (lastHit && (now - lastHit < 10 * 60 * 1000)) {
      const waitSeconds = Math.ceil((10 * 60 * 1000 - (now - lastHit)) / 1000);
      return res.status(429).json({
        status: 'FAILURE',
        message: `Protection Lock: A credit bureau inquiry was recently completed for this PAN. To protect against redundant charges (₹400/call), please wait ${waitSeconds} seconds or access your downloaded report.`
      });
    }

    if (mockMode || !clientId || !clientSecret) {
      return res.json({
        decentroTxnId: `MOCK_TXN_${Date.now()}`,
        status: 'SUCCESS',
        responseCode: 'S00000',
        message: 'Credit Report fetched successfully (Sandbox Mode)',
        data: {
          cCRResponse: {
            status: '1',
            cIRReportDataLst: [
              {
                cIRReportData: {
                  iDAndContactInfo: {
                    personalInfo: {
                      name: { fullName: name },
                      dateOfBirth: date_of_birth,
                      gender: 'Male',
                      age: { age: '35' }
                    }
                  },
                  scoreDetails: [
                    {
                      value: '785',
                      type: 'ERS',
                      name: 'ERS4.0',
                      scoringElements: [
                        { seq: '1', code: '703', description: 'Total Utilization' },
                        { seq: '2', code: '702', description: 'Total Credit Exposure' },
                        { seq: '3', code: '704', description: 'Credit Card Utilization' }
                      ]
                    }
                  ],
                  retailAccountsSummary: {
                    noOfAccounts: '10',
                    noOfActiveAccounts: '6',
                    totalMonthlyPaymentAmount: '198773.00',
                    totalBalanceAmount: '352932.00',
                    totalSanctionAmount: '2093283.00',
                    totalPastDue: '635.00'
                  },
                  retailAccountDetails: [
                    {
                      seq: '1',
                      accountNumber: '30100045286393',
                      institution: 'CAPRI GLOB',
                      accountType: 'Gold Loan',
                      ownershipType: 'Individual',
                      balance: '32940',
                      pastDueAmount: '635',
                      open: 'Yes',
                      sanctionAmount: '32946',
                      installmentAmount: '615',
                      interestRate: '22.00',
                      repaymentTenure: '24',
                      dateOpened: '09/07/2026',
                      collateral: 'Gold',
                      dpd: '15'
                    },
                    {
                      seq: '2',
                      accountNumber: '1691759583624297',
                      institution: 'SURYOFIN',
                      accountType: 'Consumer Loan',
                      ownershipType: 'Individual',
                      balance: '32516',
                      pastDueAmount: '0',
                      open: 'Yes',
                      sanctionAmount: '60000',
                      installmentAmount: '3500',
                      interestRate: '24.00',
                      repaymentTenure: '12',
                      dateOpened: '17/10/2025',
                      collateral: 'No Collateral',
                      dpd: '75'
                    },
                    {
                      seq: '3',
                      accountNumber: '00000004076668119',
                      institution: 'CENTRAL BANK',
                      accountType: 'Gold Loan',
                      ownershipType: 'Individual',
                      balance: '161270',
                      pastDueAmount: '0',
                      open: 'Yes',
                      sanctionAmount: '160194',
                      installmentAmount: '161428',
                      interestRate: '9.25',
                      repaymentTenure: '12',
                      dateOpened: '29/10/2025',
                      collateral: 'Gold',
                      valueCollateral: '218197',
                      dpd: '0'
                    },
                    {
                      seq: '4',
                      accountNumber: '7227226542779959265',
                      institution: 'INDUSIND BANK',
                      accountType: 'Credit Card',
                      ownershipType: 'Individual',
                      balance: '64750',
                      pastDueAmount: '0',
                      open: 'Yes',
                      sanctionAmount: '238000',
                      creditLimit: '238000',
                      highCredit: '230000',
                      cashLimit: '47600',
                      installmentAmount: '11293',
                      repaymentTenure: '24',
                      dateOpened: '17/02/2024',
                      dpd: '0'
                    },
                    {
                      seq: '5',
                      accountNumber: '00000040452012707',
                      institution: 'SBI',
                      accountType: 'Auto Loan Personal',
                      ownershipType: 'Individual',
                      balance: '16499',
                      pastDueAmount: '0',
                      open: 'Yes',
                      sanctionAmount: '850000',
                      installmentAmount: '17235',
                      interestRate: '8.00',
                      repaymentTenure: '60',
                      dateOpened: '18/09/2021',
                      collateral: 'Property',
                      valueCollateral: '1730090',
                      isAutoLoan: true,
                      dpd: '0'
                    },
                    {
                      seq: '6',
                      accountNumber: '0000000018545893',
                      institution: 'ICICI BANK',
                      accountType: 'Credit Card',
                      ownershipType: 'Individual',
                      balance: '37563',
                      pastDueAmount: '0',
                      open: 'Yes',
                      sanctionAmount: '80000',
                      creditLimit: '80000',
                      highCredit: '70127',
                      cashLimit: '8000',
                      installmentAmount: '4500',
                      dateOpened: '25/01/2021',
                      dpd: '10'
                    },
                    {
                      seq: '7',
                      accountNumber: 'P582PCD63630080',
                      institution: 'BAJAJ FIN LTD',
                      accountType: 'Consumer Loan',
                      ownershipType: 'Individual',
                      balance: '0',
                      pastDueAmount: '0',
                      open: 'No',
                      sanctionAmount: '110000',
                      installmentAmount: '0',
                      repaymentTenure: '7',
                      dateOpened: '18/11/2025',
                      dateClosed: '03/06/2026',
                      lastPaymentDate: '03/06/2026',
                      collateral: 'No Collateral',
                      dpd: '0'
                    },
                    {
                      seq: '8',
                      accountNumber: 'GL45578749',
                      institution: 'IIFL',
                      accountType: 'Gold Loan',
                      ownershipType: 'Individual',
                      balance: '0',
                      pastDueAmount: '0',
                      open: 'No',
                      sanctionAmount: '701300',
                      installmentAmount: '0',
                      repaymentTenure: '24',
                      dateOpened: '13/12/2025',
                      dateClosed: '17/02/2026',
                      collateral: 'Gold',
                      valueCollateral: '940438',
                      dpd: '0'
                    },
                    {
                      seq: '9',
                      accountNumber: 'PG10031191101000157',
                      institution: 'POONAFIN',
                      accountType: 'Business Loan Unsecured',
                      ownershipType: 'Guarantor',
                      balance: '0',
                      pastDueAmount: '0',
                      open: 'No',
                      sanctionAmount: '2500000',
                      installmentAmount: '0',
                      repaymentTenure: '36',
                      dateOpened: '28/06/2012',
                      dateClosed: '06/04/2021',
                      lastPaymentDate: '02/09/2017',
                      writtenOffAmountTotal: '10878',
                      writtenOffAmountPrincipal: '0',
                      settlementAmount: '43613',
                      dpd: '0'
                    },
                    {
                      seq: '10',
                      accountNumber: '55697982',
                      institution: 'HDFC BANK',
                      accountType: 'Auto Loan Personal',
                      ownershipType: 'Joint',
                      balance: '0',
                      pastDueAmount: '0',
                      open: 'No',
                      sanctionAmount: '844619',
                      installmentAmount: '0',
                      repaymentTenure: '60',
                      dateOpened: '20/03/2018',
                      dateClosed: '08/03/2023',
                      lastPaymentDate: '08/03/2023',
                      collateral: 'Hypothecation of Vehicle',
                      dpd: '0'
                    }
                  ],
                  enquiries: [
                    { seq: '1', institution: 'ICICI BANK', date: '30/07/2026', amount: '850000', purpose: 'Auto Loan Personal' },
                    { seq: '2', institution: 'EPIMONEY', date: '28/07/2026', amount: '500000', purpose: 'Business Loan - Unsecured' },
                    { seq: '3', institution: 'AU SFB', date: '16/01/2026', amount: '600000', purpose: 'Auto Loan Personal' },
                    { seq: '4', institution: 'POONAFIN', date: '18/08/2025', amount: '1500000', purpose: 'Business Loan - Unsecured' },
                    { seq: '5', institution: 'HDFC BANK', date: '12/01/2025', amount: '200000', purpose: 'Credit Card' },
                    { seq: '6', institution: 'AMEX', date: '11/01/2025', amount: '300000', purpose: 'Credit Card' },
                    { seq: '7', institution: 'AXIS BANK', date: '11/08/2024', amount: '150000', purpose: 'Credit Card' },
                    { seq: '8', institution: 'RBL BANK', date: '31/05/2024', amount: '177000', purpose: 'Credit Card' },
                    { seq: '9', institution: 'IDFC FIRST BANK', date: '29/04/2024', amount: '100000', purpose: 'Credit Card' },
                    { seq: '10', institution: 'BAJAJ FIN LTD', date: '31/01/2024', amount: '50000', purpose: 'Other' }
                  ],
                  enquirySummary: {
                    total: '10',
                    past30Days: '2',
                    past12Months: '5',
                    recent: '30/07/2026'
                  },
                  otherKeyInd: {
                    ageOfOldestTrade: '170',
                    numberOfOpenTrades: '6',
                    allLinesEVERWritten: '0.00'
                  },
                  recentActivities: {
                    accountsDeliquent: '1',
                    accountsOpened: '2',
                    totalInquiries: '10',
                    accountsUpdated: '3'
                  }
                }
              }
            ]
          },
          reportOrderNumber: '11,57,68,60,755'
        },
        responseKey: 'success_credit_report'
      });
    }

    // Set cooldown timestamp
    cooldownMap.set(document_id, now);

    const baseUrl = decentroEnv === 'production'
      ? 'https://in.decentro.tech'
      : 'https://in.staging.decentro.tech';

    const decentroEndpoint = `${baseUrl}/v2/financial_services/credit_bureau/credit_report/summary`;

    const headers = {
      'Content-Type': 'application/json',
      'client_id': clientId,
      'client_secret': clientSecret
    };
    if (moduleSecret) headers['module_secret'] = moduleSecret;

    const response = await fetch(decentroEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Server error in Decentro proxy:', err);
    res.status(500).json({ status: 'FAILURE', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Decentro Proxy Server running on port ${PORT}`);
});
