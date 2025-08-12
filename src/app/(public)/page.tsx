'use client';

import { Play, Smile, FileText, Image as ImageIcon } from 'lucide-react';
import ModoItem from '../../components/ModoItem';
import StickerBackground from '../../components/StickerBackground';

export default function HomePage() {
  return (
    <div className="min-h-screen relative mt-5">
      <div className="px-4 sm:px-6 lg:px-8">
        <StickerBackground />
        {/* Título */}
        <div className="relative z-10 text-center pt-6 sm:pt-8 lg:pt-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-poppins text-gray-800">
            <div className="flex items-center justify-center -mt-6 sm:-mt-8 lg:-mt-10">
              <img
                src="/logo_dreams.svg"
                alt="Logo Wordle of Dreams"
                className="w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52"
              />
            </div>
            <span className="block text-orange-500 font-extrabold font-pacifico text-lg sm:text-xl lg:text-2xl mt-1 sm:mt-2">
              Guessing Game
            </span>
          </h1>
          <p className="mt-3 sm:mt-4 lg:mt-6 text-gray-500 text-sm sm:text-base lg:text-lg max-w-sm sm:max-w-xl lg:max-w-2xl mx-auto font-raleway px-4 sm:px-0">
            Escolha seu modo de jogo favorito e teste seus conhecimentos sobre os personagens mais queridos da DreamWorks!
          </p>
        </div>

        {/* Modos de jogo */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-sm sm:max-w-md lg:max-w-lg mt-4 sm:mt-6 lg:mt-8 mx-auto gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10 px-2 sm:px-0">
          <ModoItem
            title="Clássico"
            description="O jogo tradicional de adivinhação de personagens DreamWorks com dicas visuais"
            icon={<Play className="text-green-500 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />}
            href="/classicMode"
          />
          <ModoItem
            title="Emojis"
            description="Descubra o personagem através de pistas divertidas com emojis"
            icon={<Smile className="text-orange-500 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />}
            href="/emojiMode"
          />
          <ModoItem
            title="Descrição"
            description="Use descrições detalhadas para encontrar o personagem misterioso"
            icon={<FileText className="text-yellow-500 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />}
            href="/descriptionMode"
          />
          {/* <ModoItem
            title="Imagem"
            description="Adivinhe o personagem com base em sua imagem desfocada"
            icon={<ImageIcon className="text-blue-500 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />}
            href="/game?modo=imagem"
          /> */}
        </div>
      </div>
    </div>
  );
}