'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface VictoryModalProps {
  onClose: () => void;
  guessesCount?: number;
}

export default function VictoryModal({ onClose, guessesCount }: VictoryModalProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextMidnight());

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
    });

    // Atualiza o contador a cada segundo
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilNextMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-green-600 mb-2">🎉 Parabéns!</h2>
        <p className="text-gray-700">Você acertou o personagem de hoje.</p>

        {guessesCount !== undefined && (
          <p className="mt-2 text-sm text-gray-600">
            Número de tentativas: <strong>{guessesCount}</strong>
          </p>
        )}

        <div className="mt-6">
          <p className="text-sm text-gray-500">Próximo personagem em:</p>
          <p className="text-2xl font-bold text-yellow-600 tracking-widest">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-xl transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

function getTimeUntilNextMidnight() {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { hours, minutes, seconds };
}
