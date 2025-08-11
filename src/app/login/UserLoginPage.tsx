'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, MailCheck } from 'lucide-react';
import { authUser } from '@/services/authUser';

export default function UserLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifiedParam = searchParams.get('verified');

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setInfo(null);
    try {
      await authUser.login(email, password);
      router.push('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Falha no login.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setInfo(null);
    try {
      await authUser.register({ email, password, username });
      setInfo('Conta criada! Enviamos um e-mail de verificação. Verifique sua caixa de entrada.');
      setTab('login');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Falha ao registrar.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!email) return;
    setLoading(true); setError(null); setInfo(null);
    try {
      const res = await authUser.resendVerification(email);
      setInfo(res.message);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Não foi possível reenviar.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderVerificationBanner = () => {
    if (verifiedParam === '1') {
      return (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-semibold">E-mail verificado com sucesso!</h3>
              <p className="text-sm opacity-90">
                Agora você já pode entrar com suas credenciais.
              </p>
            </div>
          </div>
        </div>
      );
    }
    if (verifiedParam === '0') {
      return (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">
          <div className="flex items-start gap-3">
            <XCircle className="h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-semibold">Não foi possível verificar seu e-mail.</h3>
              <p className="text-sm opacity-90">
                O link pode ter expirado ou é inválido. Informe seu e-mail abaixo e clique em{' '}
                <strong>“Reenviar verificação para este e-mail”</strong>.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {renderVerificationBanner()}

        <div className="w-full bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <MailCheck className="h-6 w-6 text-gray-800" />
            <h1 className="text-xl font-semibold text-gray-900">
              Acesse sua conta
            </h1>
          </div>

          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                tab === 'login' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => { setTab('login'); setError(null); setInfo(null); }}
            >
              Login
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                tab === 'register' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => { setTab('register'); setError(null); setInfo(null); }}
            >
              Registrar
            </button>
          </div>

          {info && <p className="mb-4 text-sm text-green-600">{info}</p>}
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {tab === 'login' ? (
            <form onSubmit={onLogin} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">E-mail</label>
                <input
                  type="email"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Senha</label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white rounded-lg py-2 font-medium hover:bg-gray-800 disabled:opacity-60"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <button
                type="button"
                onClick={onResend}
                disabled={!email || loading}
                className="w-full border mt-2 border-gray-300 text-gray-700 rounded-lg py-2 font-medium hover:bg-gray-50 disabled:opacity-60"
              >
                Reenviar verificação para este e-mail
              </button>

              <p className="text-xs text-gray-500 text-center">
                Admin? Vá para{' '}
                <Link href="/admin/login" className="underline hover:text-gray-700">
                  Login do Admin
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={onRegister} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Username</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">E-mail</label>
                <input
                  type="email"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Senha</label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white rounded-lg py-2 font-medium hover:bg-gray-800 disabled:opacity-60"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Ao criar a conta, enviaremos um e-mail para verificação.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
