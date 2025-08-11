'use client';

import { useClassicMode } from '../../../hooks/useClassicMode';
import GuessCard from '../../../components/GuessCard';
import GuessInput from '../../../components/GuessInput';
import VictoryModal from '../../../components/VictoryModal';
import StickerBackground from '../../../components/StickerBackground';
import { useEffect, useState } from 'react';
import { getAllCharacters } from '@/services/characters';

interface Character {
  id: number;
  name: string;
  imageUrl1?: string;
}

export default function ClassicMode() {
  const {
    guesses,
    loading,
    error,
    hasWon,
    targetCharacter,
    showVictoryModal,
    setShowVictoryModal,
    submitGuess
  } = useClassicMode();

  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await getAllCharacters();
        setCharacters(res.map((char: any) => ({
          ...char,
          id: Number(char.id),
        })));
      } catch (err) {
        console.error('Erro ao buscar personagens:', err);
      }
    };

    fetchCharacters();
  }, []);

  const handleGuess = (name: string) => {
    if (!hasWon) {
      submitGuess(name);
    }
  };

  if (loading) {
    return (
      <div className="">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Carregando jogo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg text-red-600">Erro: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
      <div className="pt-24 pb-8 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Modo Clássico
            </h1>
            <p className="text-gray-600">
              Descubra o personagem misterioso de hoje!
            </p>
          </div>

          {/* Input de palpite */}
          {!hasWon && (
            <div className="mb-8 flex justify-center">
              <GuessInput onSelect={handleGuess} />
            </div>
          )}

          {/* Mensagem de vitória (sem modal) */}
          {hasWon && !showVictoryModal && (
            <div className="text-center py-8">
              <div className="bg-green-100 border border-green-300 rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  🎉 Parabéns!
                </h3>
                <p className="text-green-700">
                  Você descobriu o personagem em {guesses.length} tentativa{guesses.length !== 1 ? 's' : ''}!
                </p>
              </div>
            </div>
          )}

          {/* Lista de palpites */}
          <div className="space-y-4 flex flex-col items-center">
            {guesses.slice().reverse().map((guess, index) => (
              <GuessCard
                key={guesses.length - 1 - index}
                guess={guess}
                characters={characters}
                index={guesses.length - 1 - index}
              />
            ))}
          </div>

          {/* Mensagem quando não há palpites */}
          {guesses.length === 0 && !hasWon && (
            <div className="text-center py-12 flex justify-center">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Comece a jogar!
                </h3>
                <p className="text-gray-600">
                  Digite o nome de um personagem da DreamWorks para fazer seu primeiro palpite.
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