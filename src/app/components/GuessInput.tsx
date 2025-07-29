'use client';

import { useEffect, useState, useRef } from 'react';
import { getAllCharacters } from '@/services/characterService';
import { Search, Send } from 'lucide-react';

interface Character {
  id: number;
  name: string;
}

export default function GuessInput({ onSelect }: { onSelect: (name: string) => void }) {
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
        console.log('[GuessInput] Personagens carregados:', res);
        setCharacters(res);
      } catch (err) {
        console.error('[GuessInput] Erro ao buscar personagens:', err);
      }
    };

    fetchCharacters();
  }, []);

  // Filtragem local
  useEffect(() => {
    const query = input.trim().toLowerCase();
    if (query.length === 0) {
      setFiltered([]);
      return;
    }

    const results = characters.filter((char) =>
      char.name.toLowerCase().includes(query)
    );
    console.log('[GuessInput] Filtro aplicado:', results);
    setFiltered(results);
    setShowDropdown(true);
  }, [input, characters]);

  // Fechar dropdown ao clicar fora
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
    console.log('[GuessInput] Enviando palpite:', input);
    if (!input.trim()) {
      console.warn('[GuessInput] Campo vazio, não enviando');
      return;
    }
    onSelect(input.trim());
    setInput('');
    setShowDropdown(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="flex items-center border-2 border-orange-500 rounded overflow-hidden shadow">
        <input
          value={input}
          onChange={(e) => {
            console.log('[GuessInput] Digitando:', e.target.value);
            setInput(e.target.value);
          }}
          placeholder="Digite o nome do personagem..."
          onFocus={() => {
            console.log('[GuessInput] Foco no input');
            if (input) setShowDropdown(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              console.log('[GuessInput] Enter pressionado');
              handleSubmit();
            }
          }}
          className="flex-1 px-4 py-2 outline-none"
        />
        <div className="px-2 text-gray-400">
          <Search size={18} />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-orange-500 px-4 py-2 text-white flex items-center gap-1 hover:brightness-110"
        >
          Enviar <Send size={16} />
        </button>
      </div>

      {showDropdown && filtered.length > 0 && (
        <ul className="absolute bg-white border w-full mt-1 rounded shadow z-10 max-h-64 overflow-y-auto">
          {filtered.map((char) => (
            <li
              key={char.id}
              onClick={() => {
                console.log('[GuessInput] Clicou em:', char.name);
                onSelect(char.name);
                setInput('');
                setShowDropdown(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {char.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
