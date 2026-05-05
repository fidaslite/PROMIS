import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import EmployeeMaster from '../pages/masters/EmployeeMaster';
// Import pages here as we build them

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <div>Dashboard Content Coming Soon...</div>,
      },
      {
        path: 'masters/employees',
        element:<EmployeeMaster />,
      },
      {
        path: 'transactions/logs',
        element: <div>Live Activity Log Coming Soon...</div>,
      }
    ],
  },
]);