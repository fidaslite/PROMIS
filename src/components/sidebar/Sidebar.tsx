import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menuSections } from "../../config/menuConfig";
import { ChevronDown, ChevronRight } from "lucide-react";

const DynamicSection = ({ section, location }: any) => {
  // Logic to keep section open if one of its children is active
  const isActiveSection = section.menus.some((menu: any) => location.pathname === menu.path);
  const [isOpen, setIsOpen] = useState(isActiveSection);

  const Icon = section.icon;

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm transition-all duration-200
        ${
          isActiveSection
            ? "bg-slate-800/50 text-white font-medium"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={isActiveSection ? "text-blue-500" : ""} />
          <span className="tracking-wide">{section.section}</span>
        </div>

        {isOpen ? (
          <ChevronDown size={14} className="opacity-50" />
        ) : (
          <ChevronRight size={14} className="opacity-50" />
        )}
      </button>

      {isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l border-slate-700/50">
          {section.menus.map((menu: any) => (
            <Link
              key={menu.path}
              to={menu.path}
              className={`block py-2 pr-2 pl-5 text-xs transition-all duration-200 relative
              ${
                location.pathname === menu.path
                  ? "text-blue-400 font-semibold"
                  : "text-slate-500 hover:text-slate-200 hover:translate-x-1"
              }`}
            >
              {/* Active Indicator Dot */}
              {location.pathname === menu.path && (
                <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-[2px] h-4 bg-blue-500" />
              )}
              {menu.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    // Fixed height h-screen is CRITICAL for the scroll effect to work
    <aside className="w-64 h-screen bg-[#0f172a] text-slate-300 flex flex-col shadow-2xl shrink-0 border-r border-slate-800">
      
      {/* Logo Section - Fixed */}
      <div className="p-4 py-6 border-b border-slate-800/60 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-lg shadow-blue-900/20">
          PR
        </div>
        <span className="text-lg font-bold tracking-tight text-white uppercase">
          Promis
        </span>
      </div>

      {/* Navigation Area - Scrollable */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        {menuSections.map((section) => {
          const Icon = section.icon;

          if (section.section === "General") {
            return section.menus.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className={`flex items-center gap-3 p-2.5 rounded-lg text-sm mb-1 transition-all duration-200
                ${
                  location.pathname === menu.path
                    ? "bg-blue-600/10 text-blue-400 font-semibold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {menu.name}
              </Link>
            ));
          }

          return (
            <DynamicSection
              key={section.section}
              section={section}
              location={location}
            />
          );
        })}
      </nav>

      {/* Footer - Fixed at bottom */}
      <div className="p-4 border-t border-slate-800/60 shrink-0">
        <div className="bg-slate-900/50 rounded-lg py-2 px-3">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] text-center">
            @ Powered by Fidas-Lite 
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;