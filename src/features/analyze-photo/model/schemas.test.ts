import { describe, it, expect } from 'vitest';
import { AnalyzeRequest, AnalyzeResponse } from './schemas';

describe('AnalyzeRequest', () => {
  it('should parse valid request', () => {
    const validData = { imageUrl: 'https://example.com/image.jpg' };
    const result = AnalyzeRequest.safeParse(validData);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.imageUrl).toBe('https://example.com/image.jpg');
    }
  });

  it('should reject invalid URL', () => {
    const invalidData = { imageUrl: 'not-a-url' };
    const result = AnalyzeRequest.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Invalid url');
    }
  });

  it('should reject missing imageUrl', () => {
    const invalidData = {};
    const result = AnalyzeRequest.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Required');
    }
  });
});

describe('AnalyzeResponse', () => {
  it('should parse valid response with all fields', () => {
    const validData = {
      labels: ['овсянка', 'ягоды'],
      confidence: [0.92, 0.87],
      defaultGrams: 250,
      calories: 320,
      protein_g: 12.5,
      fat_g: 8.2,
      carbs_g: 52.3
    };
    
    const result = AnalyzeResponse.safeParse(validData);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.labels).toEqual(['овсянка', 'ягоды']);
      expect(result.data.confidence).toEqual([0.92, 0.87]);
      expect(result.data.defaultGrams).toBe(250);
      expect(result.data.calories).toBe(320);
      expect(result.data.protein_g).toBe(12.5);
      expect(result.data.fat_g).toBe(8.2);
      expect(result.data.carbs_g).toBe(52.3);
    }
  });

  it('should use default values for missing fields', () => {
    const minimalData = {};
    
    const result = AnalyzeResponse.safeParse(minimalData);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.labels).toEqual([]);
      expect(result.data.confidence).toEqual([]);
      expect(result.data.defaultGrams).toBe(250);
      expect(result.data.calories).toBe(0);
      expect(result.data.protein_g).toBe(0);
      expect(result.data.fat_g).toBe(0);
      expect(result.data.carbs_g).toBe(0);
    }
  });

  it('should validate confidence values are between 0 and 1', () => {
    const invalidData = {
      confidence: [0.5, 1.5, -0.1]
    };
    
    const result = AnalyzeResponse.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const confidenceErrors = result.error.issues.filter(issue => 
        issue.path.includes('confidence')
      );
      expect(confidenceErrors.length).toBeGreaterThan(0);
    }
  });

  it('should validate defaultGrams is positive integer', () => {
    const invalidData = {
      defaultGrams: -100
    };
    
    const result = AnalyzeResponse.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const gramsError = result.error.issues.find(issue => 
        issue.path.includes('defaultGrams')
      );
      expect(gramsError).toBeDefined();
    }
  });

  it('should validate calories is non-negative', () => {
    const invalidData = {
      calories: -50
    };
    
    const result = AnalyzeResponse.safeParse(invalidData);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const caloriesError = result.error.issues.find(issue => 
        issue.path.includes('calories')
      );
      expect(caloriesError).toBeDefined();
    }
  });

  it('should validate macro nutrients are non-negative', () => {
    const invalidData = {
      protein_g: -5,
      fat_g: -2,
      carbs_g: -10
    };
    
    const result = AnalyzeResponse.safeParse(invalidData);
    
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
});
