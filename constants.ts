
import { Domain, Agent } from './types';

export const DOMAIN_CONFIGS = {
  [Domain.HEALTHCARE]: {
    title: 'DAMA Health Advisory',
    color: 'emerald',
    disclaimer: 'NON-DIAGNOSTIC: For educational guidance only. Not medical advice. In emergencies, call 911.',
    icon: 'fa-hand-holding-medical',
    systemTask: 'Synthesize health history into educational summaries with risk flags.'
  },
  [Domain.EDUCATION]: {
    title: 'DAMA Learning Lab',
    color: 'blue',
    disclaimer: 'AI LEARNING: Verify academic facts independently. This tool supports tutoring but is not an official certification.',
    icon: 'fa-graduation-cap',
    systemTask: 'Build adaptive learning paths and detect student misconceptions.'
  },
  [Domain.FINANCE]: {
    title: 'DAMA Finance Ops',
    color: 'amber',
    disclaimer: 'NON-ADVISORY: Informational purposes only. No specific product endorsements or guarantees.',
    icon: 'fa-chart-line',
    systemTask: 'Categorize expenses and project financial scenarios with compliance checks.'
  }
};

export const AGENTS: Agent[] = [
  // Healthcare Agents
  { 
    id: 'hc-specialist', domain: Domain.HEALTHCARE, name: 'Medical Researcher', role: 'Researcher', 
    description: 'Queries clinical knowledge and clusters symptoms.', icon: 'fa-microscope',
    systemPrompt: 'You are a specialized Medical Researcher. Your goal is to gather clinical facts and peer-reviewed data. Focus on evidence-based synthesis without making direct diagnoses.'
  },
  { 
    id: 'hc-safety', domain: Domain.HEALTHCARE, name: 'Clinical Auditor', role: 'Critic', 
    description: 'Identifies medical red-flags and enforces safety disclaimers.', icon: 'fa-user-nurse',
    systemPrompt: 'You are a Clinical Safety Auditor. Your role is to look for medical inaccuracies, dangerous advice, or missing disclaimers. Assign a risk score from 0-1.'
  },
  { 
    id: 'hc-supervisor', domain: Domain.HEALTHCARE, name: 'Health Coordinator', role: 'Supervisor', 
    description: 'Synthesizes specialized findings into patient-safe guidance.', icon: 'fa-user-doctor',
    systemPrompt: 'You are the Health Coordinator. You orchestrate the specialists and auditor to produce a final, coherent report that is educational and safe.'
  },
  
  // Education Agents
  { 
    id: 'ed-specialist', domain: Domain.EDUCATION, name: 'Content Tutor', role: 'Specialist', 
    description: 'Explains complex concepts with multi-modal metaphors.', icon: 'fa-chalkboard-user',
    systemPrompt: 'You are an Expert Pedagogue. Explain topics using Bloom’s Taxonomy. Focus on clarity and adaptive scaffolding.'
  },
  { 
    id: 'ed-critic', domain: Domain.EDUCATION, name: 'Pedagogy Analyst', role: 'Critic', 
    description: 'Checks for misconceptions and analyzes learning gaps.', icon: 'fa-magnifying-glass-chart',
    systemPrompt: 'You are a Pedagogy Analyst. Evaluate the content for academic rigor, common misconceptions, and cognitive load management.'
  },
  { 
    id: 'ed-supervisor', domain: Domain.EDUCATION, name: 'Curriculum Architect', role: 'Supervisor', 
    description: 'Orchestrates the learning journey and schedules follow-ups.', icon: 'fa-sitemap',
    systemPrompt: 'You are the Curriculum Architect. Organize the tutor’s explanations and the analyst’s corrections into a structured learning path.'
  },

  // Finance Agents
  { 
    id: 'fn-specialist', domain: Domain.FINANCE, name: 'Data Quant', role: 'Researcher', 
    description: 'Parses raw transaction data and identifies spending patterns.', icon: 'fa-file-invoice-dollar',
    systemPrompt: 'You are a Financial Data Analyst. Focus on quantitative precision, trend detection, and financial scenario modeling.'
  },
  { 
    id: 'fn-critic', domain: Domain.FINANCE, name: 'Compliance Officer', role: 'Critic', 
    description: 'Checks for regulatory anomalies and data privacy leaks.', icon: 'fa-scale-balanced',
    systemPrompt: 'You are a Financial Compliance Officer. Audit for regulatory risks, potential fraud, and privacy concerns in the data analysis.'
  },
  { 
    id: 'fn-supervisor', domain: Domain.FINANCE, name: 'Wealth Strategist', role: 'Supervisor', 
    description: 'Projects scenarios and creates visual dashboards.', icon: 'fa-landmark',
    systemPrompt: 'You are the Wealth Strategist. Combine quant analysis with compliance auditing to provide a balanced financial strategy.'
  }
];
