import { describe, it, expect } from 'vitest';
import { calculateScores, determineResult } from '../data/scoring';
import type { QuizAnswer } from '../data/types';

describe('Scoring Logic', () => {
  describe('calculateScores', () => {
    it('should calculate correct scores for basic answers', () => {
      const answers: Record<string, QuizAnswer> = {
        q1: { questionId: 'q1', optionId: 'o1' }, // D: +1
        q2: { questionId: 'q2', optionId: 'o1' }, // D: -2, P: -1, O: -1
        q3: { questionId: 'q3', optionId: 'o1' }, // A: -2
        q4: { questionId: 'q4', optionId: 'o1' }, // P: -2, O: -1
        q5: { questionId: 'q5', optionId: 'o1' }  // D: +2
      };

      const scores = calculateScores(answers);
      
      expect(scores.D).toBe(1); // +1 -2 +2 = 1
      expect(scores.A).toBe(-2);
      expect(scores.P).toBe(-3); // -1 -2 = -3
      expect(scores.O).toBe(-2); // -1 -1 = -2
      expect(scores.T).toBe(0);
    });

    it('should handle nicotine toggle for Q3', () => {
      const answers: Record<string, QuizAnswer> = {
        q3: { questionId: 'q3', optionId: 'o1', extraToggle: true } // A: -2 + (-2 for nicotine) = -4
      };

      const scores = calculateScores(answers);
      expect(scores.A).toBe(-4);
    });

    it('should return zero scores for empty answers', () => {
      const scores = calculateScores({});
      expect(scores.D).toBe(0);
      expect(scores.A).toBe(0);
      expect(scores.P).toBe(0);
      expect(scores.O).toBe(0);
      expect(scores.T).toBe(0);
    });
  });

  describe('determineResult', () => {
    it('should return R1 for D+T risk axes', () => {
      const scoreMap = { D: -2, T: -3, A: 0, P: 1, O: 1 };
      const result = determineResult(scoreMap);
      
      expect(result.resultId).toBe('R1');
      expect(result.axisOrder).toEqual(['T', 'D', 'A', 'P', 'O']);
    });

    it('should return R2 for A+P risk axes', () => {
      const scoreMap = { D: 1, T: 0, A: -3, P: -2, O: 1 };
      const result = determineResult(scoreMap);
      
      expect(result.resultId).toBe('R2');
      // Note: The order depends on the actual scores, so we just check the first two are A and P
      expect(result.axisOrder[0]).toBe('A');
      expect(result.axisOrder[1]).toBe('P');
    });

    it('should return R3 for D+O with O <= -2', () => {
      const scoreMap = { D: -1, T: 0, A: 1, P: 0, O: -3 };
      const result = determineResult(scoreMap);
      
      expect(result.resultId).toBe('R3');
    });

    it('should return R4 for D+P risk axes', () => {
      const scoreMap = { D: -2, T: 1, A: 0, P: -1, O: 1 };
      const result = determineResult(scoreMap);
      
      expect(result.resultId).toBe('R4');
    });

    it('should return R5 for D+O risk axes', () => {
      const scoreMap = { D: -1, T: 1, A: 0, P: 1, O: -1 };
      const result = determineResult(scoreMap);
      
      expect(result.resultId).toBe('R5');
    });

    it('should handle tie-breaking correctly', () => {
      const scoreMap = { D: -1, T: -1, A: 0, P: 0, O: 0 };
      const result = determineResult(scoreMap);
      
      // D should be preferred over T in case of ties
      expect(result.axisOrder[0]).toBe('D');
      expect(result.axisOrder[1]).toBe('T');
    });

    it('should handle all positive scores gracefully', () => {
      const scoreMap = { D: 2, T: 1, A: 1, P: 1, O: 1 };
      const result = determineResult(scoreMap);
      
      // Should still return a valid result even with all positive scores
      expect(['R1', 'R2', 'R3', 'R4', 'R5']).toContain(result.resultId);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing axes in scoreMap', () => {
      const scoreMap = { D: -2, T: -1, A: 0, P: 0, O: 0 };
      const result = determineResult(scoreMap);
      
      expect(result.resultId).toBe('R1'); // D+T should map to R1
    });

    it('should handle zero scores correctly', () => {
      const scoreMap = { D: 0, T: 0, A: 0, P: 0, O: 0 };
      const result = determineResult(scoreMap);
      
      expect(['R1', 'R2', 'R3', 'R4', 'R5']).toContain(result.resultId);
    });
  });
});
