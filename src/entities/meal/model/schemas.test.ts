import { describe, it, expect } from 'vitest';
import { CreateMeal, Meal } from './schemas';

describe('CreateMeal', () => {
  it('should parse valid meal data', () => {
    const validData = {
      title: 'Овсянка с ягодами',
      grams: 250,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3,
      takenAt: '2024-01-15T08:00:00.000Z',
      photoUrl: 'https://example.com/photo.jpg'
    };
    
    const result = CreateMeal.safeParse(validData);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Овсянка с ягодами');
      expect(result.data.grams).toBe(250);
      expect(result.data.calories).toBe(320);
      expect(result.data.protein_g).toBe(12.5);
      expect(result.data.fat_g).toBe(8.2);
      expect(result.data.carbs_g).toBe(52.3);
      expect(result.data.takenAt).toBe('2024-01-15T08:00:00.000Z');
      expect(result.data.photoUrl).toBe('https://example.com/photo.jpg');
    }
  });

  it('should parse meal data without optional fields', () => {
    const minimalData = {
      title: 'Куриная грудка',
      grams: 300,
      calories: 450,
      protein_g: 45.2,
      fat_g: 12.8,
      carbs_g: 18.5
    };
    
    const result = CreateMeal.safeParse(minimalData);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Куриная грудка');
      expect(result.data.grams).toBe(300);
      expect(result.data.takenAt).toBeUndefined();
      expect(result.data.photoUrl).toBeUndefined();
    }
  });

  it('should reject empty title', () => {
    const invalidData = {
      title: '',
      grams: 250,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3
    };
    
    const result = CreateMeal.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const titleError = result.error.issues.find(issue => 
        issue.path.includes('title')
      );
      expect(titleError).toBeDefined();
    }
  });

  it('should reject negative grams', () => {
    const invalidData = {
      title: 'Овсянка',
      grams: -100,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3
    };
    
    const result = CreateMeal.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const gramsError = result.error.issues.find(issue => 
        issue.path.includes('grams')
      );
      expect(gramsError).toBeDefined();
    }
  });

  it('should reject non-integer grams', () => {
    const invalidData = {
      title: 'Овсянка',
      grams: 250.5,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3
    };
    
    const result = CreateMeal.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const gramsError = result.error.issues.find(issue => 
        issue.path.includes('grams')
      );
      expect(gramsError).toBeDefined();
    }
  });

  it('should reject negative calories', () => {
    const invalidData = {
      title: 'Овсянка',
      grams: 250,
      calories: -50,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3
    };
    
    const result = CreateMeal.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const caloriesError = result.error.issues.find(issue => 
        issue.path.includes('calories')
      );
      expect(caloriesError).toBeDefined();
    }
  });

  it('should reject negative macro nutrients', () => {
    const invalidData = {
      title: 'Овсянка',
      grams: 250,
      calories: 320,
      protein_g: -5,
      fat_g: -2,
      carbs_g: -10
    };
    
    const result = CreateMeal.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const macroErrors = result.error.issues.filter(issue => 
        ['protein_g', 'fat_g', 'carbs_g'].some(macro => 
          issue.path.includes(macro)
        )
      );
      expect(macroErrors.length).toBeGreaterThan(0);
    }
  });

  it('should reject invalid photoUrl', () => {
    const invalidData = {
      title: 'Овсянка',
      grams: 250,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3,
      photoUrl: 'not-a-url'
    };
    
    const result = CreateMeal.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const photoUrlError = result.error.issues.find(issue => 
        issue.path.includes('photoUrl')
      );
      expect(photoUrlError).toBeDefined();
    }
  });

  it('should reject invalid takenAt format', () => {
    const invalidData = {
      title: 'Овсянка',
      grams: 250,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3,
      takenAt: 'invalid-date'
    };
    
    const result = CreateMeal.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const takenAtError = result.error.issues.find(issue => 
        issue.path.includes('takenAt')
      );
      expect(takenAtError).toBeDefined();
    }
  });
});

describe('Meal', () => {
  it('should parse valid meal with all fields', () => {
    const validData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      takenAt: '2024-01-15T08:00:00.000Z',
      title: 'Овсянка с ягодами',
      grams: 250,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3,
      photoUrl: 'https://example.com/photo.jpg'
    };
    
    const result = Meal.safeParse(validData);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.data.takenAt).toBe('2024-01-15T08:00:00.000Z');
      expect(result.data.title).toBe('Овсянка с ягодами');
    }
  });

  it('should reject invalid UUID', () => {
    const invalidData = {
      id: 'not-a-uuid',
      takenAt: '2024-01-15T08:00:00.000Z',
      title: 'Овсянка',
      grams: 250,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3
    };
    
    const result = Meal.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const idError = result.error.issues.find(issue => 
        issue.path.includes('id')
      );
      expect(idError).toBeDefined();
    }
  });
});
