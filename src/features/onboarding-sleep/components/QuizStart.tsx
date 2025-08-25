import React from 'react';
import { trackQuizStart } from '../services/analytics';

interface QuizStartProps {
  onStart: () => void;
}

export const QuizStart: React.FC<QuizStartProps> = ({ onStart }) => {
  const handleStart = () => {
    trackQuizStart();
    onStart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Сон × Питание
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            5 быстрых вопросов → персональный 7-дневный план
          </p>
        </div>

        {/* Value proposition */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Оцените ваши вечерние привычки</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Получите персональные рекомендации</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Улучшите качество сна естественным путем</span>
            </div>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Начать квиз о сне и питании"
        >
          Начать квиз
        </button>

        {/* Footer note */}
        <p className="text-sm text-gray-500 mt-6">
          Занимает около 2-3 минут • Ваши данные конфиденциальны
        </p>
      </div>
    </div>
  );
};
