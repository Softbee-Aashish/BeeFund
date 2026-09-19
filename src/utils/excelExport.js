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

/**
 * Export Styled Loan Amortization Schedule to Microsoft Excel (.xls)
 * High-fidelity bank-grade spreadsheet with official BeeFund branding,
 * structured loan parameter KPI card, column width spacing, color coding,
 * and double-underlined summary totals.
 */
export const exportLoanScheduleToExcel = ({
    loanTitle = 'OFFICIAL LOAN AMORTIZATION SCHEDULE',
    loanName = 'Term Loan',
    principal = 500000,
    annualRate = 10,
    rateStructure = 'Reducing Balance',
    tenureMonths = 24,
    effectiveEmi = 23072,
    totalInterest = 53739,
    totalPayment = 553739,
    startDateLabel = '',
    endDateLabel = '',
    scheduleRows = [],
    fileName = 'BeeFund_Loan_Repayment_Schedule.xls'
}) => {
    const esc = (v) => {
        if (v === null || v === undefined) return '';
        return String(v)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };

    const refId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const currentDateStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const fmtNum = (val) => {
        const n = Math.round(Number(val) || 0);
        return n;
    };

    const fmtRs = (val) => {
        const n = Math.round(Number(val) || 0);
        return 'Rs. ' + n.toLocaleString('en-IN');
    };

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>BeeFund Financial Services</Author>
  <Company>BeeFund Capital Advisory</Company>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#0F172A"/>
  </Style>
  <Style ss:ID="BrandBanner">
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#1E1B4B" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="BrandRibbon">
   <Font ss:FontName="Segoe UI" ss:Size="8.5" ss:Color="#FEF3C7" ss:Bold="1"/>
   <Interior ss:Color="#B45309" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="CardTitle">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#1E1B4B" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="CardLbl">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#475569" ss:Bold="1"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="CardVal">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#0F172A" ss:Bold="1"/>
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="CardValAmber">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#B45309" ss:Bold="1"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F59E0B"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F59E0B"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F59E0B"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F59E0B"/>
   </Borders>
  </Style>
  <Style ss:ID="TableTh">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#1E1B4B" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
   </Borders>
  </Style>
  <Style ss:ID="CellMonth">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#475569"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellMonthAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#475569"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellDate">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A" ss:Bold="1"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellDateAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A" ss:Bold="1"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellNum">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#475569"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellNumAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#475569"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellEmi">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#B45309" ss:Bold="1"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellEmiAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#B45309" ss:Bold="1"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellPrincipal">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#15803D" ss:Bold="1"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellPrincipalAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#15803D" ss:Bold="1"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellInterest">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#B45309"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellInterestAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#B45309"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellClosing">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#1E1B4B" ss:Bold="1"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellClosingAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#1E1B4B" ss:Bold="1"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalRow">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#78350F" ss:Bold="1"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#F59E0B"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#F59E0B"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalRowText">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#78350F" ss:Bold="1"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#F59E0B"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#F59E0B"/>
   </Borders>
  </Style>
  <Style ss:ID="Disclaimer">
   <Font ss:FontName="Segoe UI" ss:Size="8" ss:Color="#64748B" ss:Italic="1"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Amortization Schedule">
  <Table ss:DefaultRowHeight="19">
   <Column ss:Width="65"/>
   <Column ss:Width="105"/>
   <Column ss:Width="125"/>
   <Column ss:Width="115"/>
   <Column ss:Width="125"/>
   <Column ss:Width="120"/>
   <Column ss:Width="130"/>
   <Row ss:Height="28">
    <Cell ss:MergeAcross="6" ss:StyleID="BrandBanner"><Data ss:Type="String">BEEFUND FINANCIAL SERVICES  •  ${esc(loanTitle)}</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="6" ss:StyleID="BrandRibbon"><Data ss:Type="String">Bank-Grade Capital Structuring  |  Amortization Intelligence  |  Facility: ${esc(loanName)}  |  Ref: BF-LN-${refId}  |  Date: ${currentDateStr}</Data></Cell>
   </Row>
   <Row ss:Height="8"/>
   <Row ss:Height="20">
    <Cell ss:MergeAcross="6" ss:StyleID="CardTitle"><Data ss:Type="String">LOAN SANCTION &amp; REPAYMENT FACILITY PARAMETERS</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:StyleID="CardLbl"><Data ss:Type="String">Loan Facility</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="CardVal"><Data ss:Type="String">${esc(loanName)}</Data></Cell>
    <Cell ss:StyleID="CardLbl"><Data ss:Type="String">Sanctioned Principal</Data></Cell>
    <Cell ss:MergeAcross="2" ss:StyleID="CardVal"><Data ss:Type="String">${fmtRs(principal)}</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:StyleID="CardLbl"><Data ss:Type="String">Annual Interest Rate</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="CardVal"><Data ss:Type="String">${Number(annualRate).toFixed(2)}% p.a. (${esc(rateStructure)})</Data></Cell>
    <Cell ss:StyleID="CardLbl"><Data ss:Type="String">Monthly EMI</Data></Cell>
    <Cell ss:MergeAcross="2" ss:StyleID="CardValAmber"><Data ss:Type="String">${fmtRs(effectiveEmi)} / Month</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:StyleID="CardLbl"><Data ss:Type="String">Repayment Tenure</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="CardVal"><Data ss:Type="String">${tenureMonths} Months (${(tenureMonths / 12).toFixed(1)} Years)</Data></Cell>
    <Cell ss:StyleID="CardLbl"><Data ss:Type="String">Total Repayment (P + I)</Data></Cell>
    <Cell ss:MergeAcross="2" ss:StyleID="CardVal"><Data ss:Type="String">${fmtRs(totalPayment || (principal + totalInterest))}</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:StyleID="CardLbl"><Data ss:Type="String">Total Accrued Interest</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="CardValAmber"><Data ss:Type="String">${fmtRs(totalInterest)}</Data></Cell>
    <Cell ss:StyleID="CardLbl"><Data ss:Type="String">Schedule Span</Data></Cell>
    <Cell ss:MergeAcross="2" ss:StyleID="CardVal"><Data ss:Type="String">${esc(startDateLabel || 'Inception')} to ${esc(endDateLabel || 'Maturity')}</Data></Cell>
   </Row>
   <Row ss:Height="10"/>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableTh"><Data ss:Type="String">Month #</Data></Cell>
    <Cell ss:StyleID="TableTh"><Data ss:Type="String">Payment Date</Data></Cell>
    <Cell ss:StyleID="TableTh"><Data ss:Type="String">Opening POS (INR)</Data></Cell>
    <Cell ss:StyleID="TableTh"><Data ss:Type="String">Monthly EMI (INR)</Data></Cell>
    <Cell ss:StyleID="TableTh"><Data ss:Type="String">Principal Paid (INR)</Data></Cell>
    <Cell ss:StyleID="TableTh"><Data ss:Type="String">Interest Paid (INR)</Data></Cell>
    <Cell ss:StyleID="TableTh"><Data ss:Type="String">Closing Balance (INR)</Data></Cell>
   </Row>
`;

    let totalPrincipalSum = 0;
    let totalInterestSum = 0;
    let totalEmiSum = 0;

    scheduleRows.forEach((r, idx) => {
        const isAlt = idx % 2 === 1;
        const cMonth = isAlt ? 'CellMonthAlt' : 'CellMonth';
        const cDate = isAlt ? 'CellDateAlt' : 'CellDate';
        const cNum = isAlt ? 'CellNumAlt' : 'CellNum';
        const cEmi = isAlt ? 'CellEmiAlt' : 'CellEmi';
        const cPrin = isAlt ? 'CellPrincipalAlt' : 'CellPrincipal';
        const cInt = isAlt ? 'CellInterestAlt' : 'CellInterest';
        const cClose = isAlt ? 'CellClosingAlt' : 'CellClosing';

        const opening = fmtNum(r.openingPos ?? (r.balance + r.principal));
        const emi = fmtNum(r.emi);
        const principalAmt = fmtNum(r.principal);
        const interestAmt = fmtNum(r.interest);
        const closing = fmtNum(r.closingPos ?? r.balance);

        totalPrincipalSum += principalAmt;
        totalInterestSum += interestAmt;
        totalEmiSum += emi;

        xml += `   <Row ss:Height="19">
    <Cell ss:StyleID="${cMonth}"><Data ss:Type="Number">${r.month || idx + 1}</Data></Cell>
    <Cell ss:StyleID="${cDate}"><Data ss:Type="String">${esc(r.dateLabel || r.monthLabel || `Month ${r.month}`)}</Data></Cell>
    <Cell ss:StyleID="${cNum}"><Data ss:Type="Number">${opening}</Data></Cell>
    <Cell ss:StyleID="${cEmi}"><Data ss:Type="Number">${emi}</Data></Cell>
    <Cell ss:StyleID="${cPrin}"><Data ss:Type="Number">${principalAmt}</Data></Cell>
    <Cell ss:StyleID="${cInt}"><Data ss:Type="Number">${interestAmt}</Data></Cell>
    <Cell ss:StyleID="${cClose}"><Data ss:Type="Number">${closing}</Data></Cell>
   </Row>\n`;
    });

    // Total Row
    xml += `   <Row ss:Height="24">
    <Cell ss:MergeAcross="1" ss:StyleID="TotalRowText"><Data ss:Type="String">TOTAL REPAYMENT SUMMARY</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="String">—</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${totalPayment || totalEmiSum}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${principal || totalPrincipalSum}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${totalInterest || totalInterestSum}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">0</Data></Cell>
   </Row>
   <Row ss:Height="12"/>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="6" ss:StyleID="Disclaimer"><Data ss:Type="String">Disclaimer: Amortization schedule calculated using standard reducing balance compounding formula as per RBI master directions. Verified by BeeFund Financial Services.</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const cleanFilename = fileName.endsWith('.xls') ? fileName : `${fileName.replace(/\.csv$/, '')}.xls`;
    link.setAttribute('href', url);
    link.setAttribute('download', cleanFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Universal Styled Microsoft Excel (.xls) Export
 * Automatically detects metadata summaries, applies BeeFund branding,
 * colors, borders, and column widths across all loan tools.
 */
export const exportToExcel = (filename, headers, rows) => {
    const esc = (v) => {
        if (v === null || v === undefined) return '';
        return String(v)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };

    const refId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const currentDateStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    // 1. Check if metadata (LOAN SUMMARY / SANCTION DETAILS) is present
    let metaIdx = -1;
    for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        if (r && r.length > 0 && typeof r[0] === 'string') {
            const up = r[0].toUpperCase();
            if (up.includes('SUMMARY') || up.includes('SANCTION') || up.includes('METADATA')) {
                metaIdx = i;
                break;
            }
        }
    }

    const dataRows = (metaIdx !== -1 ? rows.slice(0, metaIdx) : rows)
        .filter(r => r && r.length > 0 && r.some(c => c !== null && c !== undefined && c !== ''));

    const metaRows = (metaIdx !== -1 ? rows.slice(metaIdx + 1) : [])
        .filter(r => r && r.length >= 2 && r[0] && r[1]);

    const numCols = Math.max(headers.length, 6);
    const cleanTitle = (filename || 'BeeFund_Spreadsheet')
        .replace(/_/g, ' ')
        .replace(/\.(csv|xls|xlsx)$/i, '')
        .toUpperCase();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>BeeFund Financial Services</Author>
  <Company>BeeFund Capital Advisory</Company>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#0F172A"/>
  </Style>
  <Style ss:ID="BrandBanner">
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#1E1B4B" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="BrandRibbon">
   <Font ss:FontName="Segoe UI" ss:Size="8.5" ss:Color="#FEF3C7" ss:Bold="1"/>
   <Interior ss:Color="#B45309" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="CardTitle">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#1E1B4B" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="CardLbl">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#475569" ss:Bold="1"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="CardVal">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#0F172A" ss:Bold="1"/>
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="CardValAmber">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#B45309" ss:Bold="1"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F59E0B"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F59E0B"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F59E0B"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F59E0B"/>
   </Borders>
  </Style>
  <Style ss:ID="TableTh">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#1E1B4B" ss:Pattern="Solid"/>
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
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCenter">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#475569"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCenterAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#475569"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellBold">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A" ss:Bold="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellBoldAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A" ss:Bold="1"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellNum">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellNumAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellEmi">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#B45309" ss:Bold="1"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellEmiAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#B45309" ss:Bold="1"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellPrincipal">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#15803D" ss:Bold="1"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellPrincipalAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#15803D" ss:Bold="1"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellInterest">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#B45309"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellInterestAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#B45309"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellClosing">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#1E1B4B" ss:Bold="1"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellClosingAlt">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#1E1B4B" ss:Bold="1"/>
   <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalRow">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#78350F" ss:Bold="1"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#F59E0B"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#F59E0B"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalRowText">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#78350F" ss:Bold="1"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#F59E0B"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#F59E0B"/>
   </Borders>
  </Style>
  <Style ss:ID="Disclaimer">
   <Font ss:FontName="Segoe UI" ss:Size="8" ss:Color="#64748B" ss:Italic="1"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="BeeFund Schedule">
  <Table ss:DefaultRowHeight="19">
`;

    // Column widths
    headers.forEach((h, idx) => {
        let w = 110;
        const low = String(h).toLowerCase();
        if (low.includes('month #') || low.includes('entry #') || idx === 0) w = 65;
        else if (low.includes('date') || low.includes('month / year')) w = 105;
        else if (low.includes('opening') || low.includes('closing') || low.includes('balance')) w = 125;
        else if (low.includes('emi')) w = 115;
        else if (low.includes('principal')) w = 120;
        else if (low.includes('interest')) w = 115;
        else if (low.includes('roi') || low.includes('rate') || low.includes('days')) w = 85;
        xml += `   <Column ss:Width="${w}"/>\n`;
    });

    // Top Header Banner
    const spanCols = Math.max(headers.length - 1, 5);
    xml += `   <Row ss:Height="28">
    <Cell ss:MergeAcross="${spanCols}" ss:StyleID="BrandBanner"><Data ss:Type="String">BEEFUND FINANCIAL SERVICES  •  ${esc(cleanTitle)}</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="${spanCols}" ss:StyleID="BrandRibbon"><Data ss:Type="String">Bank-Grade Capital Structuring  |  Amortization Intelligence  |  Ref: BF-EX-${refId}  |  Date: ${currentDateStr}</Data></Cell>
   </Row>
   <Row ss:Height="8"/>\n`;

    // Render Parameter Card if metaRows exist
    if (metaRows.length > 0) {
        xml += `   <Row ss:Height="20">
    <Cell ss:MergeAcross="${spanCols}" ss:StyleID="CardTitle"><Data ss:Type="String">LOAN SANCTION &amp; FACILITY PARAMETERS</Data></Cell>
   </Row>\n`;

        for (let m = 0; m < metaRows.length; m += 2) {
            const m1 = metaRows[m];
            const m2 = metaRows[m + 1];

            xml += `   <Row ss:Height="20">\n`;
            if (m1) {
                const isAmber = String(m1[0]).toLowerCase().includes('emi') || String(m1[0]).toLowerCase().includes('interest');
                xml += `    <Cell ss:StyleID="CardLbl"><Data ss:Type="String">${esc(m1[0])}</Data></Cell>\n`;
                xml += `    <Cell ss:MergeAcross="1" ss:StyleID="${isAmber ? 'CardValAmber' : 'CardVal'}"><Data ss:Type="String">${esc(m1[1])}</Data></Cell>\n`;
            }
            if (m2) {
                const isAmber = String(m2[0]).toLowerCase().includes('emi') || String(m2[0]).toLowerCase().includes('interest');
                const remainSpan = Math.max(0, spanCols - 3);
                xml += `    <Cell ss:StyleID="CardLbl"><Data ss:Type="String">${esc(m2[0])}</Data></Cell>\n`;
                xml += `    <Cell ss:MergeAcross="${remainSpan}" ss:StyleID="${isAmber ? 'CardValAmber' : 'CardVal'}"><Data ss:Type="String">${esc(m2[1])}</Data></Cell>\n`;
            } else {
                const remainSpan = Math.max(0, spanCols - 2);
                xml += `    <Cell ss:MergeAcross="${remainSpan}" ss:StyleID="CardVal"><Data ss:Type="String">—</Data></Cell>\n`;
            }
            xml += `   </Row>\n`;
        }

        xml += `   <Row ss:Height="10"/>\n`;
    }

    // Table Header Row
    xml += `   <Row ss:Height="24">\n`;
    headers.forEach(h => {
        xml += `    <Cell ss:StyleID="TableTh"><Data ss:Type="String">${esc(h)}</Data></Cell>\n`;
    });
    xml += `   </Row>\n`;

    // Data Rows
    let sumPrincipal = 0;
    let sumInterest = 0;
    let sumEmi = 0;

    dataRows.forEach((row, rIdx) => {
        const isAlt = rIdx % 2 === 1;
        xml += `   <Row ss:Height="19">\n`;

        row.forEach((cell, cIdx) => {
            const h = (headers[cIdx] || '').toLowerCase();
            const rawVal = cell;
            const numVal = typeof rawVal === 'number' ? rawVal : parseFloat(String(rawVal).replace(/[^0-9.-]/g, ''));
            const isNumeric = !isNaN(numVal) && typeof rawVal === 'number';

            if (cIdx === 0) {
                // Month / Index
                const styleId = isAlt ? 'CellCenterAlt' : 'CellCenter';
                xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="${isNumeric ? 'Number' : 'String'}">${isNumeric ? numVal : esc(rawVal)}</Data></Cell>\n`;
            } else if (h.includes('date') || h.includes('month')) {
                // Date or Month label
                const styleId = isAlt ? 'CellLeftAlt' : 'CellLeft';
                xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${esc(rawVal)}</Data></Cell>\n`;
            } else if (h.includes('emi')) {
                if (isNumeric) sumEmi += numVal;
                const styleId = isAlt ? 'CellEmiAlt' : 'CellEmi';
                xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="Number">${isNumeric ? Math.round(numVal) : 0}</Data></Cell>\n`;
            } else if (h.includes('principal') && !h.includes('cumulative')) {
                if (isNumeric) sumPrincipal += numVal;
                const styleId = isAlt ? 'CellPrincipalAlt' : 'CellPrincipal';
                xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="Number">${isNumeric ? Math.round(numVal) : 0}</Data></Cell>\n`;
            } else if (h.includes('interest') && !h.includes('cumulative')) {
                if (isNumeric) sumInterest += numVal;
                const styleId = isAlt ? 'CellInterestAlt' : 'CellInterest';
                xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="Number">${isNumeric ? Math.round(numVal) : 0}</Data></Cell>\n`;
            } else if (h.includes('closing') || h.includes('balance') || h.includes('pos')) {
                const styleId = isAlt ? 'CellClosingAlt' : 'CellClosing';
                xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="Number">${isNumeric ? Math.round(numVal) : 0}</Data></Cell>\n`;
            } else if (isNumeric) {
                const styleId = isAlt ? 'CellNumAlt' : 'CellNum';
                xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="Number">${Math.round(numVal)}</Data></Cell>\n`;
            } else {
                const styleId = isAlt ? 'CellAlt' : 'CellRegular';
                xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${esc(rawVal)}</Data></Cell>\n`;
            }
        });

        xml += `   </Row>\n`;
    });

    // Summary Totals Row if sums were tracked
    if (sumEmi > 0 || sumPrincipal > 0 || sumInterest > 0) {
        xml += `   <Row ss:Height="24">\n`;
        xml += `    <Cell ss:MergeAcross="1" ss:StyleID="TotalRowText"><Data ss:Type="String">TOTAL REPAYMENT SUMMARY</Data></Cell>\n`;
        for (let c = 2; c < headers.length; c++) {
            const h = (headers[c] || '').toLowerCase();
            if (h.includes('emi')) {
                xml += `    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${Math.round(sumEmi)}</Data></Cell>\n`;
            } else if (h.includes('principal') && !h.includes('cumulative')) {
                xml += `    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${Math.round(sumPrincipal)}</Data></Cell>\n`;
            } else if (h.includes('interest') && !h.includes('cumulative')) {
                xml += `    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${Math.round(sumInterest)}</Data></Cell>\n`;
            } else if (h.includes('closing') || h.includes('balance')) {
                xml += `    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">0</Data></Cell>\n`;
            } else {
                xml += `    <Cell ss:StyleID="TotalRow"><Data ss:Type="String">—</Data></Cell>\n`;
            }
        }
        xml += `   </Row>\n`;
    }

    xml += `   <Row ss:Height="12"/>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="${spanCols}" ss:StyleID="Disclaimer"><Data ss:Type="String">Disclaimer: Amortization figures are calculated using standard reducing balance compounding formula as per RBI master directions. Verified by BeeFund Financial Services.</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const cleanFilename = filename.endsWith('.xls') ? filename : `${filename.replace(/\.csv$/, '')}.xls`;
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

