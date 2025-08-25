import React, { useState } from 'react';
import type { ProfileDraft } from '../data/types';

interface ProfileMiniFormProps {
  onComplete: (profile: ProfileDraft) => void;
}

export const ProfileMiniForm: React.FC<ProfileMiniFormProps> = ({ onComplete }) => {
  const [profile, setProfile] = useState<ProfileDraft>({
    last_meal_time: '19:00',
    dinner_heaviness: 'moderate',
    evening_sweets_freq: 'sometimes',
    caffeine_after_14: 'sometimes',
    nicotine_evening: false,
    alcohol_evening: 'rarely',
    late_hydration: false,
    nocturia: false,
    reflux_flag: false,
    veg_fiber_low: false,
    micros_gap_hint: false
  });

  const handleChange = (field: keyof ProfileDraft, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Быстрый профиль
          </h2>
          <p className="text-gray-600">
            Помогите нам персонализировать ваш план сна
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Last meal time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              В какое время вы обычно ужинаете?
            </label>
            <input
              type="time"
              value={profile.last_meal_time}
              onChange={(e) => handleChange('last_meal_time', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Dinner heaviness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Насколько тяжелый ваш типичный ужин?
            </label>
            <select
              value={profile.dinner_heaviness}
              onChange={(e) => handleChange('dinner_heaviness', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="light">Легкий (суп, салат, небольшая порция)</option>
              <option value="moderate">Умеренный (сбалансированная еда)</option>
              <option value="heavy">Тяжелый (большая порция, богатая пища)</option>
            </select>
          </div>

          {/* Evening sweets frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Как часто вы едите сладости вечером?
            </label>
            <select
              value={profile.evening_sweets_freq}
              onChange={(e) => handleChange('evening_sweets_freq', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="never">Никогда</option>
              <option value="rarely">Редко (1-2 раза в неделю)</option>
              <option value="sometimes">Иногда (3-4 раза в неделю)</option>
              <option value="often">Часто (5+ раз в неделю)</option>
            </select>
          </div>

          {/* Caffeine after 14:00 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Как часто вы потребляете кофеин после 14:00?
            </label>
            <select
              value={profile.caffeine_after_14}
              onChange={(e) => handleChange('caffeine_after_14', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="never">Никогда</option>
              <option value="rarely">Редко (1-2 раза в неделю)</option>
              <option value="sometimes">Иногда (3-4 раза в неделю)</option>
              <option value="daily">Ежедневно</option>
            </select>
          </div>

          {/* Alcohol evening */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Как часто вы пьете алкоголь вечером?
            </label>
            <select
              value={profile.alcohol_evening}
              onChange={(e) => handleChange('alcohol_evening', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="never">Никогда</option>
              <option value="rarely">Редко (1-2 раза в месяц)</option>
              <option value="sometimes">Иногда (1-2 раза в неделю)</option>
              <option value="often">Часто (3+ раза в неделю)</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.nicotine_evening}
                onChange={(e) => handleChange('nicotine_evening', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Я использую никотиновые продукты вечером</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.late_hydration}
                onChange={(e) => handleChange('late_hydration', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Я пью много воды поздно днем</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.nocturia}
                onChange={(e) => handleChange('nocturia', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Я просыпаюсь ночью, чтобы сходить в туалет</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.reflux_flag}
                onChange={(e) => handleChange('reflux_flag', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Я испытываю изжогу или кислотный рефлюкс</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.veg_fiber_low}
                onChange={(e) => handleChange('veg_fiber_low', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Я ем мало овощей и продуктов с низким содержанием клетчатки</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.micros_gap_hint}
                onChange={(e) => handleChange('micros_gap_hint', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Я подозреваю, что у меня есть недостаток микронутриентов</span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Сохранить и продолжить
          </button>
        </form>
      </div>
    </div>
  );
};
