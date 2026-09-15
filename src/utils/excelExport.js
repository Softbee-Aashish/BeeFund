/**
 * Utility for exporting data to Excel-compatible CSV with UTF-8 BOM
 */

export const exportToExcel = (filename, headers, rows) => {
    // UTF-8 BOM to make Microsoft Excel open UTF-8 CSV with special symbols (like ₹) correctly
    const BOM = '\uFEFF';

    const escapeField = (val) => {
        if (val === null || val === undefined) return '""';
        let str = String(val);
        // Replace double quotes with two double quotes
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

export const formatINR = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '₹0';
    return '₹' + Math.round(val).toLocaleString('en-IN');
};

export const formatNumberINR = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '0';
    return Math.round(val).toLocaleString('en-IN');
};
