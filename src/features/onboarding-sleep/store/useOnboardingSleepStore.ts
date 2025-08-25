import { create } from 'zustand';

type State = {
  index: number;
  answers: Record<string, string>;
  isComplete: boolean;
  resultId: string | null;
  setAnswer: (qid: string, opt: string) => void;
  next: () => void;
  back: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
};

export const useOnboardingSleepStore = create<State>((set, get) => ({
  index: 0,
  answers: {},
  isComplete: false,
  resultId: null,
  setAnswer: (qid, opt) =>
    set((s) => ({ answers: { ...s.answers, [qid]: opt } })),
  next: () => {
    const { index, answers } = get();
    if (index < 4) { // 5 вопросов (0-4)
      set({ index: index + 1 });
    } else if (index === 4) { // Последний вопрос
      // Завершаем квиз независимо от количества ответов
      get().completeQuiz();
    } else if (index === 5) {
      // Если мы на шаге после вопросов, завершаем квиз
      get().completeQuiz();
    }
  },
  back: () => set((s) => ({ index: Math.max(0, s.index - 1) })),
  completeQuiz: () => {
    const { answers } = get();
    console.log('Completing quiz with answers:', answers);
    
    // Анализируем ответы для определения результата
    let resultId = 'R1'; // По умолчанию
    
    // Вопрос 1: Время ужина и его объем
    const q1Answer = answers['q1'];
    const hasLateDinner = q1Answer === 'q1_opt3' || q1Answer === 'q1_opt4';
    const hasHeavyDinner = q1Answer === 'q1_opt2' || q1Answer === 'q1_opt4';
    
    // Вопрос 2: Вечерние углеводы / скачки сахара
    const q2Answer = answers['q2'];
    const hasEveningCarbs = q2Answer === 'q2_opt3' || q2Answer === 'q2_opt4';
    const hasSugarSpikes = q2Answer === 'q2_opt2' || q2Answer === 'q2_opt4';
    
    // Вопрос 3: Стимуляторы после 14:00
    const q3Answer = answers['q3'];
    const hasStimulants = q3Answer === 'q3_opt3' || q3Answer === 'q3_opt4';
    
    // Вопрос 4: Алкоголь, гидратация, ночные пробуждения
    const q4Answer = answers['q4'];
    const hasAlcohol = q4Answer === 'q4_opt3' || q4Answer === 'q4_opt4';
    const hasDehydration = q4Answer === 'q4_opt2' || q4Answer === 'q4_opt4';
    
    // Вопрос 5: Состав ужина и рефлюкс
    const q5Answer = answers['q5'];
    const hasReflux = q5Answer === 'q5_opt3' || q5Answer === 'q5_opt4';
    const hasHeavyFood = q5Answer === 'q5_opt2' || q5Answer === 'q5_opt4';
    
    console.log('Analysis:', {
      hasLateDinner,
      hasHeavyDinner,
      hasEveningCarbs,
      hasSugarSpikes,
      hasStimulants,
      hasAlcohol,
      hasDehydration,
      hasReflux,
      hasHeavyFood
    });
    
    // Логика определения результата на основе доступных ответов
    if (hasLateDinner && hasHeavyDinner) {
      resultId = 'R1'; // Более ранний и легкий ужин
    } else if (hasStimulants && hasLateDinner) {
      resultId = 'R2'; // Ограничение стимуляторов + время
    } else if (hasEveningCarbs && hasSugarSpikes) {
      resultId = 'R3'; // Контроль углеводов
    } else if (hasAlcohol || hasDehydration) {
      resultId = 'R4'; // Гидратация и алкоголь
    } else if (hasReflux || hasHeavyFood) {
      resultId = 'R5'; // Состав ужина
    } else if (hasLateDinner) {
      resultId = 'R1'; // Если только поздний ужин
    } else if (hasStimulants) {
      resultId = 'R2'; // Если только стимуляторы
    } else if (hasEveningCarbs) {
      resultId = 'R3'; // Если только вечерние углеводы
    } else {
      resultId = 'R5'; // Поддержание текущих привычек (по умолчанию)
    }
    
    console.log('Selected result:', resultId);
    
    set({ 
      isComplete: true, 
      resultId,
      index: 6 // Переходим к результату
    });
  },
  resetQuiz: () => set({ 
    index: 0, 
    answers: {}, 
    isComplete: false, 
    resultId: null 
  }),
}));
