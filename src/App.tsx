import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductPage from './pages/admin/AdminProductPage';
import AdminProjectPage from './pages/admin/AdminProjectPage';
import AdminBudgetPage from './pages/admin/AdminBudgetPage';
import LeadDashboardPage from './pages/lead/LeadDashboardPage';
import LeadProjectPage from './pages/lead/LeadProjectPage';
import ICDashboardPage from './pages/ic/ICDashboardPage';
import RoleRedirect from './components/RoleRedirect';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <RoleRedirect /> },
      { path: 'admin', element: <AdminDashboardPage /> },
      { path: 'admin/products/:productId', element: <AdminProductPage /> },
      { path: 'admin/projects/:projectId', element: <AdminProjectPage /> },
      { path: 'admin/budget', element: <AdminBudgetPage /> },
      { path: 'lead', element: <LeadDashboardPage /> },
      { path: 'lead/project/:projectId', element: <LeadProjectPage /> },
      { path: 'ic', element: <ICDashboardPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
