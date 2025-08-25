# Bento Coach

AI-powered nutrition coaching PWA built with React, Vite, and modern web technologies.

## Features

- 📱 **Progressive Web App** - Installable on mobile and desktop
- 🤖 **AI Coach** - Personalized nutrition advice and meal planning
- 📸 **Photo Analysis** - Analyze food photos for nutritional information
- 📊 **Smart Tracking** - Monitor daily nutrition goals and progress
- 🛒 **Shop Integration** - Discover and purchase recommended products
- 🌙 **Dark/Light Theme** - Beautiful, accessible design system

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand + React Query
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI Integration**: OpenAI API for nutrition coaching
- **PWA**: Service Worker + Workbox for offline support
- **Testing**: Vitest + Playwright + Storybook

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lsviridov/bento-coach-app.git
cd bento-coach-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration

# A2HS Blocker Configuration (optional)
VITE_FORCE_A2HS=1  # Force PWA installation prompt (default: enabled)
```

4. Start development server:
```bash
pnpm dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm storybook` - Launch Storybook
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking

### Project Structure

```
src/
├── components/     # Reusable UI components
├── entities/       # Business entities (user, meal, product)
├── features/       # Feature modules (analyze-photo, coach-chat)
├── pages/          # Page components
├── shared/         # Shared utilities, hooks, and API
├── widgets/        # Complex UI widgets
└── main.tsx        # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ by the Bento Coach team