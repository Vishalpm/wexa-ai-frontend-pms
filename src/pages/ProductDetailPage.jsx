import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft, Pencil, Trash2, ArrowUpDown, Package,
  DollarSign, Tag, AlignLeft, AlertTriangle
} from 'lucide-react'
import { productsApi } from '../api'
import { formatCurrency, formatNumber, getError } from '../lib/utils'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import AdjustStockModal from '../components/products/AdjustStockModal'
import ProductForm from '../components/products/ProductForm'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()

  const [product, setProduct]       = useState(null)
  const [loading, setLoading]       = useState(true)

  const [editOpen, setEditOpen]     = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const [adjustOpen, setAdjustOpen] = useState(false)
  const [adjustLoading, setAdjustLoading] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    productsApi.get(id)
      .then(r => setProduct(r.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleEdit(data) {
    setEditLoading(true)
    try {
      const r = await productsApi.update(id, data)
      setProduct(r.data)
      setEditOpen(false)
      toast.success('Product updated')
    } catch (err) {
      toast.error(getError(err))
    } finally {
      setEditLoading(false)
    }
  }

  async function handleAdjust({ adjustment, note }) {
    setAdjustLoading(true)
    try {
      const r = await productsApi.adjustStock(id, { adjustment, note })
      setProduct(r.data)
      setAdjustOpen(false)
      toast.success(`Stock adjusted to ${r.data.quantityOnHand}`)
    } catch (err) {
      toast.error(getError(err))
    } finally {
      setAdjustLoading(false)
    }
  }

  async function handleDelete() {
    setDeleteLoading(true)
    try {
      await productsApi.remove(id)
      toast.success('Product deleted')
      navigate('/products')
    } catch (err) {
      toast.error(getError(err))
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Spinner size={26} /></div>
  }

  if (!product) {
    return (
      <div className="p-8">
        <Link to="/products" className="text-sm text-amber-400 hover:underline">← Back to products</Link>
        <p className="text-[#8891a8] mt-6">Product not found.</p>
      </div>
    )
  }

  const stockStatus = product.quantityOnHand === 0 ? 'red'
    : product.isLowStock ? 'amber' : 'green'
  const stockLabel = product.quantityOnHand === 0 ? 'Out of stock'
    : product.isLowStock ? 'Low stock' : 'In stock'

  return (
    <div className="p-8 max-w-3xl mx-auto">

      {/* back */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-[#8891a8] hover:text-[#e2e6f0] transition-colors mb-7"
      >
        <ChevronLeft size={15} /> Back to products
      </Link>

      {/* header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-xl font-semibold text-[#e2e6f0]">{product.name}</h1>
            <Badge variant={stockStatus}>{stockLabel}</Badge>
          </div>
          <span className="font-mono text-xs bg-[#181c23] border border-[#232832] px-2 py-1 rounded-md text-[#8891a8]">
            {product.sku}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdjustOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#232832] text-sm text-[#8891a8] hover:text-[#e2e6f0] hover:bg-white/5 transition-colors"
          >
            <ArrowUpDown size={14} /> Adjust stock
          </button>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="w-9 h-9 rounded-lg border border-[#232832] flex items-center justify-center text-[#8891a8] hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* detail grid */}
      <div className="grid grid-cols-2 gap-4 mb-5">

        {/* stock card */}
        <div className="bg-[#13161b] border border-[#232832] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={15} className="text-[#8891a8]" />
            <span className="text-xs font-medium text-[#8891a8] uppercase tracking-wider">Inventory</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8891a8]">Qty on hand</span>
              <span className={`text-sm font-semibold tabular-nums
                ${product.quantityOnHand === 0 ? 'text-red-400'
                  : product.isLowStock ? 'text-amber-400' : 'text-green-400'}`}>
                {formatNumber(product.quantityOnHand)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8891a8]">Low stock at</span>
              <span className="text-sm text-[#e2e6f0]">{product.effectiveThreshold}</span>
            </div>
            {product.lowStockThreshold == null && (
              <p className="text-xs text-[#3d4455]">Using org default threshold</p>
            )}
          </div>
        </div>

        {/* pricing card */}
        <div className="bg-[#13161b] border border-[#232832] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={15} className="text-[#8891a8]" />
            <span className="text-xs font-medium text-[#8891a8] uppercase tracking-wider">Pricing</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8891a8]">Cost price</span>
              <span className="text-sm text-[#e2e6f0]">{formatCurrency(product.costPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8891a8]">Selling price</span>
              <span className="text-sm text-[#e2e6f0]">{formatCurrency(product.sellingPrice)}</span>
            </div>
            {product.costPrice && product.sellingPrice && (
              <div className="flex justify-between items-center pt-2 border-t border-[#232832]">
                <span className="text-sm text-[#8891a8]">Margin</span>
                <span className="text-sm text-green-400">
                  {((product.sellingPrice - product.costPrice) / product.sellingPrice * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* description */}
      {product.description && (
        <div className="bg-[#13161b] border border-[#232832] rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <AlignLeft size={15} className="text-[#8891a8]" />
            <span className="text-xs font-medium text-[#8891a8] uppercase tracking-wider">Description</span>
          </div>
          <p className="text-sm text-[#e2e6f0] leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* last update note */}
      {product.lastUpdatedNote && (
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 flex gap-3">
          <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-400 mb-0.5">Last stock note</p>
            <p className="text-sm text-[#e2e6f0]">{product.lastUpdatedNote}</p>
          </div>
        </div>
      )}

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit product" width="max-w-xl">
        <ProductForm initial={product} onSubmit={handleEdit} loading={editLoading} />
      </Modal>

      {/* Adjust stock modal */}
      <AdjustStockModal
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
        onSubmit={handleAdjust}
        loading={adjustLoading}
        currentQty={product.quantityOnHand}
        productName={product.name}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
