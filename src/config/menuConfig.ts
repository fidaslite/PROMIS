import {LayoutDashboard,Database,FolderSync,Activity,Settings} from "lucide-react";
export const menuSections = [{section: "General",icon: LayoutDashboard,menus: [{name: "Dashboard",path: "/",},],},

  {
    section: "Masters",
    icon: Database,
    menus: [
      {
        name: "Employee Master",
        path: "/masters/employees",
      },
      {
        name: "Department Master",
        path: "/masters/departments",
      },
      {
        name: "Designation Master",
        path: "/masters/designations",
      },
      {
        name: "Shift Master",
        path: "/masters/shifts",
      },
      {
        name: "Line Master",
        path: "/masters/line",
      },
      {
        name: "Machine Master",
        path: "/masters/machine",
      },
      {
        name: "RFID Master",
        path: "/masters/RFID",
      },
      {
        name: "Color Master",
        path: "/masters/ColorMaster",
      },
      {
        name: "Size Master",
        path: "/masters/SizeMaster",
      },
      {
        name: "Product Master",
        path: "/masters/ProductMaster",
      },
      {
        name: "RFID Device Master",
        path: "/masters/RFIDDeviceMaster",
      },
     {
        name: "Company Master",
        path: "/masters/CompanyMaster",
      },
    {
        name: "Customer Master",
        path: "/masters/CustomerMaster",    
      },
    {
        name: "Production Type Master",
        path : "/masters/ProductionTypeMaster",
    },
    ],
  },

  {
    section: "Transactions",
    icon: FolderSync,
    menus: [
      {
        name: "Assign JobWork",
        path: "/transactions/assign-jobwork",
      },
      {
        name: "Activity Logs",
        path: "/transactions/logs",
      },
    ],
  },
  {
    section: "Settings",
    icon: Settings,
    menus: [
      {
        name: "General Settings",
        path: "/settings/general",
      },
      
    ],
  },
];