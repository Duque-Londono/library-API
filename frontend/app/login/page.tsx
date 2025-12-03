'use client'

import { useState } from 'react'
// NOTA: Reemplazo de 'next/navigation' por un dummy para runnability en este entorno
const useRouter = () => ({
  push: (path: string) => {
    // Implementación para forzar la redirección en este entorno
    window.location.href = path;
  },
})
import axios from 'axios'

// Simulación de las variables de entorno para runnability
const API_URL = process.env.NEXT_PUBLIC_API_URL // Reemplaza con tu URL real en el proyecto

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // --- LÓGICA NO MODIFICADA ---
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await axios.post(`${API_URL}${endpoint}`, {
        email,
        password,
      })

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('email', response.data.email)
      router.push('/dashboard')
      // --- FIN DE LÓGICA NO MODIFICADA ---
    } catch (err: any) {
      // Manejo de errores simulado/real
      setError(err.response?.data?.error || 'Error de conexión o credenciales inválidas.')
    } finally {
      setLoading(false)
    }
  }

  const closeWelcome = () => {
    setShowWelcome(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 font-sans text-gray-100 relative overflow-hidden">
      
      {/* Decoraciones de fondo (Neo-Brutalism / Cyberpunk Glow) */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE3MTcxNyIgc3Ryb2tlLW9wYWNpdHk9IjAuNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-5"></div>
      
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
        .glow-shadow {
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.4), 0 0 30px rgba(99, 102, 241, 0.2);
        }
        .input-glow:focus {
          border-color: #6366f1; /* Indigo-500 */
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);
        }
      `}</style>
      
      {/* Modal de Bienvenida */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-800 border-2 border-indigo-700/50 rounded-2xl shadow-2xl max-w-2xl w-full animate-slide-up overflow-hidden glow-shadow">
            
            {/* Header con gradiente */}
            <div className="p-8 text-center bg-gray-900 border-b-2 border-indigo-700/50 relative">
              <div className="relative z-10">
                <div className="inline-block p-3 bg-purple-600 rounded-xl mb-3 border border-indigo-500 shadow-lg shadow-purple-900/50">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-1 tracking-wide">
                  BIENVENIDO A BOOKSEARCH
                </h2>
                <p className="text-indigo-400 text-lg font-mono uppercase">
                  Estás invitado a explorar un universo de conocimiento
                </p>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-8">
              <div className="space-y-6">
                <p className="text-gray-300 text-lg text-center leading-relaxed">
                  Accede a la <span className="font-bold text-purple-400">mejor libreria</span> del mundo. 
                  Inicia sesión o regístrate para comenzar la búsqueda.
                </p>

                {/* Features rápidos (Estilo Matriz de Datos) */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-900 rounded-lg p-3 text-center border border-indigo-700/50 shadow-inner shadow-gray-900">
                    <div className="text-3xl mb-1">⚡</div>
                    <p className="text-xs font-semibold text-purple-400">BÚSQUEDA</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3 text-center border border-indigo-700/50 shadow-inner shadow-gray-900">
                    <div className="text-3xl mb-1">🗃️</div>
                    <p className="text-xs font-semibold text-purple-400">CATÁLOGO</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3 text-center border border-indigo-700/50 shadow-inner shadow-gray-900">
                    <div className="text-3xl mb-1">🛡️</div>
                    <p className="text-xs font-semibold text-purple-400">ACCESO SEGURO</p>
                  </div>
                </div>

                {/* Botón de cerrar */}
                <button
                  onClick={closeWelcome}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg tracking-wider hover:from-purple-500 hover:to-indigo-500 transition-all border-2 border-white/20 shadow-lg shadow-purple-900/50 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  COMENZAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de Login (Foco principal) */}
      <div className="bg-gray-800 border-2 border-indigo-700/50 rounded-2xl p-10 w-full max-w-md relative z-10 animate-slide-up glow-shadow">
        
        {/* Logo y título */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-gray-900 rounded-2xl mb-4 border border-purple-500 shadow-xl shadow-purple-900/50">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wider">
            BookSearch
          </h1>
          <p className="text-indigo-400 text-sm font-mono uppercase">
            {isLogin ? 'QUE GUSTO VERTE DE NUEVO' : 'CREA TU PERFIL DE LECTOR'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 bg-gray-900 rounded-xl p-1.5 border border-gray-700 shadow-inner shadow-gray-900">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 font-semibold tracking-wide ${
              isLogin 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'text-gray-400 hover:text-indigo-400'
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 font-semibold tracking-wide ${
              !isLogin 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                : 'text-gray-400 hover:text-purple-400'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-xs font-mono text-purple-400 mb-2 transition-colors group-focus-within:text-white">
              CORREO ELECTRÓNICO
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-900 rounded-lg border border-gray-700 text-white placeholder-gray-600 input-glow outline-none transition-all duration-300 font-mono text-sm"
                placeholder="user@domain.com"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-mono text-purple-400 mb-2 transition-colors group-focus-within:text-white">
              CONTRASEÑA
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-900 rounded-lg border border-gray-700 text-white placeholder-gray-600 input-glow outline-none transition-all duration-300 font-mono text-sm"
                placeholder="********"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded-lg font-mono text-sm shadow-xl shadow-red-900/30 animate-slide-up">
              <p className="font-bold">ERROR DE ACCESO:</p>
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-extrabold tracking-widest hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-900/50 transform hover:scale-[1.01] active:scale-[0.98] border border-white/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ...VERIFICANDO
              </span>
            ) : (
              isLogin ? 'INGRESAR' : 'CREAR CUENTA'
            )}
          </button>
        </form>

        <div className="mt-6 text-center font-mono">
          <p className="text-xs text-gray-500">
            {isLogin ? '¿NO TIENES UNA CUENTA?' : '¿YA TIENES UNA CUENTA?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-indigo-400 font-semibold transition-colors tracking-wider"
            >
              {isLogin ? '>> REGISTRAR' : '>> INICIAR SESIÓN'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}