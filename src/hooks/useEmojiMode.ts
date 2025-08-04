'use client';

import { useEffect, useState } from 'react';
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
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hasWon, setHasWon] = useState<boolean>(false);
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [revealedEmojis, setRevealedEmojis] = useState<string[]>([]);

  // Chaves para localStorage específicas do modo emoji
  const getStorageKey = (key: string) => `emojiMode_${new Date().toDateString()}_${key}`;

  // Funções para salvar/carregar progresso local
  const saveLocalProgress = (guesses: GuessResult[], hasWon: boolean, revealedEmojis: string[], targetCharacter: Character) => {
    try {
      localStorage.setItem(getStorageKey('guesses'), JSON.stringify(guesses));
      localStorage.setItem(getStorageKey('hasWon'), JSON.stringify(hasWon));
      localStorage.setItem(getStorageKey('revealedEmojis'), JSON.stringify(revealedEmojis));
      localStorage.setItem(getStorageKey('targetCharacter'), JSON.stringify(targetCharacter));
    } catch (err) {
      console.warn('Erro ao salvar progresso local:', err);
    }
  };

  const loadLocalProgress = () => {
    try {
      const savedGuesses = localStorage.getItem(getStorageKey('guesses'));
      const savedHasWon = localStorage.getItem(getStorageKey('hasWon'));
      const savedEmojis = localStorage.getItem(getStorageKey('revealedEmojis'));
      const savedTarget = localStorage.getItem(getStorageKey('targetCharacter'));

      return {
        guesses: savedGuesses ? JSON.parse(savedGuesses) : [],
        hasWon: savedHasWon ? JSON.parse(savedHasWon) : false,
        revealedEmojis: savedEmojis ? JSON.parse(savedEmojis) : [],
        targetCharacter: savedTarget ? JSON.parse(savedTarget) : null
      };
    } catch (err) {
      console.warn('Erro ao carregar progresso local:', err);
      return { guesses: [], hasWon: false, revealedEmojis: [], targetCharacter: null };
    }
  };

  // Debug: monitora mudanças no estado hasWon
  useEffect(() => {
    console.log('[useEmojiMode] 🔄 Estado hasWon mudou para:', hasWon);
    console.log('[useEmojiMode] 🔄 Estado showVictoryModal:', showVictoryModal);
  }, [hasWon, showVictoryModal]);

  useEffect(() => {
    const start = async () => {
      try {
        console.log("[useEmojiMode] 🚀 Iniciando modo emoji (sem backend)");
        
        // Carrega progresso local do modo emoji
        const localProgress = loadLocalProgress();
        console.log("[useEmojiMode] 📁 Progresso local:", localProgress);
        
        // Se há progresso salvo, usa ele
        if (localProgress.targetCharacter) {
          console.log("[useEmojiMode] 🔄 Carregando progresso salvo");
          setTargetCharacter(localProgress.targetCharacter);
          setGuesses(localProgress.guesses);
          setHasWon(localProgress.hasWon);
          setRevealedEmojis(localProgress.revealedEmojis);
          
          if (localProgress.hasWon) {
            setShowVictoryModal(true);
          }
        } else {
          console.log("[useEmojiMode] 🆕 Iniciando novo jogo");
          
          // Busca todos os personagens disponíveis
          const allCharacters = await getAllCharacters();
          const charactersWithEmojis = allCharacters.filter((char: any) => char.emojis && char.emojis.length > 0);
          
          if (charactersWithEmojis.length === 0) {
            setError("Nenhum personagem com emojis disponível");
            return;
          }

          // Seleciona um personagem baseado na data atual para consistência
          const today = new Date().toDateString();
          const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % charactersWithEmojis.length;
          const selectedCharacter = charactersWithEmojis[index];
          
          console.log("[useEmojiMode] 🎯 Personagem selecionado:", selectedCharacter.name);
          setTargetCharacter(selectedCharacter);
          
          // Revela o primeiro emoji
          if (selectedCharacter.emojis && selectedCharacter.emojis.length > 0) {
            const initialEmojis = [selectedCharacter.emojis[0]];
            setRevealedEmojis(initialEmojis);
            // Salva progresso inicial
            saveLocalProgress([], false, initialEmojis, selectedCharacter);
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
    if (!targetCharacter) {
      console.warn('[useEmojiMode] targetCharacter não disponível.');
      return;
    }

    console.log('[useEmojiMode] Enviando palpite:', name);
    console.log('[useEmojiMode] Estado atual - hasWon:', hasWon, 'targetCharacter:', targetCharacter?.name);

    // Verifica se o palpite está correto
    const isCorrect = name.toLowerCase() === targetCharacter.name.toLowerCase();
    console.log('[useEmojiMode] isCorrect:', isCorrect);
    console.log('[useEmojiMode] Comparação:', name.toLowerCase(), 'vs', targetCharacter.name.toLowerCase());

    // Cria o objeto de resposta no formato GuessResult
    const guessData: GuessResult = {
      character: targetCharacter,
      guess: name,
      isCorrect: isCorrect,
      guessedImageUrl1: targetCharacter.imageUrl || '',
      comparison: {}, // Para o modo emoji, não precisamos das comparações
      triedAt: new Date().toISOString()
    };

    const newGuesses = [...guesses, guessData];
    setGuesses(newGuesses);

    if (isCorrect) {
      console.log('[useEmojiMode] 🎉 ACERTOU! Definindo vitória...');
      
      setHasWon(true);
      
      // Revela todos os emojis quando ganha
      if (targetCharacter.emojis) {
        console.log('[useEmojiMode] Revelando todos os emojis:', targetCharacter.emojis);
        setRevealedEmojis(targetCharacter.emojis);
      }
      
      // Salva progresso da vitória
      saveLocalProgress(newGuesses, true, targetCharacter.emojis || [], targetCharacter);
      
      // Mostra modal de vitória após um delay
      setTimeout(() => {
        setShowVictoryModal(true);
      }, 1000);
    } else {
      console.log('[useEmojiMode] ❌ Errou, revelando mais emoji...');
      
      // Revela mais um emoji a cada tentativa errada
      if (targetCharacter.emojis) {
        const emojisToReveal = Math.min(newGuesses.length + 1, targetCharacter.emojis.length);
        console.log('[useEmojiMode] Revelando', emojisToReveal, 'emojis de', targetCharacter.emojis.length);
        const newRevealedEmojis = targetCharacter.emojis.slice(0, emojisToReveal);
        setRevealedEmojis(newRevealedEmojis);
        
        // Salva progresso
        saveLocalProgress(newGuesses, false, newRevealedEmojis, targetCharacter);
      }
    }
  };

  return {
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
