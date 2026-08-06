export type GoalStage =
  | 'goal_identified'
  | 'profile_built'
  | 'options_researched'
  | 'strategy_set'
  | 'documents_ready'
  | 'submitted';

export interface UserProfile {
  nationality: string | null;
  fieldOfStudy: string | null;
  degreeLevel: 'bachelors' | 'masters' | 'phd' | null;
  gpa: { value: number; scale: number } | null;
  fundingNeeds: 'fully_funded' | 'partial' | 'any' | null;
  targetCountries: string[];
  targetRegions: string[];
  workExperience: { years: number; field: string; details: string } | null;
  timeline: string | null;
  constraints: string[];
  languages: string[];
}

export interface ContextPill {
  key: string;
  label: string;
  icon: string;
  source: string; // "Learned from message #2"
}

export interface GoalState {
  currentStage: GoalStage;
  stagesCompleted: GoalStage[];
  progress: number; // 0-100
}
