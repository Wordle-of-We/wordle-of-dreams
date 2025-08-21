'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllCharacters } from '@/services/characters';
import { getAttempts } from '@/services/plays';
import { Search, Send, ImageOff, AlertTriangle } from 'lucide-react';

type CharacterOption = {
  id: number;
  name: string;
  imageUrl1?: string | null;
};

type GuessInputProps = {
  // use UMA das duas estratégias:
  // a) passe guessedNames (sem precisar de playId)
  // b) passe playId para o componente buscar /plays/:playId/attempts
  guessedNames?: string[];
  playId?: number;

  onSelect: (name: string) => void | Promise<void>;
};

export default function GuessInput({
  guessedNames,
  playId,
  onSelect,
}: GuessInputProps) {
  const [input, setInput] = useState('');
  const [characters, setCharacters] = useState<CharacterOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [guessedSet, setGuessedSet] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // 1) Carrega todos os personagens
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllCharacters();
        setCharacters(
          res.map((char: any) => ({
            id: Number(char.id),
            name: String(char.name ?? ''),
            imageUrl1: char.imageUrl1 ?? null,
          })),
        );
      } catch (err) {
        console.error('[GuessInput] Erro ao buscar personagens:', err);
      }
    })();
  }, []);

  // 2a) Se guessedNames for passado pelo pai, usa diretamente
  useEffect(() => {
    if (guessedNames && Array.isArray(guessedNames)) {
      const set = new Set(guessedNames.map((n) => n.toLowerCase().trim()));
      setGuessedSet(set);
    }
  }, [guessedNames]);

  // 2b) Caso NÃO venha guessedNames, mas venha playId, busca no backend
  const refreshGuessedFromBackend = async () => {
    if (!playId || guessedNames) return; // prioridade é do prop guessedNames
    try {
      const atts = await getAttempts(playId);
      const names = (atts ?? []).map((a: any) =>
        String(a.guess ?? '').toLowerCase().trim(),
      );
      setGuessedSet(new Set(names));
    } catch (err) {
      console.error('[GuessInput] Erro ao buscar attempts:', err);
    }
  };

  useEffect(() => {
    refreshGuessedFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playId, guessedNames]);

  // 3) Filtragem (prioriza startsWith, depois includes)
  const filteredBase = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [] as CharacterOption[];
    const starts = characters.filter((c) => c.name.toLowerCase().startsWith(q));
    const contains = characters.filter(
      (c) =>
        !c.name.toLowerCase().startsWith(q) &&
        c.name.toLowerCase().includes(q),
    );
    return [...starts, ...contains];
  }, [input, characters]);

  // 4) Remove nomes já chutados
  const filtered = useMemo(
    () => filteredBase.filter((c) => !guessedSet.has(c.name.toLowerCase().trim())),
    [filteredBase, guessedSet],
  );

  // 5) Mostrar/esconder dropdown
  useEffect(() => {
    setShowDropdown(input.trim().length > 0 && filtered.length > 0);
    setHighlightIndex(0);
  }, [input, filtered.length]);

  // 6) Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // 7) Envio
  const submitName = async (name: string) => {
    if (!name || submitting) return;
    const lower = name.toLowerCase().trim();
    if (guessedSet.has(lower)) {
      setError('Você já chutou esse personagem nesta partida.');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await onSelect(name);
      // Atualiza já-chutados
      if (guessedNames && Array.isArray(guessedNames)) {
        // o pai deve atualizar guessedNames ao receber o novo palpite;
        // aqui apenas fechamos o dropdown e limpamos input
      } else {
        // se usamos backend, atualiza via API
        await refreshGuessedFromBackend();
      }
      setInput('');
      setShowDropdown(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          'Não foi possível enviar seu palpite. Tente novamente.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    // Enter envia SEMPRE a 1ª opção; se não houver, envia o texto
    const choice = filtered[0]?.name ?? input.trim();
    if (!choice) return;
    submitName(choice);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div
        className={`flex items-stretch border-2 rounded overflow-hidden shadow bg-white ${
          error ? 'border-red-500' : 'border-orange-500'
        }`}
      >
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
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
                Math.min(i + 1, Math.max(filtered.length - 1, 0)),
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

      {error && (
        <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

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
