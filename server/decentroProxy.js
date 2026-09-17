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
                    noOfAccounts: '4',
                    noOfActiveAccounts: '3',
                    totalMonthlyPaymentAmount: '38450.00',
                    totalBalanceAmount: '862000.00',
                    totalSanctionAmount: '2450000.00',
                    totalPastDue: '0.00'
                  },
                  retailAccountDetails: [
                    {
                      seq: '1',
                      institution: 'HDFC Bank Ltd',
                      accountType: 'Secured Business Loan',
                      accountNumber: 'XXXXXXXXXXXX4821',
                      balance: '520000',
                      sanctionAmount: '1500000',
                      installmentAmount: '24500',
                      interestRate: '10.50',
                      open: 'Yes',
                      pastDueAmount: '0'
                    },
                    {
                      seq: '2',
                      institution: 'ICICI Bank Ltd',
                      accountType: 'Credit Card',
                      accountNumber: 'XXXXXXXXXXXX9134',
                      balance: '42000',
                      sanctionAmount: '300000',
                      installmentAmount: '4500',
                      interestRate: '42.00',
                      open: 'Yes',
                      pastDueAmount: '0'
                    }
                  ],
                  otherKeyInd: {
                    ageOfOldestTrade: '158',
                    numberOfOpenTrades: '3',
                    allLinesEVERWritten: '0.00'
                  },
                  recentActivities: {
                    accountsDeliquent: '0',
                    accountsOpened: '0',
                    totalInquiries: '0',
                    accountsUpdated: '1'
                  }
                }
              }
            ]
          },
          reportOrderNumber: '8923745612'
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
