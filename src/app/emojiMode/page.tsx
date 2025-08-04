'use client';

import GuessInput from '../components/GuessInput';
import VictoryModal from '../components/VictoryModal';
import StickerBackground from '../components/StickerBackground';
import EmojiDisplay from '../components/EmojiDisplay';
import GuessList from '../components/GuessList';
import { useEffect, useState } from 'react';
import { useEmojiMode } from '@/hooks/useEmojiMode';

export default function EmojiMode() {
  const {
    guesses,
    loading,
    error,
    hasWon,
    targetCharacter,
    showVictoryModal,
    setShowVictoryModal,
    submitGuess,
    revealedEmojis,
    characters
  } = useEmojiMode();

  // Debug: monitora mudanças no estado de vitória
  useEffect(() => {
    console.log('[EmojiMode] 📊 Estado atualizado:');
    console.log('  - hasWon:', hasWon);
    console.log('  - showVictoryModal:', showVictoryModal);
    console.log('  - guesses.length:', guesses.length);
    console.log('  - targetCharacter:', targetCharacter?.name);
  }, [hasWon, showVictoryModal, guesses.length]);

  const handleGuess = (name: string) => {
    console.log('[EmojiMode] Palpite:', name, 'hasWon:', hasWon);
    if (!hasWon) {
      submitGuess(name);
    } else {
      console.log('[EmojiMode] Jogo já foi ganho, não enviando palpite');
    }
  };

  if (loading) {
    return (
      <div className="">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-base sm:text-lg text-gray-600">Carregando jogo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md mx-auto">
            <p className="text-base sm:text-lg text-red-600 mb-4">Erro: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm sm:text-base"
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
              Modo Emoji 😄
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              Descubra o personagem pelos seus emojis característicos!
            </p>
          </div>

          {/* Exibição dos emojis */}
          {targetCharacter && (
            <EmojiDisplay 
              revealedEmojis={revealedEmojis}
              totalEmojis={targetCharacter.emojis?.length || 0}
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
                  🎉 Incrível!
                </h3>
                <p className="text-sm sm:text-base text-green-700">
                  Você descobriu em {guesses.length} tentativa{guesses.length !== 1 ? 's' : ''}!
                </p>
                {targetCharacter && (
                  <div className="mt-4">
                    <p className="text-sm sm:text-base text-green-600 font-semibold">
                      O personagem secreto era: {targetCharacter.name}! 
                    </p>
                    <div className="flex justify-center gap-1 sm:gap-2 mt-2 flex-wrap">
                      {targetCharacter.emojis?.map((emoji, index) => (
                        <span key={index} className="text-xl sm:text-2xl">{emoji}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lista de palpites */}
          <div className="mb-6 sm:mb-8 px-2">
            <GuessList guesses={guesses} />
          </div>

          {/* Mensagem quando não há palpites */}
          {guesses.length === 0 && !hasWon && targetCharacter && (
            <div className="text-center py-8 sm:py-12 flex justify-center px-2">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg border border-white/20 max-w-md mx-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  Comece a adivinhar! 🤔
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Olhe os emojis acima e tente descobrir qual personagem da DreamWorks eles representam.
                </p>
                <div className="text-xs sm:text-sm text-gray-500">
                  💡 Dica: A cada tentativa errada, mais um emoji será revelado!
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
                  Aguarde um momento enquanto preparamos seu desafio emoji!
                </p>
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
