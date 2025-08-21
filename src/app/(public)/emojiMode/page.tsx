// src/app/emojiMode/page.tsx
'use client'

import { useEffect } from 'react'
import GuessInput from '@/components/GuessInput'
import VictoryModal from '@/components/VictoryModal'
import StickerBackground from '@/components/StickerBackground'
import EmojiDisplay from '@/components/EmojiDisplay'
import GuessList from '@/components/GuessList'
import { useEmojiMode } from '@/hooks/useEmojiMode'

export default function EmojiModePage() {
  const {
    loading,
    error,
    guesses,
    hasWon,
    targetCharacter,
    revealedEmojis,
    showVictoryModal,
    setShowVictoryModal,
    submitGuess,
  } = useEmojiMode()

  useEffect(() => {
    console.log('[EmojiModePage] estado:', { hasWon, guesses })
  }, [hasWon, guesses])

  const handleGuess = (name: string) => {
    if (!hasWon) submitGuess(name)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-base sm:text-lg text-gray-600">Carregando jogo...</p>
        </div>
      </div>
    )
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
    )
  }

  // Se não houver personagem (por algum motivo), não tenta renderizar o restante
  if (!targetCharacter) {
    return null
  }

  // A partir daqui TS sabe que targetCharacter sempre existe
  return (
    <div>
      <StickerBackground />

      <div className="pt-16 sm:pt-24 pb-4 sm:pb-8 px-3 sm:px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Modo Emoji 😄
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            Descubra o personagem pelos seus emojis característicos!
          </p>
        </div>

        {targetCharacter?.emojis?.length != null && (
          <EmojiDisplay
            revealedEmojis={revealedEmojis}
            totalEmojis={targetCharacter.emojis.length}
          />
        )}


        {!hasWon && (
          <div className="mb-8 flex justify-center px-2">
            <div className="w-full max-w-md">
              <GuessInput
                guessedNames={guesses.map(g => g.guess)}
                onSelect={handleGuess}
              />
            </div>
          </div>
        )}

        {hasWon && !showVictoryModal && (
          <div className="text-center py-6 sm:py-8 px-2">
            <div className="bg-green-100 border border-green-300 rounded-xl p-6 shadow-lg mx-2">
              <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">
                🎉 Incrível!
              </h3>
              <p className="text-sm sm:text-base text-green-700">
                Você acertou em {guesses.length} tentativa
                {guesses.length !== 1 ? 's' : ''}!
              </p>
              <div className="mt-4">
                <p className="text-sm sm:text-base text-green-600 font-semibold">
                  O personagem era: {targetCharacter.name}!
                </p>
                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                  {targetCharacter.emojis.map((e, i) => (
                    <span key={i} className="text-2xl">{e}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 px-2">
          <GuessList guesses={guesses} />
        </div>

        {guesses.length === 0 && !hasWon && (
          <div className="text-center py-8 sm:py-12 px-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                Comece a adivinhar! 🤔
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Olhe os emojis acima e tente descobrir qual personagem eles representam.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                💡 Dica: a cada erro, mais um emoji é revelado!
              </p>
            </div>
          </div>
        )}
      </div>

      {showVictoryModal && (
        <VictoryModal
          onClose={() => setShowVictoryModal(false)}
          guessesCount={guesses.length}
        />
      )}
    </div>
  )
}
