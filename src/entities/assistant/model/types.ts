export interface PageContext {
  page: 'home' | 'diary' | 'camera' | 'shop' | 'protocols' | 'profile';
  dateISO?: string;
  productSlug?: string;
}

export interface CoachContext {
  userProfile?: {
    goals: string[];
    restrictions: string[];
    preferences: string[];
  };
  dailySummary?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    water: number;
  };
  recentMeals?: Array<{
    name: string;
    calories: number;
    protein: number;
    takenAt: string;
  }>;
  activeProtocols?: Array<{
    name: string;
    description: string;
    progress: number;
  }>;
}
