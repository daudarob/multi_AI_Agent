
import React, { useState, useRef, useEffect } from 'react';
import { Domain, Message, AgentStep, WorkflowStatus } from './types';
import { DOMAIN_CONFIGS, AGENTS } from './constants';
import Sidebar from './components/Sidebar';
import AgentDashboard from './components/AgentDashboard';
import { runFastComprehensiveAnalysis } from './services/gemini';

const App: React.FC = () => {
  const [domain, setDomain] = useState<Domain>(Domain.HEALTHCARE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('idle');
  const [workflowSteps, setWorkflowSteps] = useState<AgentStep[]>([]);
  const [approvalPending, setApprovalPending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, isProcessing]);

  const startWorkflow = async (userInput: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setWorkflowStatus('planning');
    setWorkflowSteps([]);
    setApprovalPending(false);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userInput };
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, userMsg, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const orchestrator = runFastComprehensiveAnalysis(domain, userInput, (step: AgentStep) => {
        setWorkflowSteps(prev => {
          const index = prev.findIndex(s => s.agentId === step.agentId);
          if (index > -1) {
            const next = [...prev];
            next[index] = step;
            return next;
          }
          return [...prev, step];
        });
      });

      let fullContent = '';
      for await (const result of orchestrator) {
        if (result.text) {
          fullContent += result.text;
          setMessages(prev => prev.map(m => 
            m.id === assistantId ? { ...m, content: fullContent, grounding: result.grounding || m.grounding, approvalRequired: result.approvalRequired } : m
          ));
          if (result.approvalRequired) {
            setApprovalPending(true);
            setWorkflowStatus('awaiting_approval');
          }
        }
      }
      if (!approvalPending) setWorkflowStatus('completed');
    } catch (err) {
      setWorkflowStatus('error');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const approveReport = () => {
    setApprovalPending(false);
    setWorkflowStatus('completed');
  };

  const config = DOMAIN_CONFIGS[domain];

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617] text-slate-200 font-sans relative">
      <Sidebar activeDomain={domain} setDomain={(d) => {
        setDomain(d);
        setMessages([]);
        setWorkflowSteps([]);
        setApprovalPending(false);
        setWorkflowStatus('idle');
      }} />

      <main className="flex-1 flex flex-col overflow-hidden relative border-l border-white/5 shadow-2xl">
        <header className="px-8 py-4 bg-[#0a0f1d]/80 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between z-40">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-${config.color}-500/10 flex items-center justify-center text-${config.color}-400 border border-${config.color}-500/20 shadow-lg shadow-${config.color}-500/5`}>
              <i className={`fas ${config.icon}`}></i>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">
                {config.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDashboardOpen(!isDashboardOpen)}
              className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-transparent ${isDashboardOpen ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'text-slate-500'}`}
              title="Toggle Agent Dashboard"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </header>

        {/* PIPELINE OVERLAY */}
        {(isProcessing || workflowSteps.length > 0) && workflowStatus !== 'live' && (
          <div className="absolute top-20 right-8 z-30 w-72 animate-in slide-in-from-right duration-500">
             <div className="bg-[#0f172a]/95 border border-white/10 rounded-2xl p-4 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Ensemble Syncing</h3>
                  <div className={`w-2 h-2 rounded-full ${workflowStatus === 'awaiting_approval' ? 'bg-amber-500' : 'bg-blue-500 animate-pulse'}`}></div>
                </div>
                <div className="space-y-3">
                  {AGENTS.filter(a => a.domain === domain).map(agent => {
                    const step = workflowSteps.find(s => s.agentId === agent.id);
                    const active = step?.status === 'running' || step?.status === 'reflecting';
                    const done = step?.status === 'completed';
                    if (!active && !done) return null;
                    return (
                      <div key={agent.id} className="flex items-center gap-3">
                         <div className={`w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px] ${active ? 'text-blue-400' : 'text-emerald-500'}`}>
                           <i className={`fas ${done ? 'fa-check' : agent.icon}`}></i>
                         </div>
                         <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                               <p className="text-[9px] font-bold text-white uppercase truncate">{agent.name}</p>
                               {active && <span className="text-[8px] text-blue-400 animate-pulse uppercase font-black">Active</span>}
                            </div>
                            {active && step?.thought && <p className="text-[8px] text-slate-500 italic truncate">{step.thought}</p>}
                         </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          </div>
        )}



        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(29,78,216,0.05),transparent_40%)]">
          <div className="max-w-4xl mx-auto w-full p-8 pb-40">
            {/* MESSAGES */}
            <div className="space-y-12">
              {messages.length === 0 && !isProcessing && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 text-2xl">
                     <i className="fas fa-sparkles"></i>
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Ready for Ensemble query</h2>
                     <p className="text-slate-500 text-sm max-w-sm mt-2">DAMA is synchronized across all {domain.toLowerCase()} data nodes. Start your query below.</p>
                   </div>
                </div>
              )}

              {messages.map((m, idx) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
                  <div className={`max-w-[95%] w-full ${m.role === 'user' ? 'max-w-xl' : ''}`}>
                    <div className={`p-8 rounded-3xl ${m.role === 'user' ? 'bg-blue-600 shadow-xl text-white' : 'bg-[#0f172a]/60 border border-white/5 backdrop-blur-md'}`}>
                      <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:font-black leading-relaxed whitespace-pre-wrap">
                        {m.content || (idx === messages.length - 1 && isProcessing && <span className="italic text-slate-500 animate-pulse">Orchestrating ensemble...</span>)}
                      </div>
                      
                      {m.approvalRequired && approvalPending && (
                        <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-pulse">
                          <h4 className="text-amber-500 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle"></i>
                            Human-in-the-loop: Verification Required
                          </h4>
                          <p className="text-slate-300 text-[11px] mb-4">The DAMA Auditor has flagged this report for sensitive domain content. Please review for accuracy before release.</p>
                          <button 
                            onClick={approveReport}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Approve and Close
                          </button>
                        </div>
                      )}

                      {m.grounding && m.grounding.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-3">
                          {m.grounding.map((chunk: any, i: number) => {
                            if (chunk.web) {
                              return (
                                <a
                                  key={i}
                                  href={chunk.web.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/20 transition-all"
                                >
                                  <i className="fas fa-link"></i>
                                  {chunk.web.title || 'Source'}
                                </a>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* INPUT */}
        <div className="p-8 bg-[#020617] border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); startWorkflow(input); setInput(''); }} className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={approvalPending}
                placeholder={approvalPending ? 'Awaiting report approval...' : `Query the ${domain.toLowerCase()} ensemble...`}
                className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-5 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-slate-100 placeholder:text-slate-600 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isProcessing || !input.trim() || approvalPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-arrow-right"></i>}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* DASHBOARD */}
      {isDashboardOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDashboardOpen(false)}></div>
          <div className="relative w-full max-w-4xl bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in">
            <header className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl">
                  <i className="fas fa-microchip"></i>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">Ensemble Intelligence core</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Load: 78% | Sync: Stable</p>
                </div>
              </div>
              <button onClick={() => setIsDashboardOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 text-slate-500 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </header>
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
              <AgentDashboard domain={domain} />
            </div>
            <footer className="px-10 py-5 border-t border-white/5 bg-slate-950/80 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] text-center">
              DAMA Production Workspace • Real-Time Safety Guardrails Active
            </footer>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .animate-in { animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in-right { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .slide-in-from-right { animation: slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
