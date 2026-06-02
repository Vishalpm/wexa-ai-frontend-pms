import { useEffect, useState } from 'react'
import { settingsApi } from '../api'
import { getError } from '../lib/utils'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { updateUser } = useAuth()

  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [form, setForm]         = useState({ organizationName: '', defaultLowStockThreshold: '' })
  const [errors, setErrors]     = useState({})

  useEffect(() => {
    settingsApi.get()
      .then(r => {
        setForm({
          organizationName:       r.data.organizationName,
          defaultLowStockThreshold: String(r.data.defaultLowStockThreshold),
        })
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.organizationName.trim()) e.organizationName = 'Organization name is required'
    if (!form.defaultLowStockThreshold && form.defaultLowStockThreshold !== '0')
      e.defaultLowStockThreshold = 'Threshold is required'
    else if (isNaN(Number(form.defaultLowStockThreshold)) || Number(form.defaultLowStockThreshold) < 0)
      e.defaultLowStockThreshold = 'Must be 0 or more'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const r = await settingsApi.update({
        organizationName:         form.organizationName.trim(),
        defaultLowStockThreshold: Number(form.defaultLowStockThreshold),
      })
      updateUser({ organizationName: r.data.organizationName })
      toast.success('Settings saved')
    } catch (err) {
      toast.error(getError(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={26} />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#e2e6f0]">Settings</h1>
        <p className="text-sm text-[#8891a8] mt-0.5">Manage your organization preferences</p>
      </div>

      <div className="bg-[#13161b] border border-[#232832] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <h2 className="text-sm font-semibold text-[#e2e6f0] mb-4">Organization</h2>
            <Input
              label="Organization name"
              type="text"
              value={form.organizationName}
              onChange={e => set('organizationName', e.target.value)}
              error={errors.organizationName}
            />
          </div>

          <div className="border-t border-[#232832] pt-5">
            <h2 className="text-sm font-semibold text-[#e2e6f0] mb-1">Inventory defaults</h2>
            <p className="text-xs text-[#8891a8] mb-4">
              Applied to products that don't have their own low stock threshold set.
            </p>
            <Input
              label="Default low stock threshold"
              type="number"
              min="0"
              value={form.defaultLowStockThreshold}
              onChange={e => set('defaultLowStockThreshold', e.target.value)}
              error={errors.defaultLowStockThreshold}
              hint="Products at or below this quantity will be flagged as low stock"
            />
          </div>

          <div className="pt-1 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-amber-400 text-black text-sm font-semibold
                hover:bg-amber-300 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
