import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-50 shadow z-50 py-4 px-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Wordle of Dreams
        </Link>
        <div className="space-x-4">
          <Link href="/game" className="text-gray-700 hover:text-gray-500">
            Jogar
          </Link>
          <Link href="/sobre" className="text-gray-700 hover:text-gray-500">
            Sobre
          </Link>
        </div>
      </div>
    </nav>
  );
}