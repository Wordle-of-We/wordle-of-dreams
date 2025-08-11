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

  // Função auxiliar para traduzir as chaves (apenas para o cabeçalho)
  const translateKey = (key: string) => {
    const map: Record<string, string> = {
      gender: 'Gênero',
      race: 'Raça ou Cor',
      hair: 'Cabelo',
      status: 'Status',
      alivestatus: 'Status',
      franchises: 'Franquia',
      species: 'Espécie',
      isprotagonist: 'Protagonista',
      ethnicity: 'Etnia',
    };
    return map[key.toLowerCase()] || key;
  };

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
      <div className="pt-16 sm:pt-20 pb-4 px-2 sm:px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Título */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Modo Clássico
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Descubra o personagem misterioso de hoje!
            </p>
          </div>

          {/* Input de palpite */}
          {!hasWon && (
            <div className="mb-6 flex justify-center">
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

          {/* Cabeçalho das características (só aparece se houver palpites) */}
          {guesses.length > 0 && (
            <div className="mb-4 overflow-x-auto">
              <div className="flex justify-center gap-3 md:gap-4 min-w-fit px-2">
                <div className="w-28 sm:w-32 md:w-36 lg:w-40 h-12 sm:h-14 flex items-center justify-center text-sm sm:text-base font-semibold text-gray-800 bg-gray-200/80 rounded-lg flex-shrink-0">
                  Personagem
                </div>
                {Object.keys(guesses[0].comparison).map((key) => (
                  <div key={key} className="w-24 sm:w-28 md:w-32 lg:w-36 h-12 sm:h-14 flex items-center justify-center text-sm sm:text-base font-semibold text-gray-800 bg-gray-200/80 rounded-lg flex-shrink-0">
                    {translateKey(key)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de palpites */}
          <div className="space-y-2 flex flex-col items-center w-full">
            {guesses.slice().reverse().map((guess, index) => (
              <div key={guesses.length - 1 - index} className="w-full max-w-none overflow-x-auto">
                <GuessCard
                  guess={guess}
                  characters={characters}
                  index={guesses.length - 1 - index}
                  hideLabels={true}
                />
              </div>
            ))}
          </div>          {/* Mensagem quando não há palpites */}
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