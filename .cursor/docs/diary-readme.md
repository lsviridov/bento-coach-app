# Diary Page Implementation

## Overview

The `/diary` page is a fully functional mobile-first diary application that allows users to track their daily nutrition intake. It follows the ADAPTO project architecture with FSD (Feature-Sliced Design) principles.

## Features

- **Day Navigation**: Navigate between days with arrow buttons and date display
- **Daily Totals**: View calories, water intake, and macronutrients (protein, fat, carbs)
- **Meal Management**: Add, edit, and delete meals with full CRUD operations
- **Responsive Design**: Mobile-first design optimized for 375-430px viewports
- **Offline Support**: Graceful offline handling with cached data
- **MSW Integration**: Mock API for development and testing

## Architecture

### FSD Structure

```
src/
  entities/meal/
    model/
      schemas.ts      # Zod schemas for Meal and DaySummary
      api.ts         # API functions for CRUD operations
    ui/
      MealCard.tsx   # Individual meal display component
    index.ts         # Public exports
  features/add-meal/
    model/
      useAddMeal.ts  # React Query mutations hook
    ui/
      AddMealModal.tsx  # Modal for adding/editing meals
      AddMealFab.tsx    # Floating action button
    index.ts         # Public exports
  widgets/
    day-switcher/
      ui/DaySwitcher.tsx  # Date navigation component
    day-totals/
      ui/DayTotals.tsx    # Nutrition totals display
  shared/
    api/
      fetcher.ts     # HTTP client with timeout
      msw/           # Mock Service Worker handlers
    hooks/
      useToday.ts    # Current date hook
      useOfflineFlag.ts  # Offline detection hook
```

### Data Flow

1. **Page Load**: `Diary.tsx` initializes with current date
2. **Data Fetching**: React Query fetches day data via `fetchDay()`
3. **State Management**: Local state for modal, editing, and date selection
4. **Mutations**: `useAddMeal` hook handles create/update/delete operations
5. **Cache Invalidation**: React Query automatically updates UI after mutations

## Components

### MealCard

Displays individual meal information with:
- Optional photo thumbnail
- Title, grams, and calories
- Macronutrient breakdown (protein, fat, carbs)
- Edit and delete actions
- Responsive layout with proper touch targets

### DaySwitcher

Navigation component with:
- Previous/next day buttons
- Current date display (Today, Yesterday, Tomorrow, or formatted date)
- Russian locale support for date formatting

### DayTotals

Nutrition summary grid showing:
- Calories and water (large cards)
- Protein, fat, carbs (smaller cards)
- Uses ADAPTO color tokens for consistent theming

### AddMealModal

Form modal for meal creation/editing:
- Input validation with Zod schemas
- Auto-calculation of calories from macros
- Slider for grams selection
- Optional photo URL input

## API Integration

### MSW Handlers

Mock Service Worker provides deterministic fake data:

- `GET /api/diary?date=YYYY-MM-DD` - Fetch day summary
- `POST /api/meals` - Create new meal
- `PUT /api/meals/:id` - Update existing meal
- `DELETE /api/meals/:id` - Delete meal

### Data Contracts

```typescript
// Meal schema
export const Meal = z.object({
  id: z.string().uuid(),
  takenAt: z.string().datetime(),
  title: z.string().min(1),
  grams: z.number().int().positive(),
  calories: z.number().int().nonnegative(),
  protein_g: z.number().nonnegative(),
  fat_g: z.number().nonnegative(),
  carbs_g: z.number().nonnegative(),
  photoUrl: z.string().url().optional()
});

// Day summary schema
export const DaySummary = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  totals: z.object({
    water_ml: z.number().int().nonnegative(),
    calories: z.number().int().nonnegative(),
    protein_g: z.number().nonnegative(),
    fat_g: z.number().nonnegative(),
    carbs_g: z.number().nonnegative()
  }),
  meals: z.array(Meal)
});
```

## State Management

### React Query

- **Query Key**: `['day', dateISO]` for day data
- **Stale Time**: 30 seconds for optimal UX
- **Cache Invalidation**: Automatic after mutations
- **Offline Handling**: Disabled queries when offline

### Local State

- **Modal State**: `isModalOpen` and `editingMeal`
- **Date Selection**: `selectedDate` synchronized with URL
- **Form State**: Managed by `react-hook-form` with Zod validation

## Offline Support

### Implementation

