import React, { useState } from 'react';
import type { Question, Option } from '../data/types';
import { trackQuizAnswer } from '../services/analytics';
import { QuizProgress } from './QuizProgress';

interface QuizQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOption?: string;
  extraToggle?: boolean;
  onAnswer: (questionId: string, optionId: string, extraToggle?: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOption,
  extraToggle,
  onAnswer,
  onNext,
  onPrevious
}) => {
  const [localSelectedOption, setLocalSelectedOption] = useState(selectedOption);
  const [localExtraToggle, setLocalExtraToggle] = useState(extraToggle);

  const handleOptionSelect = (optionId: string) => {
    setLocalSelectedOption(optionId);
    onAnswer(question.id, optionId, localExtraToggle);
  };

  const handleExtraToggle = (checked: boolean) => {
    setLocalExtraToggle(checked);
    if (localSelectedOption) {
      onAnswer(question.id, localSelectedOption, checked);
    }
  };

  const handleNext = () => {
    if (localSelectedOption) {
      onNext();
    }
  };

  const canProceed = localSelectedOption !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <QuizProgress current={currentIndex + 1} total={totalQuestions} />
        
        {/* Question counter */}
        <div className="text-sm text-gray-500 mb-4">
          Question {currentIndex + 1} of {totalQuestions}
        </div>

        {/* Question title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
          {question.title}
        </h2>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {question.options.map((option) => (
            <label
              key={option.id}
              className={`block cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                localSelectedOption === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={localSelectedOption === option.id}
                onChange={() => handleOptionSelect(option.id)}
                className="sr-only"
                aria-label={`Select option: ${option.label}`}
              />
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                  localSelectedOption === option.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {localSelectedOption === option.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                  )}
                </div>
                <span className="text-gray-800 leading-relaxed">{option.label}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Extra toggle for Q3 (nicotine) */}
        {question.id === 'q3' && localSelectedOption && (
          <div className="mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localExtraToggle || false}
                onChange={(e) => handleExtraToggle(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">
                Nicotine in evening?
              </span>
            </label>
            <p className="text-sm text-gray-600 mt-2 ml-8">
              This affects your stimulant score
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentIndex === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            aria-label="Go to previous question"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
              canProceed
                ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            aria-label={canProceed ? "Go to next question" : "Please select an option to continue"}
          >
            {currentIndex === totalQuestions - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
