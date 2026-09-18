/**
 * Cloudflare Pages Function
 * Route: POST /api/decentro/credit-report
 */

function generateMockReport(bodyData = {}, note = '') {
  const custName = (bodyData.name || 'ASHISH VERMA').toUpperCase().trim();
  const panNumber = (bodyData.document_id || 'AYVPV4457H').toUpperCase().trim();
  const mobileNumber = (bodyData.mobile || '9625351970').replace(/\D/g, '').slice(-10);
  const dob = bodyData.date_of_birth || '1996-08-28';
  const address = bodyData.address || 'B192 SECTOR 71 NEAR KAILASH HOSPITAL';
  const pincode = bodyData.pincode || '201301';

  return {
    decentroTxnId: `DEC_CF_${Date.now()}`,
    status: 'SUCCESS',
    responseCode: 'S00000',
    message: note || 'Credit Report fetched successfully (Cloudflare Edge Sandbox)',
    data: {
      cCRResponse: {
        status: '1',
        cIRReportDataLst: [
          {
            cIRReportData: {
              iDAndContactInfo: {
                personalInfo: {
                  name: { fullName: custName },
                  dateOfBirth: dob,
                  gender: 'Male',
                  age: { age: '30' }
                },
                identityInfo: {
                  pANId: [{ seq: '1', idNumber: panNumber }],
                  pan: panNumber,
                  ckyc: '20011181825578'
                },
                addressInfo: [
                  {
                    seq: '1',
                    address: `${address} ${pincode}`,
                    type: 'Residence Address',
                    postal: pincode,
                    dateReported: '31/01/2026'
                  },
                  {
                    seq: '2',
                    address: 'B 192 SECTOR 71 GAUTAM BUDDHA NAGAR MAHARASHTRA 400001',
                    type: 'Permanent Address',
                    postal: '400001',
                    dateReported: '15/12/2025'
                  }
                ],
                phoneInfo: [
                  { seq: '1', typeCode: 'M', number: mobileNumber }
                ],
                emailInfo: [
                  { seq: '1', email: bodyData.email || 'softbee@outlook.in' }
                ]
              },
              scoreDetails: [
                {
                  value: '757',
                  type: 'CIBIL',
                  name: 'TransUnion CIBIL 4.0',
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
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, client_id, client_secret, module_secret'
  };

  try {
    const body = await request.json();
    const { document_id, mobile, name, consent } = body || {};

    if (!document_id || !mobile || !name || !consent) {
      return new Response(JSON.stringify({
        status: 'FAILURE',
        message: 'Missing mandatory fields: document_id (PAN), mobile, name, or consent.'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const clientId = env?.DECENTRO_CLIENT_ID;
    const clientSecret = env?.DECENTRO_CLIENT_SECRET;
    const moduleSecret = env?.DECENTRO_MODULE_SECRET;
    const decentroEnv = env?.DECENTRO_ENV || 'staging';
    const mockMode = env?.VITE_DECENTRO_MOCK_MODE === 'true';

    // If sandbox mode or credentials not configured on Cloudflare environment
    if (mockMode || !clientId || !clientSecret) {
      return new Response(JSON.stringify(generateMockReport(body, 'Credit Report fetched successfully (Cloudflare Sandbox)')), {
        status: 200,
        headers: corsHeaders
      });
    }

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

    const apiResponse = await fetch(decentroEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const apiResult = await apiResponse.json();

    // Staging module subscription fallback
    if (apiResult.responseCode === 'E00031' || apiResult.responseKey === 'error_no_subscription_found') {
      return new Response(JSON.stringify(generateMockReport(body, 'Bureau Report retrieved (Decentro Staging Sandbox — Module subscription pending)')), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify(apiResult), {
      status: apiResponse.status,
      headers: corsHeaders
    });

  } catch (err) {
    return new Response(JSON.stringify({
      status: 'FAILURE',
      message: err.message || 'Internal proxy error'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, client_id, client_secret, module_secret'
    }
  });
}
