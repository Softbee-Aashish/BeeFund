/**
 * ==============================================================================
 * BEEFUND - BANK-GRADE LOAN AMORTIZATION & REPAYMENT SCHEDULE PDF ENGINE
 * ==============================================================================
 * Features:
 * - Ultra-crisp PDF output with zero Unicode font glitches (100% Latin-1 safe `Rs.` notation).
 * - Premium Brand Styling:
 *   * Primary: Dark Blue Violet (#1E1B4B / [30, 27, 75])
 *   * Accent & Borders: Yellow-Brown & Warm Amber Gold (#B45309 / #D97706 / [180, 83, 9] & [217, 119, 6])
 *   * Alternating Rows: Warm Amber Tint (#FEFCE8 / [254, 252, 232])
 * - Big BeeFund Branding with official crest, compliance tagline, and verification reference.
 * - Comprehensive Loan Sanction & Facility Terms parameter card.
 * - Dynamic multi-page pagination with continuation headers and `Page X of Y` footers.
 * - Universal compatibility for Term Loans, Sanction Schedules, and OD/CC statements.
 * ==============================================================================
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BEEFUND_LOGO_BASE64, BEEFUND_LOGO_WHITE_BASE64 } from '../assets/logoBase64.js';

/**
 * Universal autoTable runner across ESM, CommonJS, and bundled environments
 */
export const runAutoTable = (doc, options) => {
    if (typeof doc.autoTable === 'function') {
        doc.autoTable(options);
    } else if (typeof autoTable === 'function') {
        autoTable(doc, options);
    } else if (typeof autoTable?.default === 'function') {
        autoTable.default(doc, options);
    } else {
        console.error('jspdf-autotable runner could not be invoked');
    }
};

/**
 * Format currency strictly without Unicode Rupee symbol to prevent jsPDF font corruption
 */
export const formatPdfCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val) || val === '') return 'Rs. 0';
    return 'Rs. ' + Math.round(Number(val)).toLocaleString('en-IN');
};

export const formatPdfNumber = (val) => {
    if (val === null || val === undefined || isNaN(val) || val === '') return '0';
    return Math.round(Number(val)).toLocaleString('en-IN');
};

// Brand Color Constants
const COLOR_DARK_BLUE_VIOLET = [30, 27, 75];   // #1E1B4B
const COLOR_MID_VIOLET = [46, 42, 114];         // #2E2A72
const COLOR_YELLOW_BROWN = [180, 83, 9];        // #B45309
const COLOR_GOLD_AMBER = [217, 119, 6];         // #D97706
const COLOR_GOLD_LIGHT = [251, 191, 36];        // #FBBF24
const COLOR_ROW_ALT = [254, 252, 232];          // #FEFCE8 (Amber 50)
const COLOR_CARD_BG = [248, 250, 252];          // #F8FAFC
const COLOR_BORDER_GRAY = [203, 213, 225];      // #CBD5E1
const COLOR_TEXT_DARK = [15, 23, 42];           // #0F172A
const COLOR_TEXT_MUTED = [71, 85, 105];         // #475569
const COLOR_SUCCESS_GREEN = [22, 101, 52];      // #166534

/**
 * Generate a Bank-Grade Loan Amortization Schedule PDF
 */
