import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/client'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) return
    setLoading(true); setError('')
    try {
      const { data } = await api.post<{ token: string; username: string; role: string }>(
        '/auth/login', { username, password }
      )
      if (data.role !== 'MANAGER') { setError('Acesso negado. Use as credenciais de gerência.'); return }
      login(data.token, data.username, data.role)
      navigate('/dashboard')
    } catch {
      setError('Usuário ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-indigo-600 items-center justify-center text-2xl mb-3 shadow-lg">📊</div>
          <h1 className="text-2xl font-bold text-gray-900">Gerência</h1>
          <p className="text-gray-500 text-sm mt-1">Painel administrativo</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide">USUÁRIO</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="gerente1"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-300 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide">SENHA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-300 transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm py-2 px-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !username || !password}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
        <p className="text-center text-gray-400 text-xs mt-4">gerente1 / gerente123</p>
      </div>
    </div>
  )
}