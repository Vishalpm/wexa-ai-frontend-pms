import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'

export default function AdjustStockModal({ open, onClose, onSubmit, loading, currentQty, productName }) {
  const [adjustment, setAdjustment] = useState('')
  const [note, setNote]             = useState('')
  const [error, setError]           = useState('')

  function handleClose() {
    setAdjustment('')
    setNote('')
    setError('')
    onClose()
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!adjustment || isNaN(Number(adjustment))) {
      setError('Enter a valid number (positive to add, negative to remove)')
      return
    }
    const newQty = Number(currentQty) + Number(adjustment)
    if (newQty < 0) {
      setError(`Cannot go below 0. Current: ${currentQty}, adjustment: ${adjustment}`)
      return
    }
    onSubmit({ adjustment: Number(adjustment), note })
    setAdjustment('')
    setNote('')
    setError('')
  }

  const preview = adjustment !== '' && !isNaN(Number(adjustment))
    ? Number(currentQty) + Number(adjustment)
    : null

  return (
    <Modal open={open} onClose={handleClose} title="Adjust stock" width="max-w-sm">
      <div className="mb-5 p-3 rounded-xl bg-[#0d0f12] border border-[#232832]">
        <p className="text-xs text-[#8891a8] mb-0.5">{productName}</p>
        <p className="text-sm font-medium text-[#e2e6f0]">
          Current quantity: <span className="text-amber-400 font-semibold">{currentQty}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Adjustment"
            type="number"
            placeholder="+10 or -5"
            value={adjustment}
            onChange={e => { setAdjustment(e.target.value); setError('') }}
            error={error}
            hint={preview !== null ? `New quantity will be: ${preview}` : undefined}
            autoFocus
          />
        </div>

        <Input
          label="Note (optional)"
          placeholder="e.g. Weekend market sale"
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-lg border border-[#232832] text-sm text-[#8891a8] hover:text-[#e2e6f0] hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Apply'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
