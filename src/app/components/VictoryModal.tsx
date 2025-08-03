import { ReactElement } from 'react';

interface Props {
  onClose: () => void;
}

export function VictoryModal({ onClose }: Props): ReactElement {
  return (
    <div className="bg-black/80 fixed inset-0 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
      <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Parabéns!</h2>
      <p className="text-lg mb-6 text-gray-600">Você acertou o personagem!</p>
      <button
        onClick={onClose}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
      >
        Jogar novamente
      </button>
      </div>
    </div>
  );
}