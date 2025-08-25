# Environment Variables Template

Create a `.env.local` file in the project root with the following variables:

```bash
# Environment variables for local development
VITE_ENV=dev
VITE_SITE_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5173
VITE_USE_MSW=1
```

## Variables Explained

- `VITE_ENV`: Environment name (dev, staging, prod)
- `VITE_SITE_URL`: Base URL for the application
- `VITE_API_BASE_URL`: Base URL for API calls (MSW will intercept these)
- `VITE_USE_MSW`: Enable MSW mocking (1 = enabled, 0 = disabled)

## MSW Setup

When `VITE_USE_MSW=1`, the application will use MSW to mock API calls to:
- `GET /api/diary?date=YYYY-MM-DD`
- `POST /api/meals`
- `PUT /api/meals/:id`
- `DELETE /api/meals/:id`

This provides deterministic fake data for development and testing.
