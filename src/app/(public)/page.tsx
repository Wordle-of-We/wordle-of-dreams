'use client';

import { Play, Smile, FileText, Image as ImageIcon } from 'lucide-react';
import ModoItem from '../../components/ModoItem';
import StickerBackground from '../../components/StickerBackground';
// import Logo from '/logo_dreams.svg';

export default function HomePage() {
  return (
    <div>
      <div className=" px-4">
        <StickerBackground />
        {/* Título */}
        <div className="relative z-10 text-center mt-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-poppins text-gray-800">
            <div className="flex items-center justify-center -mt-10">
              <img
                src="/logo_dreams.svg"
                alt="Logo Wordle of Dreams"
                className="w-52 h-52"
              />
            </div>
            <span className="block text-orange-500 font-extrabold font-pacifico text-xl sm:text-2xl mt-2">
              Guessing Game
            </span>
          </h1>
          <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-xl mx-auto font-raleway">
            Escolha seu modo de jogo favorito e teste seus conhecimentos sobre os personagens mais queridos da DreamWorks!
          </p>
        </div>

        {/* Modos de jogo */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-md mt-6 mx-auto gap-4 mb-6">
          <ModoItem
            title="Clássico"
            description="O jogo tradicional de adivinhação de personagens DreamWorks com dicas visuais"
            icon={<Play className="text-green-500 w-8 h-8" />}
            href="/classicMode"
          />
          <ModoItem
            title="Emojis"
            description="Descubra o personagem através de pistas divertidas com emojis"
            icon={<Smile className="text-orange-500 w-8 h-8" />}
            href="/emojiMode"
          />
          <ModoItem
            title="Descrição"
            description="Use descrições detalhadas para encontrar o personagem misterioso"
            icon={<FileText className="text-yellow-500 w-8 h-8" />}
            href="/descriptionMode"
          />
          {/* <ModoItem
            title="Imagem"
            description="Adivinhe o personagem com base em sua imagem desfocada"
            icon={<ImageIcon className="text-blue-500 w-8 h-8" />}
            href="/game?modo=imagem"
          /> */}
        </div>
      </div>
    </div>
  );
}