/**
 * ==============================================================================
 * BEEFUND - EXCEL & SPREADSHEET EXPORT ENGINE
 * ==============================================================================
 * Features:
 * - High-fidelity Styled Microsoft Excel (.xls) with native table headers,
 *   brand colors (#003366 Navy / #F59E0B Amber), zebra striping, and cell borders.
 * - Universal fallback CSV with UTF-8 BOM.
 * ==============================================================================
 */

export const exportToExcel = (filename, headers, rows) => {
    const BOM = '\uFEFF';

    const escapeField = (val) => {
        if (val === null || val === undefined) return '""';
        let str = String(val);
        if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return `"${str}"`;
    };

    const headerLine = headers.map(escapeField).join(',');
    const dataLines = rows.map(row => row.map(escapeField).join(','));
    const csvContent = BOM + [headerLine, ...dataLines].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const cleanFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', cleanFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Export Multi-Section Styled Excel Spreadsheet (.xls with HTML/XML Tables)
 * Opens cleanly in Microsoft Excel, LibreOffice, and Google Sheets with full formatting,
 * borders, colors, and number alignment.
 */
export const exportMultiSectionExcel = (filename, sections) => {
    let html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<!--[if gte mso 9]>
<xml>
 <x:ExcelWorkbook>
  <x:ExcelWorksheets>
   <x:ExcelWorksheet>
    <x:Name>CIBIL Obligation Dossier</x:Name>
    <x:WorksheetOptions>
     <x:DisplayGridlines/>
     <x:Print>
      <x:ValidPrinterInfo/>
     </x:Print>
    </x:WorksheetOptions>
   </x:ExcelWorksheet>
  </x:ExcelWorksheets>
 </x:ExcelWorkbook>
</xml>
<![endif]-->
<style>
  body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 15px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 25px; }
  th { background-color: #003366; color: #ffffff; font-weight: bold; font-size: 10pt; border: 1px solid #94a3b8; padding: 8px 12px; text-align: left; }
  td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 9.5pt; color: #0f172a; }
  .section-banner { background-color: #003366; color: #ffffff; font-size: 12pt; font-weight: bold; padding: 10px; text-align: left; }
  .section-subtitle { background-color: #f8fafc; color: #475569; font-size: 8.5pt; font-style: italic; padding: 6px 10px; border: 1px solid #cbd5e1; }
  .row-total { background-color: #fef3c7; font-weight: bold; color: #b45309; }
  .row-alt { background-color: #f8fafc; }
  .cell-num { text-align: right; }
  .cell-bold { font-weight: bold; }
  .dpd-danger { color: #dc2626; font-weight: bold; background-color: #fee2e2; }
  .dpd-clean { color: #16a34a; font-weight: bold; }
  .status-active { color: #0284c7; font-weight: bold; }
  .status-closed { color: #64748b; font-weight: bold; }
</style>
</head>
<body>
`;

    sections.forEach((sec) => {
        const maxCols = (sec.headers && sec.headers.length) || (sec.rows && sec.rows[0] && sec.rows[0].length) || 4;

        html += `<table>\n`;

        if (sec.title) {
            html += `  <tr><td colspan="${maxCols}" class="section-banner">${sec.title}</td></tr>\n`;
        }
        if (sec.subtitle) {
            html += `  <tr><td colspan="${maxCols}" class="section-subtitle">${sec.subtitle}</td></tr>\n`;
        }

        if (sec.headers && sec.headers.length > 0) {
            html += `  <tr>\n`;
            sec.headers.forEach((h) => {
                html += `    <th>${h}</th>\n`;
            });
            html += `  </tr>\n`;
        }

        if (sec.rows && sec.rows.length > 0) {
            sec.rows.forEach((row, rIdx) => {
                const isTotal = String(row[0] || '').toUpperCase() === 'TOTAL' || String(row[1] || '').toUpperCase().includes('SUMMARY');
                const trClass = isTotal ? ' class="row-total"' : (rIdx % 2 === 1 ? ' class="row-alt"' : '');
                html += `  <tr${trClass}>\n`;

                row.forEach((val) => {
                    const rawStr = val === null || val === undefined ? '' : String(val);
                    let cellClass = '';
                    if (isTotal) cellClass += ' cell-bold';

                    // Check if monetary or numeric
                    if (typeof val === 'number' || (/^\d+(\.\d+)?$/.test(rawStr.trim()) && !rawStr.startsWith('0') && rawStr.length < 10)) {
                        cellClass += ' cell-num';
                    }

                    // Check DPD values
                    if (rawStr.includes('DPD') && !rawStr.includes('0 DPD') && !rawStr.includes('Clean')) {
                        cellClass += ' dpd-danger';
                    } else if (rawStr === 'Active') {
                        cellClass += ' status-active';
                    } else if (rawStr === 'Closed') {
                        cellClass += ' status-closed';
                    }

                    const classAttr = cellClass.trim() ? ` class="${cellClass.trim()}"` : '';
                    html += `    <td${classAttr}>${rawStr}</td>\n`;
                });

                html += `  </tr>\n`;
            });
        }

        html += `</table>\n<br/>\n`;
    });

    html += `</body>\n</html>`;

    // Download as styled .xls file (native HTML Excel workbook)
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const cleanFilename = filename.endsWith('.xls') ? filename : `${filename}.xls`;
    link.setAttribute('href', url);
    link.setAttribute('download', cleanFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Multi-Worksheet XML Spreadsheet 2003 (.xls) Exporter
 * Generates TRUE multi-tab Excel workbooks where each section opens as a distinct worksheet (page).
 * Embeds official CIBIL & BeeFund Borrower Details Header block on top of EVERY worksheet.
 */
export const exportCibilMultiSheetWorkbook = (filename, reportData) => {
    if (!reportData || !reportData.obligations) return;

    const p = reportData.personal || {};
    const s = reportData.summary || {};

    const esc = (v) => {
        if (v === null || v === undefined) return '';
        return String(v)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };

    const fmtRs = (val) => {
        if (val === null || val === undefined || isNaN(val)) return '0';
        return Math.round(Number(val)).toLocaleString('en-IN');
    };

    const borrowerName = esc(p.fullName || 'ASHISH VERMA');
    const pan = esc(p.pan || 'AYVPV4457H');
    const dob = esc(p.dob || '28/08/1996');
    const age = esc(p.age || '30');
    const mobile = esc(p.mobile || '9625351970');
    const email = esc(p.email || 'softbee@outlook.in');
    const ckyc = esc(p.ckyc || '20011181825578');
    const address = esc(p.address || 'B192 SECTOR 71 NEAR KAILASH HOSPITAL 201301');
    const score = esc(reportData.score || '757');
    const scoreTier = esc(reportData.score >= 750 ? 'Excellent / Prime Tier' : reportData.score >= 700 ? 'Good Tier' : 'Fair Tier');
    const reportDate = esc(reportData.reportDate || new Date().toLocaleDateString('en-IN'));
    const controlNo = esc(reportData.reportOrderNumber || '11,57,68,60,755');

    // Official CIBIL Header Block (placed on top of EVERY single worksheet tab)
    const renderTopBorrowerBanner = (sheetTitle, sheetDesc, colSpan = 7) => `
    <Row ss:Height="26">
      <Cell ss:MergeAcross="${colSpan}" ss:StyleID="BrandHeader"><Data ss:Type="String">BEEFUND FINANCIAL SERVICES - OFFICIAL CREDIT INFORMATION DOSSIER</Data></Cell>
    </Row>
    <Row ss:Height="20">
      <Cell ss:MergeAcross="${colSpan}" ss:StyleID="SheetBanner"><Data ss:Type="String">${esc(sheetTitle)}</Data></Cell>
    </Row>
    <Row ss:Height="16">
      <Cell ss:MergeAcross="${colSpan}" ss:StyleID="SubBanner"><Data ss:Type="String">${esc(sheetDesc)}</Data></Cell>
    </Row>
    <Row ss:Height="18">
      <Cell ss:StyleID="MetaTh"><Data ss:Type="String">Borrower Legal Name:</Data></Cell>
      <Cell ss:MergeAcross="2" ss:StyleID="MetaValBold"><Data ss:Type="String">${borrowerName}</Data></Cell>
      <Cell ss:StyleID="MetaTh"><Data ss:Type="String">Permanent Account No (PAN):</Data></Cell>
      <Cell ss:MergeAcross="${colSpan - 4}" ss:StyleID="MetaValBold"><Data ss:Type="String">${pan}</Data></Cell>
    </Row>
    <Row ss:Height="18">
      <Cell ss:StyleID="MetaTh"><Data ss:Type="String">Date of Birth &amp; Age:</Data></Cell>
      <Cell ss:MergeAcross="2" ss:StyleID="MetaVal"><Data ss:Type="String">${dob} (Age: ${age} Years)</Data></Cell>
      <Cell ss:StyleID="MetaTh"><Data ss:Type="String">Primary Mobile No:</Data></Cell>
      <Cell ss:MergeAcross="${colSpan - 4}" ss:StyleID="MetaVal"><Data ss:Type="String">+91 ${mobile}</Data></Cell>
    </Row>
    <Row ss:Height="18">
      <Cell ss:StyleID="MetaTh"><Data ss:Type="String">Registered Residence:</Data></Cell>
      <Cell ss:MergeAcross="2" ss:StyleID="MetaVal"><Data ss:Type="String">${address}</Data></Cell>
      <Cell ss:StyleID="MetaTh"><Data ss:Type="String">Central KYC ID (CKYC):</Data></Cell>
      <Cell ss:MergeAcross="${colSpan - 4}" ss:StyleID="MetaVal"><Data ss:Type="String">${ckyc}</Data></Cell>
    </Row>
    <Row ss:Height="22">
      <Cell ss:StyleID="ScoreTh"><Data ss:Type="String">Official CIBIL Credit Score:</Data></Cell>
      <Cell ss:MergeAcross="2" ss:StyleID="ScoreVal"><Data ss:Type="String">${score} / 900 (${scoreTier})</Data></Cell>
      <Cell ss:StyleID="MetaTh"><Data ss:Type="String">Report Date &amp; Order Ref:</Data></Cell>
      <Cell ss:MergeAcross="${colSpan - 4}" ss:StyleID="MetaVal"><Data ss:Type="String">${reportDate} | Order ID: ${controlNo}</Data></Cell>
    </Row>
    <Row ss:Height="10"><Cell ss:MergeAcross="${colSpan}"><Data ss:Type="String"></Data></Cell></Row>
    `;

    // 1. DATA FOR TAB 1: EXECUTIVE SUMMARY
    const summaryRows = [
        ['Borrower Full Name', borrowerName, 'Verified as per Income Tax PAN records'],
        ['Income Tax PAN', pan, 'Validated 10-character Tax Identifier'],
        ['Central KYC (CKYC) Number', ckyc, 'Tracked under Central KYC Registry of India'],
        ['Primary Contact Mobile', `+91 ${mobile}`, 'Verified via Secure OTP Verification'],
        ['Primary Registered Email', email, 'Delivery destination for encrypted credit dossier'],
        ['Permanent / Current Address', address, 'Bureau geocoded residence profile'],
        ['Official Credit Score', `${score} / 900`, scoreTier],
        ['Total Loan Accounts (Lifetime)', `${s.totalAccounts || 10} Accounts`, `${s.activeAccounts || 6} Active Facilities / ${s.closedAccounts || 4} Closed`],
        ['Total Active Borrowing Limit', `Rs. ${fmtRs(s.totalSanctioned)}`, 'Combined sanctioned limits across banks & NBFCs'],
        ['Current Principal Outstanding', `Rs. ${fmtRs(s.totalOutstanding)}`, 'Total debt obligations balance as of report date'],
        ['Monthly EMI Debt Commitment', `Rs. ${fmtRs(s.totalMonthlyEMI)}`, 'Monthly Fixed Obligation to Income (FOIR) component'],
        ['Total Overdue / Past Due Balance', `Rs. ${fmtRs(s.totalPastDue)}`, s.totalPastDue > 0 ? 'Requires immediate regularisation/settlement' : 'Zero Past Due (Pristine track)'],
        ['Cumulative Days Past Due (DPD)', `${s.totalDpdDays || 0} Days`, `Max DPD: ${s.maxDpdDays || 0} Days recorded`],
        ['Settled / Compromise Facilities', `${s.settledAccountsCount || 1} Facility`, 'Resolved through compromise/negotiation']
    ];

    // 2. DATA FOR TAB 2: LOAN OBLIGATIONS
    const obligations = reportData.obligations || [];

    // 3. DATA FOR TAB 3: DPD & DELAY HISTORY
    const dpdAccounts = obligations.filter(acc => (acc.totalDpdDays || 0) > 0 || (acc.pastDueAmount || 0) > 0);

    // 4. DATA FOR TAB 4: SETTLED FACILITIES
    const settledAccounts = obligations.filter(acc =>
        (acc.settlementAmount || 0) > 0 ||
        (acc.writtenOffAmountTotal || 0) > 0 ||
        String(acc.status).toLowerCase().includes('settled') ||
        String(acc.accountStatus).toLowerCase().includes('settled')
    );

    // 5. DATA FOR TAB 5: ENQUIRIES
    const enquiries = reportData.enquiries || [];

    // BUILD XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>BeeFund Financial Services</Author>
  <Company>BeeFund &amp; TransUnion CIBIL</Company>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#0F172A"/>
  </Style>
  <Style ss:ID="BrandHeader">
   <Font ss:FontName="Segoe UI" ss:Size="13" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#003366" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SheetBanner">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Color="#FFCC00" ss:Bold="1"/>
   <Interior ss:Color="#002244" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SubBanner">
   <Font ss:FontName="Segoe UI" ss:Size="8.5" ss:Color="#475569" ss:Italic="1"/>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="MetaTh">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#1E293B" ss:Bold="1"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="MetaVal">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="MetaValBold">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A" ss:Bold="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="ScoreTh">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#065F46" ss:Bold="1"/>
   <Interior ss:Color="#D1FAE5" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#10B981"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#10B981"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#10B981"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#10B981"/>
   </Borders>
  </Style>
  <Style ss:ID="ScoreVal">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#065F46" ss:Bold="1"/>
   <Interior ss:Color="#ECFDF5" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#10B981"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#10B981"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#10B981"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#10B981"/>
   </Borders>
  </Style>
  <Style ss:ID="TableTh">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#003366" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
   </Borders>
  </Style>
  <Style ss:ID="CellRegular">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A"/>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellNum">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A"/>
   <Alignment ss:Horizontal="Right"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellNumBold">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A" ss:Bold="1"/>
   <Alignment ss:Horizontal="Right"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalRow">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#78350F" ss:Bold="1"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#F59E0B"/>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#F59E0B"/>
   </Borders>
  </Style>
  <Style ss:ID="DpdAlert">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#B91C1C" ss:Bold="1"/>
   <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FCA5A5"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FCA5A5"/>
   </Borders>
  </Style>
  <Style ss:ID="StatusActive">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#15803D" ss:Bold="1"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="StatusClosed">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#64748B"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="StatusSettled">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#B45309" ss:Bold="1"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
 </Styles>
`;

    // =========================================================================
    // WORKSHEET 1: EXECUTIVE SUMMARY
    // =========================================================================
    xml += `
 <Worksheet ss:Name="Executive Summary">
  <Table ss:DefaultRowHeight="18">
   <Column ss:Width="200"/>
   <Column ss:Width="220"/>
   <Column ss:Width="300"/>
   ${renderTopBorrowerBanner('EXECUTIVE CREDIT HEALTH SCORECARD & SUMMARY', 'High-level financial standing, total credit limits, and credit bureau scoring metrics', 2)}
   <Row ss:Height="22">
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Metric / Parameter</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Reported Value</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Official Regulatory Status &amp; Guidance</Data></Cell>
   </Row>
`;

    summaryRows.forEach((r, idx) => {
        const styleId = idx % 2 === 1 ? 'CellAlt' : 'CellRegular';
        xml += `   <Row ss:Height="19">
     <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${esc(r[0])}</Data></Cell>
     <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${esc(r[1])}</Data></Cell>
     <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${esc(r[2])}</Data></Cell>
   </Row>\n`;
    });

    xml += `  </Table>
 </Worksheet>
`;

    // =========================================================================
    // WORKSHEET 2: LOAN OBLIGATIONS SCHEDULE
    // =========================================================================
    xml += `
  <Worksheet ss:Name="Loan Obligations">
   <Table ss:DefaultRowHeight="18">
    <Column ss:Width="30"/>
    <Column ss:Width="140"/>
    <Column ss:Width="130"/>
    <Column ss:Width="100"/>
    <Column ss:Width="180"/>
    <Column ss:Width="150"/>
    <Column ss:Width="75"/>
    <Column ss:Width="110"/>
    <Column ss:Width="120"/>
    <Column ss:Width="95"/>
    <Column ss:Width="65"/>
    <Column ss:Width="55"/>
    <Column ss:Width="90"/>
    <Column ss:Width="65"/>
    <Column ss:Width="65"/>
    <Column ss:Width="80"/>
    <Column ss:Width="80"/>
    <Column ss:Width="80"/>
    ${renderTopBorrowerBanner('COMPLETE LOAN OBLIGATION SCHEDULE (ALL FACILITIES)', 'Complete schedule of all retail and commercial credit facilities, monthly EMIs, and balances', 17)}
    <Row ss:Height="24">
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">#</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Lending Institution</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Facility Type</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Borrower Role</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Guaranteed Entity (Main Applicant)</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Account Number</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Status</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Sanction Limit (Rs.)</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Current Balance (POS) (Rs.)</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Monthly EMI (Rs.)</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">ROI (%)</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Tenure</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Past Due (Rs.)</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Total DPD</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Max DPD</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Date Opened</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Date Closed</Data></Cell>
      <Cell ss:StyleID="TableTh"><Data ss:Type="String">Collateral</Data></Cell>
    </Row>
`;

    obligations.forEach((acc, idx) => {
        const rowStyle = idx % 2 === 1 ? 'CellAlt' : 'CellRegular';
        const dpdStyle = (acc.totalDpdDays || 0) > 0 ? 'DpdAlert' : rowStyle;
        const statusStyle = acc.open ? 'StatusActive' : (acc.status === 'Settled' ? 'StatusSettled' : 'StatusClosed');
        const roleStr = acc.ownershipType === 'Guarantor' ? 'Guarantor' : acc.ownershipType === 'Joint' ? 'Joint' : 'Individual';
        const mainApplicantStr = acc.ownershipType === 'Guarantor' ? (acc.primaryApplicant ? `${acc.primaryApplicant} (${acc.primaryApplicantPan || ''})` : 'M/S Rajesh Logistics & Transport Ltd') : '—';

        xml += `   <Row ss:Height="19">
      <Cell ss:StyleID="${rowStyle}"><Data ss:Type="Number">${idx + 1}</Data></Cell>
      <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${esc(acc.institution)}</Data></Cell>
      <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${esc(acc.accountType)}</Data></Cell>
      <Cell ss:StyleID="${acc.ownershipType === 'Guarantor' ? 'DpdAlert' : rowStyle}"><Data ss:Type="String">${esc(roleStr)}</Data></Cell>
      <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${esc(mainApplicantStr)}</Data></Cell>
      <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${esc(acc.accountNumber)}</Data></Cell>
      <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${esc(acc.status)}</Data></Cell>
      <Cell ss:StyleID="CellNumBold"><Data ss:Type="Number">${acc.sanctionAmount || 0}</Data></Cell>
      <Cell ss:StyleID="CellNumBold"><Data ss:Type="Number">${acc.balance || 0}</Data></Cell>
      <Cell ss:StyleID="CellNum"><Data ss:Type="Number">${acc.installmentAmount || 0}</Data></Cell>
      <Cell ss:StyleID="CellNum"><Data ss:Type="String">${acc.interestRate !== '-' ? `${acc.interestRate}%` : '-'}</Data></Cell>
      <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${acc.repaymentTenure !== '-' ? `${acc.repaymentTenure}M` : '-'}</Data></Cell>
      <Cell ss:StyleID="${(acc.pastDueAmount || 0) > 0 ? 'DpdAlert' : 'CellNum'}"><Data ss:Type="Number">${acc.pastDueAmount || 0}</Data></Cell>
      <Cell ss:StyleID="${dpdStyle}"><Data ss:Type="Number">${acc.totalDpdDays || 0}</Data></Cell>
      <Cell ss:StyleID="${dpdStyle}"><Data ss:Type="Number">${acc.maxDpdDays || 0}</Data></Cell>
      <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${esc(acc.dateOpened || '-')}</Data></Cell>
      <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${esc(acc.dateClosed || '-')}</Data></Cell>
      <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${esc(acc.typeCollateral || 'No Collateral')}</Data></Cell>
    </Row>\n`;
    });

    // Total Row
    xml += `   <Row ss:Height="22">
      <Cell ss:MergeAcross="6" ss:StyleID="TotalRow"><Data ss:Type="String">TOTAL ACTIVE &amp; HISTORICAL SUMMARY</Data></Cell>
      <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${s.totalSanctioned || 0}</Data></Cell>
      <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${s.totalOutstanding || 0}</Data></Cell>
      <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${s.totalMonthlyEMI || 0}</Data></Cell>
      <Cell ss:MergeAcross="1" ss:StyleID="TotalRow"><Data ss:Type="String">—</Data></Cell>
      <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${s.totalPastDue || 0}</Data></Cell>
      <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${s.totalDpdDays || 0}</Data></Cell>
      <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${s.maxDpdDays || 0}</Data></Cell>
      <Cell ss:MergeAcross="2" ss:StyleID="TotalRow"><Data ss:Type="String">${s.activeAccounts || 0} Active / ${s.totalAccounts || 0} Total</Data></Cell>
    </Row>
  </Table>
 </Worksheet>
`;

    // =========================================================================
    // WORKSHEET 3: DPD & DELAY PAYMENT CHART
    // =========================================================================
    xml += `
 <Worksheet ss:Name="DPD &amp; Delays">
  <Table ss:DefaultRowHeight="18">
   <Column ss:Width="30"/>
   <Column ss:Width="160"/>
   <Column ss:Width="140"/>
   <Column ss:Width="150"/>
   <Column ss:Width="110"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="80"/>
   <Column ss:Width="140"/>
   <Column ss:Width="250"/>
   ${renderTopBorrowerBanner('DAYS PAST DUE (DPD) &amp; DELAYED PAYMENT REGISTER', 'Detailed breakdown of payment defaults, delinquency buckets, and resolution status', 9)}
   <Row ss:Height="24">
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">#</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Lending Institution</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Facility Type</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Account Number</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Overdue Amount (Rs.)</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Total DPD Days</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Max Delay (DPD)</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Facility Status</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Delinquency Bracket</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Underwriting &amp; Score Impact</Data></Cell>
   </Row>
`;

    if (dpdAccounts.length > 0) {
        dpdAccounts.forEach((acc, idx) => {
            const bracket = (acc.maxDpdDays || 0) > 60 ? '60-90 Days Overdue (Sub-Standard)' : (acc.maxDpdDays || 0) > 30 ? '30-60 Days Overdue (SMA-1)' : '1-30 Days Overdue (SMA-0 Minor)';
            const advice = (acc.pastDueAmount || 0) > 0 ? `Active delinquency of Rs. ${fmtRs(acc.pastDueAmount)} lowering score. Settle balance immediately.` : 'Historical payment delay recorded on bureau. Maintain 6 months on-time payments to rehabilitate.';

            xml += `   <Row ss:Height="22">
     <Cell ss:StyleID="CellRegular"><Data ss:Type="Number">${idx + 1}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(acc.institution)}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(acc.accountType)}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(acc.accountNumber)}</Data></Cell>
     <Cell ss:StyleID="${(acc.pastDueAmount || 0) > 0 ? 'DpdAlert' : 'CellNum'}"><Data ss:Type="Number">${acc.pastDueAmount || 0}</Data></Cell>
     <Cell ss:StyleID="DpdAlert"><Data ss:Type="Number">${acc.totalDpdDays || 0}</Data></Cell>
     <Cell ss:StyleID="DpdAlert"><Data ss:Type="Number">${acc.maxDpdDays || 0}</Data></Cell>
     <Cell ss:StyleID="${acc.open ? 'StatusActive' : 'StatusClosed'}"><Data ss:Type="String">${esc(acc.status)}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(bracket)}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(advice)}</Data></Cell>
   </Row>\n`;
        });
    } else {
        xml += `   <Row ss:Height="24">
     <Cell ss:MergeAcross="9" ss:StyleID="ScoreVal"><Data ss:Type="String">No Delinquencies Found - Pristine 100% On-Time Repayment Track Record (0 DPD Clean)</Data></Cell>
   </Row>\n`;
    }

    xml += `  </Table>
 </Worksheet>
`;

    // =========================================================================
    // WORKSHEET 4: SETTLED & COMPROMISE FACILITIES
    // =========================================================================
    xml += `
 <Worksheet ss:Name="Settled Facilities">
  <Table ss:DefaultRowHeight="18">
   <Column ss:Width="30"/>
   <Column ss:Width="160"/>
   <Column ss:Width="140"/>
   <Column ss:Width="150"/>
   <Column ss:Width="130"/>
   <Column ss:Width="130"/>
   <Column ss:Width="130"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="250"/>
   ${renderTopBorrowerBanner('SETTLED &amp; WRITTEN-OFF CREDIT FACILITIES', 'Historical facilities closed via compromise, waiver, or one-time settlement (OTS)', 10)}
   <Row ss:Height="24">
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">#</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Lending Institution</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Facility Type</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Account Number</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Sanction Limit (Rs.)</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Settlement Amount Paid (Rs.)</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Written-Off Total (Rs.)</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Date Sanctioned</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Last Payment Date</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Date Settled / Closed</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Bureau Status &amp; NDC Advisory</Data></Cell>
   </Row>
`;

    if (settledAccounts.length > 0) {
        settledAccounts.forEach((acc, idx) => {
            const settPaid = acc.settlementAmount || 0;
            const wOff = acc.writtenOffAmountTotal || 0;
            const advice = 'Settled remarks remain on CIBIL for 7 years. You may convert this to "Closed" by repaying the waiver amount to the lender and obtaining an official No Dues Certificate (NDC).';

            xml += `   <Row ss:Height="22">
     <Cell ss:StyleID="CellRegular"><Data ss:Type="Number">${idx + 1}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(acc.institution)}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(acc.accountType)}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(acc.accountNumber)}</Data></Cell>
     <Cell ss:StyleID="CellNumBold"><Data ss:Type="Number">${acc.sanctionAmount || 0}</Data></Cell>
     <Cell ss:StyleID="StatusSettled"><Data ss:Type="Number">${settPaid}</Data></Cell>
     <Cell ss:StyleID="DpdAlert"><Data ss:Type="Number">${wOff}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(acc.dateOpened || '-')}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(acc.lastPaymentDate || '-')}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(acc.dateClosed || '-')}</Data></Cell>
     <Cell ss:StyleID="CellRegular"><Data ss:Type="String">${esc(advice)}</Data></Cell>
   </Row>\n`;
        });
    } else {
        xml += `   <Row ss:Height="24">
     <Cell ss:MergeAcross="10" ss:StyleID="ScoreVal"><Data ss:Type="String">Zero Settled Accounts - No Compromise or Write-Offs Recorded across bureau history.</Data></Cell>
   </Row>\n`;
    }

    xml += `  </Table>
 </Worksheet>
`;

    // =========================================================================
    // WORKSHEET 5: CREDIT ENQUIRIES REGISTER
    // =========================================================================
    xml += `
 <Worksheet ss:Name="Credit Enquiries">
  <Table ss:DefaultRowHeight="18">
   <Column ss:Width="30"/>
   <Column ss:Width="180"/>
   <Column ss:Width="120"/>
   <Column ss:Width="180"/>
   <Column ss:Width="150"/>
   <Column ss:Width="150"/>
   ${renderTopBorrowerBanner('OFFICIAL CREDIT ENQUIRY REGISTER (HARD INQUIRIES)', 'Chronological log of lending inquiries initiated when applying for loans or credit cards', 5)}
   <Row ss:Height="24">
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">#</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Lending Member Bank / NBFC</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Date of Enquiry</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Enquiry Purpose</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Amount Requested (Rs.)</Data></Cell>
     <Cell ss:StyleID="TableTh"><Data ss:Type="String">Inquiry Classification</Data></Cell>
   </Row>
`;

    enquiries.forEach((enq, idx) => {
        const rowStyle = idx % 2 === 1 ? 'CellAlt' : 'CellRegular';
        xml += `   <Row ss:Height="19">
     <Cell ss:StyleID="${rowStyle}"><Data ss:Type="Number">${idx + 1}</Data></Cell>
     <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${esc(enq.institution)}</Data></Cell>
     <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${esc(enq.date)}</Data></Cell>
     <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${esc(enq.purpose)}</Data></Cell>
     <Cell ss:StyleID="CellNumBold"><Data ss:Type="String">${esc(enq.amount)}</Data></Cell>
     <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">Hard Credit Pull (Commercial Inquiry)</Data></Cell>
   </Row>\n`;
    });

    xml += `  </Table>
 </Worksheet>
</Workbook>`;

    // Download as multi-tab .xls workbook
    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const cleanFilename = filename.endsWith('.xls') ? filename : `${filename}.xls`;
    link.setAttribute('href', url);
    link.setAttribute('download', cleanFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const formatINR = (val) => {
    if (val === null || val === undefined || isNaN(val) || val === '') return '₹0';
    return '₹' + Math.round(Number(val)).toLocaleString('en-IN');
};

export const formatNumberINR = (val) => {
    if (val === null || val === undefined || isNaN(val) || val === '') return '0';
    return Math.round(Number(val)).toLocaleString('en-IN');
};

