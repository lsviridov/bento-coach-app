import type { Question } from './types';

export const questions: Question[] = [
  {
    id: 'q1',
    title: 'Dinner timing & load',
    options: [
      {
        id: 'o1',
        label: '≤2h before bed, light (protein+veg)',
        weights: { D: 1 }
      },
      {
        id: 'o2',
        label: '≤2h before bed, heavy/spicy',
        weights: { D: -1, T: -2, O: -1 }
      },
      {
        id: 'o3',
        label: '2–4h before bed, moderate',
        weights: { D: 0, T: 1 }
      },
      {
        id: 'o4',
        label: '>4h; later I snack sweets',
        weights: { D: -1, T: -1, P: -1 }
      }
    ]
  },
  {
    id: 'q2',
    title: 'Evening carbs / sugar swings',
    options: [
      {
        id: 'o1',
        label: 'Sweets/refined snacks',
        weights: { D: -2, P: -1, O: -1 }
      },
      {
        id: 'o2',
        label: 'Fruit/yogurt unsweetened/cottage cheese',
        weights: { D: 1 }
      },
      {
        id: 'o3',
        label: 'Nothing or herbal tea',
        weights: { P: 1 }
      },
      {
        id: 'o4',
        label: 'Grazing every 30–60 min (chips etc.)',
        weights: { D: -2, P: -1 }
      }
    ]
  },
  {
    id: 'q3',
    title: 'Stimulants after 14:00',
    options: [
      {
        id: 'o1',
        label: 'Daily coffee/energy drinks',
        weights: { A: -2 }
      },
      {
        id: 'o2',
        label: 'Sometimes (1–3×/week)',
        weights: { A: -1 }
      },
      {
        id: 'o3',
        label: 'Rarely/never',
        weights: { A: 1 }
      }
    ]
  },
  {
    id: 'q4',
    title: 'Alcohol, hydration, night wake-ups',
    options: [
      {
        id: 'o1',
        label: 'Alcohol 1–2 servings, 3–5×/week',
        weights: { P: -2, O: -1 }
      },
      {
        id: 'o2',
        label: 'Rare/none',
        weights: { P: 1 }
      },
      {
        id: 'o3',
        label: 'Low water day, compensate late',
        weights: { P: -1 }
      },
      {
        id: 'o4',
        label: 'Wake at night to bathroom 1–2×',
        weights: { O: -1 }
      }
    ]
  },
  {
    id: 'q5',
    title: 'Dinner composition & reflux',
    options: [
      {
        id: 'o1',
        label: 'Protein + fiber (veg/whole)',
        weights: { D: 2 }
      },
      {
        id: 'o2',
        label: 'Mostly carbs (pasta/rice/bread)',
        weights: { D: -1 }
      },
      {
        id: 'o3',
        label: 'Fatty/spicy; heartburn sometimes',
        weights: { D: -1, O: -2, T: -1 }
      },
      {
        id: 'o4',
        label: 'Few veg; likely low Mg/B6/tryptophan',
        weights: { D: -1, O: -1 }
      }
    ]
  }
];
