function DataTable({ columns, rows }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.length ? rows.map((row, idx) => (
            <tr key={row._id || idx}>{columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}</tr>
          )) : <tr><td colSpan={columns.length}>No data found</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
