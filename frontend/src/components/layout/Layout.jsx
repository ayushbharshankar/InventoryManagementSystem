import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Layout() {
  const { user, logout } = useAuth();
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/inventory', label: 'Inventory' },
    { to: '/products', label: 'Products' },
    { to: '/transactions', label: 'Transactions' },
    { to: '/parties', label: 'Suppliers & Customers' },
    { to: '/reports', label: 'Reports' }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>IMS</h2>
        <p>{user?.name} ({user?.role})</p>
        <nav>{links.map((link) => <NavLink key={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to={link.to}>{link.label}</NavLink>)}</nav>
        <button type="button" onClick={logout}>Logout</button>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  );
}

export default Layout;
