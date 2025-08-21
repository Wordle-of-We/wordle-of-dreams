'use client';

import Image from "next/image";
import { CheckCircle, Film, Heart, Scissors, ShieldCheck, User, Users, XCircle, Zap } from "lucide-react";

interface Character {
  id: number;
  name: string;
  imageUrl1?: string;
}

interface Comparison<T> {
  guessed: T;
  target: T;
}

interface GuessResult {
  guess: string;
  isCorrect: boolean;
  guessedImageUrl1: string | null;
  comparison: { [key: string]: Comparison<any> };
  triedAt: string;
}

interface GuessCardProps {
  guess: GuessResult;
  characters: Character[];
  index: number;
  hideLabels?: boolean;
}

export default function GuessCard({ guess: g, characters, index, hideLabels = false }: GuessCardProps) {
  const guessedCharacter = characters.find(
    (char) => char.name.toLowerCase() === g.guess.toLowerCase()
  );

  const getStatusColor = (guessed: any, target: any) => {
    if (JSON.stringify(guessed) === JSON.stringify(target)) return 'bg-green-400';
    if (
      Array.isArray(guessed) &&
      Array.isArray(target) &&
      guessed.some((val) => target.includes(val))
    )
      return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getIconForKey = (key: string) => {
    switch (key.toLowerCase()) {
      case 'gender':
        return <User size={15} />;
      case 'race':
        return <Users size={15} />;
      case 'hair':
        return <Scissors size={15} />;
      case 'status':
      case 'alivestatus':
        return <Heart size={15} />;
      case 'franchises':
        return <Film size={15} />;
      case 'species':
        return <Zap size={15} />;
      case 'isprotagonist':
        return <ShieldCheck size={15} />;
      case 'ethnicity':
        return <Users size={15} />;
      default:
        return null;
    }
  };

  const translateKey = (key: string) => {
    const map: Record<string, string> = {
      gender: 'Gênero',
      race: 'Raça ou Cor',
      hair: 'Cabelo',
      status: 'Status',
      alivestatus: 'Status',
      franchises: 'Franquia',
      species: 'Espécie',
      isprotagonist: 'Protagonista',
      ethnicity: 'Etnia',
    };
    return map[key.toLowerCase()] || key;
  };

  const translateValue = (key: string, value: any) => {
    const translations: Record<string, Record<string, string>> = {
      gender: {
        male: 'Masculino',
        female: 'Feminino',
        other: 'Outro',
      },
      genero: {
        MALE: 'Masculino',
        FEMALE: 'Feminino',
        other: 'Outro',
      },
      status: {
        alive: 'Vivo',
        dead: 'Morto',
        unknown: 'Desconhecido',
      },
      alivestatus: {
        ALIVE: 'Vivo',
        DEAD: 'Morto',
        UNKNOWN: 'Desconhecido',
      },
      isprotagonist: {
        true: 'Sim',
        false: 'Não',
      },
      hair: {
        black: 'Preto',
        brown: 'Castanho',
        blonde: 'Loiro',
        red: 'Ruivo',
        gray: 'Grisalho',
        white: 'Branco',
        blue: 'Azul',
        green: 'Verde',
        pink: 'Rosa',
        purple: 'Roxo',
        other: 'Outro',
      },
      race: {
        white: 'Branca',
        black: 'Preta',
        brown: 'Parda',
        yellow: 'Amarela',
        indigenous: 'Indígena',
        other: 'Outra',
      },
      ethnicity: {
        white: 'Branca',
        black: 'Preta',
        brown: 'Parda',
        yellow: 'Amarela',
        indigenous: 'Indígena',
        other: 'Outra',
      },
      species: {
        human: 'Humano',
        alien: 'Alienígena',
        robot: 'Robô',
        animal: 'Animal',
        other: 'Outro',
      },
      franchises: {
      },
    };

    const keyLower = key.toLowerCase();

    if (Array.isArray(value)) {
      return value
        .map((v) =>
          translations[keyLower]?.[String(v).toLowerCase()] || String(v)
        )
        .join(', ');
    }

    if (
      typeof value === 'boolean' &&
      translations[keyLower] &&
      translations[keyLower][String(value)]
    ) {
      return translations[keyLower][String(value)];
    }

    return (
      translations[keyLower]?.[String(value).toLowerCase()] || String(value)
    );
  };

  return (
    <div className="rounded-lg p-3 sm:p-4 w-full max-w-fit mx-auto bg-white/50 backdrop-blur-sm overflow-x-auto">
      <div className="flex items-center gap-3 md:gap-4 min-w-fit">
        <div className="flex flex-col items-center justify-center w-24 sm:w-28 md:w-32 lg:w-36 h-20 sm:h-24 md:h-28 lg:h-32 flex-shrink-0">
          <Image
            src={
              guessedCharacter?.imageUrl1 ||
              g.guessedImageUrl1 ||
              "/images/default-character.png"
            }
            alt={g.guess}
            width={80}
            height={80}
            className="object-contain rounded-lg w-14 h-14 sm:w-18 sm:h-18 md:w-22 md:h-22"
          />
          <span className="text-sm sm:text-base font-medium text-gray-800 mt-1 text-center truncate w-full px-1">
            {g.guess}
          </span>
        </div>

        <div className="flex gap-3 md:gap-4">
          {Object.entries(g.comparison).map(([key, val]) => {
            const color = getStatusColor(val.guessed, val.target);
            const Icon = getIconForKey(key);
            const label = translateKey(key);

            return (
              <div
                key={`${key}-${index}`}
                className={`w-24 sm:w-28 md:w-32 lg:w-36 h-14 sm:h-16 md:h-18 lg:h-20 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md flex flex-col items-center justify-center text-white ${color} flex-shrink-0`}
              >
                {!hideLabels && (
                  <>
                    <div className="text-sm">{Icon}</div>
                    <div className="text-sm font-semibold mt-1">{label}</div>
                  </>
                )}
                <div className={`text-sm sm:text-base font-bold text-center px-1 ${hideLabels ? 'flex-1 flex items-center justify-center' : ''}`}>
                  {translateValue(key, val.guessed)}
                </div>
                <div className="mt-1">
                  {color === "bg-green-400" && <CheckCircle size={18} className="sm:w-5 sm:h-5" />}
                  {color === "bg-red-400" && <XCircle size={18} className="sm:w-5 sm:h-5" />}
                  {color === "bg-yellow-400" && (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-400 rounded-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
