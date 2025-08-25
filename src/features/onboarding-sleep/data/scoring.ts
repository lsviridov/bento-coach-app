import type { Axis, QuizAnswer, ScoringResult, Weights } from './types';

export function calculateScores(answers: Record<string, QuizAnswer>): Record<Axis, number> {
  const scoreMap: Record<Axis, number> = { D: 0, A: 0, P: 0, T: 0, O: 0 };
  
  Object.values(answers).forEach(answer => {
    // Find the selected option
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;
    
    const option = question.options.find(o => o.id === answer.optionId);
    if (!option) return;
    
    // Apply weights
    Object.entries(option.weights).forEach(([axis, weight]) => {
      scoreMap[axis as Axis] += weight;
    });
    
    // Handle Q3 nicotine toggle
    if (answer.questionId === 'q3' && answer.extraToggle) {
      scoreMap.A -= 2;
    }
  });
  
  return scoreMap;
}

export function determineResult(scoreMap: Record<Axis, number>): ScoringResult {
  // Sort axes by score (ascending - lowest scores are highest risk)
  const axisOrder: Axis[] = Object.entries(scoreMap)
    .sort(([, a], [, b]) => a - b)
    .map(([axis]) => axis as Axis);
  
  // Get top 2 negative axes (highest risk)
  const riskAxes = axisOrder.filter(axis => scoreMap[axis] < 0).slice(0, 2);
  
  // Map to result based on risk axes
  let resultId: string;
  
  if (riskAxes.includes('D') && riskAxes.includes('T')) {
    resultId = 'R1'; // "Late & wrong mix"
  } else if (riskAxes.includes('A') && riskAxes.includes('P')) {
    resultId = 'R2'; // "Stimulants & no evening protocol"
  } else if (riskAxes.includes('D') && riskAxes.includes('O') && scoreMap.O <= -2) {
    resultId = 'R3'; // "Reflux-friendly dinner"
  } else if (riskAxes.includes('D') && riskAxes.includes('P')) {
    resultId = 'R4'; // "Glycemic swings & no structure"
  } else if (riskAxes.includes('D') && riskAxes.includes('O')) {
    resultId = 'R5'; // "Micronutrient gap at dinner"
  } else {
    // Fallback: pick first two risk axes
    const fallbackAxes = riskAxes.length >= 2 ? riskAxes.slice(0, 2) : ['D', 'T'];
    if (fallbackAxes.includes('D') && fallbackAxes.includes('T')) {
      resultId = 'R1';
    } else if (fallbackAxes.includes('A') && fallbackAxes.includes('P')) {
      resultId = 'R2';
    } else if (fallbackAxes.includes('D') && fallbackAxes.includes('O')) {
      resultId = 'R3';
    } else if (fallbackAxes.includes('D') && fallbackAxes.includes('P')) {
      resultId = 'R4';
    } else {
      resultId = 'R5';
    }
  }
  
  return {
    resultId: resultId as any,
    axisOrder,
    scoreMap
  };
}

// Import questions for scoring calculation
import { questions } from './questions';
