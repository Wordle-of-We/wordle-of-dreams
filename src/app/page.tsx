'use client';

import { Flame, ScrollText, Image, Smile } from 'lucide-react';
import ModoItem from './components/ModoItem';

export default function HomePage() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">Escolha o modo de jogo</h1>

        <ModoItem
          title="Clássico"
          description="Consiga pistas a cada tentativa"
          icon={<Flame className="text-black" />}
          href="/game?modo=classico"
        />
        <ModoItem
          title="Descrição"
          description="Adivinhe o personagem pela descrição"
          icon={<ScrollText className="text-black" />}
          href="/game?modo=descricao"
        />
        <ModoItem
          title="Imagem"
          description="Adivinhe o personagem pela foto desfocada"
          icon={<Image className="text-black" />}
          href="/game?modo=imagem"
        />
        <ModoItem
          title="Emoji"
          description="Adivinhe o personagem pela sequência de emojis"
          icon={<Smile className="text-black" />}
          href="/game?modo=emoji"
        />
      </div>
  );
}