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

export const formatINR = (val) => {
    if (val === null || val === undefined || isNaN(val) || val === '') return '₹0';
    return '₹' + Math.round(Number(val)).toLocaleString('en-IN');
};

export const formatNumberINR = (val) => {
    if (val === null || val === undefined || isNaN(val) || val === '') return '0';
    return Math.round(Number(val)).toLocaleString('en-IN');
};
