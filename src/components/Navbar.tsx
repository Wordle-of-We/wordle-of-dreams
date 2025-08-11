import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-50 shadow z-50 py-4 px-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-gray-800 tracking-tight hover:scale-105 transition-transform">
          <Image 
          src="/WordleLogo.svg" 
          alt="Wordle of Dreams Logo" 
          className="h-10 w-60"
          width={400}
          height={400}
          />
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/sobre" className="text-gray-700 hover:text-gray-500 font-medium px-3 py-1 rounded transition-colors">
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
      </div>
    </nav>
  );
}