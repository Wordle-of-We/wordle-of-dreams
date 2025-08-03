'use client';
import { useEffect, useState } from 'react';
import { useClassicMode } from '@/hooks/useClassicMode';
import GuessInput from '../components/GuessInput';
import { CheckCircle, XCircle, User, Users, Scissors, Heart, Film, Zap, ShieldCheck, } from 'lucide-react';
import StickerBackground from '../components/StickerBackground';
import { VictoryModal } from '../components/VictoryModal';
import { getDailyProgress } from '@/services/playService';
import type { Guess, Character } from '@/types/index';
import GuessCard from '../components/GuessCard';


export default function ClassicMode() {
  const { characters, submitGuess, loading } = useClassicMode();
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [playId, setPlayId] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null);

  const typedCharacters = characters as Character[];

  useEffect(() => {
    if (guesses.some((g) => g.isCorrect)) {
      setShowVictoryModal(true);
    }
  }, [guesses]);

  useEffect(() => {
    async function loadDailyProgress() {
      const data = await getDailyProgress(1);
      console.log('[ClassicMode] Progresso diário carregado:', data);
      console.log('[DEBUG] character recebido:', data.character);
      console.log('[DEBUG] guesses recebidos:', data.guesses);
      if (data) {
        setPlayId(data.playId ?? null);
        setGuesses(data.attempts ?? []);
        setHasWon(data.completed ?? false);
        setTargetCharacter(data.target ?? null);
      }
    }
    loadDailyProgress();
  }, []);

  const reversedGuesses = [...guesses].reverse();

  return (
    <div className="classic-mode-container">
      <StickerBackground />
      {showVictoryModal && (
        <VictoryModal onClose={() => setShowVictoryModal(false)} />
      )}
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
          </div>
        ) : (
          <div className="space-y-6">
            {reversedGuesses.map((g, i) => (
              <GuessCard key={i} guess={g} characters={typedCharacters} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}