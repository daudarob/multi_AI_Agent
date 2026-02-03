
export enum Domain {
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  FINANCE = 'FINANCE'
}

export type WorkflowStatus = 'idle' | 'planning' | 'researching' | 'reviewing' | 'awaiting_approval' | 'synthesizing' | 'completed' | 'error' | 'live';

export interface Agent {
  id: string;
  name: string;
  role: 'Specialist' | 'Critic' | 'Supervisor' | 'Researcher';
  description: string;
  icon: string;
  domain: Domain;
  systemPrompt: string;
}

export interface AgentArtifact {
  type: 'link' | 'data' | 'warning';
  label: string;
  value: string;
}

export interface AgentStep {
  agentId: string;
  agentName: string;
  status: 'pending' | 'running' | 'reflecting' | 'completed' | 'error';
  thought?: string;
  output?: string;
  artifacts?: AgentArtifact[];
  confidence?: number; // 0 to 1
  riskScore?: number; // 0 to 1
  timestamp: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isReflection?: boolean;
  approvalRequired?: boolean;
  grounding?: any[];
  contributingAgents?: string[];
}

export interface LiveTranscription {
  text: string;
  role: 'user' | 'model';
}

export interface EnsembleState {
  originalQuery: string;
  plan: string;
  rawFindings: string;
  critique: string;
  safetyScore: number;
  grounding: any[];
  requiresHumanApproval: boolean;
}
