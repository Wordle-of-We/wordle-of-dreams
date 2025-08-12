// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopModesOpen, setIsDesktopModesOpen] = useState(false);
  const [isMobileModesOpen, setIsMobileModesOpen] = useState(false);

  const closeModesTimer = useRef<number | null>(null);

  // ESC fecha tudo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setIsDesktopModesOpen(false);
    setIsMobileModesOpen(false);
  };

  // Hover suave para "Modos de Jogo" no desktop
  const openDesktopModes = () => {
    if (closeModesTimer.current) window.clearTimeout(closeModesTimer.current);
    closeModesTimer.current = null;
    setIsDesktopModesOpen(true);
  };
  const scheduleCloseDesktopModes = () => {
    if (closeModesTimer.current) window.clearTimeout(closeModesTimer.current);
    closeModesTimer.current = window.setTimeout(() => setIsDesktopModesOpen(false), 120);
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-gray-50/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Altura fixa em todas as telas */}
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={closeAll}
            aria-label="Ir para a página inicial"
          >
            {/* Logo com largura responsiva (maior no mobile, como você pediu) */}
            <Image
              src="/WordleLogo.svg"
              alt="Wordle of Dreams"
              width={200}
              height={50}
              className="w-36 sm:w-40 md:w-48 lg:w-56 h-auto"
              sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/about"
              onClick={closeAll}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              Sobre
            </Link>

            {/* Modos de Jogo (desktop) */}
            <div
              className="relative"
              onMouseEnter={openDesktopModes}
              onMouseLeave={scheduleCloseDesktopModes}
            >
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 inline-flex items-center gap-1"
                aria-haspopup="menu"
                aria-expanded={isDesktopModesOpen}
                onFocus={openDesktopModes}
                onBlur={scheduleCloseDesktopModes}
              >
                Modos de Jogo
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                role="menu"
                className={`absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-150
                ${isDesktopModesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
              >
                <Link href="/classicMode" onClick={closeAll} role="menuitem" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Clássico
                </Link>
                <Link href="/emojiMode" onClick={closeAll} role="menuitem" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Emoji
                </Link>
                <Link href="/descriptionMode" onClick={closeAll} role="menuitem" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Descrição
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile: botão hambúrguer */}
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Abrir menu"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(v => !v)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                // Ícone X
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                // Ícone hambúrguer
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop (mobile) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden"
          onClick={closeAll}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu panel — alinhado ao h-16 */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-16 inset-x-0 origin-top overflow-hidden transition-[max-height,opacity] duration-200
        ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="mx-4 my-2 rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="p-2">
            <Link
              href="/about"
              onClick={closeAll}
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Sobre
            </Link>

            {/* Accordion: Modos de Jogo (mobile) */}
            <button
              type="button"
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
              aria-expanded={isMobileModesOpen}
              onClick={() => setIsMobileModesOpen(v => !v)}
            >
              <span>Modos de Jogo</span>
              <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-transform ${isMobileModesOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ${isMobileModesOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <Link href="/classicMode" onClick={closeAll} className="block ml-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  Clássico
                </Link>
                <Link href="/emojiMode" onClick={closeAll} className="block ml-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  Emoji
                </Link>
                <Link href="/descriptionMode" onClick={closeAll} className="block ml-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  Descrição
                </Link>
              </div>
            </div>

            <div className="p-2">
              <button
                type="button"
                className="w-full mt-2 px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
                onClick={closeAll}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
