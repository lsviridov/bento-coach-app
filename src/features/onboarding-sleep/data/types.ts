// Core types for onboarding sleep quiz
export type Axis = 'D' | 'A' | 'P' | 'T' | 'O'; // Diet, Activators, Protocols, Timing, Outcomes

export type Weights = Partial<Record<Axis, number>>;

export type Option = {
  id: string;
  label: string;
  weights: Weights;
};

export type Question = {
  id: string;
  title: string;
  options: Option[];
};

export type ResultId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5';

export type Plan = {
  id: ResultId;
  title: string;
  why: string;
  tonight: string[];
  plan7d: string[];
  bundleTags: string[];
};

export type QuizAnswer = {
  questionId: string;
  optionId: string;
  extraToggle?: boolean; // For Q3 nicotine toggle
};

export type QuizState = {
  answers: Record<string, QuizAnswer>;
  currentIndex: number;
  scoreMap: Partial<Record<Axis, number>>;
  resultId: ResultId | null;
  profileDraft: ProfileDraft | null;
};

export type ProfileDraft = {
  last_meal_time: string;
  dinner_heaviness: 'light' | 'moderate' | 'heavy';
  evening_sweets_freq: 'never' | 'rarely' | 'sometimes' | 'often';
  caffeine_after_14: 'never' | 'rarely' | 'sometimes' | 'daily';
  nicotine_evening: boolean;
  alcohol_evening: 'never' | 'rarely' | 'sometimes' | 'often';
  late_hydration: boolean;
  nocturia: boolean;
  reflux_flag: boolean;
  veg_fiber_low: boolean;
  micros_gap_hint: boolean;
};

export type ScoringResult = {
  resultId: ResultId;
  axisOrder: Axis[];
  scoreMap: Record<Axis, number>;
};
