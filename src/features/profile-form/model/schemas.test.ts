import { describe, it, expect } from 'vitest';
import { Profile, ProfilePatch, ProfileFormData } from './schemas';

describe('Profile Schema', () => {
  it('should validate a valid profile', () => {
    const validProfile = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'user@example.com',
      full_name: 'Иван Иванов',
      birthdate: '1990-05-15',
      height_cm: 175,
      weight_kg: 70.5,
      allergies: ['Лактоза', 'Глютен'],
      goals: ['Энергия и бодрость'],
      theme: 'auto',
      push_enabled: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const result = Profile.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('should validate profile with minimal data', () => {
    const minimalProfile = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'user@example.com',
      full_name: null,
      birthdate: null,
      height_cm: null,
      weight_kg: null,
      allergies: [],
      goals: [],
      theme: 'auto',
      push_enabled: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const result = Profile.safeParse(minimalProfile);
    expect(result.success).toBe(true);
  });

  it('should reject invalid UUID', () => {
    const invalidProfile = {
      id: 'invalid-uuid',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'user@example.com',
      allergies: [],
      goals: [],
      theme: 'auto',
      push_enabled: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const result = Profile.safeParse(invalidProfile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('id');
    }
  });

  it('should reject invalid email', () => {
    const invalidProfile = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'invalid-email',
      allergies: [],
      goals: [],
      theme: 'auto',
      push_enabled: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const result = Profile.safeParse(invalidProfile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('should reject invalid height', () => {
    const invalidProfile = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'user@example.com',
      height_cm: 300, // Too high
      allergies: [],
      goals: [],
      theme: 'auto',
      push_enabled: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const result = Profile.safeParse(invalidProfile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('height_cm');
    }
  });

  it('should reject invalid weight', () => {
    const invalidProfile = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'user@example.com',
      weight_kg: 10, // Too low
      allergies: [],
      goals: [],
      theme: 'auto',
      push_enabled: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const result = Profile.safeParse(invalidProfile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('weight_kg');
    }
  });

  it('should reject invalid theme', () => {
    const invalidProfile = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'user@example.com',
      theme: 'invalid-theme',
      allergies: [],
      goals: [],
      push_enabled: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const result = Profile.safeParse(invalidProfile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('theme');
    }
  });
});

describe('ProfilePatch Schema', () => {
  it('should validate partial profile update', () => {
    const validPatch = {
      full_name: 'Новое Имя',
      height_cm: 180,
    };

    const result = ProfilePatch.safeParse(validPatch);
    expect(result.success).toBe(true);
  });

  it('should reject patch with id', () => {
    const invalidPatch = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      full_name: 'Новое Имя',
    };

    const result = ProfilePatch.safeParse(invalidPatch);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('id');
    }
  });

  it('should reject patch with user_id', () => {
    const invalidPatch = {
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      full_name: 'Новое Имя',
    };

    const result = ProfilePatch.safeParse(invalidPatch);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('user_id');
    }
  });
});

describe('ProfileFormData Schema', () => {
  it('should validate form data with strings', () => {
    const validFormData = {
      full_name: 'Иван Иванов',
      birthdate: '1990-05-15',
      height_cm: '175',
      weight_kg: '70.5',
      allergies: ['Лактоза'],
      goals: ['Энергия'],
    };

    const result = ProfileFormData.safeParse(validFormData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.height_cm).toBe(175);
      expect(result.data.weight_kg).toBe(70.5);
    }
  });

  it('should handle empty strings as null', () => {
    const formDataWithEmptyStrings = {
      full_name: '',
      birthdate: '',
      height_cm: '',
      weight_kg: '',
      allergies: [],
      goals: [],
    };

    const result = ProfileFormData.safeParse(formDataWithEmptyStrings);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.height_cm).toBeNull();
      expect(result.data.weight_kg).toBeNull();
    }
  });

  it('should validate required fields', () => {
    const emptyFormData = {
      allergies: [],
      goals: [],
    };

    const result = ProfileFormData.safeParse(emptyFormData);
    expect(result.success).toBe(true);
  });
});
