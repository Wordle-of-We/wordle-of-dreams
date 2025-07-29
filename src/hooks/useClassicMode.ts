'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Comparison<T> {
  guessed: T;
  target: T;
}

interface GuessResult {
  guess: string;
  isCorrect: boolean;
  imageUrl: string;
  comparison: {
    [key: string]: Comparison<any>;
  };
  triedAt: string;
}

export function useClassicMode() {
  const [playId, setPlayId] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicia a partida
  useEffect(() => {
    const startGame = async () => {
      try {
        const res = await api.post('/plays/start', {
          modeConfigId: 1,
        });
        console.log('[useClassicGame] playId recebido:', res.data.id);
        setPlayId(res.data.id);
      } catch (err) {
        console.error('[useClassicGame] Erro ao iniciar partida:', err);
        setError('Erro ao iniciar o jogo.');
      } finally {
        setLoading(false);
      }
    };

    startGame();
  }, []);

  // Envia palpite
 const submitGuess = async (name: string) => {
  const idToUse = playId ?? 1;

  const payload = { guess: name };
  console.log(`[useClassicGame] Enviando palpite para /plays/${idToUse}/guess`, payload);

  try {
    const res = await api.post(`/plays/${idToUse}/guess`, payload);
    console.log('[useClassicGame] Resposta recebida:', res.data);

    setGuesses((prev) => [...prev, res.data]);
  } catch (err: any) {
    console.error('[useClassicGame] ❌ Erro ao enviar palpite:', err.response?.data || err.message);
  }
};


  return {
    playId,
    guesses,
    loading,
    error,
    submitGuess,
  };
}