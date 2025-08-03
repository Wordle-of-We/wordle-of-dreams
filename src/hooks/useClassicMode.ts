'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

type Character = {
  id: number;
  name: string;
  imageUrl?: string;
  // Add other properties as needed
};

interface Comparison<T> {
  guessed: T;
  target: T;
}

interface GuessResult {
  character: any;
  guess: string;
  isCorrect: boolean;
  guessedImageUrl1: string;
  comparison: {
    [key: string]: Comparison<any>;
  };
  triedAt: string;
}

export function useClassicMode() {
  const [playId, setPlayId] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const start = async () => {
    try {
      const res = await api.post("/plays/start", { modeConfigId: 1 });
      console.log("[useClassicGame] Partida iniciada:", res.data);
      console.log("[useClassicGame] playId recebido:", res.data.playId);
      setPlayId(res.data.playId);
    } catch (err) {
      console.error("Erro ao iniciar partida:", err);
    } finally {
      setLoading(false);
    }
  };
  start();
}, []);

  // Envia palpite
  const submitGuess = async (name: string) => {
    if (!playId) {
      console.warn('[useClassicGame] ⚠️ playId ainda não disponível. Palpite ignorado.');
      return;
    }
    const idToUse = playId;


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
    characters,
  };
}