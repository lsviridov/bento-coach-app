# Onboarding Sleep Quiz Feature

A comprehensive onboarding quiz that assesses users' sleep and nutrition habits to provide personalized recommendations.

## Features

- **5-question quiz** covering dinner timing, evening habits, stimulants, alcohol, and meal composition
- **Smart scoring system** based on ADAPTO framework (Diet, Activators, Protocols, Timing, Outcomes)
- **Personalized results** with 5 different plan types (R1-R5)
- **Profile mini-form** for additional context
- **Bundle recommendations** based on quiz results
- **Analytics tracking** for key user interactions
- **Supabase integration** for data persistence

## Usage

```tsx
import { OnboardingSleepQuiz } from '@features/onboarding-sleep';

function App() {
  return (
    <div>
      <OnboardingSleepQuiz />
    </div>
  );
}
```

## Quiz Flow

1. **Start Screen** - Introduction and value proposition
2. **Questions 1-5** - One question per screen with progress bar
3. **Profile Form** - Quick profile questions for personalization
4. **Result Screen** - Personalized plan with action buttons
5. **Bundle Shelf** - Recommended products/services

## Question Structure

### Q1: Dinner timing & load
- Options with weights affecting Diet (D) and Timing (T) axes

### Q2: Evening carbs / sugar swings
- Options affecting Diet (D), Protocols (P), and Outcomes (O)

### Q3: Stimulants after 14:00
- Options affecting Activators (A) axis
- Extra toggle for nicotine use

### Q4: Alcohol, hydration, night wake-ups
- Options affecting Protocols (P) and Outcomes (O)

### Q5: Dinner composition & reflux
- Options affecting Diet (D) and Outcomes (O)

## Scoring System

- Each answer contributes weights to different axes
- Top 2 negative axes determine the result type
- 5 result types (R1-R5) with specific recommendations

## Result Types

- **R1**: "Earlier, lighter dinner" - Focus on timing and meal size
- **R2**: "Cut stimulants, add ritual" - Focus on evening routines
- **R3**: "Reflux-safe dinner" - Focus on digestive comfort
- **R4**: "Stable evening glucose" - Focus on blood sugar stability
- **R5**: "Micros for calm sleep" - Focus on micronutrients

## Data Persistence

The feature saves:
- Quiz answers and scoring
- User profile data
- Selected plan
- Analytics events

## Analytics Events

- `onboarding_start`
- `quiz_answered`
- `profile_completed`
- `result_shown`
- `plan_saved`
- `bundle_viewed`
- `bundle_saved`
- `reminder_set`

## Environment Variables

Required Supabase configuration:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

Run the scoring tests:
```bash
npm test -- src/features/onboarding-sleep/__tests__/scoring.test.ts
```

## Customization

- Modify questions in `data/questions.ts`
- Adjust plans in `data/plans.ts`
- Update scoring logic in `data/scoring.ts`
- Customize UI components in `components/`

## Dependencies

- React 18+
- TypeScript
- Zustand (state management)
- Supabase JS
- Tailwind CSS
- Vitest (testing)
