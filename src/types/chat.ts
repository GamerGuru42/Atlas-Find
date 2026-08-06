import { MatchResult } from './opportunity';
import { ContextPill, GoalStage } from './user';

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;

  // Agent-only rich content
  opportunityCards?: MatchResult[];
  adviceCards?: AdviceCard[];
  contextPillsAdded?: ContextPill[];
  goalUpdate?: GoalStage | null;
  suggestedQuestions?: string[];

  // Agent processing state
  agentSteps?: AgentStep[];
}

export interface AdviceCard {
  title: string;
  body: string;
  priority: 'urgent' | 'strategic' | 'tip';
  icon: '⏰' | '🎯' | '💡' | '⚠️';
}

export interface AgentStep {
  agent: string;
  status: 'running' | 'done' | 'error';
  label: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  agentSteps: AgentStep[];
}
