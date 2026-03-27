import { useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../services/api';
import useFetchData from '../hooks/useFetchData';
import StatCard from '../components/common/StatCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DashboardPage() {
  const { token } = useAuth();
  const { data, loading, error, run } = useFetchData(dashboardApi.analytics);
  useEffect(() => { run(token); }, [run, token]);

  const totalProducts = data.totalProducts || 0;
  const lowStockCount = data.lowStockItems?.count || 0;
  const stockSummary = data.stockSummary || {};
  const categoryRows = stockSummary.byCategory || [];
  const recentTransactions = data.recentTransactions || [];

  const categoryChartData = {
    labels: categoryRows.map((row) => row._id || 'Unknown'),
    datasets: [
      {
        label: 'Stock Quantity by Category',
        data: categoryRows.map((row) => row.totalQuantity || 0),
        backgroundColor: '#60a5fa'
      }
    ]
  };

  const trendMap = recentTransactions.reduce((acc, tx) => {
    const key = new Date(tx.date).toLocaleDateString();
    const qty = Number(tx.quantity || 0);
    const signedQty = tx.type === 'OUT' ? -qty : qty;
    acc[key] = (acc[key] || 0) + signedQty;
    return acc;
  }, {});

  const trendLabels = Object.keys(trendMap);
  const trendData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Stock Trend (IN positive, OUT negative)',
        data: trendLabels.map((label) => trendMap[label]),
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        tension: 0.25
      }
    ]
  };

  return (
    <section>
      <h1>Dashboard Analytics</h1>
      {loading ? <p className="status">Loading analytics...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="stats-grid">
        <StatCard title="Total Products" value={totalProducts} />
        <StatCard title="Low Stock Items" value={lowStockCount} />
        <StatCard title="Total Stock Quantity" value={stockSummary.totalStockQuantity || 0} />
        <StatCard title="Stock Value" value={stockSummary.totalStockValue || 0} />
      </div>

      <div className="split-grid">
        <div className="card">
          <h3>Stock Trends</h3>
          <Line data={trendData} />
        </div>
        <div className="card">
          <h3>Stock by Category</h3>
          <Bar data={categoryChartData} />
        </div>
      </div>

      <div className="card">
        <h3>Recent Activity</h3>
        {recentTransactions.length ? (
          <div className="activity-list">
            {recentTransactions.map((tx) => (
              <div className="activity-item" key={tx._id}>
                <strong>{tx.type}</strong> {tx.quantity} units of {tx.product?.name || 'Unknown product'}
                <span>{new Date(tx.date).toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent transactions</p>
        )}
      </div>
    </section>
  );
}

export default DashboardPage;
