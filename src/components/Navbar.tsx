// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGameModeDropdownOpen, setIsGameModeDropdownOpen] = useState(false);
  const { user, logout } = useAuth(); // vem do UserAuthProvider no layout público

  // Dropdown "Modos de Jogo"
  const [openModes, setOpenModes] = useState(false);
  const closeTimerModes = useRef<number | null>(null);
  const openModesMenu = () => {
    if (closeTimerModes.current) window.clearTimeout(closeTimerModes.current);
    closeTimerModes.current = null;
    setOpenModes(true);
  };
  const scheduleCloseModes = () => {
    if (closeTimerModes.current) window.clearTimeout(closeTimerModes.current);
    closeTimerModes.current = window.setTimeout(() => setOpenModes(false), 150);
  };

  // Dropdown "Usuário"
  const [openUser, setOpenUser] = useState(false);
  const closeTimerUser = useRef<number | null>(null);
  const openUserMenu = () => {
    if (closeTimerUser.current) window.clearTimeout(closeTimerUser.current);
    closeTimerUser.current = null;
    setOpenUser(true);
  };
  const scheduleCloseUser = () => {
    if (closeTimerUser.current) window.clearTimeout(closeTimerUser.current);
    closeTimerUser.current = window.setTimeout(() => setOpenUser(false), 150);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsGameModeDropdownOpen(false);
  };

  // Fallbacks visuais
  const displayName =
    ((user as any)?.username as string) ||
    user?.email?.split('@')[0] ||
    'Você';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleGameModeDropdown = () => {
    setIsGameModeDropdownOpen(!isGameModeDropdownOpen);
  };

  const avatarUrl =
    ((user as any)?.avatarIconUrl as string) ||
    `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-50 shadow z-50 py-4 px-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-gray-800 tracking-tight hover:scale-105 transition-transform" onClick={closeMobileMenu}>
          <Image
            src="/WordleLogo.svg"
            alt="Wordle of Dreams Logo"
            className="h-8 w-48 sm:h-10 sm:w-60"
            width={400}
            height={400}
          />
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-6">
          <Link
            href="/about"
            className="text-gray-700 hover:text-gray-500 font-medium px-3 py-1 rounded transition-colors"
          >
            Sobre
          </Link>

          {/* Dropdown: Modos de Jogo */}
          <div
            className="relative"
            onMouseEnter={openModesMenu}
            onMouseLeave={scheduleCloseModes}
          >
            <button
              className="text-gray-700 hover:text-gray-500 font-medium px-3 py-1 rounded transition-colors focus:outline-none flex items-center"
              aria-haspopup="menu"
              aria-expanded={openModes}
              onFocus={openModesMenu}
              onBlur={scheduleCloseModes}
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
                openModes
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-1 pointer-events-none'
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
            </div>
          </div>

          {/* Área de usuário */}
          {!user ? (
            <Link
              href="/login"
              className="inline-flex items-center border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Login
            </Link>
          ) : (
            <div
              className="relative"
              onMouseEnter={openUserMenu}
              onMouseLeave={scheduleCloseUser}
            >
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
                aria-haspopup="menu"
                aria-expanded={openUser}
                onFocus={openUserMenu}
                onBlur={scheduleCloseUser}
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                />
                <span className="hidden sm:inline text-gray-700 font-medium">
                  {displayName}
                </span>
                <svg
                  className="ml-1 w-4 h-4 text-gray-600"
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
                className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-150 ${
                  openUser
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-1 pointer-events-none'
                }`}
                role="menu"
              >

                {(user as any)?.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Painel Admin
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
