
import React from 'react';
import { Domain } from '../types';
import { AGENTS, DOMAIN_CONFIGS } from '../constants';

interface AgentDashboardProps {
  domain: Domain;
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({ domain }) => {
  const activeAgents = AGENTS.filter(a => a.domain === domain);
  const config = DOMAIN_CONFIGS[domain];

  return (
    <div className="p-10 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeAgents.map(agent => (
          <div key={agent.id} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] group hover:border-blue-500/20 hover:bg-slate-800/40 transition-all shadow-xl flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-${config.color}-500/10 border border-${config.color}-500/20 flex items-center justify-center text-${config.color}-400 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${agent.icon} text-xl`}></i>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[8px] font-black uppercase text-emerald-400 border border-emerald-500/20">Operational</span>
            </div>
            <div className="flex-1 space-y-2 mb-2">
              <h3 className="font-black text-white text-lg tracking-tight uppercase">{agent.name}</h3>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{agent.role}</p>
              <p className="text-xs text-slate-400 leading-relaxed pt-2">{agent.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0f172a]/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
          <h2 className="text-sm font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
            <i className="fas fa-shield-check text-emerald-500"></i>
            Compliance guardrails
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 flex-shrink-0 text-xs">
                <i className="fas fa-check"></i>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Neural Self-Critique</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">Dynamic loops auditing for domain-specific hallucinations.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0 text-xs">
                <i className="fas fa-lock"></i>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Data Privacy Isolation</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">Secure state memory prevents cross-session leakage.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a]/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
          <h2 className="text-sm font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
            <i className="fas fa-chart-line text-blue-500"></i>
            Ensemble performance
          </h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 text-center">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">State Sync</div>
                <div className="text-xl font-black text-emerald-400 tracking-tighter">99.9%</div>
             </div>
             <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 text-center">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Latency</div>
                <div className="text-xl font-black text-blue-400 tracking-tighter">24ms</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
