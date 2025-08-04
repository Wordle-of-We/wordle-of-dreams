'use client';

interface GuessListProps {
  guesses: Array<{
    guess: string;
    isCorrect: boolean;
    triedAt: string;
  }>;
}

export default function GuessList({ guesses }: GuessListProps) {
  if (guesses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 flex flex-col items-center max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Seus palpites ({guesses.length}):
      </h3>
      
      {guesses.slice().reverse().map((guess, index) => (
        <div
          key={index}
          className={`
            w-full px-4 py-3 rounded-lg shadow-md border-2 text-center font-medium
            ${guess.isCorrect 
              ? 'bg-green-100 border-green-300 text-green-800' 
              : 'bg-red-100 border-red-300 text-red-800'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">
              {guess.isCorrect ? '✅' : '❌'}
            </span>
            <span className="text-lg font-semibold">
              {guess.guess}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
