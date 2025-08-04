'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { getDailyProgress } from '@/services/playService';
import { getAllCharacters } from '@/services/characterService';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hasWon, setHasWon] = useState<boolean>(false);
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [revealedEmojis, setRevealedEmojis] = useState<string[]>([]);

  // Debug: monitora mudanças no estado hasWon
  useEffect(() => {
    console.log('[useEmojiMode] 🔄 Estado hasWon mudou para:', hasWon);
    console.log('[useEmojiMode] 🔄 Estado showVictoryModal:', showVictoryModal);
  }, [hasWon, showVictoryModal]);

  useEffect(() => {
    const start = async () => {
      try {
        // Inicia partida com modeConfigId específico para emoji (2)
        const res = await api.post("/plays/start", { modeConfigId: 2 });
        const id = res.data.playId;
        setPlayId(id);
        console.log("[useEmojiMode] Partida iniciada com playId:", id);

        // Carrega progresso do modo emoji (modeId: 2)
        const progress = await getDailyProgress(2);
        console.log("[useEmojiMode] Progresso do modo emoji:", progress);
        console.log("[useEmojiMode] Target character:", progress?.target);

        setGuesses(progress?.attempts ?? []);
        setHasWon(progress?.completed ?? false);
        setTargetCharacter(progress?.target ?? null);
        
        // Se há progresso e personagem target
        if (progress?.target && progress.target.emojis) {
          if (progress.completed) {
            // Se já completou, mostra todos os emojis
            setRevealedEmojis(progress.target.emojis);
            setShowVictoryModal(true);
          } else if (progress.attempts && progress.attempts.length > 0) {
            // Calcula quantos emojis devem estar revelados baseado no número de tentativas
            const emojisToReveal = Math.min(progress.attempts.length + 1, progress.target.emojis.length);
            setRevealedEmojis(progress.target.emojis.slice(0, emojisToReveal));
          } else {
            // Se não há tentativas, revela apenas o primeiro emoji
            setRevealedEmojis([progress.target.emojis[0]]);
          }
        } else if (progress?.target) {
          console.warn("[useEmojiMode] Personagem não tem emojis definidos");
          setRevealedEmojis([]);
        } else {
          // Fallback: Se não há personagem target, busca um personagem com emojis
          console.warn("[useEmojiMode] Nenhum personagem target encontrado, buscando fallback");
          
          const allCharacters = await getAllCharacters();
          const charactersWithEmojis = allCharacters.filter((char: any) => char.emojis && char.emojis.length > 0);
          
          if (charactersWithEmojis.length > 0) {
            // Seleciona um personagem baseado na data atual para consistência
            const today = new Date().toDateString();
            const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % charactersWithEmojis.length;
            const selectedCharacter = charactersWithEmojis[index];
            
            console.log("[useEmojiMode] Personagem fallback selecionado:", selectedCharacter);
            setTargetCharacter(selectedCharacter);
            
            // Revela o primeiro emoji
            if (selectedCharacter.emojis && selectedCharacter.emojis.length > 0) {
              setRevealedEmojis([selectedCharacter.emojis[0]]);
            }
          } else {
            setError("Nenhum personagem com emojis disponível");
            return;
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

    console.log('[useEmojiMode] Enviando palpite:', name);
    console.log('[useEmojiMode] Estado atual - hasWon:', hasWon, 'targetCharacter:', targetCharacter?.name);

    const payload = { guess: name };
    try {
      const res = await api.post(`/plays/${playId}/guess`, payload);
      console.log('[useEmojiMode] Resposta completa da API:', JSON.stringify(res.data, null, 2));
      console.log('[useEmojiMode] isCorrect:', res.data.isCorrect);
      console.log('[useEmojiMode] Palpite:', name, 'vs Target:', targetCharacter?.name);

      setGuesses((prev) => [...prev, res.data]);

      // Verifica vitória de múltiplas formas
      const isWin = res.data.isCorrect || 
                   (res.data.guess && targetCharacter && 
                    res.data.guess.toLowerCase() === targetCharacter.name.toLowerCase()) ||
                   (name.toLowerCase() === targetCharacter?.name.toLowerCase());

      console.log('[useEmojiMode] Verificação de vitória:', {
        'res.data.isCorrect': res.data.isCorrect,
        'nome igual': name.toLowerCase() === targetCharacter?.name.toLowerCase(),
        'resultado final': isWin
      });

      if (isWin) {
        console.log('[useEmojiMode] 🎉 ACERTOU! Definindo vitória...');
        
        // Força a atualização do estado
        setTimeout(() => {
          console.log('[useEmojiMode] 🔧 Forçando atualização de estado...');
          setHasWon(true);
          setShowVictoryModal(true);
        }, 100);
        
        setHasWon(true);
        setShowVictoryModal(true);
        // Revela todos os emojis quando ganha
        const currentTarget = targetCharacter;
        if (currentTarget && currentTarget.emojis) {
          console.log('[useEmojiMode] Revelando todos os emojis:', currentTarget.emojis);
          setRevealedEmojis(currentTarget.emojis);
        }
      } else {
        console.log('[useEmojiMode] ❌ Errou, revelando mais emoji...');
        // Revela mais um emoji a cada tentativa errada
        const currentTarget = targetCharacter;
        if (currentTarget && currentTarget.emojis) {
          const currentGuessCount = guesses.length + 1;
          const emojisToReveal = Math.min(currentGuessCount + 1, currentTarget.emojis.length);
          console.log('[useEmojiMode] Revelando', emojisToReveal, 'emojis de', currentTarget.emojis.length);
          setRevealedEmojis(currentTarget.emojis.slice(0, emojisToReveal));
        }
      }
    } catch (err: any) {
      console.error('[useEmojiMode] Erro ao enviar palpite:', err.response?.data || err.message);
    }
  };

  return {
    playId,
    guesses,
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
