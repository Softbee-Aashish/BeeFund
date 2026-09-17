/**
 * ==============================================================================
 * BEEFUND - DECENTRO CREDIT BUREAU SERVICE & PARSER
 * ==============================================================================
 * Features:
 * - Anti-abuse session caching (prevents duplicate API hits costing ₹400 each)
 * - Strict field sanitization matching Decentro Credit Bureau API rules
 * - Comprehensive parser for Decentro CIR report payload & obligation schedule
 * - Excel & PDF export generators for loan obligation analysis
 * ==============================================================================
 */

import { exportToExcel } from './excelExport';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Official Decentro Credit Bureau API Endpoints Specification:
 * - Staging Base: https://in.staging.decentro.tech
 * - Production Base: https://in.decentro.tech
 */
export const DECENTRO_ENDPOINTS = {
    // 1. Credit Report Summary API (Detailed CIR data, loan obligations, score factors, base64 PDF)
    CREDIT_REPORT_SUMMARY: '/v2/financial_services/credit_bureau/credit_report/summary',
    // 2. Standard Credit Report API
    CREDIT_REPORT: '/v2/financial_services/credit_bureau/credit_report',
    // 3. Quick Credit Score API (Lightweight score check with just mobile & name)
    QUICK_CREDIT_SCORE: '/v2/bytes/credit-score',
    // 4. Customer Data Pull API (Fetch KYC, linked PAN, email, phone, addresses)
    CUSTOMER_DATA_PULL: '/v2/financial_services/data/pull'
};

// In-memory cache to ensure zero duplicate hits within the active browser session
const sessionReportCache = new Map();

/**
 * Format currency into Indian Rupees format (e.g. ₹1,25,000)
 */
export const formatINR = (val) => {
    if (val === null || val === undefined || val === '') return '₹0';
    const num = typeof val === 'string' ? parseFloat(val.replace(/[^\d.-]/g, '')) : val;
    if (isNaN(num)) return '₹0';
    return '₹' + Math.round(num).toLocaleString('en-IN');
};

/**
 * Sanitize purpose string for Decentro API:
 * - Must be between 20 and 50 characters (see Decentro documentation)
 * - Must NOT contain special characters like @#$%^&*!~ (causes error_unsanitized_values)
 */
export const sanitizeConsentPurpose = (purpose) => {
    const clean = (purpose || 'Fetching credit report for loan eligibility assessment')
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (clean.length < 20) {
        return 'For credit evaluation and loan eligibility purpose';
    }
    return clean.slice(0, 50);
};

/**
 * Map loan purpose string to Decentro 2-character inquiry purpose code
 * Valid codes per Decentro API spec: BL, CC, CL, HL, GL, PL
 */
export const mapInquiryPurpose = (purpose) => {
    if (!purpose) return 'PL';
    const p = purpose.toUpperCase();
    if (p.includes('BUSINESS') || p === 'BL') return 'BL';
    if (p.includes('HOME') || p.includes('LAP') || p === 'HL') return 'HL';
    if (p.includes('CARD') || p === 'CC') return 'CC';
    if (p.includes('CAR') || p.includes('AUTO') || p === 'CL') return 'CL';
    if (p.includes('GOLD') || p === 'GL') return 'GL';
    return 'PL'; // Default Personal Loan
};

/**
 * Map address type to Decentro code: H (Home/Residence), O (Office), X (Other)
 */
export const mapAddressType = (type) => {
    if (!type) return 'H';
    const t = type.toUpperCase();
    if (t.startsWith('O')) return 'O';
    if (t.startsWith('P') || t.startsWith('X')) return 'X';
    return 'H';
};

/**
 * Fetch Credit Report from Decentro (with built-in anti-drain cache)
 */
