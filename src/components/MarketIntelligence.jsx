import { markets, volumeChartData, recentTransactions, aiInsights } from '../data/mockData'

function fmt(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toLocaleString()}`
}

function AreaChart({ data }) {
  const W = 780, H = 180, PAD = { t: 10, r: 20, b: 36, l: 45 }
  const chartW = W - PAD.l - PAD.r
  const chartH = H - PAD.t - PAD.b

  // Total volume per month
  const totals = data.map(d => d.Vancouver + d.Seattle + d.Portland + d.SanFrancisco)
  const maxVal = Math.max(...totals) * 1.15
  const months = data.map(d => d.month)

  const xScale = (i) => PAD.l + (i / (data.length - 1)) * chartW
  const yScale = (v) => PAD.t + chartH - (v / maxVal) * chartH

  // Total line points
  const points = totals.map((v, i) => `${xScale(i)},${yScale(v)}`)
  const polyline = points.join(' ')

  // Fill area
  const fillPath = `M ${xScale(0)},${PAD.t + chartH} L ${points.join(' L ')} L ${xScale(data.length - 1)},${PAD.t + chartH} Z`

  // Vancouver only
  const vanPoints = data.map((d, i) => `${xScale(i)},${yScale(d.Vancouver)}`).join(' ')

  // Y grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1.0].map(pct => ({
    y: PAD.t + chartH * (1 - pct),
    label: `$${Math.round(maxVal * pct)}M`,
  }))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '180px' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {gridLines.map(({ y, label }) => (
        <g key={label}>
          <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,3" />
          <text x={PAD.l - 6} y={y + 4} textAnchor="end" fill="#9ca3af" fontSize="10">{label}</text>
        </g>
      ))}

      {/* Fill */}
      <path d={fillPath} fill="url(#areaGrad)" />

      {/* Vancouver line (secondary) */}
      <polyline points={vanPoints} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.6" />

      {/* Total line */}
      <polyline points={polyline} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {totals.map((v, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(v)} r="3" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
      ))}

      {/* X axis labels */}
      {months.map((m, i) => (
        i % 2 === 0 && (
          <text key={m} x={xScale(i)} y={H - 6} textAnchor="middle" fill="#9ca3af" fontSize="10">{m}</text>
        )
      ))}

      {/* Axes */}
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + chartH} stroke="#d1d5db" strokeWidth="1" />
      <line x1={PAD.l} y1={PAD.t + chartH} x2={W - PAD.r} y2={PAD.t + chartH} stroke="#d1d5db" strokeWidth="1" />
    </svg>
  )
}

const MARKET_COLORS = {
  Vancouver:     { ring: 'ring-blue-500',   dot: 'bg-blue-500',   bg: 'bg-blue-50',   badge: 'bg-blue-100 text-blue-700' },
  Seattle:       { ring: 'ring-violet-500', dot: 'bg-violet-500', bg: 'bg-violet-50', badge: 'bg-violet-100 text-violet-700' },
  Portland:      { ring: 'ring-rose-500',   dot: 'bg-rose-500',   bg: 'bg-rose-50',   badge: 'bg-rose-100 text-rose-700' },
  'San Francisco':{ ring: 'ring-amber-500', dot: 'bg-amber-500',  bg: 'bg-amber-50',  badge: 'bg-amber-100 text-amber-700' },
}

const ASSET_COLORS = {
  Office:      'bg-blue-100 text-blue-700',
  Industrial:  'bg-purple-100 text-purple-700',
  Retail:      'bg-amber-100 text-amber-700',
  Multifamily: 'bg-emerald-100 text-emerald-700',
}

export default function MarketIntelligence() {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* Market cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {markets.map(m => {
          const mc = MARKET_COLORS[m.name] || MARKET_COLORS.Vancouver
          const volChange = ((m.ytdVolume - m.prevYtdVolume) / m.prevYtdVolume * 100).toFixed(1)
          const isUp = m.trend === 'up'

          return (
            <div key={m.id} className={`bg-white rounded-xl border-2 ${isUp ? 'border-gray-100' : 'border-gray-100'} p-5 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${mc.dot}`} />
                  <span className="font-bold text-gray-900 text-sm">{m.name}</span>
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-bold ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isUp ? '↑' : '↓'} {Math.abs(parseFloat(volChange))}%
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Vacancy Rate</span>
                  <span className="text-sm font-bold text-gray-900">{m.vacancyRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Avg Cap Rate</span>
                  <span className="text-sm font-bold text-amber-600">{m.avgCapRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">YTD Volume</span>
                  <span className="text-sm font-bold text-gray-900">{fmt(m.ytdVolume)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Rent Growth YoY</span>
                  <span className={`text-sm font-bold ${m.rentGrowthYoy >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {m.rentGrowthYoy >= 0 ? '+' : ''}{m.rentGrowthYoy}%
                  </span>
                </div>
              </div>

              <div className={`mt-3 pt-3 border-t border-gray-100`}>
                <div className="text-[10px] text-gray-400 mb-1">Top Submarket</div>
                <div className="text-xs font-semibold text-gray-700">{m.topSubmarket}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart + AI Insights row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Area Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">12-Month Transaction Volume</h3>
              <p className="text-xs text-gray-500 mt-0.5">Combined 4-market total + Vancouver breakdown</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-amber-500 inline-block rounded" />
                <span className="text-gray-500">All Markets</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-px bg-blue-500 inline-block rounded border-t border-dashed border-blue-500" style={{borderTopStyle:'dashed'}} />
                <span className="text-gray-500">Vancouver</span>
              </span>
            </div>
          </div>
          <AreaChart data={volumeChartData} />
        </div>

        {/* AI Insights */}
        <div className="bg-[#0f172a] rounded-xl border border-slate-700 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-white">Claude AI Market Insights</div>
              <div className="text-[10px] text-slate-500">Generated by Claude Opus · Updated May 10, 2026</div>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {aiInsights.map((insight, i) => (
              <div key={i} className="flex gap-3 text-xs text-slate-300 leading-relaxed">
                <span className="text-amber-500 mt-0.5 flex-shrink-0 font-bold">›</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <button className="w-full text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors text-center">
              Refresh Insights →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Recent Transactions</h3>
          <span className="text-xs text-gray-400">{recentTransactions.length} transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Property', 'Asset Type', 'Buyer', 'Price', 'Cap Rate', 'Market', 'Date'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((tx, i) => (
                <tr key={i} className="hover:bg-amber-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{tx.property}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ASSET_COLORS[tx.assetType]}`}>{tx.assetType}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{tx.buyer}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{fmt(tx.price)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-amber-600">{tx.capRate}%</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{tx.market}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
