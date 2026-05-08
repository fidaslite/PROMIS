import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/header/Header';
import { menuSections } from "../config/menuConfig";

const MainLayout: React.FC = () => {
  const location = useLocation();

  // Function to determine header title based on path
const getHeaderTitle = () => {

  const allMenus = menuSections.flatMap(
    (section) => section.menus
  );

  const currentMenu = allMenus.find(
    (menu) => menu.path === location.pathname
  );

  return currentMenu?.name || "System Overview";
};

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header headerName={getHeaderTitle()} />

        <main className="flex-1 overflow-auto bg-slate-50 p-0"> {/* p-0 for tightest alignment */}

          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;