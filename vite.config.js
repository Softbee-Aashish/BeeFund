import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Decentro Credit Bureau Middleware Plugin
function decentroCreditProxyPlugin(env) {
  return {
    name: 'decentro-credit-proxy',
    configureServer(server) {
      server.middlewares.use('/api/decentro/credit-report', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ status: 'FAILURE', message: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            const clientId = env.DECENTRO_CLIENT_ID || process.env.DECENTRO_CLIENT_ID;
            const clientSecret = env.DECENTRO_CLIENT_SECRET || process.env.DECENTRO_CLIENT_SECRET;
            const moduleSecret = env.DECENTRO_MODULE_SECRET || process.env.DECENTRO_MODULE_SECRET;
            const decentroEnv = env.DECENTRO_ENV || process.env.DECENTRO_ENV || 'staging';
            const mockMode = (env.VITE_DECENTRO_MOCK_MODE || process.env.VITE_DECENTRO_MOCK_MODE) === 'true';

            // Safe Mock Mode: If mockMode is enabled or API keys are not yet configured
            if (mockMode || !clientId || !clientSecret) {
              console.log('🛡️ Decentro Safe Mode: Serving simulated bureau report (Cost: ₹0)');
              const mockScore = 785;
              const mockResponse = {
                decentroTxnId: `MOCK_TXN_${Date.now()}`,
                status: 'SUCCESS',
                responseCode: 'S00000',
                message: 'Credit Report fetched successfully (Sandbox / Protected Mode)',
                data: {
                  cCRResponse: {
                    status: '1',
                    cIRReportDataLst: [
                      {
                        cIRReportData: {
                          iDAndContactInfo: {
                            personalInfo: {
                              name: {
                                fullName: parsedBody.name || 'RAHUL SANJAY DESHMUKH',
                                firstName: (parsedBody.name || 'RAHUL').split(' ')[0],
                                lastName: (parsedBody.name || 'DESHMUKH').split(' ')[1] || 'SHARMA'
                              },
                              dateOfBirth: parsedBody.date_of_birth || '1988-06-15',
                              gender: 'Male',
                              age: { age: '36' },
                              totalIncome: '1250000',
                              occupation: 'BUSINESS OWNER'
                            },
                            identityInfo: {
                              pANId: [{ seq: '1', idNumber: parsedBody.document_id || 'BQTPD5678L' }]
                            },
                            addressInfo: [
                              {
                                seq: '1',
                                address: parsedBody.address || 'GALAXY TOWER 3 NEHRU STREET INDIRANAGAR',
                                state: 'KARNATAKA',
                                postal: parsedBody.pincode || '560038',
                                type: 'Primary'
                              }
                            ],
                            phoneInfo: [
                              { seq: '1', typeCode: 'M', number: parsedBody.mobile || '9876543210' }
                            ]
                          },
                          scoreDetails: [
                            {
                              type: 'ERS',
                              version: '4.0',
                              name: 'ERS4.0',
                              value: String(mockScore),
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
                            noOfWriteOffs: '0',
                            totalPastDue: '0.00',
                            totalBalanceAmount: '862000.00',
                            totalSanctionAmount: '2450000.00',
                            totalCreditLimit: '300000.00',
                            totalMonthlyPaymentAmount: '38450.00'
                          },
                          retailAccountDetails: [
                            {
                              seq: '1',
                              accountNumber: 'XXXXXXXXXXXX4821',
                              institution: 'HDFC Bank Ltd',
                              accountType: 'Secured Business Loan',
                              ownershipType: 'Individual',
                              balance: '520000',
                              pastDueAmount: '0',
                              open: 'Yes',
                              sanctionAmount: '1500000',
                              installmentAmount: '24500',
                              interestRate: '10.50',
                              repaymentTenure: '60',
                              termFrequency: 'Monthly',
                              accountStatus: 'Current Account',
                              dateOpened: '2023-04-10',
                              lastPaymentDate: '2026-02-05'
                            },
                            {
                              seq: '2',
                              accountNumber: 'XXXXXXXXXXXX9134',
                              institution: 'ICICI Bank Ltd',
                              accountType: 'Credit Card (Regalia)',
                              ownershipType: 'Individual',
                              balance: '42000',
                              pastDueAmount: '0',
                              open: 'Yes',
                              sanctionAmount: '300000',
                              installmentAmount: '4500',
                              interestRate: '42.00',
                              repaymentTenure: 'Revolving',
                              termFrequency: 'Monthly',
                              accountStatus: 'Current Account',
                              dateOpened: '2021-08-15',
                              lastPaymentDate: '2026-02-28'
                            },
                            {
                              seq: '3',
                              accountNumber: 'XXXXXXXXXXXX6210',
                              institution: 'Kotak Mahindra Bank',
                              accountType: 'Commercial Auto Loan',
                              ownershipType: 'Individual',
                              balance: '300000',
                              pastDueAmount: '0',
                              open: 'Yes',
                              sanctionAmount: '650000',
                              installmentAmount: '9450',
                              interestRate: '9.75',
                              repaymentTenure: '48',
                              termFrequency: 'Monthly',
                              accountStatus: 'Current Account',
                              dateOpened: '2024-01-20',
                              lastPaymentDate: '2026-02-10'
                            },
                            {
                              seq: '4',
                              accountNumber: 'XXXXXXXXXXXX1109',
                              institution: 'Axis Bank Ltd',
                              accountType: 'Consumer Loan',
                              ownershipType: 'Individual',
                              balance: '0',
                              pastDueAmount: '0',
                              open: 'No',
                              sanctionAmount: '150000',
                              installmentAmount: '0',
                              interestRate: '12.00',
                              repaymentTenure: '12',
                              termFrequency: 'Monthly',
                              accountStatus: 'Closed Account',
                              dateOpened: '2022-03-01',
                              lastPaymentDate: '2023-03-01'
                            }
                          ],
                          enquiries: [
                            { seq: '1', institution: 'State Bank of India', date: '2025-11-14', amount: '500000' }
                          ],
                          enquirySummary: {
                            total: '1',
                            past30Days: '0',
                            past12Months: '1',
                            recent: '2025-11-14'
                          }
                        }
                      }
                    ]
                  }
                }
              };

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(mockResponse));
              return;
            }

            // Real Decentro Live API Call
            console.log(`📡 Forwarding LIVE request to Decentro (${decentroEnv}) - Cost: ~₹400`);
            const baseUrl = decentroEnv === 'production'
              ? 'https://in.decentro.tech'
              : 'https://in.staging.decentro.tech';

            const decentroEndpoint = `${baseUrl}/v2/financial_services/credit_bureau/credit_report/summary`;

            const headers = {
              'Content-Type': 'application/json',
              'client_id': clientId,
              'client_secret': clientSecret
            };
            if (moduleSecret) {
              headers['module_secret'] = moduleSecret;
            }

            const apiResponse = await fetch(decentroEndpoint, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(parsedBody)
            });

            const apiResult = await apiResponse.json();
            res.statusCode = apiResponse.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(apiResult));
          } catch (err) {
            console.error('Decentro proxy error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'FAILURE', message: err.message || 'Internal proxy error' }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      decentroCreditProxyPlugin(env)
    ],
    server: {
      host: true,
      allowedHosts: true
    }
  };
});

