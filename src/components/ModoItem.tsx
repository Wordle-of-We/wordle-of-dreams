import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface ModoCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

export default function ModoItem({ title, description, icon, href }: ModoCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const BTN_WIDTH = 'w-28 md:w-28 lg:w-28';
  const BTN_HEIGHT = 'h-10 md:h-10 lg:h-10';

  return (
    <div className="flex flex-row justify-center items-center w-full">
      <div
        className="
          bg-white rounded-xl
          p-3 sm:p-4 md:p-5                /* menos padding no desktop */
          border border-gray-200 shadow-sm
          hover:shadow-md transition
          flex flex-col md:flex-row items-center
          gap-3 sm:gap-4 md:gap-5          /* gaps menores */
          w-full
          max-w-sm sm:max-w-lg md:max-w-2xl/* cartão menor no desktop */
          cursor-pointer hover:-translate-y-0.5 hover:scale-[1.01]
          duration-200
        "
      >
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-center sm:justify-start md:justify-center md:flex-shrink-0">
          <div className="bg-gray-100 rounded-xl p-3 sm:p-3 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12">
            {icon}
          </div>
          <h2 className="text-base sm:text-lg md:hidden font-bold text-gray-900">
            {title}
          </h2>
        </div>

        <div className="flex flex-col md:flex-1 md:gap-1.5 items-center md:items-start text-center md:text-left w-full">
          <h2 className="hidden md:block text-lg font-bold text-gray-900">
            {title}
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <button
          onClick={async () => {
            setLoading(true);
            router.push(href);
          }}
          disabled={loading}
          className={`
            relative inline-flex items-center justify-center
            ${BTN_WIDTH} ${BTN_HEIGHT}             /* FIXA o tamanho */
            rounded-md font-semibold
            bg-orange-500 text-white
            hover:brightness-110
            disabled:opacity-70 disabled:cursor-not-allowed
            flex-shrink-0
            text-sm                                  /* texto menor */
          `}
          aria-busy={loading}
        >
          <span className={`inline-flex items-center gap-2 transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
            Jogar <ArrowRight className="w-4 h-4" />
          </span>

          {loading && (
            <svg
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