export const fetchDecentroCreditReport = async (formData, options = {}) => {
    const panClean = (formData.pan || '').toUpperCase().trim();
    const mobileClean = (formData.mobile || '').replace(/\D/g, '').slice(-10);

    // 1. Check Anti-Drain Cache: If this user was already queried in this session, return cached report!
    const cacheKey = `${panClean}_${mobileClean}`;
    if (!options.bypassCache && sessionReportCache.has(cacheKey)) {
        console.log('⚡ Serving credit report from session cache (Saved ₹400 API hit):', cacheKey);
        return {
            fromCache: true,
            data: sessionReportCache.get(cacheKey)
        };
    }

    // 2. Prepare request payload matching Decentro OpenAPI specification
    const payload = {
        reference_id: `BF_CR_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        consent: true,
        consent_purpose: sanitizeConsentPurpose(formData.consentPurpose),
        name: (formData.name || '').trim().slice(0, 40),
        mobile: mobileClean,
        inquiry_purpose: mapInquiryPurpose(formData.inquiryPurpose),
        date_of_birth: formData.dob || '',
        address_type: mapAddressType(formData.addressType),
        address: (formData.address || 'India').slice(0, 100),
        pincode: (formData.pincode || '').slice(0, 6),
        document_type: 'PAN',
        document_id: panClean,
        bureau_code: formData.bureauCode || 'EQ',
        generate_pdf: true
    };

    // 3. Dispatch to secure backend endpoint
    const response = await fetch('/api/decentro/credit-report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || result.status === 'FAILURE') {
        const errorMsg = result.message || result.error || 'Failed to retrieve bureau report.';
        throw new Error(errorMsg);
    }

    // 4. Parse and cache successful response
    const parsedData = parseDecentroResponse(result, formData);
    sessionReportCache.set(cacheKey, parsedData);

    return {
        fromCache: false,
        data: parsedData
    };
};

/**
 * Parse Decentro JSON response into structured Credit Report & Obligation data
 */
export const parseDecentroResponse = (apiResult, originalInput = {}) => {
    // Navigate to primary CIR report data object
    const rawData = apiResult.data || {};
    const cirReport = rawData?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData || rawData;

    const contactInfo = cirReport?.iDAndContactInfo || {};
    const personal = contactInfo?.personalInfo || {};
    const retailSummary = cirReport?.retailAccountsSummary || {};
    const retailAccounts = cirReport?.retailAccountDetails || [];
    const scoreDetails = cirReport?.scoreDetails || [];
    const enquiries = cirReport?.enquiries || [];
    const enquirySummary = cirReport?.enquirySummary || {};

    // Extract Credit Score
    let creditScore = 750;
    let bureauModel = 'Equifax / CIBIL';
    if (scoreDetails && scoreDetails.length > 0) {
        const primaryScore = scoreDetails[0];
        const val = parseInt(primaryScore.value, 10);
        if (!isNaN(val) && val >= 300 && val <= 900) {
            creditScore = val;
        }
        bureauModel = `${primaryScore.name || primaryScore.type || 'Bureau'} ${primaryScore.version || ''}`.trim();
    } else if (rawData.score) {
        creditScore = parseInt(rawData.score, 10) || 750;
    }

    // Full Name
    const fullName = personal?.name?.fullName || personal?.fullName || originalInput.name || 'Valued Customer';

    // Parse Accounts into Structured Obligation Chart
    let totalMonthlyEMI = 0;
    let totalSanctioned = 0;
    let totalOutstanding = 0;

    const obligationAccounts = retailAccounts.map((acc, idx) => {
        const emi = parseFloat(acc.installmentAmount || '0') || 0;
        const sanction = parseFloat(acc.sanctionAmount || acc.creditLimit || '0') || 0;
        const balance = parseFloat(acc.balance || '0') || 0;
        const pastDue = parseFloat(acc.pastDueAmount || '0') || 0;
        const isOpen = (acc.open || '').toLowerCase() === 'yes' || (acc.accountStatus || '').toLowerCase().includes('current');

        if (isOpen) {
            totalMonthlyEMI += emi;
            totalOutstanding += balance;
            totalSanctioned += sanction;
        }

        return {
            id: idx + 1,
            accountNumber: acc.accountNumber || `ACC-${idx + 1001}`,
            institution: acc.institution || 'Financial Institution',
            accountType: acc.accountType || 'Credit Facility',
            ownershipType: acc.ownershipType || 'Individual',
            sanctionAmount: sanction,
            balance: balance,
            installmentAmount: emi,
            interestRate: acc.interestRate || 'N/A',
            repaymentTenure: acc.repaymentTenure ? `${acc.repaymentTenure} Months` : 'N/A',
            pastDueAmount: pastDue,
            status: isOpen ? 'Active' : 'Closed',
            open: isOpen,
            dateOpened: acc.dateOpened || acc.dateReported || 'N/A',
            lastPaymentDate: acc.lastPaymentDate || 'N/A'
        };
    });

    // If summary values exist, give them priority
    if (retailSummary.totalMonthlyPaymentAmount) {
        totalMonthlyEMI = parseFloat(retailSummary.totalMonthlyPaymentAmount) || totalMonthlyEMI;
    }
    if (retailSummary.totalBalanceAmount) {
        totalOutstanding = parseFloat(retailSummary.totalBalanceAmount) || totalOutstanding;
    }
    if (retailSummary.totalSanctionAmount) {
        totalSanctioned = parseFloat(retailSummary.totalSanctionAmount) || totalSanctioned;
    }

    return {
        decentroTxnId: apiResult.decentroTxnId || `TXN_${Date.now()}`,
        reportOrderNumber: rawData.reportOrderNumber || cirReport?.reportOrderNumber || 'N/A',
        reportDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        score: creditScore,
        bureauModel: bureauModel,
        pdfBase64: rawData.pdfReport || rawData.pdf_base64 || null,
        personal: {
            fullName: fullName.toUpperCase(),
            dob: personal.dateOfBirth || personal.dob || originalInput.dob || 'N/A',
            age: personal.age?.age || personal.age || 'N/A',
            gender: personal.gender || 'N/A',
            pan: originalInput.pan ? `${originalInput.pan.slice(0, 2)}XXXXXX${originalInput.pan.slice(-2)}` : 'N/A',
            mobile: originalInput.mobile ? `+91 ${originalInput.mobile.slice(0, 2)}XXXXXX${originalInput.mobile.slice(-2)}` : 'N/A',
            occupation: personal.occupation || 'Salaried / Business',
            address: contactInfo.addressInfo?.[0]?.address || originalInput.address || 'Registered Address, India'
        },
        summary: {
            totalAccounts: parseInt(retailSummary.noOfAccounts, 10) || obligationAccounts.length,
            activeAccounts: parseInt(retailSummary.noOfActiveAccounts, 10) || obligationAccounts.filter(a => a.open).length,
            closedAccounts: Math.max(0, (parseInt(retailSummary.noOfAccounts, 10) || obligationAccounts.length) - (parseInt(retailSummary.noOfActiveAccounts, 10) || obligationAccounts.filter(a => a.open).length)),
            totalMonthlyEMI: totalMonthlyEMI,
            totalOutstanding: totalOutstanding,
            totalSanctioned: totalSanctioned,
            totalPastDue: parseFloat(retailSummary.totalPastDue || '0') || 0,
            writeOffs: parseInt(retailSummary.noOfWriteOffs, 10) || 0
        },
        obligations: obligationAccounts,
        enquiries: enquiries.map((enq, idx) => ({
            id: idx + 1,
            institution: enq.institution || 'Lender',
            date: enq.date || 'Recent',
            amount: enq.amount ? formatINR(enq.amount) : 'N/A'
        })),
        enquirySummary: {
            total: parseInt(enquirySummary.total, 10) || enquiries.length,
            past30Days: parseInt(enquirySummary.past30Days, 10) || 0,
            past12Months: parseInt(enquirySummary.past12Months, 10) || 0
        },
        scoringFactors: ((scoreDetails && scoreDetails[0]?.scoringElements) || rawData?.scoringElements || []).map((el) => ({
            type: el.type || 'RES',
            seq: el.seq || '1',
            code: el.code || '',
            description: el.description || 'Credit factor'
        })),
        otherKeyInd: {
            ageOfOldestTrade: cirReport?.otherKeyInd?.ageOfOldestTrade ? `${cirReport.otherKeyInd.ageOfOldestTrade} Months` : 'N/A',
            numberOfOpenTrades: cirReport?.otherKeyInd?.numberOfOpenTrades || 'N/A',
            allLinesEVERWritten: cirReport?.otherKeyInd?.allLinesEVERWritten || '0.00'
        },
        recentActivities: {
            accountsDelinquent: cirReport?.recentActivities?.accountsDeliquent || '0',
            accountsOpened: cirReport?.recentActivities?.accountsOpened || '0',
            totalInquiries: cirReport?.recentActivities?.totalInquiries || '0',
            accountsUpdated: cirReport?.recentActivities?.accountsUpdated || '0'
        }
    };
};

/**
 * Export full Obligation Chart and Bureau Summary to Excel (CSV with UTF-8 BOM)
 */
export const exportObligationChartToExcel = (reportData) => {
    if (!reportData || !reportData.obligations) return;

    const headers = [
        '#',
        'Lending Institution',
        'Account Type',
        'Account Number',
        'Ownership',
        'Sanction Amount (INR)',
        'Current Balance (INR)',
        'Monthly EMI Obligation (INR)',
        'Interest Rate (ROI %)',
        'Repayment Tenure',
        'Past Due / Overdue (INR)',
        'Status',
        'Date Opened',
        'Last Payment Date'
    ];

    const rows = reportData.obligations.map((acc, index) => [
        index + 1,
        acc.institution,
        acc.accountType,
        acc.accountNumber,
        acc.ownershipType,
        acc.sanctionAmount,
        acc.balance,
        acc.installmentAmount,
        acc.interestRate,
        acc.repaymentTenure,
        acc.pastDueAmount,
        acc.status,
        acc.dateOpened,
        acc.lastPaymentDate
    ]);

    // Add Summary Row at the bottom
    rows.push([
        'TOTAL',
        'SUMMARY',
        `${reportData.summary.activeAccounts} Active / ${reportData.summary.totalAccounts} Total`,
        '',
        '',
        reportData.summary.totalSanctioned,
        reportData.summary.totalOutstanding,
        reportData.summary.totalMonthlyEMI,
        '',
        '',
        reportData.summary.totalPastDue,
        '',
        '',
        ''
    ]);

    const sanitizedName = (reportData.personal?.fullName || 'Customer').replace(/\s+/g, '_');
    const filename = `BeeFund_Obligation_Chart_${sanitizedName}_${Date.now()}`;
    exportToExcel(filename, headers, rows);
};

/**
 * Download Comprehensive CIBIL / Bureau PDF Report with Obligation Schedule
 */
export const downloadBureauReportPdf = (reportData) => {
    if (!reportData) return;

    // If Decentro provided an official base64 PDF, download that directly!
    if (reportData.pdfBase64) {
        try {
            const byteCharacters = atob(reportData.pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Official_Credit_Report_${(reportData.personal?.fullName || 'Customer').replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        } catch (e) {
            console.warn('Could not decode Decentro base64 PDF, falling back to client PDF generator:', e);
        }
    }

    // High-fidelity multi-page PDF generation via jsPDF & AutoTable
    const doc = new jsPDF('p', 'mm', 'a4');
    const amber = [217, 119, 6];
    const darkSlate = [15, 23, 42];

    // Page 1 Header Banner
    doc.setFillColor(amber[0], amber[1], amber[2]);
    doc.rect(0, 0, 210, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BEEFUND - OFFICIAL CREDIT HEALTH & OBLIGATION REPORT', 14, 15);

    // Borrower Demographic Block
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Borrower: ${reportData.personal?.fullName || 'N/A'} | PAN: ${reportData.personal?.pan || 'N/A'} | Mobile: ${reportData.personal?.mobile || 'N/A'}`, 14, 32);
    doc.text(`Date of Assessment: ${reportData.reportDate} | Bureau Model: ${reportData.bureauModel} | Txn ID: ${reportData.decentroTxnId}`, 14, 37);

    // Score & Obligation Summary Highlight Box
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(14, 42, 182, 34, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text('BUREAU CREDIT SCORE', 20, 50);
    doc.text('TOTAL MONTHLY EMI OBLIGATION', 75, 50);
    doc.text('TOTAL ACTIVE OUTSTANDING', 140, 50);

    doc.setFontSize(22);
    doc.setTextColor(amber[0], amber[1], amber[2]);
    doc.text(`${reportData.score} / 900`, 20, 64);

    doc.setFontSize(14);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text(formatINR(reportData.summary.totalMonthlyEMI), 75, 63);
    doc.text(formatINR(reportData.summary.totalOutstanding), 140, 63);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(5, 150, 105);
    doc.text(`Active Facilities: ${reportData.summary.activeAccounts} of ${reportData.summary.totalAccounts}`, 75, 69);
    doc.text(`Total Sanctioned: ${formatINR(reportData.summary.totalSanctioned)}`, 140, 69);

    // Obligation Schedule Table (Retail Accounts)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text('Detailed Loan Obligation Schedule (All Active & Closed Accounts):', 14, 86);

    const obligationRows = (reportData.obligations || []).map((acc, i) => [
        i + 1,
        acc.institution,
        acc.accountType,
        acc.accountNumber,
        formatINR(acc.sanctionAmount),
        formatINR(acc.balance),
        formatINR(acc.installmentAmount),
        acc.interestRate !== 'N/A' ? `${acc.interestRate}%` : 'N/A',
        formatINR(acc.pastDueAmount),
        acc.status
    ]);

    doc.autoTable({
        startY: 90,
        head: [['#', 'Lender', 'Type', 'A/C No.', 'Sanction', 'Balance', 'EMI', 'ROI', 'Past Due', 'Status']],
        body: obligationRows,
        theme: 'grid',
        headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
        styles: { fontSize: 7.5, cellPadding: 2.5 },
        alternateRowStyles: { fillColor: [255, 251, 235] },
        columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 28 },
            2: { cellWidth: 24 },
            3: { cellWidth: 22 },
            4: { cellWidth: 20 },
            5: { cellWidth: 20 },
            6: { cellWidth: 18 },
            7: { cellWidth: 12 },
            8: { cellWidth: 16 },
            9: { cellWidth: 14 }
        }
    });

    // Recent Inquiries Summary
    const inquiriesY = doc.lastAutoTable.finalY + 10;
    if (inquiriesY < 240 && reportData.enquiries?.length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Recent Hard Credit Inquiries:', 14, inquiriesY);

        const enquiryRows = reportData.enquiries.slice(0, 5).map(e => [
            e.institution,
            e.date,
            e.amount
        ]);

        doc.autoTable({
            startY: inquiriesY + 4,
            head: [['Lending Institution', 'Inquiry Date', 'Requested Amount']],
            body: enquiryRows,
            theme: 'grid',
            headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255], fontSize: 8 },
            styles: { fontSize: 7.5, cellPadding: 2 }
        });
    }

    // Disclaimer footer
    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128);
    doc.text('This credit report and obligation summary is powered by BeeFund Financial Services in partnership with authorized credit bureaus.', 14, 282);
    doc.text('Soft inquiry pulls conducted via BeeFund have zero negative impact on consumer credit rating under RBI guidelines.', 14, 286);

    const safeName = (reportData.personal?.fullName || 'Customer').replace(/\s+/g, '_');
    doc.save(`BeeFund_Credit_Report_${safeName}.pdf`);
};
