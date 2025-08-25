import React, { useState } from 'react';
import type { Plan } from '../data/types';
import { trackResultShown, trackPlanSaved, trackReminderSet } from '../services/analytics';

interface ResultScreenProps {
  plan: Plan;
  onSavePlan: () => void;
  onViewBundles: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  plan,
  onSavePlan,
  onViewBundles
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isReminderSet, setIsReminderSet] = useState(false);

  React.useEffect(() => {
    trackResultShown(plan.id);
  }, [plan.id]);

  const handleSavePlan = async () => {
    setIsSaving(true);
    try {
      await onSavePlan();
      // Success feedback could be added here
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetReminder = () => {
    setIsReminderSet(true);
    trackReminderSet('daily');
    // In a real app, this would integrate with notification APIs
    setTimeout(() => setIsReminderSet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Personalized Plan
          </h1>
          <p className="text-gray-600">
            Based on your answers, here's what we recommend
          </p>
        </div>

        {/* Plan Card */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {plan.title}
          </h2>
          
          {/* Why this plan */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Why this plan?</h3>
            <p className="text-gray-700 leading-relaxed">{plan.why}</p>
          </div>

          {/* Tonight's steps */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tonight's steps:</h3>
            <ul className="space-y-2">
              {plan.tonight.map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 7-day plan preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">7-day plan preview:</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <ul className="space-y-2 text-sm text-gray-700">
                {plan.plan7d.slice(0, 3).map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
                {plan.plan7d.length > 3 && (
                  <li className="text-blue-600 font-medium">
                    +{plan.plan7d.length - 3} more steps...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <button
            onClick={handleSavePlan}
            disabled={isSaving}
            className="w-full bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Plan'}
          </button>

          <button
            onClick={onViewBundles}
            className="w-full bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl text-lg border-2 border-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            See Bundles
          </button>

          <button
            onClick={handleSetReminder}
            disabled={isReminderSet}
            className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReminderSet ? 'Reminder Set!' : 'Set Daily Reminder'}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Your plan will be saved and you can access it anytime
          </p>
        </div>
      </div>
    </div>
  );
};
