import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import EmployeeMaster from '../pages/masters/EmployeeMaster';
import DepartmentMaster from '../pages/masters/DepartmentMaster';
import DesignationMaster from '../pages/masters/DesignationMaster.tsx'
import ShiftMaster from '../pages/masters/ShiftMaster.tsx';
import LineMaster from '../pages/masters/LineMaster.tsx';
import MachineMaster from '../pages/masters/MachineMaster.tsx';
import RFIDMaster from '../pages/masters/RFIDMaster.tsx';
import ColorMaster from '../pages/masters/ColorMaster.tsx';
import SizeMaster from '../pages/masters/SizeMaster.tsx';
import ProductMaster from '../pages/masters/ProductMaster.tsx';
import RFIDDeviceMaster from '../pages/masters/RFIDDeviceMaster.tsx';
import CompanyMaster from '../pages/masters/CompanyMaster.tsx';
import CustomerMaster from '../pages/masters/CustomerMaster.tsx';
import ProductionTypeMaster from '../pages/masters/ProductionTypeMaster.tsx';
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
        path:'masters/RFID',
        element:<RFIDMaster/>,
      },
      {
        path:'masters/ColorMaster',
        element:<ColorMaster/>,
      },
      {
        path:'masters/SizeMaster',
        element:<SizeMaster/>,
      },
      {
        path:'masters/ProductMaster',
        element:<ProductMaster/>
      },
      {
        path:'masters/RFIDDeviceMaster',
        element:<RFIDDeviceMaster/>,
      },
      {
        path:'masters/CompanyMaster',
        element:<CompanyMaster/>,
      },
      {
        path:'masters/CustomerMaster',
        element:<CustomerMaster/>,
      },
      {
        path:'masters/ProductionTypeMaster',
        element:<ProductionTypeMaster/>,
      },
      {
        path: 'transactions/logs',
        element: <div>Live Activity Log Coming Soon...</div>,
      }
    ],
  },
]);