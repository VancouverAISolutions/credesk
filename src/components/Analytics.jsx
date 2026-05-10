import { analyticsKPIs, monthlyDeals, portfolioByAssetType, brokerLeaderboard } from '../data/mockData'

function fmt(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  return `$${n.toLocaleString()}`
}

// SVG Bar Chart — deals closed by month
function BarChart({ data }) {
  const W = 760, H = 220, PAD = { t: 10, r: 20, b: 40, l: 45 }
  const chartW = W - PAD.l - PAD.r
  const chartH = H - PAD.t - PAD.b
  const maxVal = Math.max(...data.map(d => d.deals), 1)
  const barW = chartW / data.length
  const barPad = barW * 0.25

  const yLines = [0, 1, 2, 3].filter(v => v <= maxVal + 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '220px' }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="barGradEmpty" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#f3f4f6" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yLines.map(v => {
        const y = PAD.t + chartH - (v / (maxVal + 1)) * chartH
        return (
          <g key={v}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={PAD.l - 6} y={y + 4} textAnchor="end" fill="#9ca3af" fontSize="11">{v}</text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = PAD.l + i * barW + barPad / 2
        const barHeight = d.deals === 0 ? 4 : (d.deals / (maxVal + 1)) * chartH
        const y = PAD.t + chartH - barHeight
        const isEmpty = d.deals === 0

        return (
          <g key={d.month}>
            <rect x={x} y={isEmpty ? PAD.t + chartH - 4 : y} width={barW - barPad} height={barHeight}
              fill={isEmpty ? 'url(#barGradEmpty)' : 'url(#barGrad)'}
              rx="4" opacity={isEmpty ? 0.5 : 1} />
            {d.deals > 0 && (
              <text x={x + (barW - barPad) / 2} y={y - 4} textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="600">
                {d.deals}
              </text>
            )}
            <text x={x + (barW - barPad) / 2} y={H - 8} textAnchor="middle" fill="#9ca3af" fontSize="10">
              {d.month}
            </text>
          </g>
        )
      })}

      {/* Axes */}
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + chartH} stroke="#e5e7eb" strokeWidth="1" />
      <line x1={PAD.l} y1={PAD.t + chartH} x2={W - PAD.r} y2={PAD.t + chartH} stroke="#e5e7eb" strokeWidth="1" />
    </svg>
  )
}

