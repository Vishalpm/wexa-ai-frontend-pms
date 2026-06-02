import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { productsApi } from '../api'
import { getError } from '../lib/utils'
import ProductForm from '../components/products/ProductForm'
import toast from 'react-hot-toast'

export default function CreateProductPage() {
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data) {
    setLoading(true)
    try {
      await productsApi.create(data)
      toast.success('Product created')
      navigate('/products')
    } catch (err) {
      toast.error(getError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-[#8891a8] hover:text-[#e2e6f0] transition-colors mb-7"
      >
        <ChevronLeft size={15} />
        Back to products
      </Link>

      <h1 className="text-xl font-semibold text-[#e2e6f0] mb-1">New product</h1>
      <p className="text-sm text-[#8891a8] mb-7">Add a new product to your inventory</p>

      <div className="bg-[#13161b] border border-[#232832] rounded-2xl p-6">
        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}
