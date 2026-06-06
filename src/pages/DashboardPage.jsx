import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, AlertTriangle, BarChart2, ArrowRight, TrendingDown } from 'lucide-react'
import { dashboardApi } from '../api'
import { formatNumber, formatCurrency } from '../lib/utils'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="bg-[#13161b] border border-[#232832] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-[#e2e6f0] tracking-tight">{value}</p>
      <p className="text-sm text-[#8891a8] mt-0.5">{label}</p>
      {sub && <p className="text-xs text-[#3d4455] mt-1">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.get()
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={26} />
      </div>
    )
  }

  const { summary, lowStockItems } = data || {}

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#e2e6f0]">Dashboard</h1>
        <p className="text-sm text-[#8891a8] mt-0.5">Your inventory at a glance</p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total products"
          value={formatNumber(summary?.totalProducts)}
          icon={Package}
          accent="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          label="Units in stock"
          value={formatNumber(summary?.totalQuantityOnHand)}
          icon={BarChart2}
          accent="bg-green-500/10 text-green-400"
        />
        <StatCard
          label="Low stock alerts"
          value={formatNumber(summary?.lowStockCount)}
          icon={AlertTriangle}
          accent={summary?.lowStockCount > 0 ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-[#8891a8]'}
        />
      </div>

      {/* low stock table */}
      <div className="bg-[#13161b] border border-[#232832] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#232832]">
          <div className="flex items-center gap-2.5">
            <TrendingDown size={16} className="text-red-400" />
            <h2 className="text-sm font-semibold text-[#e2e6f0]">Low stock items</h2>
            {summary?.lowStockCount > 0 && (
              <Badge variant="red">{summary.lowStockCount}</Badge>
            )}
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-xs text-[#8891a8] hover:text-amber-400 transition-colors"
          >
            View all products <ArrowRight size={12} />
          </Link>
        </div>

        {lowStockItems?.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-3">
              <Package size={20} className="text-green-400" />
            </div>
            <p className="text-sm font-medium text-[#e2e6f0]">All stocked up</p>
            <p className="text-xs text-[#8891a8] mt-1">No products are running low right now</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#232832]">
                <th className="text-left text-xs font-medium text-[#8891a8] px-5 py-3">Product</th>
                <th className="text-left text-xs font-medium text-[#8891a8] px-5 py-3">SKU</th>
                <th className="text-right text-xs font-medium text-[#8891a8] px-5 py-3">In stock</th>
                <th className="text-right text-xs font-medium text-[#8891a8] px-5 py-3">Threshold</th>
                <th className="text-right text-xs font-medium text-[#8891a8] px-5 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-[#232832] last:border-0 hover:bg-white/[0.02] transition-colors`}
                >
                  <td className="px-5 py-3">
                    <Link to={`/products/${item.id}`} className="text-sm font-medium text-[#e2e6f0] hover:text-amber-400 transition-colors">
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs text-[#8891a8]">{item.sku}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm font-medium ${item.quantityOnHand === 0 ? 'text-red-400' : 'text-amber-400'}`}>
                      {item.quantityOnHand}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-sm text-[#8891a8]">{item.effectiveThreshold}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-sm text-[#e2e6f0]">{formatCurrency(item.sellingPrice)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