// SVG Donut Chart
function DonutChart({ data }) {
  const cx = 100, cy = 100, outerR = 85, innerR = 50
  const total = data.reduce((s, d) => s + d.value, 0)

  function polarToCartesian(angle) {
    const rad = (angle - 90) * Math.PI / 180
    return { x: cx + outerR * Math.cos(rad), y: cy + outerR * Math.sin(rad) }
  }
  function innerPoint(angle) {
    const rad = (angle - 90) * Math.PI / 180
    return { x: cx + innerR * Math.cos(rad), y: cy + innerR * Math.sin(rad) }
  }
  function arcPath(startAngle, endAngle, color) {
    const s1 = polarToCartesian(startAngle)
    const e1 = polarToCartesian(endAngle)
    const s2 = innerPoint(endAngle)
    const e2 = innerPoint(startAngle)
    const large = endAngle - startAngle > 180 ? 1 : 0
    return `M ${s1.x.toFixed(2)} ${s1.y.toFixed(2)} A ${outerR} ${outerR} 0 ${large} 1 ${e1.x.toFixed(2)} ${e1.y.toFixed(2)} L ${s2.x.toFixed(2)} ${s2.y.toFixed(2)} A ${innerR} ${innerR} 0 ${large} 0 ${e2.x.toFixed(2)} ${e2.y.toFixed(2)} Z`
  }

  let currentAngle = 0
  const slices = data.map(d => {
    const sliceAngle = (d.value / total) * 360
    const path = arcPath(currentAngle, currentAngle + sliceAngle - 0.5, d.color)
    currentAngle += sliceAngle
    return { ...d, path }
  })

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 200 200" className="w-44 h-44 flex-shrink-0">
        {slices.map(s => (
          <path key={s.type} d={s.path} fill={s.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
        ))}
        {/* Center label */}
        <text x={cx} y={cy - 8} textAnchor="middle" fill="#111827" fontSize="18" fontWeight="800">
          {data.reduce((s, d) => s + d.pct, 0)}%
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#6b7280" fontSize="10">
          Portfolio
        </text>
      </svg>
      <div className="space-y-2.5 flex-1">
        {data.map(d => (
          <div key={d.type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <div className="text-sm text-gray-700 flex-1">{d.type}</div>
            <div className="text-sm font-bold text-gray-900">{d.pct}%</div>
            <div className="text-xs text-gray-500">{fmt(d.value)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const KPI_CARDS = (kpis) => [
  {
    label: 'Total AUM',
    value: fmt(kpis.totalAUM),
    sub: 'Assets under management',
    icon: '🏦',
    color: 'from-blue-500 to-indigo-600',
    change: '+12.4%',
    up: true,
  },
  {
    label: 'Deals Closed YTD',
    value: kpis.dealsClosedYTD,
    sub: '3 transactions in 2026',
    icon: '✅',
    color: 'from-emerald-500 to-teal-600',
    change: '+50% vs 2025',
    up: true,
  },
  {
    label: 'Avg Deal Size',
    value: fmt(kpis.avgDealSize),
    sub: 'YTD average',
    icon: '💰',
    color: 'from-amber-500 to-orange-500',
    change: '+18.2%',
    up: true,
  },
  {
    label: 'Pipeline Conversion',
    value: `${kpis.conversionRate}%`,
    sub: 'LOI → Close rate',
    icon: '📊',
    color: 'from-violet-500 to-purple-600',
    change: '+3pts YoY',
    up: true,
  },
]

export default function Analytics() {
  const kpis = analyticsKPIs

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS(kpis).map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${card.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                {card.up ? '↑' : '↓'} {card.change}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-gray-900">{card.value}</div>
            <div className="text-sm font-semibold text-gray-700 mt-0.5">{card.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pipeline Value', value: fmt(kpis.pipelineValue), sub: 'Active deals' },
          { label: 'Active Deals', value: kpis.activeDealCount, sub: 'In pipeline' },
          { label: 'Avg Cap Rate (Closed)', value: `${kpis.avgCapRateClosed}%`, sub: 'YTD closed' },
          { label: 'Target IRR', value: `${kpis.irr}%`, sub: 'Portfolio target' },
        ].map(item => (
          <div key={item.label} className="bg-[#0f172a] rounded-xl p-4">
            <div className="text-xl font-bold text-amber-400">{item.value}</div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5">{item.label}</div>
            <div className="text-[10px] text-slate-500">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-3">
            <h3 className="font-bold text-gray-900">Deals Closed by Month (2026)</h3>
            <p className="text-xs text-gray-500 mt-0.5">Transaction count · YTD: 3 deals, $834M volume</p>
          </div>
          <BarChart data={monthlyDeals} />
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900">Portfolio by Asset Type</h3>
            <p className="text-xs text-gray-500 mt-0.5">Total AUM: {fmt(kpis.totalAUM)}</p>
          </div>
          <DonutChart data={portfolioByAssetType} />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Top Performers</h3>
            <p className="text-xs text-gray-500 mt-0.5">Broker performance · YTD 2026</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Rank', 'Broker', 'Title', 'Deals YTD', 'Total Volume', 'Avg Cap Rate', 'Conversion Rate'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brokerLeaderboard.map((broker, i) => (
                <tr key={broker.name} className={i === 0 ? 'bg-amber-50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-amber-500 text-white' :
                      i === 1 ? 'bg-gray-300 text-gray-700' :
                      i === 2 ? 'bg-orange-200 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {broker.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{broker.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{broker.title}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-gray-900">{broker.dealsYTD}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{fmt(broker.totalVolume)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-amber-600">{broker.avgCapRate}%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${broker.conversionRate}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{broker.conversionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