- **Detection**: `useOfflineFlag` hook monitors network status
- **Caching**: React Query provides automatic caching
- **UI Feedback**: Offline badge shows when disconnected
- **Graceful Degradation**: Forms and interactions work offline

### Future Enhancements

- Background sync for offline operations
- Persistent offline queue
- Conflict resolution strategies

## Testing

### Unit Tests

- **Schemas**: Zod validation tests for Meal and DaySummary
- **API**: Mocked API function tests
- **Hooks**: Custom hook behavior tests

### E2E Tests

Playwright tests cover:
- Page navigation and day switching
- Meal CRUD operations
- Offline mode handling
- Responsive design validation

### Storybook

Component stories for:
- MealCard (default, with photo, long title)
- DayTotals (various nutrition values)
- DaySwitcher (different date states)
- AddMealModal (add/edit modes)

## Performance

### Optimizations

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Lazy loading for meal photos
- **Bundle Size**: Tree-shaking and dynamic imports
- **Caching**: React Query with appropriate stale times

### Metrics

- **Initial JS**: Target ≤230KB gzipped
- **LCP**: Target ≤2.5s on 4G
- **INP**: Target ≤200ms

## Accessibility

### WCAG AA+ Compliance

- **Focus Management**: Visible focus indicators
- **Touch Targets**: Minimum 44×44px for mobile
- **Screen Reader**: Proper ARIA labels and descriptions
- **Color Contrast**: Meets AA standards with ADAPTO tokens
- **Keyboard Navigation**: Full keyboard support

### ARIA Implementation

- Modal dialogs with proper roles
- Form labels and error messages
- Action buttons with descriptive text
- Status announcements for dynamic content

## Local Development

### Setup

1. **Environment Variables**:
   ```bash
   VITE_ENV=dev
   VITE_SITE_URL=http://localhost:5173
   VITE_API_BASE_URL=http://localhost:5173
   VITE_USE_MSW=1
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Start Development Server**:
   ```bash
   pnpm dev
   ```

4. **Open Diary Page**:
   Navigate to `http://localhost:5173/diary`

### MSW Configuration

- **Development Only**: Automatically enabled when `VITE_USE_MSW=1`
- **Deterministic Data**: Same data for same dates
- **CRUD Operations**: Full mock API with in-memory store
- **Easy Disabling**: Set `VITE_USE_MSW=0` to disable

### Testing Commands

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Storybook
pnpm storybook

# Build Storybook
pnpm build-storybook
```

## Deployment

### Build Process

1. **Production Build**: `pnpm build`
2. **Environment**: Set `VITE_USE_MSW=0` for production
3. **API Endpoints**: Configure real backend URLs
4. **PWA**: Service worker and manifest included

### Environment Variables

- **Development**: MSW enabled, local API
- **Staging**: Real API endpoints, MSW disabled
- **Production**: Production API, MSW disabled

## Future Enhancements

### Planned Features

- **Photo Upload**: Direct image capture and upload
- **Barcode Scanning**: Product lookup via camera
- **Meal Templates**: Quick-add common meals
- **Nutrition Goals**: Daily targets and progress
- **Social Features**: Sharing and community

### Technical Improvements

- **Real-time Updates**: WebSocket integration
- **Advanced Caching**: Service worker strategies
- **Analytics**: User behavior tracking
- **A/B Testing**: Feature flag system

## Troubleshooting

### Common Issues

1. **MSW Not Working**: Check `VITE_USE_MSW=1` in `.env.local`
2. **Type Errors**: Ensure all imports use slice root exports
3. **Build Failures**: Verify all dependencies are installed
4. **Test Failures**: Check MSW mocking in test environment

### Debug Mode

- **Console Logs**: MSW startup and API calls
- **Network Tab**: Mock requests and responses
- **React DevTools**: Component state inspection
- **Playwright**: Visual test debugging

## Contributing

### Development Guidelines

- **FSD Compliance**: No deep imports, use slice roots
- **Type Safety**: Full TypeScript with strict mode
- **Testing**: Unit tests for logic, E2E for flows
- **Accessibility**: WCAG AA+ compliance required
- **Performance**: Bundle size and Core Web Vitals

### Code Review Checklist

- [ ] FSD layers respected
- [ ] No deep imports
- [ ] Zod validation for all I/O
- [ ] Loading/error/empty states implemented
- [ ] Accessibility requirements met
- [ ] Tests added/updated
- [ ] Performance impact assessed
