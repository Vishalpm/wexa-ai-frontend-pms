export function getError(err) {
  return (
    err?.response?.data?.errors?.[0]?.msg ||
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong'
  )
}

export function formatCurrency(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

export function formatNumber(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-US').format(val)
}
