import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHomeRouteByRole } from '../../utils/auth';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="status">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={getHomeRouteByRole(user.role)} replace />;
  return children;
}

export default ProtectedRoute;
