'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Users, Gamepad2, Target } from 'lucide-react';
import { apiAdmin } from '@/lib/api';
import { KPI } from '@/interfaces/Stats';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [loading, setLoading] = useState(true);

  const loadKPIs = async () => {
    setLoading(true);
    try {
      const { data } = await apiAdmin.get<KPI>('/admin/dashboard/kpis', {
        withCredentials: true,
      });
      setKpis(data);
    } catch (err) {
      console.error('Erro ao carregar KPIs:', err);
      setKpis(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadKPIs();
      if (!mounted) return;
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 👇 TODOS os hooks ficam ANTES de qualquer return condicional
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: { legend: { position: 'top' as const } },
      scales: { y: { beginAtZero: true } },
    }),
    []
  );

  const accessData = useMemo(() => {
    const labels = kpis?.accessData?.labels ?? [];
    const acc =
      kpis?.accessData?.datasets?.find((ds) => ds.label === 'Acessos')?.data ?? [];
    const att =
      kpis?.accessData?.datasets?.find((ds) => ds.label === 'Tentativas')?.data ?? [];
    return {
      labels,
      datasets: [
        {
          label: 'Acessos',
          data: acc,
          borderColor: 'rgb(29, 78, 216)',
          backgroundColor: 'rgba(29, 78, 216, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Tentativas',
          data: att,
          borderColor: 'rgb(4, 120, 87)',
          backgroundColor: 'rgba(4, 120, 87, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }, [kpis]);

  const modeUsageData = useMemo(() => {
    const labels = kpis?.modeUsageData?.labels ?? [];
    const data = kpis?.modeUsageData?.datasets?.[0]?.data ?? [];
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(29, 78, 216, 0.8)',
            'rgba(4, 120, 87, 0.8)',
            'rgba(194, 65, 12, 0.8)',
            'rgba(126, 34, 206, 0.8)',
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [kpis]);

  const attemptsData = useMemo(() => {
    const labels = kpis?.attemptsData?.labels ?? [];
    const ds0 = kpis?.attemptsData?.datasets?.[0]?.data ?? [];
    const ds1 = kpis?.attemptsData?.datasets?.[1]?.data ?? [];
    return {
      labels,
      datasets: [
        { label: 'Tentativas', data: ds0, backgroundColor: 'rgba(29, 78, 216, 0.8)' },
        { label: 'Acertos', data: ds1, backgroundColor: 'rgba(4, 120, 87, 0.8)' },
      ],
    };
  }, [kpis]);

  if (loading || !kpis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800" />
      </div>
    );
  }

  // (Sem hooks abaixo daqui) — com kpis garantido
  const kpiCards = [
    { title: 'Total de Usuários', value: kpis.totalUsers, icon: Users, color: 'text-blue-800 bg-blue-200' },
    { title: 'Usuários Ativos', value: kpis.activeUsers, icon: Users, color: 'text-green-800 bg-green-200' },
    { title: 'Partidas Diárias', value: kpis.dailyGames, icon: Gamepad2, color: 'text-purple-800 bg-purple-200' },
    { title: 'Total de Tentativas', value: kpis.totalAttempts, icon: Target, color: 'text-orange-800 bg-orange-200' },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={loadKPIs}
          className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
        >
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${kpi.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-700">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Number(kpi.value ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Acessos vs Tentativas (24h)
          </h3>
          <Line data={accessData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uso por Modo de Jogo
          </h3>
          <Pie data={modeUsageData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tentativas vs Acertos por Modo
          </h3>
          <Bar data={attemptsData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 5 Personagens por Modo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(kpis.topCharacters || {}).map(([mode, chars], idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="font-medium text-gray-900">{mode}</h4>
              {(chars || []).map((tc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm text-gray-700"
                >
                  <span>{tc.character}</span>
                  <span className="font-medium">{tc.count}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
