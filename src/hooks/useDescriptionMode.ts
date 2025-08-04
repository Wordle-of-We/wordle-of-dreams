'use client';

import { useEffect, useState } from 'react';
import { getAllCharacters } from '@/services/characterService';

type Character = {
  id: number;
  name: string;
  description?: string;
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

export function useDescriptionMode() {
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hasWon, setHasWon] = useState<boolean>(false);
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  // Chaves para localStorage específicas do modo descrição
  const getStorageKey = (key: string) => `descriptionMode_${new Date().toDateString()}_${key}`;

  // Funções para salvar/carregar progresso local
  const saveLocalProgress = (guesses: GuessResult[], hasWon: boolean, targetCharacter: Character) => {
    try {
      localStorage.setItem(getStorageKey('guesses'), JSON.stringify(guesses));
      localStorage.setItem(getStorageKey('hasWon'), JSON.stringify(hasWon));
      localStorage.setItem(getStorageKey('targetCharacter'), JSON.stringify(targetCharacter));
    } catch (err) {
      console.warn('Erro ao salvar progresso local:', err);
    }
  };

  const loadLocalProgress = () => {
    try {
      const savedGuesses = localStorage.getItem(getStorageKey('guesses'));
      const savedHasWon = localStorage.getItem(getStorageKey('hasWon'));
      const savedTarget = localStorage.getItem(getStorageKey('targetCharacter'));

      return {
        guesses: savedGuesses ? JSON.parse(savedGuesses) : [],
        hasWon: savedHasWon ? JSON.parse(savedHasWon) : false,
        targetCharacter: savedTarget ? JSON.parse(savedTarget) : null
      };
    } catch (err) {
      console.warn('Erro ao carregar progresso local:', err);
      return { guesses: [], hasWon: false, targetCharacter: null };
    }
  };

  // Debug: monitora mudanças no estado hasWon
  useEffect(() => {
    console.log('[useDescriptionMode] 🔄 Estado hasWon mudou para:', hasWon);
    console.log('[useDescriptionMode] 🔄 Estado showVictoryModal:', showVictoryModal);
  }, [hasWon, showVictoryModal]);

  useEffect(() => {
    const start = async () => {
      try {
        console.log("[useDescriptionMode] 🚀 Iniciando modo descrição (sem backend)");
        
        // Carrega progresso local do modo descrição
        const localProgress = loadLocalProgress();
        console.log("[useDescriptionMode] 📁 Progresso local:", localProgress);
        
        // Se há progresso salvo, usa ele
        if (localProgress.targetCharacter) {
          console.log("[useDescriptionMode] 🔄 Carregando progresso salvo");
          setTargetCharacter(localProgress.targetCharacter);
          setGuesses(localProgress.guesses);
          setHasWon(localProgress.hasWon);
          
          if (localProgress.hasWon) {
            setShowVictoryModal(true);
          }
        } else {
          console.log("[useDescriptionMode] 🆕 Iniciando novo jogo");
          
          // Busca todos os personagens disponíveis
          const allCharacters = await getAllCharacters();
          const charactersWithDescription = allCharacters.filter((char: any) => char.description && char.description.length > 0);
          
          if (charactersWithDescription.length === 0) {
            setError("Nenhum personagem com descrição disponível");
            return;
          }

          // Seleciona um personagem baseado na data atual para consistência
          const today = new Date().toDateString();
          const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % charactersWithDescription.length;
          const selectedCharacter = charactersWithDescription[index];
          
          console.log("[useDescriptionMode] 🎯 Personagem selecionado:", selectedCharacter.name);
          setTargetCharacter(selectedCharacter);
          
          // Salva progresso inicial
          saveLocalProgress([], false, selectedCharacter);
        }
      } catch (err) {
        console.error("Erro ao iniciar modo descrição:", err);
        setError("Erro ao iniciar modo descrição");
      } finally {
        setLoading(false);
      }
    };

    start();
  }, []);

  const submitGuess = async (name: string) => {
    if (!targetCharacter) {
      console.warn('[useDescriptionMode] targetCharacter não disponível.');
      return;
    }

    console.log('[useDescriptionMode] Enviando palpite:', name);
    console.log('[useDescriptionMode] Estado atual - hasWon:', hasWon, 'targetCharacter:', targetCharacter?.name);

    // Verifica se o palpite está correto
    const isCorrect = name.toLowerCase() === targetCharacter.name.toLowerCase();
    console.log('[useDescriptionMode] isCorrect:', isCorrect);
    console.log('[useDescriptionMode] Comparação:', name.toLowerCase(), 'vs', targetCharacter.name.toLowerCase());

    // Cria o objeto de resposta no formato GuessResult
    const guessData: GuessResult = {
      character: targetCharacter,
      guess: name,
      isCorrect: isCorrect,
      guessedImageUrl1: targetCharacter.imageUrl || '',
      comparison: {}, // Para o modo descrição, não precisamos das comparações
      triedAt: new Date().toISOString()
    };

    const newGuesses = [...guesses, guessData];
    setGuesses(newGuesses);

    if (isCorrect) {
      console.log('[useDescriptionMode] 🎉 ACERTOU! Definindo vitória...');
      
      setHasWon(true);
      
      // Salva progresso da vitória
      saveLocalProgress(newGuesses, true, targetCharacter);
      
      // Mostra modal de vitória após um delay
      setTimeout(() => {
        setShowVictoryModal(true);
      }, 1000);
    } else {
      console.log('[useDescriptionMode] ❌ Errou, continue tentando...');
      
      // Salva progresso
      saveLocalProgress(newGuesses, false, targetCharacter);
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
  };
}
