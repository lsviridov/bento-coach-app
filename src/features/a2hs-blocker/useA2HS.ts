'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { BeforeInstallPromptEvent } from './types';

type Platform = 'ios'|'android'|'other';

export function useA2HS(force = true) {
  const [installed, setInstalled] = useState(false);
  const [platform, setPlatform] = useState<Platform>('other');
  const [inApp, setInApp] = useState(false);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'other');

    // in-app браузеры (не дают A2HS)
    setInApp(/instagram|fbav|line\//.test(ua) || !!window.TelegramWebviewProxy);

    // уже установлено?
    const standalone = matchMedia('(display-mode: standalone)').matches
      || !!navigator.standalone;
    const ls = localStorage.getItem('a2hs-installed') === '1';
    if (standalone || ls) setInstalled(true);

    // Android: перехват системного промпта
    const onBI = (e: BeforeInstallPromptEvent) => { e.preventDefault(); deferredRef.current = e; };
    const onInstalled = () => {
      localStorage.setItem('a2hs-installed','1');
      setInstalled(true);
    };
    window.addEventListener('beforeinstallprompt', onBI);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBI);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const supportsPrompt = !!deferredRef.current;

  const promptInstall = async () => {
    const evt = deferredRef.current;
    if (!evt) return { outcome: 'unsupported' };
    evt.prompt();
    const choice = await evt.userChoice; // { outcome: 'accepted' | 'dismissed' }
    if (choice?.outcome === 'accepted') {
      // На некоторых девайсах событие appinstalled не приходит мгновенно
      setTimeout(() => setInstalled(true), 10_000);
    }
    return choice;
  };

  const shouldBlock = useMemo(() => {
    const forceFlag = import.meta.env.VITE_FORCE_A2HS !== '0';
    const bypass = new URLSearchParams(location.search).has('dev-bypass');
    return force && forceFlag && !installed && !bypass;
  }, [installed, force]);

  return { shouldBlock, platform, inApp, supportsPrompt, promptInstall, setInstalled };
}
