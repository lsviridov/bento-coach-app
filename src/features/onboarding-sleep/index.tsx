import { memo } from 'react';
import { questions } from './data/questions';
import { QuizStart } from './components/QuizStart';
import { useOnboardingSleepStore } from './store/useOnboardingSleepStore';

// Простые результаты для демонстрации
const results = {
  R1: {
    title: 'Более ранний и легкий ужин',
    why: 'Поздние тяжелые приемы пищи + сладости держат мозг в состоянии бодрствования',
    tonight: [
      'Ужинайте не позже 19:00',
      'Сократите порцию на 20%',
      'Исключите сладости после 18:00'
    ],
    plan7d: [
      'День 1-2: Ужин в 19:00, легкие блюда',
      'День 3-4: Добавьте овощи, убирайте жирное',
      'День 5-7: Зафиксируйте новое время, отслеживайте качество сна'
    ]
  },
  R2: {
    title: 'Ограничение стимуляторов',
    why: 'Кофеин и никотин после 14:00 могут нарушать циркадные ритмы',
    tonight: [
      'Последний кофе/чай до 14:00',
      'Избегайте энергетиков',
      'Создайте вечерний ритуал без стимуляторов'
    ],
    plan7d: [
      'День 1-2: Отследите все источники кофеина',
      'День 3-4: Постепенно сокращайте дозы',
      'День 5-7: Замените на травяные чаи, воду'
    ]
  },
  R3: {
    title: 'Оптимизация времени ужина',
    why: 'Поздний ужин не дает организму переключиться в режим сна',
    tonight: [
      'Перенесите ужин на 19:00-19:30',
      'Легкие белковые блюда',
      'После 20:00 только вода'
    ],
    plan7d: [
      'День 1-2: Сдвигайте время на 15 минут раньше',
      'День 3-4: Добавьте вечернюю прогулку',
      'День 5-7: Зафиксируйте новое расписание'
    ]
  },
  R4: {
    title: 'Контроль вечерних углеводов',
    why: 'Вечерние углеводы могут вызывать скачки сахара и нарушать сон',
    tonight: [
      'Ужин без хлеба, макарон, картошки',
      'Фокус на белке и овощах',
      'Если хочется сладкого - фрукты до 18:00'
    ],
    plan7d: [
      'День 1-2: Изучите состав ужинов',
      'День 3-4: Замените углеводы на овощи',
      'День 5-7: Оцените изменения в качестве сна'
    ]
  },
  R5: {
    title: 'Поддержание текущих привычек',
    why: 'Ваши вечерние привычки уже оптимальны для качественного сна',
    tonight: [
      'Продолжайте текущий режим',
      'Отслеживайте качество сна',
      'Можете добавить вечернюю медитацию'
    ],
    plan7d: [
      'День 1-3: Ведите дневник сна',
      'День 4-5: Анализируйте паттерны',
      'День 6-7: Оптимизируйте на основе данных'
    ]
  }
};

function OnboardingSleepQuizBase() {
  const index = useOnboardingSleepStore((s) => s.index);
  const answers = useOnboardingSleepStore((s) => s.answers);
  const isComplete = useOnboardingSleepStore((s) => s.isComplete);
  const resultId = useOnboardingSleepStore((s) => s.resultId);
  const next = useOnboardingSleepStore((s) => s.next);
  const back = useOnboardingSleepStore((s) => s.back);
  const setAnswer = useOnboardingSleepStore((s) => s.setAnswer);
  const resetQuiz = useOnboardingSleepStore((s) => s.resetQuiz);

  const handleAnswer = (questionId: string, optionId: string) => {
    console.log('Answering question:', { questionId, optionId });
    setAnswer(questionId, optionId);
  };

  const handleNext = () => {
    console.log('Moving to next question');
    next();
  };

  const handleReturnToMain = () => {
    // Возвращаемся на главную страницу
    window.location.href = '/';
  };

  const handleRestartQuiz = () => {
    resetQuiz();
  };

  // Show start screen if no answers yet
  if (index === 0 && Object.keys(answers).length === 0) {
    return <QuizStart onStart={next} />;
  }

  // Show questions if we're in the question range
  if (index < questions.length) {
    const question = questions[index];
    const answer = answers[question.id];
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">
              Вопрос {index + 1} из {questions.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {question.title}
            </h2>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className={`block cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                    answer === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={answer === option.id}
                    onChange={() => handleAnswer(question.id, option.id)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                      answer === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answer === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                      )}
                    </div>
                    <span className="text-gray-800 leading-relaxed">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={back}
                disabled={index === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  index === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Назад
              </button>

              <div className="flex gap-3">
                {/* Кнопка "Завершить квиз" на последнем вопросе */}
                {index === questions.length - 1 && (
                  <button
                    onClick={() => {
                      console.log('Manual quiz completion');
                      // Принудительно завершаем квиз
                      const store = useOnboardingSleepStore.getState();
                      store.completeQuiz();
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all duration-200"
                  >
                    Завершить квиз
                  </button>
                )}

                <button
                  onClick={handleNext}
                  disabled={!answer}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                    answer
                      ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {index === questions.length - 1 ? 'Далее' : 'Далее'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show result screen
  if (isComplete && resultId && results[resultId as keyof typeof results]) {
    const result = results[resultId as keyof typeof results];
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Ваш персональный план
            </h1>
            <p className="text-lg text-gray-600">
              На основе ваших ответов мы подготовили рекомендации для улучшения сна
            </p>
          </div>

          {/* Debug info - можно убрать в продакшене */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Debug:</strong> Результат: {resultId}, Завершен: {isComplete ? 'Да' : 'Нет'}, 
              Ответов: {Object.keys(answers).length}/5
            </p>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              {result.title}
            </h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Почему этот план?</h3>
              <p className="text-gray-700 leading-relaxed">{result.why}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Шаги на сегодня:</h3>
              <ul className="space-y-2">
                {result.tonight.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">7-дневный план:</h3>
              <ul className="space-y-2">
                {result.plan7d.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleReturnToMain}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200"
            >
              Вернуться на главную
            </button>
            
            <button
              onClick={handleRestartQuiz}
              className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
            >
              Пройти квиз заново
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - если что-то пошло не так
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Что-то пошло не так
        </h1>
        <p className="text-gray-600 mb-6">
          Попробуйте пройти квиз заново
        </p>
        
        {/* Debug info */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <p className="text-sm text-red-800">
            <strong>Debug:</strong><br />
            Индекс: {index}<br />
            Завершен: {isComplete ? 'Да' : 'Нет'}<br />
            Результат: {resultId || 'Нет'}<br />
            Ответов: {Object.keys(answers).length}/5<br />
            Ответы: {JSON.stringify(answers, null, 2)}
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleRestartQuiz}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200"
          >
            Начать заново
          </button>
          <br />
          <button
            onClick={handleReturnToMain}
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}

export const OnboardingSleepQuiz = memo(OnboardingSleepQuizBase);
export default OnboardingSleepQuiz;
