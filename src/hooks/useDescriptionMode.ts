'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { getDailyProgress } from '@/services/playService';

type Character = {
  id: number;
  name: string;
  imageUrl?: string;
  description?: string;
};

interface Comparison<T> {
  guessed: T;
  target: T;
}

export interface GuessResult {
  character: any;
  guess: string;
  isCorrect: boolean;
  guessedImageUrl1: string;
  comparison: {
    [key: string]: Comparison<any>;
  };
  triedAt: string;
}

export function useDescriptionMode() {
  const [playId, setPlayId] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hasWon, setHasWon] = useState<boolean>(false);
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  useEffect(() => {
    const start = async () => {
      try {
        // Busca o personagem sorteado do dia para o modo descrição
        const dailyResponse = await api.get('/daily-selection');
        const dailySelections = dailyResponse.data;
        
        // Filtra pelo modo descrição (modeConfigId: 3)
        const descriptionMode = dailySelections.find((selection: any) => selection.modeConfigId === 3);
        
        if (!descriptionMode) {
          throw new Error("Modo descrição não encontrado na seleção diária");
        }
        
        const selectedCharacter = descriptionMode.character;
        console.log("[useDescriptionMode] personagem do dia:", selectedCharacter);
        setTargetCharacter(selectedCharacter);

        // Inicia uma nova partida
        const res = await api.post("/plays/start", { modeConfigId: 3 });
        const id = res.data.playId;
        setPlayId(id);

        // Carrega progresso se existir
        const progress = await getDailyProgress(3);
        console.log("[useDescriptionMode] progresso do dia:", progress);

        setGuesses(progress.attempts ?? []);
        setHasWon(progress.completed ?? false);
        if (progress.completed) {
          setHasWon(true);
          setShowVictoryModal(true);
        }
      } catch (err) {
        console.error("Erro ao iniciar partida:", err);
        setError("Erro ao iniciar partida");
      } finally {
        setLoading(false);
      }
    };

    start();
  }, []);

  const submitGuess = async (name: string) => {
    if (!playId) {
      console.warn('[useDescriptionMode] playId não disponível.');
      return;
    }

    const payload = { guess: name };
    try {
      const res = await api.post(`/plays/${playId}/guess`, payload);
      console.log('[useDescriptionMode] novo palpite:', res.data);

      setGuesses((prev) => [...prev, res.data]);

      if (res.data.isCorrect) {
        setHasWon(true);
        setShowVictoryModal(true);
        if (!targetCharacter) {
          const progress = await getDailyProgress(3);
          setTargetCharacter(progress.target ?? null);
        }
      }
    } catch (err: any) {
      console.error('[useDescriptionMode] erro ao enviar palpite:', err.response?.data || err.message);
    }
  };

  return {
    playId,
    guesses,
    characters,
    loading,
    error,
    hasWon,
    targetCharacter,
    showVictoryModal,
    setShowVictoryModal,
    submitGuess,
  };
}
