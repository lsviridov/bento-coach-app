import type { Plan } from './types';

export const plans: Record<string, Plan> = {
  R1: {
    id: 'R1',
    title: 'Earlier, lighter dinner',
    why: 'Late heavy meals + sweets keep brain alert',
    tonight: [
      'Shift dinner ≥3h before bed',
      'If hungry: yogurt/cottage+fruit',
      'Caffeine-free warm drink'
    ],
    plan7d: [
      'Move dinner 1 hour earlier each day',
      'Replace heavy carbs with protein+veg',
      'No sweets after 18:00',
      'Light evening snack: nuts or yogurt',
      'Herbal tea ritual at 21:00',
      'Track sleep quality improvement',
      'Plan next week\'s dinner timing'
    ],
    bundleTags: ['evening-light', 'sugar-stable']
  },
  R2: {
    id: 'R2',
    title: 'Cut stimulants, add ritual',
    why: 'Caffeine/nicotine delay sleep; alcohol fragments sleep',
    tonight: [
      'Caffeine curfew 14:00',
      'Pick 1 ritual at 22:00',
      'No alcohol/spicy at dinner'
    ],
    plan7d: [
      'Gradually reduce caffeine after 14:00',
      'Create evening wind-down routine',
      'Replace energy drinks with herbal alternatives',
      'Limit alcohol to 1 serving max',
      'Practice deep breathing at 22:00',
      'Track sleep onset improvement',
      'Plan caffeine-free alternatives'
    ],
    bundleTags: ['caffeine-free', 'evening-ritual']
  },
  R3: {
    id: 'R3',
    title: 'Reflux-safe dinner',
    why: 'Fatty/spicy ↑reflux → shallow sleep',
    tonight: [
      'Small non-spicy dinner',
      'Last meal ≥3h before bed',
      'Slightly elevate headboard'
    ],
    plan7d: [
      'Avoid spicy/fatty foods at dinner',
      'Eat smaller portions, chew slowly',
      'Stay upright 2-3h after eating',
      'Identify trigger foods to avoid',
      'Practice stress-reduction techniques',
      'Track reflux frequency',
      'Plan gentle dinner options'
    ],
    bundleTags: ['low-reflux', 'gentle-gut']
  },
  R4: {
    id: 'R4',
    title: 'Stable evening glucose',
    why: 'Sugar swings push wakefulness',
    tonight: [
      'No sweets after dinner',
      'Protein+fiber dinner',
      'Small oatmeal 60–90m if cravings'
    ],
    plan7d: [
      'Balance protein with complex carbs',
      'Avoid refined sugars after 17:00',
      'Include healthy fats in dinner',
      'Plan evening snack alternatives',
      'Track energy levels after dinner',
      'Practice mindful eating',
      'Prepare healthy evening options'
    ],
    bundleTags: ['sugar-stable', 'whole-grains']
  },
  R5: {
    id: 'R5',
    title: 'Micros for calm sleep',
    why: 'Low Mg/B6/tryptophan worsens sleep quality',
    tonight: [
      'Protein+greens dinner',
      'Herbal tea',
      'Plan Mg/B6 foods tomorrow'
    ],
    plan7d: [
      'Include leafy greens daily',
      'Add nuts/seeds to meals',
      'Choose whole grains over refined',
      'Include fatty fish 2-3x/week',
      'Track sleep quality changes',
      'Plan magnesium-rich snacks',
      'Consider supplement timing'
    ],
    bundleTags: ['magnesium-rich', 'calm-evening']
  }
};
