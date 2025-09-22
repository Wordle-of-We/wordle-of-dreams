'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import {
  User,
  Users,
  Scissors,
  Heart,
  Film,
  Zap,
  ShieldCheck,
  CheckCircle,
  XCircle,
} from 'lucide-react';

type Comparison<T> = { guessed: T; target: T };

type GuessResult = {
  guess: string;
  isCorrect: boolean;
  guessedImageUrl1: string | null;
  comparison: Record<string, Comparison<any>>;
  triedAt: string; // ISO
};

export default function GuessesTable({ guesses }: { guesses: GuessResult[] }) {
  const ordered = useMemo(
    () =>
      [...guesses].sort(
        (a, b) => new Date(b.triedAt).getTime() - new Date(a.triedAt).getTime()
      ),
    [guesses]
  );
  if (!ordered.length) return null;

  const PREFERRED_ORDER = [
    'gênero', 'gender',
    'raça', 'race',
    'etnia', 'ethnicity',
    'cabelo', 'hair',
    'status', 'alivestatus',
    'franchises',
    'descrição', 'emojis', 'imagem',
    'species', 'isprotagonist',
  ];

  const comparisonKeys = useMemo(() => {
    const keys = Object.keys(ordered[0].comparison ?? {});
    const uniq = keys.filter((k, i) => keys.indexOf(k) === i);
    return uniq.sort((a, b) => {
      const ia = PREFERRED_ORDER.indexOf(a.toLowerCase());
      const ib = PREFERRED_ORDER.indexOf(b.toLowerCase());
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib) || a.localeCompare(b);
    });
  }, [ordered]);

  const translateKey = (key: string) => {
    const map: Record<string, string> = {
      gender: 'Gênero',
      gênero: 'Gênero',
      race: 'Raça ou Cor',
      raça: 'Raça ou Cor',
      ethnicity: 'Etnia',
      etnia: 'Etnia',
      hair: 'Cabelo',
      cabelo: 'Cabelo',
      status: 'Status',
      alivestatus: 'Status',
      franchises: 'Franquia',
      descrição: 'Descrição',
      emojis: 'Emojis',
      imagem: 'Imagem',
      species: 'Espécie',
      isprotagonist: 'Protagonista',
    };
    return map[key.toLowerCase()] || key;
  };

  const getIconForKey = (key: string) => {
    const k = key.toLowerCase();
    if (k === 'gender' || k === 'gênero' || k === 'genero') return <User size={15} />;
    if (k === 'race' || k === 'raça') return <Users size={15} />;
    if (k === 'hair' || k === 'cabelo') return <Scissors size={15} />;
    if (k === 'status' || k === 'alivestatus') return <Heart size={15} />;
    if (k === 'franchises') return <Film size={15} />;
    if (k === 'species' || k === 'espécie') return <Zap size={15} />;
    if (k === 'isprotagonist' || k === 'protagonista') return <ShieldCheck size={15} />;
    if (k === 'ethnicity' || k === 'etnia') return <Users size={15} />;
    return null;
  };

  const translateValue = (key: string, value: any) => {
    const k = key.toLowerCase();
    const str = String(value);

    if (k === 'gender' || k === 'gênero' || k === 'genero') {
      const u = str.toUpperCase();
      if (u === 'MALE') return 'Masculino';
      if (u === 'FEMALE') return 'Feminino';
      if (u === 'OTHER' || u === 'UNKNOWN') return 'Outro';
      return str;
    }

    const t: Record<string, Record<string, string>> = {
      gender: { male: 'Masculino', female: 'Feminino', other: 'Outro' },
      gênero: { MALE: 'Masculino', FEMALE: 'Feminino', OTHER: 'Outro' },
      status: { alive: 'Vivo', dead: 'Morto', unknown: 'Desconhecido' },
      alivestatus: { ALIVE: 'Vivo', DEAD: 'Morto', UNKNOWN: 'Desconhecido' },
      isprotagonist: { true: 'Sim', false: 'Não' },
      hair: {
        black: 'Preto', brown: 'Castanho', blonde: 'Loiro', red: 'Ruivo',
        gray: 'Grisalho', white: 'Branco', blue: 'Azul', green: 'Verde',
        pink: 'Rosa', purple: 'Roxo', other: 'Outro',
      },
      race: {
        white: 'Branca', black: 'Preta', brown: 'Parda', yellow: 'Amarela',
        indigenous: 'Indígena', other: 'Outra',
      },
      etnia: {
        white: 'Branca', black: 'Preta', brown: 'Parda', yellow: 'Amarela',
        indigenous: 'Indígena', other: 'Outra',
      },
      ethnicity: {
        white: 'Branca', black: 'Preta', brown: 'Parda', yellow: 'Amarela',
        indigenous: 'Indígena', other: 'Outra',
      },
      species: { human: 'Humano', alien: 'Alienígena', robot: 'Robô', animal: 'Animal', other: 'Outro' },
    };

    if (Array.isArray(value)) {
      return value.map(v => t[k]?.[String(v).toLowerCase()] || String(v)).join(', ');
    }
    if (typeof value === 'boolean' && t[k]?.[String(value)]) return t[k][String(value)];
    return t[k]?.[str.toLowerCase()] ?? str;
  };

  const arraysEqual = (a: any, b: any) => {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    const sa = [...a].map(String).sort();
    const sb = [...b].map(String).sort();
    return JSON.stringify(sa) === JSON.stringify(sb);
  };
  const arraysIntersect = (a: any, b: any) => {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    const setB = new Set(b.map((x: any) => String(x)));
    return a.some((x: any) => setB.has(String(x)));
  };

  const getStatusColor = (guessed: any, target: any) => {
    const eq = Array.isArray(guessed) && Array.isArray(target)
      ? arraysEqual(guessed, target)
      : String(guessed) === String(target);

    if (eq) return 'bg-blue-400';
    if (arraysIntersect(guessed, target)) return 'bg-orange-400';
    return 'bg-red-400';
  };

  // Larguras/alturas (cards estilo GuessCard)
  const CELL_W = 'w-24 sm:w-28 md:w-32 lg:w-36';
  const CELL_H = 'min-h-14 sm:min-h-16 md:min-h-[4.5rem] lg:min-h-20';

  return (
    <div className="w-full px-2">
      {/* Scroll no mobile, sem scroll no desktop */}
      <div className="mx-auto max-w-7xl md:grid md:place-items-center">
        <div className="w-full max-w-full overflow-x-auto md:overflow-visible md:w-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
          <table
            className="
              table-auto
              min-w-[700px] sm:min-w-[900px] md:min-w-0
              w-fit md:w-auto
              mx-auto
              border-separate border-spacing-y-3
            "
          >
            {/* Cabeçalho */}
            <thead>
              <tr>
                <th className={`${CELL_W} px-3 py-2`}>
                  <div className="rounded-lg bg-gray-200/80 backdrop-blur text-center px-3 py-2 text-sm md:text-base font-semibold text-gray-900">
                    Personagem
                  </div>
                </th>
                {comparisonKeys.map((key) => (
                  <th key={key} className={`${CELL_W} px-3 py-2`}>
                    <div className="rounded-lg bg-gray-200/80 backdrop-blur text-center px-3 py-2 text-sm md:text-base font-semibold text-gray-900 whitespace-normal break-words">
                      {translateKey(key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Corpo (cards coloridos por célula) */}
            <tbody>
              {ordered.map((g, idx) => (
                <tr key={`${g.guess}-${idx}`}>
                  {/* Coluna do personagem */}
                  <td className={`${CELL_W} px-3 py-2 align-middle`}>
                    <div className="rounded-xl bg-white/70 backdrop-blur flex items-center gap-3 px-3 py-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={g.guessedImageUrl1 || '/images/default-character.png'}
                          alt={g.guess}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm md:text-base font-semibold text-gray-900 whitespace-normal break-words">
                        {g.guess}
                      </span>
                    </div>
                  </td>

                  {/* Colunas das características */}
                  {comparisonKeys.map((key) => {
                    const comp = g.comparison[key];
                    if (!comp) {
                      return (
                        <td key={`${g.guess}-${key}`} className={`${CELL_W} px-3 py-2 align-middle`}>
                          <div
                            className={`
                              ${CELL_W} ${CELL_H}
                              p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md
                              flex flex-col items-center justify-center
                              text-gray-700 bg-gray-100
                            `}
                          >
                            <span className="text-xs md:text-sm font-medium">—</span>
                          </div>
                        </td>
                      );
                    }

                    const color = getStatusColor(comp.guessed, comp.target);
                    const Icon = getIconForKey(key);
                    const val = translateValue(key, comp.guessed);
                    const targetVal = translateValue(key, comp.target);

                    return (
                      <td key={`${g.guess}-${key}`} className={`${CELL_W} px-3 py-2 align-middle`}>
                        <div
                          className={`
                            ${CELL_W} ${CELL_H}
                            p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md
                            flex flex-col items-center justify-center text-white
                            ${color} flex-shrink-0
                          `}
                          title={`Seu palpite: ${val}\nAlvo: ${targetVal}`}
                        >
                          <div className="text-sm">{Icon}</div>
                          <div className="text-sm sm:text-base font-bold text-center px-1 leading-snug whitespace-normal break-words">
                            {val}
                          </div>
                          <div className="mt-1">
                            {color === 'bg-blue-400' && <CheckCircle size={18} className="sm:w-5 sm:h-5" />}
                            {color === 'bg-red-400' && <XCircle size={18} className="sm:w-5 sm:h-5" />}
                            {color === 'bg-orange-400' && (
                              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-200 rounded-full border border-orange-500" />
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Dica de scroll no mobile (opcional) */}
          {/* <div className="md:hidden text-center text-xs text-gray-500 mt-2">
            Arraste para o lado para ver todas as colunas →
          </div> */}
        </div>
      </div>
    </div>
  );
}
