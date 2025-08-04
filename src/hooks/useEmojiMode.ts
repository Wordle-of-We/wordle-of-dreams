'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { getDailyProgress } from '@/services/playService';

type Character = {
  id: number;
  name: string;
  emojis: string[];
  imageUrl?: string;
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

export function useEmojiMode() {
  const [playId, setPlayId] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hasWon, setHasWon] = useState<boolean>(false);
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [revealedEmojis, setRevealedEmojis] = useState<string[]>([]);

  useEffect(() => {
    const start = async () => {
      try {
        console.log("[useEmojiMode] 🚀 Iniciando modo emoji");
        
        // Busca a seleção diária da API
        const response = await api.get('/daily-selection');
        console.log("[useEmojiMode] � Resposta da API:", response.data);
        
        if (!response.data || !Array.isArray(response.data)) {
          setError("Erro ao carregar dados da seleção diária");
          return;
        }

        // Filtra pela configuração do modo emoji (modeConfigId: 2)
        const emojiModeSelection = response.data.find((selection: any) => selection.modeConfigId === 2);
        console.log("[useEmojiMode] 🎯 Seleção do modo emoji:", emojiModeSelection);
        
        if (!emojiModeSelection) {
          setError("Nenhuma seleção encontrada para o modo emoji");
          return;
        }

        // Define o personagem alvo
        setTargetCharacter(emojiModeSelection.character);
        setCharacters(emojiModeSelection.characters);
        
        // Inicia uma nova partida
        const res = await api.post("/plays/start", { modeConfigId: 2 });
        const id = res.data.playId;
        setPlayId(id);
        
        // Carrega o progresso existente do backend
        const progress = await getDailyProgress(2);
        console.log("[useEmojiMode] 📁 Progresso carregado:", progress);

        if (progress && progress.attempts && progress.attempts.length > 0) {
          setGuesses(progress.attempts);
          setHasWon(progress.completed || false);
          
          // Calcula os emojis revelados baseado no número de tentativas
          const revealedCount = Math.min(progress.attempts.length + 1, emojiModeSelection.character.emojis?.length || 0);
          const newRevealedEmojis = emojiModeSelection.character.emojis?.slice(0, revealedCount) || [];
          setRevealedEmojis(newRevealedEmojis);
          
          if (progress.completed) {
            setRevealedEmojis(emojiModeSelection.character.emojis || []);
            setShowVictoryModal(true);
          }
        } else {
          // Primeiro jogo do dia - revela apenas o primeiro emoji
          if (emojiModeSelection.character.emojis && emojiModeSelection.character.emojis.length > 0) {
            setRevealedEmojis([emojiModeSelection.character.emojis[0]]);
          }
        }
      } catch (err) {
        console.error("Erro ao iniciar modo emoji:", err);
        setError("Erro ao iniciar modo emoji");
      } finally {
        setLoading(false);
      }
    };

    start();
  }, []);

  const submitGuess = async (name: string) => {
    if (!playId) {
      console.warn('[useEmojiMode] playId não disponível.');
      return;
    }

    const payload = { guess: name };
    try {
      const res = await api.post(`/plays/${playId}/guess`, payload);
      console.log('[useEmojiMode] novo palpite:', res.data);

      setGuesses((prev) => [...prev, res.data]);

      if (res.data.isCorrect) {
        console.log('[useEmojiMode] 🎉 ACERTOU! Definindo vitória...');
        setHasWon(true);
        
        // Revela todos os emojis quando ganha
        if (targetCharacter && targetCharacter.emojis) {
          console.log('[useEmojiMode] Revelando todos os emojis:', targetCharacter.emojis);
          setRevealedEmojis(targetCharacter.emojis);
        }
        
        setShowVictoryModal(true);
        
        if (!targetCharacter) {
          const progress = await getDailyProgress(2);
          setTargetCharacter(progress.target ?? null);
        }
      } else {
        console.log('[useEmojiMode] ❌ Errou, revelando mais emoji...');
        
        // Revela mais um emoji a cada tentativa errada
        if (targetCharacter && targetCharacter.emojis) {
          const newGuesses = [...guesses, res.data];
          const emojisToReveal = Math.min(newGuesses.length + 1, targetCharacter.emojis.length);
          console.log('[useEmojiMode] Revelando', emojisToReveal, 'emojis de', targetCharacter.emojis.length);
          const newRevealedEmojis = targetCharacter.emojis.slice(0, emojisToReveal);
          setRevealedEmojis(newRevealedEmojis);
        }
      }
    } catch (err: any) {
      console.error('[useEmojiMode] erro ao enviar palpite:', err.response?.data || err.message);
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
    revealedEmojis,
  };
}
