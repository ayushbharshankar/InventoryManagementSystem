export const getHomeRouteByRole = (role) => {
  const normalized = String(role || '').toLowerCase();

  if (normalized === 'admin') return '/dashboard';
  if (normalized === 'manager') return '/inventory';
  return '/transactions';
};

