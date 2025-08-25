'use client';
import { useEffect, useRef } from 'react';
// Иконки созданы с нуля для точного соответствия iOS интерфейсу
import { useA2HS } from './useA2HS';

// Кастомные векторные иконки для iOS интерфейса
const ShareIcon = () => (
  <svg className="inline w-4 h-4" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Коробочка с разрывом сверху */}
    <path d="M4 10L8 8L12 10L16 8L20 10V22H4V10Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    {/* Стрелочка вверх с острым треугольным кончиком */}
    <path d="M12 0L12 8M8 5L12 1L16 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="butt" strokeLinejoin="miter"/>
  </svg>
);

const HomeScreenIcon = () => (
  <svg className="inline w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Квадратик */}
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    {/* Плюс по центру */}
    <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

export function InstallBlocker() {
  const { shouldBlock, platform, inApp, supportsPrompt, promptInstall, setInstalled } = useA2HS(true);
  const modalRef = useRef<HTMLDivElement|null>(null);

  // Блокируем взаимодействие с остальным UI
  useEffect(() => {
    const root = document.getElementById('root');
    if (shouldBlock) {
      document.body.classList.add('overflow-hidden');
      root?.setAttribute('aria-hidden','true');
      root?.setAttribute('inert', '');
      // фокус внутрь модалки
      setTimeout(() => modalRef.current?.focus(), 0);
    } else {
      document.body.classList.remove('overflow-hidden');
      root?.removeAttribute('aria-hidden');
      root?.removeAttribute('inert');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      root?.removeAttribute('aria-hidden');
      root?.removeAttribute('inert');
    };
  }, [shouldBlock]);

  if (!shouldBlock) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Установка приложения"
      tabIndex={-1}
      ref={modalRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-between backdrop-blur-xl bg-black/80 text-white"
      onKeyDown={(e) => {
        // примитивный focus trap
        if (e.key === 'Tab') { e.preventDefault(); }
      }}
    >
      <main className="w-full max-w-sm grow px-6 py-4 flex flex-col justify-center">
        {/* Заголовок и подзаголовок */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-white">Установи ADAPTO на домашний экран</h1>
          <p className="mt-2 text-sm text-white/80">Так приложение работает офлайн, быстрее стартует и получает пуш-уведомления.</p>
        </div>
        {inApp && (
          <div className="mb-4 rounded-2xl border border-white/15 bg-white/5 p-3 text-white/85">
            Вы открыли ссылку во встроенном браузере. Пожалуйста, откройте в {platform === 'ios' ? 'Safari' : 'Chrome'}, чтобы установить.
            <div className="mt-3 flex gap-2">
              <button className="rounded-full bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
                onClick={() => navigator.clipboard.writeText(location.href)}>Скопировать ссылку</button>
            </div>
          </div>
        )}

        {platform === 'android' && (
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-white/90">
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              <li>Нажмите кнопку «Установить».</li>
              <li>Подтвердите во всплывающем окне.</li>
            </ol>
            <button
              className="mt-4 w-full rounded-full bg-white px-4 py-3 text-[var(--brand,#0a84ff)] font-medium"
              onClick={() => promptInstall()}
            >
              Установить
            </button>
            {!supportsPrompt && (
              <p className="mt-2 text-xs text-white/70">Если кнопка не сработала — обновите страницу или откройте сайт в Chrome.</p>
            )}
          </div>
        )}

        {platform === 'ios' && (
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-white/90">
            <ol className="list-decimal space-y-3 pl-5 text-sm">
              <li className="flex items-center gap-2">
                Нажмите <ShareIcon /> <b>Поделиться</b>
              </li>
              <li className="flex items-center gap-2">
                Выберите <HomeScreenIcon /> <b>На экран «Домой»</b>
              </li>
            </ol>
            <p className="mt-3 text-xs text-white/70">После установки запустите приложение с ярлыка — блокировка исчезнет.</p>
          </div>
        )}

        {platform === 'other' && (
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-white/90">
            <p className="text-sm">Откройте сайт на смартфоне в Safari или Chrome, чтобы установить на домашний экран.</p>
          </div>
        )}
      </main>

      <footer className="w-full max-w-sm px-6 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] text-center text-xs text-white/60">
        Dev-обход: добавьте к URL <code>?dev-bypass=1</code>
      </footer>
    </div>
  );
}
