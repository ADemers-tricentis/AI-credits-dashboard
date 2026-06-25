import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function RoleRedirect() {
  const { role } = useAppContext();
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'lead') return <Navigate to="/lead" replace />;
  return <Navigate to="/ic" replace />;
}
