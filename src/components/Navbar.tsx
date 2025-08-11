'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGameModeDropdownOpen, setIsGameModeDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsGameModeDropdownOpen(false);
  };

  const toggleGameModeDropdown = () => {
    setIsGameModeDropdownOpen(!isGameModeDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50 py-4 px-4 sm:px-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800 tracking-tight hover:scale-105 transition-transform" onClick={closeMobileMenu}>
          <Image
            src="/WordleLogo.svg"
            alt="Wordle of Dreams Logo"
            className="h-8 w-48 sm:h-10 sm:w-60"
            width={400}
            height={400}
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="text-gray-700 hover:text-gray-500 font-medium px-3 py-1 rounded transition-colors">
            Sobre
          </Link>
          <div className="relative group">
            <button className="text-gray-700 hover:text-gray-500 font-medium px-3 py-1 rounded transition-colors focus:outline-none">
              Modos de Jogo
              <svg className="inline ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
              <Link href="/classicMode" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Clássico
              </Link>
              <Link href="/emojiMode" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Emoji
              </Link>
              <Link href="/descriptionMode" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Descrição
              </Link>
              <Link href="/game/imagem" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Imagem
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
          onClick={toggleMobileMenu}
          aria-expanded="false"
        >
          <span className="sr-only">Abrir menu principal</span>
          {!isMobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-700 hover:text-gray-500 hover:bg-gray-100 rounded-md font-medium"
              onClick={closeMobileMenu}
            >
              Sobre
            </Link>

            {/* Mobile Game Modes Dropdown */}
            <div>
              <button
                className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:text-gray-500 hover:bg-gray-100 rounded-md font-medium focus:outline-none"
                onClick={toggleGameModeDropdown}
              >
                Modos de Jogo
                <svg
                  className={`w-4 h-4 transition-transform ${isGameModeDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isGameModeDropdownOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    href="/classicMode"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-500 hover:bg-gray-50 rounded-md"
                    onClick={closeMobileMenu}
                  >
                    Clássico
                  </Link>
                  <Link
                    href="/emojiMode"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-500 hover:bg-gray-50 rounded-md"
                    onClick={closeMobileMenu}
                  >
                    Emoji
                  </Link>
                  <Link
                    href="/descriptionMode"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-500 hover:bg-gray-50 rounded-md"
                    onClick={closeMobileMenu}
                  >
                    Descrição
                  </Link>
                  <Link
                    href="/game/imagem"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-500 hover:bg-gray-50 rounded-md"
                    onClick={closeMobileMenu}
                  >
                    Imagem
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}