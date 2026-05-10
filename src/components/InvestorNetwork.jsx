import { useState, useMemo } from 'react'
import { investors } from '../data/mockData'

const TYPES = ['All', 'REIT', 'Private Equity', 'Family Office', 'Individual']
const MARKETS_LIST = ['All', 'Vancouver', 'Seattle', 'Portland', 'San Francisco']

const TYPEESTYLES = {
  'REIT':           { bg: 'bg-blue-100',    text: 'text-blue-700' },
  'Private Equity': { bg: 'bg-violet-100',  text: 'text-violet-700' },
  'Family Office':  { bg: 'bg-amber-100',   text: 'text-amber-700' },
  'Individual':     { bg: 'bg-emerald-100', text: 'text-emerald-700' },
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500'
]

function fmt(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toLocaleString()}`
}

function InvestorDetailPanel({ investor, onClose }) {
  const ts = TYPE_STYLES[investor.investorType] || TYPE_STYLES['Individual']
  const avatarColor = AVATAR_COLORS[investors.findIndex(i => i.id === investor.id) % AVATAR_COLORS.length]
  const initials = investor.name.split(' ').map(w => w[0]).join('').toUpperCase()

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#0f172a] px-6 py-8">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-16 h-16 ${avatarColor} rounded-2xl flex items-center justify-center text-white font-bold text-xl`}>
              {initials}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{investor.name}</h2>
            <div className="text-slate-400 text-sm mt-0.5">{investor.title}</div>
            <div className="text-amber-400 text-sm font-semibold mt-0.5">{investor.company}</div>
            <div className="mt-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ts.bg} ${ts.text}`}>
                {investor.investorType}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <span className="w-4 text-gray-400">✉</span>
                <a href={`mailto:${investor.email}`} className="text-blue-600 hover:underline">{investor.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-4 text-gray-400">📞</span>
                <span className="text-gray-700">{investor.phone}</span>
              </div>
            </div>
          </div>

          {/* Investment Criteria */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Investment Criteria</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Deal Size</span>
                <span className="font-semibold text-gray-900">{fmt(investor.minDealSize)} – {fmt(investor.maxDealSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Target Cap Rate</span>
                <span className="font-semibold text-gray-900">{investor.targetCapRate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">AUM</span>
                <span className="font-semibold text-gray-900">${investor.aum}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Deals Closed</span>
                <span className="font-semibold text-gray-900">{investor.dealsCompleted} with us</span>
              </div>
            </div>
          </div>

          {/* Target Markets */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Target Markets</h3>
            <div className="flex flex-wrap gap-2">
              {investor.targetMarkets.map(m => (
                <span key={m} className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  📍 {m}
                </span>
              ))}
            </div>
          </div>

          {/* Asset Types */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Asset Types</h3>
            <div className="flex flex-wrap gap-2">
              {investor.assetTypes.map(a => (
                <span key={a} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</h3>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
              {investor.notes}
            </div>
          </div>

          {/* Activity */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {investor.activity.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400">{item.date}</div>
                    <div className="text-sm text-gray-700">{item.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Last contact */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Last Contact</div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">{investor.lastContact}</div>
            </div>
            <button className="bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors">
              Log Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InvestorNetwork() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [marketFilter, setMarketFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return investors.filter(i => {
      if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.company.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'All' && i.investorType !== typeFilter) return false
      if (marketFilter !== 'All' && !i.targetMarkets.includes(marketFilter)) return false
      return true
    })
  }, [search, typeFilter, marketFilter])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search investors..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={marketFilter} onChange={e => setMarketFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
            {MARKETS_LIST.map(m => <option key={m}>{m}</option>)}
          </select>
          <span className="text-sm text-gray-500 ml-auto">{filtered.length} contacts</span>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Contact
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((investor, idx) => {
            const ts = TYPE_STYLES[investor.investorType] || TYPE_STYLES.Individual
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length]
            const initials = investor.name.split(' ').map(w => w[0]).join('').toUpperCase()

            return (
              <div key={investor.id} onClick={() => setSelected(investor)}
                className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-11 h-11 ${avatarColor} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 text-sm leading-tight">{investor.name}</div>
                    <div className="text-xs text-gray-500">{investor.title}</div>
                    <div className="text-xs font-semibold text-gray-700 mt-0.5">{investor.company}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${ts.bg} ${ts.text}`}>
                    {investor.investorType}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deal Size</span>
                    <span className="font-semibold text-gray-900">{fmt(investor.minDealSize)}–{fmt(investor.maxDealSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cap Rate</span>
                    <span className="font-semibold text-gray-900">{investor.targetCapRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">AUM</span>
                    <span className="font-semibold text-gray-900">${investor.aum}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {investor.assetTypes.slice(0, 2).map(a => (
                      <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{a}</span>
                    ))}
                    {investor.assetTypes.length > 2 && (
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">+{investor.assetTypes.length - 2}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">Last: {investor.lastContact}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selected && <InvestorDetailPanel investor={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
