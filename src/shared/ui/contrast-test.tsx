import { SectionCard } from './section-card';

export function ContrastTest() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-display text-ink">Тест контраста</h1>
      
      {/* Тест основных цветов */}
      <SectionCard>
        <div className="p-4">
          <h2 className="text-xl font-medium text-ink mb-3">Основные цвета</h2>
          <div className="space-y-2">
            <p className="text-ink">Это основной текст (text-ink) - должен быть темным и читаемым</p>
            <p className="text-muted">Это muted текст (text-muted) - должен быть серым, но читаемым</p>
            <p className="text-brand">Это brand текст (text-brand) - должен быть брендовым</p>
            <p className="text-accent">Это accent текст (text-accent) - должен быть оранжевым</p>
          </div>
        </div>
      </SectionCard>

      {/* Тест бейджей */}
      <SectionCard>
        <div className="p-4">
          <h2 className="text-xl font-medium text-ink mb-3">Бейджи</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-50 text-ink" style={{ color: 'var(--ink)' }}>
              Brand 50 фон
            </span>
            <span className="px-3 py-1 rounded-full bg-accent/15 text-ink" style={{ color: 'var(--ink)' }}>
              Accent 15% фон
            </span>
            <span className="px-3 py-1 rounded-full bg-success/15 text-ink" style={{ color: 'var(--ink)' }}>
              Success 15% фон
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Тест карточек */}
      <SectionCard variant="elevated" glow>
        <div className="p-4">
          <h2 className="text-xl font-medium text-ink mb-3">Карточка с тенью</h2>
          <p className="text-muted">Эта карточка имеет тень и свечение</p>
          <div className="mt-3 text-2xl font-bold text-ink">1850</div>
          <div className="text-sm text-muted">ккал</div>
        </div>
      </SectionCard>

      {/* Тест иконок */}
      <SectionCard>
        <div className="p-4">
          <h2 className="text-xl font-medium text-ink mb-3">Иконки</h2>
          <div className="flex items-center gap-4">
            <span className="text-brand">🔥 Brand иконка</span>
            <span className="text-accent">💧 Accent иконка</span>
            <span className="text-muted">⏰ Muted иконка</span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
