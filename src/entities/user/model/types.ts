export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string; // Added missing email field
  full_name?: string | null;
  birthdate?: string | null; // 'YYYY-MM-DD'
  height_cm?: number | null;
  weight_kg?: number | null;
  allergies: string[];
  goals: string[];
  theme: 'light' | 'dark' | 'auto';
  push_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  birthdate?: string;
  height_cm?: number;
  weight_kg?: number;
  allergies?: string[];
  goals?: string[];
  theme?: 'light' | 'dark' | 'auto';
  push_enabled?: boolean;
}

export interface SupportTicket {
  id: string;
  type: 'export' | 'delete';
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
}
