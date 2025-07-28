import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface ModoCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

export default function ModoItem({ title, description, icon, href }: ModoCardProps) {
  const router = useRouter();

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition flex flex-row items-center gap-6 w-full max-w-md min-w-[320px]">
        <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center w-16 h-16">
          {icon}
        </div>
        <div className="flex flex-col flex-1 text-left gap-2 min-w-0">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <button
          onClick={() => router.push(href)}
          className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2 hover:brightness-110"
        >
          Jogar <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}