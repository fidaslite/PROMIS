import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, LayoutDashboard, Database, Activity } from "lucide-react";

const Sidebar: React.FC = () => {
  // Changed initial state to false so it stays collapsed on refresh
  const [isMastersOpen, setIsMastersOpen] = useState(false);
  const location = useLocation();

  return (
    /* Changed width to w-60 (smaller) and reduced padding/gap sizes */
    <aside className="w-60 bg-[#1e293b] text-slate-300 flex flex-col shadow-xl shrink-0">
      
      {/* Logo Section - Slimmer padding */}
      <div className="p-4 py-5 text-lg font-bold text-white border-b border-slate-700 flex items-center gap-3">
        <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-xs shrink-0">
          PR
        </div>
        <span className="tracking-tight">PROMIS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">

        {/* Dashboard */}
        <Link 
          to="/" 
          className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition-all 
          ${location.pathname === "/" ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"}`}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>

        {/* Masters Dropdown */}
        <div>
          <button
            onClick={() => setIsMastersOpen(!isMastersOpen)}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm transition-all
            ${location.pathname.startsWith('/masters') ? "text-white" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <div className="flex items-center gap-3">
              <Database size={16} />
              Masters
            </div>
            {isMastersOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {isMastersOpen && (
            <div className="ml-7 mt-1 space-y-1 border-l border-slate-700">
              <Link 
                to="/masters/employees" 
                className={`block p-2 pl-4 text-xs transition-colors
                ${location.pathname === "/masters/employees" ? "text-blue-400 font-medium" : "hover:text-white"}`}
              >
                Employee Master
              </Link>
              <Link 
                to="/masters/departments" 
                className={`block p-2 pl-4 text-xs transition-colors
                ${location.pathname === "/masters/departments" ? "text-blue-400 font-medium" : "hover:text-white"}`}
              >
                Department Master
              </Link>
              <Link 
                to="/masters/designations" 
                className={`block p-2 pl-4 text-xs transition-colors
                ${location.pathname === "/masters/designations" ? "text-blue-400 font-medium" : "hover:text-white"}`}
              >
                Designation Master
              </Link>
              <Link 
                to="/masters/shifts" 
                className={`block p-2 pl-4 text-xs transition-colors
                ${location.pathname === "/masters/shifts" ? "text-blue-400 font-medium" : "hover:text-white"}`}
              >
                Shift Master
              </Link>
              <Link 
                to="/masters/line" 
                className={`block p-2 pl-4 text-xs transition-colors
                ${location.pathname === "/masters/line" ? "text-blue-400 font-medium" : "hover:text-white"}`}
              >
                Line Master
              </Link>
              <Link 
                to="/masters/machine" 
                className={`block p-2 pl-4 text-xs transition-colors
                ${location.pathname === "/masters/machine" ? "text-blue-400 font-medium" : "hover:text-white"}`}
              >
                Machine Master
              </Link>
            </div>
          )}
        </div>

        {/* Activity Logs */}
        <Link 
          to="/transactions/logs" 
          className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition-all
          ${location.pathname === "/transactions/logs" ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"}`}
        >
          <Activity size={16} />
          Activity Logs
        </Link>

      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 text-[10px] text-slate-500 uppercase tracking-widest text-center">
        v1.0.4 - Admin
      </div>
    </aside>
  );
};

export default Sidebar;