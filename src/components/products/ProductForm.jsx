import { useState } from 'react'
import Input from '../ui/Input'

export default function ProductForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    name:              initial.name              ?? '',
    sku:               initial.sku               ?? '',
    description:       initial.description       ?? '',
    quantityOnHand:    initial.quantityOnHand     ?? '',
    costPrice:         initial.costPrice          ?? '',
    sellingPrice:      initial.sellingPrice       ?? '',
    lowStockThreshold: initial.lowStockThreshold  ?? '',
  })
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())  e.name = 'Product name is required'
    if (!form.sku.trim())   e.sku  = 'SKU is required'
    if (form.quantityOnHand !== '' && (isNaN(form.quantityOnHand) || Number(form.quantityOnHand) < 0))
      e.quantityOnHand = 'Must be 0 or more'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return

    const payload = {
      name:  form.name.trim(),
      sku:   form.sku.trim(),
    }
    if (form.description)       payload.description       = form.description.trim()
    if (form.quantityOnHand !== '') payload.quantityOnHand = Number(form.quantityOnHand)
    if (form.costPrice !== '')      payload.costPrice      = form.costPrice
    if (form.sellingPrice !== '')   payload.sellingPrice   = form.sellingPrice
    if (form.lowStockThreshold !== '') payload.lowStockThreshold = Number(form.lowStockThreshold)

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Product name"
          placeholder="e.g. Blue Widget"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          error={errors.name}
          autoFocus
        />
        <Input
          label="SKU"
          placeholder="e.g. BLU-WGT-001"
          value={form.sku}
          onChange={e => set('sku', e.target.value)}
          error={errors.sku}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[#8891a8] uppercase tracking-wider block mb-1.5">
          Description
        </label>
        <textarea
          rows={2}
          placeholder="Optional product description"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0d0f12] border border-[#232832] text-sm
            text-[#e2e6f0] placeholder-[#3d4455] outline-none resize-none
            focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10 transition-all"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Qty on hand"
          type="number"
          placeholder="0"
          min="0"
          value={form.quantityOnHand}
          onChange={e => set('quantityOnHand', e.target.value)}
          error={errors.quantityOnHand}
        />
        <Input
          label="Cost price ($)"
          type="number"
          placeholder="0.00"
          min="0"
          step="0.01"
          value={form.costPrice}
          onChange={e => set('costPrice', e.target.value)}
        />
        <Input
          label="Selling price ($)"
          type="number"
          placeholder="0.00"
          min="0"
          step="0.01"
          value={form.sellingPrice}
          onChange={e => set('sellingPrice', e.target.value)}
        />
      </div>

      <Input
        label="Low stock threshold"
        type="number"
        placeholder="Leave blank to use org default"
        min="0"
        value={form.lowStockThreshold}
        onChange={e => set('lowStockThreshold', e.target.value)}
        hint="Alert when quantity falls at or below this number"
      />

      <div className="pt-1 flex gap-3 justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-amber-400 text-black text-sm font-semibold
            hover:bg-amber-300 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save product'}
        </button>
      </div>
    </form>
  )
}
