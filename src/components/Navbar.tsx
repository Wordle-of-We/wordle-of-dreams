// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const openMenu = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 150); // pequeno delay
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-50 shadow z-50 py-4 px-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 tracking-tight hover:scale-105 transition-transform"
        >
          Wordle of Dreams
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-6">
          <Link
            href="/game"
            className="text-gray-700 hover:text-gray-500 font-medium px-3 py-1 rounded transition-colors"
          >
            Jogar
          </Link>

          <Link
            href="/sobre"
            className="text-gray-700 hover:text-gray-500 font-medium px-3 py-1 rounded transition-colors"
          >
            Sobre
          </Link>

          {/* Dropdown com hover “seguro” */}
          <div
            className="relative"
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
          >
            <button
              className="text-gray-700 hover:text-gray-500 font-medium px-3 py-1 rounded transition-colors focus:outline-none flex items-center"
              aria-haspopup="menu"
              aria-expanded={open}
              onFocus={openMenu}
              onBlur={scheduleClose}
            >
              Modos de Jogo
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-150 ${
                open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
              }`}
              role="menu"
            >
              <Link href="/classicMode" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" role="menuitem">
                Clássico
              </Link>
              <Link href="/emojiMode" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" role="menuitem">
                Emoji
              </Link>
              <Link href="/descriptionMode" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" role="menuitem">
                Descrição
              </Link>
              <Link href="/game/imagem" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" role="menuitem">
                Imagem
              </Link>
            </div>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
