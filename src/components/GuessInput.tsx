'use client';

import { useEffect, useState, useRef } from 'react';
import { getAllCharacters } from '@/services/characters';
import { Search, Send } from 'lucide-react';

interface Character {
  id: number;
  name: string;
}

export default function GuessInput({
  onSelect,
}: {
  onSelect: (name: string) => void;
}) {
  const [input, setInput] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filtered, setFiltered] = useState<Character[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Buscar todos os personagens uma vez
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await getAllCharacters();
        setCharacters(res.map((char: any) => ({
          ...char,
          id: Number(char.id),
        })));
      } catch (err) {
        console.error('[GuessInput] Erro ao buscar personagens:', err);
      }
    };

    fetchCharacters();
  }, []);

  // Filtrar conforme o input
  useEffect(() => {
    const query = input.trim().toLowerCase();
    if (!query) {
      setFiltered([]);
      return;
    }
    setFiltered(
      characters.filter((char) =>
        char.name.toLowerCase().includes(query)
      )
    );
    setShowDropdown(true);
  }, [input, characters]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSelect(input.trim());
    setInput('');
    setShowDropdown(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="flex items-center border-2 border-orange-500 rounded overflow-hidden shadow">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite o nome do personagem..."
          onFocus={() => input && setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base"
        />
        <div className="px-2 text-gray-800">
          <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-orange-500 px-3 sm:px-4 py-2 sm:py-3 text-white flex items-center gap-1 hover:brightness-110 text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Enviar</span>
          <Send size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {showDropdown && filtered.length > 0 && (
        <ul className="absolute bg-white border w-full mt-1 rounded shadow z-10 max-h-48 sm:max-h-64 overflow-y-auto">
          {filtered.map((char) => (
            <li
              key={char.id}
              onClick={() => {
                onSelect(char.name);
                setInput('');
                setShowDropdown(false);
              }}
              className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm sm:text-base"
            >
              {char.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
