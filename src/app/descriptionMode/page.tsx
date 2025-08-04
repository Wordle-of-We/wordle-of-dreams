'use client';

import GuessInput from '../components/GuessInput';
import VictoryModal from '../components/VictoryModal';
import StickerBackground from '../components/StickerBackground';
import DescriptionDisplay from '../components/DescriptionDisplay';
import GuessList from '../components/GuessList';
import { useEffect, useState } from 'react';
import { useDescriptionMode } from '@/hooks/useDescriptionMode';

export default function DescriptionMode() {
  const {
    guesses,
    loading,
    error,
    hasWon,
    targetCharacter,
    showVictoryModal,
    setShowVictoryModal,
    submitGuess
  } = useDescriptionMode();

  // Debug: monitora mudanças no estado de vitória
  useEffect(() => {
    console.log('[DescriptionMode] 📊 Estado atualizado:');
    console.log('  - hasWon:', hasWon);
    console.log('  - showVictoryModal:', showVictoryModal);
    console.log('  - guesses.length:', guesses.length);
    console.log('  - targetCharacter:', targetCharacter?.name);
    console.log('  - targetCharacter.description:', targetCharacter?.description);
  }, [hasWon, showVictoryModal, guesses.length, targetCharacter]);

  // Transforma os guesses para o formato esperado pelo GuessList
  const transformedGuesses = guesses.map(guess => ({
    guess: guess.guess,
    isCorrect: guess.isCorrect,
    triedAt: guess.triedAt,
    character: {
      id: guess.character?.id || 0,
      name: guess.guess,
      imageUrl: guess.guessedImageUrl1
    }
  }));

  const handleGuess = (name: string) => {
    console.log('[DescriptionMode] Palpite:', name, 'hasWon:', hasWon);
    if (!hasWon) {
      submitGuess(name);
    } else {
      console.log('[DescriptionMode] Jogo já foi ganho, não enviando palpite');
    }
  };

  if (loading) {
    return (
      <div className="">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-base sm:text-lg text-gray-600">Carregando jogo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md mx-auto">
            <p className="text-base sm:text-lg text-red-600 mb-4">Erro: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <StickerBackground />

      {/* Conteúdo principal */}
      <div className="pt-16 sm:pt-24 pb-4 sm:pb-8 px-3 sm:px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Título */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Modo Descrição 📝
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              Descubra o personagem através de sua descrição!
            </p>
          </div>

          {/* Exibição da descrição */}
          {targetCharacter && targetCharacter.description && (
            <DescriptionDisplay 
              description={targetCharacter.description}
            />
          )}

          {/* Input de palpite */}
          {!hasWon && (
            <div className="mb-6 sm:mb-8 flex justify-center px-2">
              <div className="w-full max-w-md">
                <GuessInput onSelect={handleGuess} />
              </div>
            </div>
          )}

          {/* Mensagem de vitória (sem modal) */}
          {hasWon && !showVictoryModal && (
            <div className="text-center py-6 sm:py-8 px-2">
              <div className="bg-green-100 border border-green-300 rounded-xl p-4 sm:p-6 shadow-lg mx-2">
                <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">
                  🎉 Fantástico!
                </h3>
                <p className="text-sm sm:text-base text-green-700">
                  Você descobriu em {guesses.length} tentativa{guesses.length !== 1 ? 's' : ''}!
                </p>
                {targetCharacter && (
                  <div className="mt-4">
                    <p className="text-sm sm:text-base text-green-600 font-semibold">
                      O personagem secreto era: {targetCharacter.name}! 
                    </p>
                    {targetCharacter.description && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs sm:text-sm text-green-700">
                          <strong>Descrição completa:</strong> {targetCharacter.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lista de palpites */}
          <div className="mb-6 sm:mb-8 px-2">
            <GuessList guesses={transformedGuesses} />
          </div>

          {/* Mensagem quando não há palpites */}
          {transformedGuesses.length === 0 && !hasWon && targetCharacter && (
            <div className="text-center py-8 sm:py-12 flex justify-center px-2">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg border border-white/20 max-w-md mx-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  Comece a adivinhar! 🤔
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Leia a descrição acima e tente descobrir qual personagem da DreamWorks ela descreve.
                </p>
                <div className="text-xs sm:text-sm text-gray-500">
                  💡 Dica: Leia a descrição com atenção e tente adivinhar o personagem!
                </div>
              </div>
            </div>
          )}

          {/* Mensagem quando não há personagem carregado */}
          {!targetCharacter && !loading && (
            <div className="text-center py-8 sm:py-12 flex justify-center px-2">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg border border-white/20 max-w-md mx-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  Carregando personagem do dia...
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Aguarde um momento enquanto preparamos seu desafio de descrição!
                </p>
              </div>
            </div>
          )}

          {/* Mensagem quando personagem não tem descrição */}
          {targetCharacter && !targetCharacter.description && !loading && (
            <div className="text-center py-8 sm:py-12 flex justify-center px-2">
              <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 sm:p-8 shadow-lg max-w-md mx-2">
                <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">
                  ⚠️ Ops!
                </h3>
                <p className="text-sm sm:text-base text-yellow-700">
                  Este personagem não possui uma descrição disponível. Tente novamente mais tarde!
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm sm:text-base"
                >
                  Recarregar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de vitória */}
      {showVictoryModal && (
        <VictoryModal 
          onClose={() => setShowVictoryModal(false)}
          guessesCount={guesses.length}
        />
      )}
    </div>
  );
}
