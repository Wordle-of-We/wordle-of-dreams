'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllCharacters } from '@/services/characters';
import { Search, Send, ImageOff } from 'lucide-react';

type CharacterOption = {
  id: number;
  name: string;
  imageUrl1?: string | null;
};

export default function GuessInput({
  onSelect,
}: {
  onSelect: (name: string) => void | Promise<void>;
}) {
  const [input, setInput] = useState('');
  const [characters, setCharacters] = useState<CharacterOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Buscar todos os personagens uma vez
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await getAllCharacters();
        setCharacters(
          res.map((char: any) => ({
            id: Number(char.id),
            name: String(char.name ?? ''),
            imageUrl1: char.imageUrl1 ?? null,
          }))
        );
      } catch (err) {
        console.error('[GuessInput] Erro ao buscar personagens:', err);
      }
    };

    fetchCharacters();
  }, []);

  // Lista filtrada (prioriza startsWith, depois includes)
  const filtered = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [] as CharacterOption[];
    const starts = characters.filter((c) =>
      c.name.toLowerCase().startsWith(q)
    );
    const contains = characters.filter(
      (c) => !c.name.toLowerCase().startsWith(q) && c.name.toLowerCase().includes(q)
    );
    return [...starts, ...contains];
  }, [input, characters]);

  // Mostrar/esconder dropdown
  useEffect(() => {
    setShowDropdown(input.trim().length > 0 && filtered.length > 0);
    setHighlightIndex(0); // ao mudar o input, resetar destaque
  }, [input, filtered.length]);

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

  const submitName = async (name: string) => {
    if (!name || submitting) return;
    try {
      setSubmitting(true);
      await onSelect(name);
    } finally {
      setSubmitting(false);
      setInput('');
      setShowDropdown(false);
    }
  };

  const handleSubmit = () => {
    // Enter envia SEMPRE a primeira opção, se existir; senão envia o texto digitado
    const choice = filtered[0]?.name ?? input.trim();
    if (!choice) return;
    submitName(choice);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="flex items-stretch border-2 border-orange-500 rounded overflow-hidden shadow">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite o nome do personagem..."
          onFocus={() => input && setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (!showDropdown) setShowDropdown(true);
              setHighlightIndex((i) =>
                Math.min(i + 1, Math.max(filtered.length - 1, 0))
              );
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setHighlightIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Escape') {
              setShowDropdown(false);
            }
          }}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base"
        />
        <div className="px-2 flex items-center text-gray-800 flex-none">
          <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-orange-500 px-3 sm:px-4 py-2 sm:py-3 text-white flex items-center gap-1 hover:brightness-110 text-sm sm:text-base flex-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Enviar</span>
          <Send className="w-4 h-4 sm:w-4 sm:h-4" />
        </button>
      </div>

      {showDropdown && filtered.length > 0 && (
        <ul
          role="listbox"
          className="absolute bg-white border w-full mt-1 rounded shadow z-10 max-h-56 sm:max-h-72 overflow-y-auto"
        >
          {filtered.map((char, idx) => {
            const isActive = idx === highlightIndex;
            return (
              <li
                key={char.id}
                role="option"
                aria-selected={isActive}
                onMouseDown={(e) => {
                  // mouseDown para não perder o foco antes do click
                  e.preventDefault();
                  submitName(char.name);
                }}
                className={`flex items-center gap-3 px-3 sm:px-4 py-2 cursor-pointer text-sm sm:text-base ${
                  isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center flex-none">
                  {char.imageUrl1 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={char.imageUrl1}
                      alt={char.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <ImageOff className="w-5 h-5 opacity-60" />
                  )}
                </div>
                <span className="truncate">{char.name}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
