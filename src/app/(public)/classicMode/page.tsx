'use client';

import { useClassicMode } from '@/hooks/useClassicMode';
import GuessInput from '@/components/GuessInput';
import VictoryModal from '@/components/VictoryModal';
import StickerBackground from '@/components/StickerBackground';
import GuessesTable from '@/components/GuessTable';

export default function ClassicMode() {
  const {
    guesses,
    loading,
    error,
    hasWon,
    showVictoryModal,
    setShowVictoryModal,
    submitGuess,
  } = useClassicMode();

  const handleGuess = (name: string) => {
    if (!hasWon) submitGuess(name);
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Carregando jogo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md mx-auto">
            <p className="text-lg text-red-600 mb-4">Erro: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <StickerBackground /> */}

      <div className="pt-16 sm:pt-24 pb-4 sm:pb-8 px-3 sm:px-4 relative z-10 overflow-x-hidden">
        {/* Bloco 1: título + input (largura confortável para leitura) */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Modo Clássico
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-2 mb-6 sm:mb-8">
            O jogo tradicional de adivinhação de personagens
            <br className="hidden sm:block" />
            DreamWorks com dicas visuais
          </p>

          {!hasWon && (
            <div className="mb-6 sm:mb-8 flex justify-center px-2">
              <div className="w-full max-w-md">
                <GuessInput
                  guessedNames={guesses.map((g) => g.guess)}
                  onSelect={handleGuess}
                />
              </div>
            </div>
          )}

          {hasWon && !showVictoryModal && (
            <div className="text-center py-6 sm:py-8 px-2">
              <div className="bg-green-100 border border-green-300 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">
                  🎉 Parabéns!
                </h3>
                <p className="text-sm sm:text-base text-green-700">
                  Você descobriu o personagem em {guesses.length} tentativa
                  {guesses.length !== 1 ? 's' : ''}!
                </p>
              </div>
            </div>
          )}
        </div>

        {guesses.length > 0 && (
          <div className="mt-4 w-full px-2 overflow-x-hidden">
            <div className="mx-auto max-w-7xl md:flex md:justify-center">
              <GuessesTable guesses={guesses} />
            </div>
          </div>
        )}

        {guesses.length === 0 && !hasWon && (
          <div className="text-center flex justify-center w-full px-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Comece a jogar!
              </h3>
              <p className="text-gray-600">
                Digite o nome de um personagem da DreamWorks para fazer seu
                primeiro palpite.
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
  );
}
