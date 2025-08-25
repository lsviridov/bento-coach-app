'use client';
import { useEffect, useRef } from 'react';
import { useA2HS } from './useA2HS';

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
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[color:var(--bg,#0b0b0c)] text-[color:var(--ink,#14151a)]"
      onKeyDown={(e) => {
        // примитивный focus trap
        if (e.key === 'Tab') { e.preventDefault(); }
      }}
    >
      <header className="w-full max-w-sm px-6 pt-10 text-center">
        <h1 className="text-xl font-semibold text-white">Установи ADAPTO на домашний экран</h1>
        <p className="mt-2 text-sm text-white/80">Так приложение работает офлайн, быстрее стартует и получает пуш-уведомления.</p>
      </header>

      <main className="w-full max-w-sm grow px-6 py-4">
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
            <p className="text-sm">Откройте в Safari → нажмите <b>Поделиться</b> → <b>На экран «Домой»</b> → <b>Добавить</b>.</p>
            <p className="mt-2 text-xs text-white/70">После установки запустите приложение с ярлыка — блокировка исчезнет.</p>
            <button
              className="mt-4 w-full rounded-full bg-white/10 px-4 py-3 text-white"
              onClick={() => {
                // если пользователь уже поставил и вернулся через тот же таб: позволяем снять блокировку вручную
                if (confirm('Я уже установил и открыл с ярлыка')) {
                  localStorage.setItem('a2hs-installed','1');
                  setInstalled(true);
                }
              }}
            >
              Я установил(а)
            </button>
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
