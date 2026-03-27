function escapeCell(value) {
  const s = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function rowsToCsv(headers, rows) {
  const lines = [
    headers.map((h) => escapeCell(h)).join(','),
    ...rows.map((row) => row.map((cell) => escapeCell(cell)).join(','))
  ];
  return lines.join('\r\n');
}

export function downloadCsv(filename, csvContent) {
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
