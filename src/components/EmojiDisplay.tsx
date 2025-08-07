'use client';

interface EmojiDisplayProps {
  revealedEmojis: string[];
  totalEmojis: number;
}

export default function EmojiDisplay({ revealedEmojis, totalEmojis }: EmojiDisplayProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-white/30 mb-6 sm:mb-8 mx-2">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
          Emojis do Personagem
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          {revealedEmojis.length} de {totalEmojis} emojis revelados
        </p>
        
        {/* Container dos emojis */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 min-h-[60px] sm:min-h-[80px] items-center">
          {revealedEmojis.map((emoji, index) => (
            <div
              key={index}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl p-2 sm:p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl shadow-md border-2 border-yellow-200 transform transition-all duration-300 hover:scale-110 animate-fade-in-scale"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              {emoji}
            </div>
          ))}
          
          {/* Placeholders para emojis não revelados */}
          {Array.from({ length: totalEmojis - revealedEmojis.length }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl p-2 sm:p-3 bg-gray-200 rounded-xl shadow-md border-2 border-gray-300 flex items-center justify-center"
            >
              <span className="text-gray-400 text-2xl sm:text-3xl md:text-4xl">?</span>
            </div>
          ))}
        </div>
        
        {revealedEmojis.length < totalEmojis && (
          <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-2">
            Mais emojis serão revelados a cada tentativa!
          </p>
        )}
      </div>
    </div>
  );
}
