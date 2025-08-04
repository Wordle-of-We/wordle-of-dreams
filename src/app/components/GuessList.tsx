'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getAllCharacters } from '@/services/characterService';

interface Character {
  id: number;
  name: string;
  imageUrl1?: string;
}

interface GuessListProps {
  guesses: Array<{
    guess: string;
    isCorrect: boolean;
    triedAt: string;
    character?: {
      id: number;
      name: string;
      imageUrl?: string;
    };
  }>;
}

export default function GuessList({ guesses }: GuessListProps) {
  const [characters, setCharacters] = useState<Character[]>([]);

  // Busca todos os personagens para poder mostrar a imagem correta de cada palpite
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const allCharacters = await getAllCharacters();
        setCharacters(allCharacters);
      } catch (error) {
        console.error('Erro ao buscar personagens:', error);
      }
    };
    fetchCharacters();
  }, []);

  // Função para encontrar o personagem pelo nome do palpite
  const findCharacterImage = (guessName: string) => {
    const character = characters.find(char => 
      char.name.toLowerCase() === guessName.toLowerCase()
    );
    return character?.imageUrl1 || '/images/default-character.png';
  };

  if (guesses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 flex flex-col items-center max-w-md mx-auto">
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
        Seus palpites ({guesses.length}):
      </h3>
      
      {guesses.slice().reverse().map((guess, index) => (
        <div
          key={index}
          className={`
            w-full px-3 sm:px-4 py-3 rounded-lg shadow-md border-2 text-center font-medium
            ${guess.isCorrect 
              ? 'bg-green-100 border-green-300 text-green-800' 
              : 'bg-red-100 border-red-300 text-red-800'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/* Imagem do personagem chutado */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 border-current flex-shrink-0">
              <Image
                src={findCharacterImage(guess.guess)}
                alt={guess.guess}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Ícone de acerto/erro */}
            <span className="text-base sm:text-lg">
              {guess.isCorrect ? '✅' : '❌'}
            </span>
            
            {/* Nome do personagem */}
            <span className="text-sm sm:text-base md:text-lg font-semibold">
              {guess.guess}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
