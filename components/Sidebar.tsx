import React from 'react';
import { Domain } from '../types';
import { DOMAIN_CONFIGS } from '../constants';

interface SidebarProps {
  activeDomain: Domain;
  setDomain: (d: Domain) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeDomain, setDomain }) => {
  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="fas fa-microchip text-blue-500"></i>
          <span>DAMA</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Multi-Agent AI</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {Object.entries(DOMAIN_CONFIGS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setDomain(key as Domain)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeDomain === key 
                ? `bg-${config.color}-500/10 text-${config.color}-400 ring-1 ring-${config.color}-500/30` 
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className={`fas ${config.icon} w-5`}></i>
            <span className="font-medium">{config.title}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900 rounded-lg p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">JD</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">System Admin</p>
            <p className="text-xs text-slate-500 truncate">DAMA Platform v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;