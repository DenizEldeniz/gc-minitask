import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getAuthErrorMessage } from '../utils/firebaseErrors'
import { validateRegisterForm } from '../validation'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    const result = validateRegisterForm({ firstName, lastName, email, password, passwordConfirm })
    if (!result.valid) {
      setFieldErrors(result.errors ?? {})
      return
    }
    setLoading(true)
    try {
      await register(email.trim(), password, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
      navigate('/')
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors ${hasError
      ? 'border-rose-500/40 focus:border-rose-500/70'
      : 'border-white/[0.08] focus:border-primary-500/50'
    }`

  return (
    <div className="min-h-screen flex bg-[#0a0a0f]">

      {/* ── Sol: Dekoratif panel ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden border-r border-white/[0.06]">
        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-primary-600/20 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -left-16 w-96 h-96 rounded-full bg-primary-800/20 blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-white/[0.02] blur-3xl animate-float-slower" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center shrink-0 shadow-lg shadow-primary-900/40">
              <span className="text-white font-black text-xs tracking-tighter">GC</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-white font-bold text-base tracking-tight">tasks</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mb-0.5 shrink-0" />
            </div>
          </div>

          {/* Hero text */}
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Hesabınızı
              <br />
              <span className="text-primary-400">oluşturun</span>
            </h1>
            <p className="text-white/40 text-lg max-w-md">
              Birkaç adımda üye olun ve görevlerinizi yönetmeye başlayın.
            </p>
          </div>

          {/* Dots */}
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-float" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-float-slow" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary-400/60 animate-float-slower" />
          </div>
        </div>
      </div>

      {/* ── Sağ: Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[420px] animate-fade-in">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-baseline gap-0.5">
              <span className="text-white font-bold text-base tracking-tight">tasks</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mb-0.5 shrink-0" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Kayıt ol</h2>
          <p className="text-white/40 text-sm mb-8">Yeni hesabınızla başlayın</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-rose-400 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Ad</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Adınız"
                  autoComplete="given-name"
                  className={inputClass(!!fieldErrors.firstName)}
                />
                {fieldErrors.firstName && <p className="text-xs text-rose-400 mt-1">{fieldErrors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Soyad</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Soyadınız"
                  autoComplete="family-name"
                  className={inputClass(!!fieldErrors.lastName)}
                />
                {fieldErrors.lastName && <p className="text-xs text-rose-400 mt-1">{fieldErrors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                autoComplete="email"
                className={inputClass(!!fieldErrors.email)}
              />
              {fieldErrors.email && <p className="text-xs text-rose-400 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                autoComplete="new-password"
                className={inputClass(!!fieldErrors.password)}
              />
              {fieldErrors.password && <p className="text-xs text-rose-400 mt-1">{fieldErrors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Şifre tekrar</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                autoComplete="new-password"
                className={inputClass(!!fieldErrors.passwordConfirm)}
              />
              {fieldErrors.passwordConfirm && <p className="text-xs text-rose-400 mt-1">{fieldErrors.passwordConfirm}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Kayıt yapılıyor...
                </span>
              ) : 'Kayıt ol'}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-8">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
