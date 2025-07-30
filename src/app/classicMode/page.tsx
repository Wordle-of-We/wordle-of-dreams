'use client';

import { useClassicMode } from '@/hooks/useClassicMode';
import GuessInput from '../components/GuessInput';
import { CheckCircle, XCircle, User, Users, Scissors, Heart, Film, Zap, ShieldCheck, } from 'lucide-react';
import Image from 'next/image';
import StickerBackground from '../components/StickerBackground';

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
    race: 'Raça',
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


export default function ClassicMode() {
  const { guesses, characters, submitGuess, loading, playId } = useClassicMode();

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

  // Inverte a ordem dos palpites para mostrar o último no topo
  const reversedGuesses = [...guesses].reverse();

  return (
    <div className="classic-mode-container">
      <StickerBackground />
      <h1 className="text-3xl font-bold text-center mb-8">Modo Clássico</h1>

      {playId ? (
        <div className="flex justify-center">
          <GuessInput onSelect={(name) => submitGuess(name)} />
        </div>
      ) : (
        <p className="text-center mt-6 text-gray-500">Carregando partida...</p>
      )}

      {/* Legenda */}
      <div className="mt-10 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-green-600">
          <div className="w-4 h-4 bg-green-400 rounded-full" />
          Correto
        </div>
        <div className="flex items-center gap-2 text-yellow-500">
          <div className="w-4 h-4 bg-yellow-400 rounded-full" />
          Parcial
        </div>
        <div className="flex items-center gap-2 text-red-500">
          <div className="w-4 h-4 bg-red-500 rounded-full" />
          Incorreto
        </div>
      </div>

      <div className="relative z-10 mt-10 space-y-6">
        {guesses.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg font-semibold">Nenhuma tentativa ainda</p>
            <p>Faça seu primeiro palpite para começar</p>
          </div>
        ) : (
          reversedGuesses.map((g, i) => {
            const guessedCharacter = characters.find(
              (char) => char.name.toLowerCase() === g.guess.toLowerCase()
            );

            return (
              <div key={i} className="rounded p-6 shadow-sm w-max mx-full bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex justify-center items-center mt-5 w-25 h-25">
                    <Image
                      src={
                        guessedCharacter?.imageUrl ||
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
                          key={`${key}-${i}`}
                          className={`w-25 h-25 p-4 rounded-xl shadow-md flex flex-col items-center justify-between text-white ${color}`}
                        >
                          <div className="text-xs">{Icon}</div>
                          <div className="text-xs font-semibold mt-1">{label}</div>
                          <div className="text-xs font-bold text-center break-words">
                            {typeof val.guessed === "object"
                              ? Array.isArray(val.guessed)
                                ? val.guessed.join(", ")
                                : JSON.stringify(val.guessed)
                              : val.guessed}
                          </div>
                          <div className="mt-1">
                            {color === 'bg-green-400' && <CheckCircle size={20} />}
                            {color === 'bg-red-400' && <XCircle size={20} />}
                            {color === 'bg-yellow-400' && <div className="w-4 h-4 bg-yellow-400 rounded-full" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}