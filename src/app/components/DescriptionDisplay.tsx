'use client';

interface DescriptionDisplayProps {
  description: string;
}

export default function DescriptionDisplay({ description }: DescriptionDisplayProps) {
  if (!description) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-white/30 mb-6 sm:mb-8 mx-2">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Descrição do Personagem
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Carregando descrição...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-white/30 mb-6 sm:mb-8 mx-2">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
          Descrição do Personagem
        </h2>
        
        {/* Container da descrição */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200 min-h-[100px] sm:min-h-[120px] flex items-center justify-center">
          <div className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-800 max-w-2xl animate-fade-in-scale">
            <p className="font-medium">
              {description}
            </p>
          </div>
        </div>
        
        {/* Dica */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs sm:text-sm text-yellow-700">
            💡 <strong>Dica:</strong> Leia atentamente a descrição e tente descobrir qual personagem da DreamWorks ela descreve!
          </p>
        </div>
      </div>
    </div>
  );
}
