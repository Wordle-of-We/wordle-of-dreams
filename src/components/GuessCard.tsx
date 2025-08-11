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
}

export default function GuessCard({ guess: g, characters, index }: GuessCardProps) {
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
        // Adicione traduções específicas se necessário
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
    <div className="rounded p-6 shadow-sm w-max mx-full bg-gray-50">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex justify-center items-center mt-5 w-25 h-25">
          <Image
            src={
              guessedCharacter?.imageUrl1 ||
              g.guessedImageUrl1 ||
              "/images/default-character.png"
            }
            alt={g.guess}
            width={160}
            height={160}
            className="object-contain rounded-xl border"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {Object.entries(g.comparison).map(([key, val]) => {
            const color = getStatusColor(val.guessed, val.target);
            const Icon = getIconForKey(key);
            const label = translateKey(key);

            return (
              <div
                key={`${key}-${index}`}
                className={`w-25 h-25 p-4 rounded-xl shadow-md flex flex-col items-center justify-between text-white ${color}`}
              >
                <div className="text-xs">{Icon}</div>
                <div className="text-xs font-semibold mt-1">{label}</div>
                <div className="text-xs font-bold text-center break-words">
                  {translateValue(key, val.guessed)}
                </div>
                <div className="mt-1">
                  {color === "bg-green-400" && <CheckCircle size={20} />}
                  {color === "bg-red-400" && <XCircle size={20} />}
                  {color === "bg-yellow-400" && (
                    <div className="w-4 h-4 bg-yellow-400 rounded-full" />
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
