'use client';

import { useClassicMode } from '@/hooks/useClassicMode';
import GuessInput from '../components/GuessInput';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ClassicMode() {
  const { guesses, submitGuess, loading } = useClassicMode();

  const getStatusColor = (guessed: any, target: any) => {
    if (JSON.stringify(guessed) === JSON.stringify(target)) return 'bg-green-500';
    if (
      Array.isArray(guessed) &&
      Array.isArray(target) &&
      guessed.some((val) => target.includes(val))
    )
      return 'bg-yellow-400';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Modo Clássico</h1>

        <GuessInput  onSelect={(name) => {submitGuess(name);}} />

      {loading && <p className="text-center mt-4 text-gray-500">Carregando...</p>}

      <div className="mt-10 space-y-6">
        {guesses.map((g, i) => (
          <div key={i} className="border rounded p-6 bg-white shadow-sm">
            <p className="text-xl font-semibold mb-4">
              Tentativa {i + 1}: {g.guess} {g.isCorrect && '✅'}
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* <img
                src={g.imageUrl}
                alt={g.guess}
                className="w-40 h-40 object-contain rounded border"
              /> */}

              <div className="flex flex-wrap gap-4">
                {Object.entries(g.comparison).map(([key, val]) => {
                  const color = getStatusColor(val.guessed, val.target);
                  return (
                    <div
                      key={key}
                      className={`w-36 h-36 text-white p-4 rounded flex flex-col justify-between ${color}`}
                    >
                      <div className="text-sm font-semibold">{key}</div>
                      <div className="text-lg font-bold">{val.guessed}</div>
                      <div className="flex justify-end">
                        {color === 'bg-green-500' && <CheckCircle />}
                        {color === 'bg-red-500' && <XCircle />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="mt-10 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-green-600">
          <div className="w-4 h-4 bg-green-500 rounded-full" />
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
    </div>
  );
}
