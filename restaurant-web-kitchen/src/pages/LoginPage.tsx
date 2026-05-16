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
      if (data.role !== 'KITCHEN') { setError('Acesso negado. Use as credenciais da cozinha.'); return }
      login(data.token, data.username, data.role)
      navigate('/kitchen')
    } catch {
      setError('Usuário ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-amber-500 items-center justify-center text-3xl mb-4">🍳</div>
          <h1 className="text-2xl font-bold text-white">Painel da Cozinha</h1>
          <p className="text-zinc-400 text-sm mt-1">Acesso restrito à equipe</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">USUÁRIO</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cozinha1"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 placeholder-zinc-600 text-sm transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">SENHA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 placeholder-zinc-600 text-sm transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-400 text-sm py-2 px-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !username || !password}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-3 rounded-xl transition-colors mt-1"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
        <p className="text-center text-zinc-600 text-xs mt-4">
          Credencial padrão: cozinha1 / cozinha123
        </p>
      </div>
    </div>
  )
}
