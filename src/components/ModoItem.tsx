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

  return (
    <div className="flex flex-row justify-center items-center w-full">
      <div
        className="bg-white rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 w-full max-w-xs sm:max-w-lg md:max-w-4xl cursor-pointer hover:-translate-y-1 hover:scale-[1.02] sm:hover:scale-[1.03] duration-200"
      >
        {/* Seção do ícone e título */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-center sm:justify-start md:justify-center md:flex-shrink-0">
          <div className="bg-gray-100 rounded-xl p-3 sm:p-4 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
            {icon}
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 md:hidden">{title}</h2>
        </div>

        {/* Seção do conteúdo principal em telas tablets e maiores */}
        <div className="flex flex-col md:flex-1 md:gap-2 items-center md:items-start text-center md:text-left w-full">
          <h2 className="hidden md:block text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{description}</p>
        </div>

        {/* Botão */}
        <button
          onClick={async () => {
            setLoading(true);
            router.push(href);
          }}
          disabled={loading}
          className={`bg-orange-500 text-white px-4 py-2 sm:px-6 sm:py-2 md:px-8 md:py-3 rounded-md font-semibold flex items-center gap-2 hover:brightness-150 text-sm sm:text-base md:text-lg flex-shrink-0 w-full sm:w-auto md:w-auto justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <>
              Jogar <ArrowRight size={14} className="sm:size-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
