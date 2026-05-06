import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import EmployeeMaster from '../pages/masters/EmployeeMaster';
import DepartmentMaster from '../pages/masters/DepartmentMaster';
import DesignationMaster from '../pages/masters/DesignationMaster.tsx'
import ShiftMaster from '../pages/masters/ShiftMaster.tsx';
import LineMaster from '../pages/masters/LineMaster.tsx';
import MachineMaster from '../pages/masters/MachineMaster.tsx';
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
        path: 'masters/departments',
        element:<DepartmentMaster />,
      },
      {
        path: 'masters/designations',
        element:<DesignationMaster />,
      },
      {
        path:'masters/shifts',
        element:<ShiftMaster />,
      },
      {
        path:'masters/line',
        element:<LineMaster />,
      },
      {
        path:'masters/machine',
        element:<MachineMaster/>,
      },
      {
        path: 'transactions/logs',
        element: <div>Live Activity Log Coming Soon...</div>,
      }
    ],
  },
]);