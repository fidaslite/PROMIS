import React from 'react';
import { Search } from 'lucide-react'; 

interface HeaderProps {
    headerName : string;
}

const Header: React.FC<HeaderProps> = ({headerName}) => {

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between shrink-0">
          {/* Dynamic Title based on current master clicked */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-Bold text-slate-800">{headerName}</h1>
          </div>

          <div className="flex items-center gap-4 ml-auto"> 
            <div className="relative group w-64 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search by name or code..."
                className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-slate-600"
              />
            </div>
          </div>
        </header>
  )
};

export default Header;