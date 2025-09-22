'use client';

import { Play, Smile, FileText, Users, Trophy, Clock, HelpCircle, Star, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StickerBackground from '../../../components/StickerBackground';

export default function AboutPage() {
  const router = useRouter();

  const gameFeatures = [
    {
      icon: <Play className="text-green-500 w-6 h-6" />,
      title: "Modo Clássico",
      description: "Jogue o tradicional jogo de adivinhação com dicas visuais dos seus personagens favoritos da DreamWorks."
    },
    {
      icon: <Smile className="text-orange-500 w-6 h-6" />,
      title: "Modo Emojis",
      description: "Descubra personagens através de pistas divertidas usando emojis criativos e expressivos."
    },
    {
      icon: <FileText className="text-yellow-500 w-6 h-6" />,
      title: "Modo Descrição",
      description: "Use descrições detalhadas e características únicas para identificar o personagem misterioso."
    }
  ];

  const gameStats = [
    {
      icon: <Users className="text-blue-500 w-6 h-6" />,
      title: "Personagens Únicos",
      description: "Mais de 50+ personagens icônicos da DreamWorks para você descobrir e colecionar."
    },
    {
      icon: <Smile className="text-purple-500 w-6 h-6" />,
      title: "Nostalgia Garantida",
      description: "Reviva momentos marcantes dos filmes clássicos da DreamWorks enquanto joga."
    },
    {
      icon: <Clock className="text-red-500 w-6 h-6" />,
      title: "Desafios Diários",
      description: "Novos desafios todos os dias para manter a diversão sempre renovada."
    }
  ];

  const howToPlay = [
    {
      step: "1",
      title: "Escolha seu Modo",
      description: "Selecione entre Clássico, Emojis ou Descrição baseado na sua preferência."
    },
    {
      step: "2",
      title: "Analise as Pistas",
      description: "Use as dicas fornecidas para deduzir qual personagem da DreamWorks está sendo apresentado."
    },
    {
      step: "3",
      title: "Faça sua Tentativa",
      description: "Digite o nome do personagem que você acredita ser a resposta correta."
    },
    {
      step: "4",
      title: "Receba Feedback",
      description: "Veja se acertou e receba dicas adicionais se necessário para continuar jogando."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* <StickerBackground /> */}

      {/* Header */}
      <div className="relative z-10 px-4 pt-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar ao Início
          </button>

          <div className="text-center mb-12 ">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/logo_dreams.svg"
                alt="Logo Wordle of Dreams"
                className="w-32 h-32"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
              Sobre o <span className="text-orange-500 font-pacifico">Wordle of Dreams</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-raleway">
              Mergulhe no universo mágico da DreamWorks e teste seus conhecimentos sobre os personagens mais queridos do cinema de animação!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Sobre o Jogo */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              O que é o Wordle of Dreams?
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                O <strong>Wordle of Dreams</strong> é um jogo de adivinhação inspirado no clássico Wordle, mas com uma twist especial:
                todos os desafios giram em torno dos personagens icônicos dos filmes da DreamWorks Animation.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Desde Shrek até Po do Kung Fu Panda, passando por Alex de Madagascar e muitos outros, você terá a oportunidade
                de testar seus conhecimentos sobre esses personagens queridos através de diferentes modos de jogo únicos e divertidos.
              </p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <p className="text-orange-800 font-semibold">
                  💡 Dica: Quanto mais você jogar, mais familiarizado ficará com os personagens e suas características únicas!
                </p>
              </div>
            </div>
          </section>

          {/* Modos de Jogo */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Modos de Jogo
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {gameFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="bg-gray-100 rounded-full p-3 w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Características do Jogo */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Características do Jogo
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {gameStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="bg-gray-100 rounded-full p-3 w-fit mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{stat.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{stat.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Como Jogar */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Como Jogar
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="grid md:grid-cols-2 gap-8">
                {howToPlay.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
                {[
                {
                  question: "Quantas tentativas eu tenho para adivinhar?",
                  answer: "Você terá quantas tentativas forem necesssarias para adivinhar o personagem correto."
                },
                {
                  question: "Os personagens são apenas dos filmes principais?",
                  answer: "Incluímos personagens de todos os filmes da DreamWorks, desde protagonistas até personagens secundários memoráveis."
                },
                {
                  question: "Posso jogar offline?",
                  answer: "Atualmente o jogo requer conexão com a internet para funcionar corretamente e sincronizar seus progressos."
                },
                {
                  question: "Há algum sistema de ranking?",
                  answer: "Ainda não há sistema de ranking, mas futuramente pretendemos adicionar essa funcionalidade para que você possa comparar seu desempenho com outros jogadores."
                }
                ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                  <HelpCircle className="text-orange-500 w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                  </div>
                </div>
                ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-white">
              <Star className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Pronto para Jogar?</h2>
              <p className="text-lg mb-6 opacity-90">
                Teste seus conhecimentos sobre os personagens da DreamWorks agora mesmo!
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-white text-orange-500 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Começar a Jogar
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
