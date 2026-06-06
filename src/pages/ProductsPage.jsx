import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Package, Pencil, Trash2 } from 'lucide-react'
import { productsApi } from '../api'
import { formatCurrency, formatNumber, getError } from '../lib/utils'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [meta, setMeta]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)

  const searchTimer = useRef(null)

  const loadProducts = useCallback(async (q, pg) => {
    setLoading(true)
    try {
      const params = { page: pg, limit: 20 }
      if (q.trim()) params.search = q.trim()
      const r = await productsApi.list(params)
      setProducts(r.data.data)
      setMeta(r.data.meta)
    } catch (err) {
      toast.error(getError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProducts(search, page) }, [page])

  function handleSearchChange(val) {
    setSearch(val)
    setPage(1)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => loadProducts(val, 1), 350)
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await productsApi.remove(deleteTarget.id)
      toast.success('Product deleted')
      setDeleteTarget(null)
      loadProducts(search, page)
    } catch (err) {
      toast.error(getError(err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-[#e2e6f0]">Products</h1>
          <p className="text-sm text-[#8891a8] mt-0.5">
            {meta ? `${formatNumber(meta.total)} product${meta.total !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <Link
          to="/products/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition-colors"
        >
          <Plus size={15} />
          Add product
        </Link>
      </div>

      {/* search bar */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d4455] pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#13161b] border border-[#232832]
            text-sm text-[#e2e6f0] placeholder-[#3d4455] outline-none
            focus:border-amber-400/60 focus:ring-2 focus:ring-amber-500/8 transition-all"
        />
      </div>

      {/* table */}
      <div className="bg-[#13161b] border border-[#232832] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-24 flex justify-center">
            <Spinner size={24} />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title={search ? 'No products match your search' : 'No products yet'}
            description={search ? 'Try a different search term' : 'Add your first product to get started'}
            action={
              !search && (
                <Link
                  to="/products/new"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition-colors"
                >
                  <Plus size={14} /> Add product
                </Link>
              )
            }
          />
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#232832]">
                  <th className="text-left text-xs font-medium text-[#8891a8] px-5 py-3">Name</th>
                  <th className="text-left text-xs font-medium text-[#8891a8] px-5 py-3">SKU</th>
                  <th className="text-right text-xs font-medium text-[#8891a8] px-5 py-3">Qty</th>
                  <th className="text-right text-xs font-medium text-[#8891a8] px-5 py-3">Selling price</th>
                  <th className="text-center text-xs font-medium text-[#8891a8] px-5 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-[#8891a8] px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr
                    key={product.id}
                    className="border-b border-[#232832] last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-sm font-medium text-[#e2e6f0] hover:text-amber-400 transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      {product.description && (
                        <p className="text-xs text-[#3d4455] mt-0.5 truncate max-w-xs">{product.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs bg-[#181c23] border border-[#232832] px-2 py-0.5 rounded-md text-[#8891a8]">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`text-sm font-semibold tabular-nums
                        ${product.quantityOnHand === 0 ? 'text-red-400' :
                          product.isLowStock ? 'text-amber-400' : 'text-[#e2e6f0]'}`}>
                        {formatNumber(product.quantityOnHand)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm text-[#e2e6f0]">{formatCurrency(product.sellingPrice)}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {product.quantityOnHand === 0 ? (
                        <Badge variant="red">Out of stock</Badge>
                      ) : product.isLowStock ? (
                        <Badge variant="amber">Low stock</Badge>
                      ) : (
                        <Badge variant="green">In stock</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/products/${product.id}/edit`)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8891a8] hover:text-[#e2e6f0] hover:bg-white/5 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8891a8] hover:text-red-400 hover:bg-red-500/5 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#232832]">
                <p className="text-xs text-[#8891a8]">
                  Page {meta.page} of {meta.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={meta.page <= 1}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#8891a8] border border-[#232832] hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={meta.page >= meta.totalPages}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#8891a8] border border-[#232832] hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
