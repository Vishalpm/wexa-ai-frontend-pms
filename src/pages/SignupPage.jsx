import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getError } from '../lib/utils'
import Input from '../components/ui/Input'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate   = useNavigate()

  const [form, setForm] = useState({ email: '', password: '', organizationName: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.email)            e.email            = 'Email is required'
    if (!form.password)         e.password         = 'Password is required'
    else if (form.password.length < 6) e.password  = 'At least 6 characters'
    if (!form.organizationName) e.organizationName = 'Organization name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signup(form.email, form.password, form.organizationName)
      navigate('/dashboard')
    } catch (err) {
      toast.error(getError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-[#0d0f12]">
      <div className="w-full max-w-sm">

        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center">
            <Zap size={16} className="text-black fill-black" />
          </div>
          <span className="text-base font-semibold text-[#e2e6f0]">StockFlow</span>
        </div>

        <h1 className="text-2xl font-semibold text-[#e2e6f0] mb-1">Create account</h1>
        <p className="text-sm text-[#8891a8] mb-8">Set up your inventory workspace</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Organization name"
            type="text"
            placeholder="Acme Store"
            value={form.organizationName}
            onChange={e => set('organizationName', e.target.value)}
            error={errors.organizationName}
            autoFocus
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={e => set('password', e.target.value)}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-lg bg-amber-400 text-black text-sm font-semibold
              hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-[#8891a8] mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