export const generateLoanSchedulePDF = ({
    loanTitle = 'OFFICIAL LOAN AMORTIZATION DOSSIER',
    loanName = 'Home / Term Loan',
    principal = 0,
    annualRate = 0,
    rateStructure = 'Reducing Balance',
    tenureMonths = 0,
    effectiveEmi = 0,
    totalInterest = 0,
    totalPayment = 0,
    startDateLabel = '',
    endDateLabel = '',
    moratoriumMonths = 0,
    processingFee = 0,
    scheduleRows = [],
    fileName = 'BeeFund_Loan_Amortization_Schedule.pdf'
}) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2); // 182mm
    const totalPagesExp = '{total_pages_count_string}';

    // Unique Reference Code
    const refId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const currentDateStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    // =========================================================================
    // 1. TOP HERO HEADER BANNER (PAGE 1)
    // =========================================================================
    // Dark Blue Violet Background Bar
    doc.setFillColor(COLOR_DARK_BLUE_VIOLET[0], COLOR_DARK_BLUE_VIOLET[1], COLOR_DARK_BLUE_VIOLET[2]);
    doc.rect(0, 0, pageWidth, 26, 'F');

    // Yellow-Brown / Gold Accent Ribbon
    doc.setFillColor(COLOR_GOLD_AMBER[0], COLOR_GOLD_AMBER[1], COLOR_GOLD_AMBER[2]);
    doc.rect(0, 26, pageWidth, 2.5, 'F');

    // Official BeeFund Brand Logo
    try {
        doc.addImage(BEEFUND_LOGO_WHITE_BASE64, 'PNG', margin, 4.5, 36, 11.7);
    } catch (e) {
        // Fallback badge
        doc.setFillColor(COLOR_YELLOW_BROWN[0], COLOR_YELLOW_BROWN[1], COLOR_YELLOW_BROWN[2]);
        doc.roundedRect(margin, 5.5, 9, 9, 1.8, 1.8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('B', margin + 2.8, 12);
        doc.setFontSize(16);
        doc.text('BEEFUND', margin + 12, 11.5);
    }

    // Tagline / Subtitle
    doc.setTextColor(COLOR_GOLD_LIGHT[0], COLOR_GOLD_LIGHT[1], COLOR_GOLD_LIGHT[2]);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('FINANCIAL SERVICES & LOAN ADVISORY', margin + 39, 11);

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Bank-Grade Capital Structuring  |  Amortization Intelligence', margin + 39, 16);

    // Right Header Information
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(loanTitle.toUpperCase(), pageWidth - margin, 10.5, { align: 'right' });

    doc.setTextColor(COLOR_GOLD_LIGHT[0], COLOR_GOLD_LIGHT[1], COLOR_GOLD_LIGHT[2]);
    doc.setFontSize(7.5);
    doc.text(`Facility: ${loanName}`, pageWidth - margin, 15.5, { align: 'right' });

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ref: BF-LN-${refId}  |  Generated: ${currentDateStr}`, pageWidth - margin, 20.5, { align: 'right' });

    // =========================================================================
    // 2. LOAN SANCTION & REPAYMENT FACILITY PARAMETERS CARD
    // =========================================================================
    const cardY = 32;
    const titleBarHeight = 6;
    const gridHeight = 24;
    const hasMetadata = moratoriumMonths > 0 || processingFee > 0;
    const metaBarHeight = hasMetadata ? 5 : 0;
    const totalCardHeight = titleBarHeight + gridHeight + metaBarHeight;

    // Card Outer Outline
    doc.setDrawColor(COLOR_BORDER_GRAY[0], COLOR_BORDER_GRAY[1], COLOR_BORDER_GRAY[2]);
    doc.setLineWidth(0.3);
    doc.setFillColor(COLOR_CARD_BG[0], COLOR_CARD_BG[1], COLOR_CARD_BG[2]);
    doc.rect(margin, cardY, contentWidth, totalCardHeight, 'FD');

    // Title Strip (Dark Blue Violet)
    doc.setFillColor(COLOR_DARK_BLUE_VIOLET[0], COLOR_DARK_BLUE_VIOLET[1], COLOR_DARK_BLUE_VIOLET[2]);
    doc.rect(margin, cardY, contentWidth, titleBarHeight, 'F');

    // Title Strip Accent Bottom Border
    doc.setFillColor(COLOR_GOLD_AMBER[0], COLOR_GOLD_AMBER[1], COLOR_GOLD_AMBER[2]);
    doc.rect(margin, cardY + titleBarHeight - 0.6, contentWidth, 0.6, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('LOAN SANCTION & REPAYMENT FACILITY TERMS', margin + 4, cardY + 4.2);

    doc.setTextColor(COLOR_GOLD_LIGHT[0], COLOR_GOLD_LIGHT[1], COLOR_GOLD_LIGHT[2]);
    doc.setFontSize(6.5);
    doc.text('STATUS: CONFIRMED BANK-GRADE AMORTIZATION', pageWidth - margin - 4, cardY + 4.2, { align: 'right' });

    // 8-Metric Grid (2 Rows x 4 Columns)
    const colW = contentWidth / 4; // 45.5mm
    const rowH = 12;

    const metrics = [
        // Row 1
        {
            label: 'SANCTIONED PRINCIPAL',
            value: formatPdfCurrency(principal),
            valColor: COLOR_DARK_BLUE_VIOLET,
            isBold: true
        },
        {
            label: 'INTEREST RATE',
            value: `${Number(annualRate).toFixed(2)}% p.a.`,
            subText: `(${rateStructure})`,
            valColor: COLOR_TEXT_DARK,
            isBold: true
        },
        {
            label: 'TOTAL TENURE',
            value: `${tenureMonths} Months`,
            subText: `(${(tenureMonths / 12).toFixed(1)} Years)`,
            valColor: COLOR_TEXT_DARK,
            isBold: true
        },
        {
            label: 'MONTHLY EMI',
            value: formatPdfCurrency(effectiveEmi),
            valColor: COLOR_YELLOW_BROWN,
            isBold: true,
            highlightBg: true
        },
        // Row 2
        {
            label: 'TOTAL INTEREST PAYABLE',
            value: formatPdfCurrency(totalInterest),
            valColor: COLOR_YELLOW_BROWN,
            isBold: true
        },
        {
            label: 'TOTAL AMOUNT PAYABLE',
            value: formatPdfCurrency(totalPayment),
            valColor: COLOR_DARK_BLUE_VIOLET,
            isBold: true
        },
        {
            label: 'FIRST EMI DATE',
            value: startDateLabel || 'Immediate',
            valColor: COLOR_TEXT_DARK,
            isBold: true
        },
        {
            label: 'FINAL MATURITY DATE',
            value: endDateLabel || '-',
            valColor: COLOR_TEXT_DARK,
            isBold: true
        }
    ];

    metrics.forEach((m, idx) => {
        const colIdx = idx % 4;
        const rowIdx = Math.floor(idx / 4);
        const cellX = margin + (colIdx * colW);
        const cellY = cardY + titleBarHeight + (rowIdx * rowH);

        // Highlight EMI cell with subtle warm gold tint
        if (m.highlightBg) {
            doc.setFillColor(254, 243, 199); // warm amber-100
            doc.rect(cellX, cellY, colW, rowH, 'F');
        }

        // Cell dividing lines
        doc.setDrawColor(COLOR_BORDER_GRAY[0], COLOR_BORDER_GRAY[1], COLOR_BORDER_GRAY[2]);
        doc.setLineWidth(0.2);
        if (colIdx > 0) {
            doc.line(cellX, cellY, cellX, cellY + rowH);
        }
        if (rowIdx > 0) {
            doc.line(cellX, cellY, cellX + colW, cellY);
        }

        // Metric Label
        doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
        doc.setFontSize(5.5);
        doc.setFont('helvetica', 'bold');
        doc.text(m.label, cellX + 3, cellY + 3.8);

        // Metric Value
        doc.setTextColor(m.valColor[0], m.valColor[1], m.valColor[2]);
        doc.setFontSize(m.highlightBg ? 9.5 : 8.5);
        doc.setFont('helvetica', 'bold');
        doc.text(m.value, cellX + 3, cellY + 8.2);

        // Subtext if applicable
        if (m.subText) {
            doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
            doc.setFontSize(5.5);
            doc.setFont('helvetica', 'normal');
            doc.text(m.subText, cellX + 3, cellY + 11);
        }
    });

    // Optional Metadata Bar (Moratorium, Processing Fee, etc.)
    if (hasMetadata) {
        const metaY = cardY + titleBarHeight + gridHeight;
        doc.setFillColor(COLOR_ROW_ALT[0], COLOR_ROW_ALT[1], COLOR_ROW_ALT[2]);
        doc.rect(margin, metaY, contentWidth, metaBarHeight, 'F');
        doc.setDrawColor(COLOR_BORDER_GRAY[0], COLOR_BORDER_GRAY[1], COLOR_BORDER_GRAY[2]);
        doc.line(margin, metaY, margin + contentWidth, metaY);

        const metaItems = [];
        if (moratoriumMonths > 0) metaItems.push(`Moratorium: ${moratoriumMonths} Months`);
        if (processingFee > 0) metaItems.push(`Processing Fee: ${formatPdfCurrency(processingFee)}`);
        metaItems.push(`Repayment Mode: ${rateStructure}`);
        metaItems.push('Compounding: Monthly Reducing Balance');

        doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
        doc.setFontSize(5.5);
        doc.setFont('helvetica', 'bold');
        doc.text(metaItems.join('   |   '), margin + 4, metaY + 3.4);
    }

    // =========================================================================
    // 3. FULL AMORTIZATION REPAYMENT SCHEDULE TABLE
    // =========================================================================
    const tableStartY = cardY + totalCardHeight + 4;

    const tableHeaders = [
        ['Mo #', 'Payment Date', 'Opening POS', 'Monthly EMI', 'Principal Paid', 'Interest Paid', 'Closing POS']
    ];

    const tableRows = scheduleRows.map(r => [
        String(r.month),
        r.dateLabel || r.monthLabel || `Month ${r.month}`,
        formatPdfCurrency(r.openingPos ?? (r.balance + r.principal)),
        formatPdfCurrency(r.emi),
        formatPdfCurrency(r.principal),
        formatPdfCurrency(r.interest),
        formatPdfCurrency(r.closingPos ?? r.balance)
    ]);

    const totalEmiSum = effectiveEmi * scheduleRows.length;
    const tableFooters = [
        [
            'TOTALS',
            '',
            '',
            formatPdfCurrency(totalPayment || totalEmiSum),
            formatPdfCurrency(principal),
            formatPdfCurrency(totalInterest),
            'Closing: Rs. 0'
        ]
    ];

    runAutoTable(doc, {
        head: tableHeaders,
        body: tableRows,
        foot: tableFooters,
        startY: tableStartY,
        margin: { top: 18, bottom: 16, left: margin, right: margin },
        styles: {
            font: 'helvetica',
            fontSize: 7,
            cellPadding: 1.8,
            lineColor: COLOR_BORDER_GRAY,
            lineWidth: 0.15,
            textColor: COLOR_TEXT_DARK
        },
        headStyles: {
            fillColor: COLOR_DARK_BLUE_VIOLET,
            textColor: [255, 255, 255],
            fontSize: 7.2,
            fontStyle: 'bold',
            lineColor: COLOR_GOLD_AMBER,
            lineWidth: 0.3,
            halign: 'right'
        },
        alternateRowStyles: {
            fillColor: COLOR_ROW_ALT
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 14, textColor: COLOR_TEXT_MUTED },
            1: { halign: 'left', cellWidth: 26, fontStyle: 'bold' },
            2: { halign: 'right', cellWidth: 28, textColor: COLOR_TEXT_MUTED },
            3: { halign: 'right', cellWidth: 28, fontStyle: 'bold', textColor: COLOR_YELLOW_BROWN },
            4: { halign: 'right', cellWidth: 28, textColor: COLOR_SUCCESS_GREEN },
            5: { halign: 'right', cellWidth: 28, textColor: COLOR_YELLOW_BROWN },
            6: { halign: 'right', cellWidth: 30, fontStyle: 'bold', textColor: COLOR_DARK_BLUE_VIOLET }
        },
        footStyles: {
            fillColor: COLOR_DARK_BLUE_VIOLET,
            textColor: [255, 255, 255],
            fontSize: 7.5,
            fontStyle: 'bold',
            lineColor: COLOR_GOLD_AMBER,
            lineWidth: 0.3,
            halign: 'right'
        },
        didDrawPage: (data) => {
            // Continuation Header on Page 2+
            if (data.pageNumber > 1) {
                doc.setFillColor(COLOR_DARK_BLUE_VIOLET[0], COLOR_DARK_BLUE_VIOLET[1], COLOR_DARK_BLUE_VIOLET[2]);
                doc.rect(0, 0, pageWidth, 11, 'F');

                doc.setFillColor(COLOR_GOLD_AMBER[0], COLOR_GOLD_AMBER[1], COLOR_GOLD_AMBER[2]);
                doc.rect(0, 11, pageWidth, 1.2, 'F');

                try {
                    doc.addImage(BEEFUND_LOGO_WHITE_BASE64, 'PNG', margin, 1.8, 20, 6.5);
                } catch (e) {}

                doc.setTextColor(255, 255, 255);
                doc.setFontSize(7.5);
                doc.setFont('helvetica', 'bold');
                doc.text(`BEEFUND FINANCIAL SERVICES  •  ${loanName} Repayment Schedule (Contd.)`, margin + 23, 7.5);

                doc.setTextColor(COLOR_GOLD_LIGHT[0], COLOR_GOLD_LIGHT[1], COLOR_GOLD_LIGHT[2]);
                doc.setFontSize(6.5);
                doc.text(`Ref: BF-LN-${refId}`, pageWidth - margin, 7.5, { align: 'right' });
            }

            // Standard Footer on Every Page
            const footerY = pageHeight - 9;
            doc.setDrawColor(COLOR_GOLD_AMBER[0], COLOR_GOLD_AMBER[1], COLOR_GOLD_AMBER[2]);
            doc.setLineWidth(0.3);
            doc.line(margin, footerY - 2.5, pageWidth - margin, footerY - 2.5);

            try {
                doc.addImage(BEEFUND_LOGO_BASE64, 'PNG', margin, footerY - 1.8, 12, 3.9);
            } catch (e) {}

            doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
            doc.setFontSize(6);
            doc.setFont('helvetica', 'normal');
            doc.text('BEEFUND FINANCIAL SERVICES  |  Official Loan Repayment Schedule  |  Confidential', margin + 14, footerY + 1);

            doc.setTextColor(COLOR_TEXT_DARK[0], COLOR_TEXT_DARK[1], COLOR_TEXT_DARK[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, pageWidth - margin, footerY + 1, { align: 'right' });
        }
    });

    // Replace total pages placeholder
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    // Save and Trigger Download
    doc.save(fileName);
};

/**
 * Generate an Overdraft (OD) & Credit Card Interest Statement PDF
 */
export const generateODStatementPDF = ({
    accountTitle = 'Overdraft (OD) Account',
    summary = {},
    entries = [],
    fileName = 'BeeFund_OD_Interest_Statement.pdf'
}) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);
    const totalPagesExp = '{total_pages_count_string}';

    const refId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const currentDateStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    // 1. TOP HEADER BANNER
    doc.setFillColor(COLOR_DARK_BLUE_VIOLET[0], COLOR_DARK_BLUE_VIOLET[1], COLOR_DARK_BLUE_VIOLET[2]);
    doc.rect(0, 0, pageWidth, 26, 'F');

    doc.setFillColor(COLOR_GOLD_AMBER[0], COLOR_GOLD_AMBER[1], COLOR_GOLD_AMBER[2]);
    doc.rect(0, 26, pageWidth, 2.5, 'F');

    // Official BeeFund Brand Logo
    try {
        doc.addImage(BEEFUND_LOGO_WHITE_BASE64, 'PNG', margin, 4.5, 36, 11.7);
    } catch (e) {
        doc.setFillColor(COLOR_YELLOW_BROWN[0], COLOR_YELLOW_BROWN[1], COLOR_YELLOW_BROWN[2]);
        doc.roundedRect(margin, 5.5, 9, 9, 1.8, 1.8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('B', margin + 2.8, 12);
        doc.setFontSize(16);
        doc.text('BEEFUND', margin + 12, 11.5);
    }

    doc.setTextColor(COLOR_GOLD_LIGHT[0], COLOR_GOLD_LIGHT[1], COLOR_GOLD_LIGHT[2]);
    doc.setFontSize(7);
    doc.text('FINANCIAL SERVICES & WORKING CAPITAL INTELLIGENCE', margin + 39, 11);

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Overdraft & Cash Credit Daily Balance Audit Dossier', margin + 39, 16);

    // Right Header Information
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('OVERDRAFT (OD) INTEREST STATEMENT', pageWidth - margin, 10.5, { align: 'right' });

    doc.setTextColor(COLOR_GOLD_LIGHT[0], COLOR_GOLD_LIGHT[1], COLOR_GOLD_LIGHT[2]);
    doc.setFontSize(7.5);
    doc.text(`Facility: ${accountTitle}`, pageWidth - margin, 15.5, { align: 'right' });

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ref: BF-OD-${refId}  |  Date: ${currentDateStr}`, pageWidth - margin, 20.5, { align: 'right' });

    // 2. SUMMARY KPI CARD
    const cardY = 32;
    const titleH = 6;
    const gridH = 14;
    const cardH = titleH + gridH;

    doc.setDrawColor(COLOR_BORDER_GRAY[0], COLOR_BORDER_GRAY[1], COLOR_BORDER_GRAY[2]);
    doc.setLineWidth(0.3);
    doc.setFillColor(COLOR_CARD_BG[0], COLOR_CARD_BG[1], COLOR_CARD_BG[2]);
    doc.rect(margin, cardY, contentWidth, cardH, 'FD');

    doc.setFillColor(COLOR_DARK_BLUE_VIOLET[0], COLOR_DARK_BLUE_VIOLET[1], COLOR_DARK_BLUE_VIOLET[2]);
    doc.rect(margin, cardY, contentWidth, titleH, 'F');
    doc.setFillColor(COLOR_GOLD_AMBER[0], COLOR_GOLD_AMBER[1], COLOR_GOLD_AMBER[2]);
    doc.rect(margin, cardY + titleH - 0.6, contentWidth, 0.6, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('OVERDRAFT UTILIZATION & INTEREST SUMMARY', margin + 4, cardY + 4.2);

    doc.setTextColor(COLOR_GOLD_LIGHT[0], COLOR_GOLD_LIGHT[1], COLOR_GOLD_LIGHT[2]);
    doc.setFontSize(6.5);
    doc.text('STATUS: VERIFIED DAILY INTEREST CALCULATION', pageWidth - margin - 4, cardY + 4.2, { align: 'right' });

    const colW = contentWidth / 4;
    const odMetrics = [
        { label: 'TOTAL CALCULATION DAYS', value: `${summary.totalDays || 0} Days`, valColor: COLOR_TEXT_DARK },
        { label: 'AVG DAILY BALANCE', value: formatPdfCurrency(summary.avgDailyBalance), valColor: COLOR_DARK_BLUE_VIOLET },
        { label: 'ANNUAL RATE (BENCHMARK)', value: entries[0]?.rate ? `${entries[0].rate}% p.a.` : 'Variable', valColor: COLOR_TEXT_DARK },
        { label: 'TOTAL ACCRUED INTEREST', value: formatPdfCurrency(summary.totalInterest), valColor: COLOR_YELLOW_BROWN, highlightBg: true }
    ];

    odMetrics.forEach((m, idx) => {
        const cellX = margin + (idx * colW);
        const cellY = cardY + titleH;

        if (m.highlightBg) {
            doc.setFillColor(254, 243, 199);
            doc.rect(cellX, cellY, colW, gridH, 'F');
        }

        if (idx > 0) {
            doc.setDrawColor(COLOR_BORDER_GRAY[0], COLOR_BORDER_GRAY[1], COLOR_BORDER_GRAY[2]);
            doc.setLineWidth(0.2);
            doc.line(cellX, cellY, cellX, cellY + gridH);
        }

        doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
        doc.setFontSize(5.5);
        doc.setFont('helvetica', 'bold');
        doc.text(m.label, cellX + 3, cellY + 4.5);

        doc.setTextColor(m.valColor[0], m.valColor[1], m.valColor[2]);
        doc.setFontSize(m.highlightBg ? 9.5 : 8.5);
        doc.setFont('helvetica', 'bold');
        doc.text(m.value, cellX + 3, cellY + 9.5);
    });

    // 3. TABLE
    const tableStartY = cardY + cardH + 4;
    const tableHeaders = [['#', 'From Date', 'To Date', 'Days', 'Utilized Balance', 'Rate (% p.a.)', 'Daily Interest', 'Total Interest']];
    const tableRows = entries.map((row, idx) => [
        String(idx + 1),
        row.fromDate || '-',
        row.toDate || '-',
        String(row.days),
        formatPdfCurrency(row.balance),
        `${row.rate}%`,
        formatPdfCurrency(row.dailyInterest),
        formatPdfCurrency(row.periodInterest)
    ]);

    const tableFooters = [[
        'TOTAL',
        '',
        '',
        `${summary.totalDays || 0} Days`,
        `Avg: ${formatPdfCurrency(summary.avgDailyBalance)}`,
        '',
        '',
        formatPdfCurrency(summary.totalInterest)
    ]];

    runAutoTable(doc, {
        head: tableHeaders,
        body: tableRows,
        foot: tableFooters,
        startY: tableStartY,
        margin: { top: 18, bottom: 16, left: margin, right: margin },
        styles: {
            font: 'helvetica',
            fontSize: 7,
            cellPadding: 2,
            lineColor: COLOR_BORDER_GRAY,
            lineWidth: 0.15,
            textColor: COLOR_TEXT_DARK
        },
        headStyles: {
            fillColor: COLOR_DARK_BLUE_VIOLET,
            textColor: [255, 255, 255],
            fontSize: 7.2,
            fontStyle: 'bold',
            lineColor: COLOR_GOLD_AMBER,
            lineWidth: 0.3,
            halign: 'right'
        },
        alternateRowStyles: {
            fillColor: COLOR_ROW_ALT
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10, textColor: COLOR_TEXT_MUTED },
            1: { halign: 'left', cellWidth: 26 },
            2: { halign: 'left', cellWidth: 26 },
            3: { halign: 'center', cellWidth: 16 },
            4: { halign: 'right', cellWidth: 32, fontStyle: 'bold', textColor: COLOR_DARK_BLUE_VIOLET },
            5: { halign: 'center', cellWidth: 22 },
            6: { halign: 'right', cellWidth: 24, textColor: COLOR_TEXT_MUTED },
            7: { halign: 'right', cellWidth: 26, fontStyle: 'bold', textColor: COLOR_YELLOW_BROWN }
        },
        footStyles: {
            fillColor: COLOR_DARK_BLUE_VIOLET,
            textColor: [255, 255, 255],
            fontSize: 7.5,
            fontStyle: 'bold',
            lineColor: COLOR_GOLD_AMBER,
            lineWidth: 0.3,
            halign: 'right'
        },
        didDrawPage: (data) => {
            if (data.pageNumber > 1) {
                doc.setFillColor(COLOR_DARK_BLUE_VIOLET[0], COLOR_DARK_BLUE_VIOLET[1], COLOR_DARK_BLUE_VIOLET[2]);
                doc.rect(0, 0, pageWidth, 11, 'F');
                doc.setFillColor(COLOR_GOLD_AMBER[0], COLOR_GOLD_AMBER[1], COLOR_GOLD_AMBER[2]);
                doc.rect(0, 11, pageWidth, 1.2, 'F');

                try {
                    doc.addImage(BEEFUND_LOGO_WHITE_BASE64, 'PNG', margin, 1.8, 20, 6.5);
                } catch (e) {}

                doc.setTextColor(255, 255, 255);
                doc.setFontSize(7.5);
                doc.setFont('helvetica', 'bold');
                doc.text(`BEEFUND FINANCIAL SERVICES  •  ${accountTitle} Statement (Contd.)`, margin + 23, 7.5);
            }

            const footerY = pageHeight - 9;
            doc.setDrawColor(COLOR_GOLD_AMBER[0], COLOR_GOLD_AMBER[1], COLOR_GOLD_AMBER[2]);
            doc.setLineWidth(0.3);
            doc.line(margin, footerY - 2.5, pageWidth - margin, footerY - 2.5);

            try {
                doc.addImage(BEEFUND_LOGO_BASE64, 'PNG', margin, footerY - 1.8, 12, 3.9);
            } catch (e) {}

            doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
            doc.setFontSize(6);
            doc.text('BEEFUND FINANCIAL SERVICES  |  Official Overdraft Interest Statement  |  Confidential', margin + 14, footerY + 1);

            doc.setTextColor(COLOR_TEXT_DARK[0], COLOR_TEXT_DARK[1], COLOR_TEXT_DARK[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, pageWidth - margin, footerY + 1, { align: 'right' });
        }
    });

    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    doc.save(fileName);
};
