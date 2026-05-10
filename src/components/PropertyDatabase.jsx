import { useState, useMemo } from 'react'
import { properties } from '../data/mockData'

const ASSET_TYPES = ['All', 'Office', 'Retail', 'Industrial', 'Multifamily']
const MARKETS = ['All', 'Vancouver', 'Seattle', 'Portland', 'San Francisco']
const STATUSES = ['All', 'Available', 'Under Contract', 'Off Market']

const STATUS_STYLES = {
  Available:      { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Under Contract':{ bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  'Off Market':    { bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400' },
}

const ASSET_COLORS = {
  Office:      'bg-blue-100 text-blue-700',
  Industrial:  'bg-purple-100 text-purple-700',
  Retail:      'bg-amber-100 text-amber-700',
  Multifamily: 'bg-emerald-100 text-emerald-700',
}

function fmt(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  return `$${n.toLocaleString()}`
}

function PropertyDetailModal({ property, onClose }) {
  const ss = STATUS_STYLES[property.status] || STATUS_STYLES.Available
  const gradients = [
    'from-blue-400 to-indigo-600',
    'from-violet-400 to-purple-600',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-teal-600',
  ]
  const grad = gradients[Math.abs(property.id.charCodeAt(1) - 48) % 4]

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Photo placeholder */}
        <div className={`h-44 bg-gradient-to-br ${grad} flex items-center justify-center relative`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative text-center text-white">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <div className="text-xs opacity-70 font-medium">Property Photos</div>
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/30 text-white rounded-full p-1.5 hover:bg-black/50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ASSETC_COLORS[property.assetType]}`}>
                  {property.assetType}
                </span>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${ss.bg} ${ss.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                  {property.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{property.address}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{property.market}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{fmt(property.askingPrice)}</div>
              <div className="text-sm text-amber-600 font-semibold">{property.capRate}% Cap Rate</div>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {property.sqft > 0 && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-gray-900">{property.sqft.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Square Feet</div>
              </div>
            )}
            {property.units && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-gray-900">{property.units}</div>
                <div className="text-xs text-gray-500">Units</div>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-gray-900">{property.yearBuilt}</div>
              <div className="text-xs text-gray-500">Year Built</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-gray-900">{property.occupancy}%</div>
              <div className="text-xs text-gray-500">Occupancy</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-gray-900">{fmt(property.noi)}</div>
              <div className="text-xs text-gray-500">Annual NOI</div>
            </div>
          </div>

          {/* Financial summary */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Financial Summary</h3>
            <div className="space-y-2">
              {[
                { label: 'Asking Price', value: fmt(property.askingPrice) },
                { label: 'NOI', value: fmt(property.noi) },
                { label: 'Cap Rate', value: `${property.capRate}%` },
                { label: 'Price/SF', value: property.sqft > 0 ? `$${Math.round(property.askingPrice / property.sqft).toLocaleString()}/SF` : 'N/A' },
                { label: 'GRM (est.)', value: `${(property.askingPrice / (property.noi * 1.4)).toFixed(1)}x` },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="font-semibold text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PropertyDatabase() {
  const [search, setSearch] = useState('')
  const [assetType, setAssetType] = useState('All')
  const [market, setMarket] = useState('All')
  const [status, setStatus] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [view, setView] = useState('list') // 'list' | 'map'
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (search && !p.address.toLowerCase().includes(search.toLowerCase()) && !p.market.toLowerCase().includes(search.toLowerCase())) return false
      if (assetType !== 'All' && p.assetType !== assetType) return false
      if (market !== 'All' && p.market !== market) return false
      if (status !== 'All' && p.status !== status) return false
      if (minPrice && p.askingPrice < Number(minPrice) * 1e6) return false
      if (maxPrice && p.askingPrice > Number(maxPrice) * 1e6) return false
      return true
    })
  }, [search, assetType, market, status, minPrice, maxPrice])

  return (
    <div className="flex h-full overflow-hidden">
      {/* Filter Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto p-4 space-y-5 hidden lg:block">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Asset Type</h3>
          <div className="space-y-1">
            {ASSET_TYPES.map(t => (
              <button key={t} onClick={() => setAssetType(t)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${assetType === t ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Market</h3>
          <div className="space-y-1">
            {MARKETS.map(m => (
              <button key={m} onClick={() => setMarket(m)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${market === m ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</h3>
          <div className="space-y-1">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${status === s ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price Range ($M)</h3>
          <div className="space-y-2">
            <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
        <button onClick={() => { setAssetType('All'); setMarket('All'); setStatus('All'); setMinPrice(''); setMaxPrice('') }}
          className="w-full text-xs text-gray-500 hover:text-gray-700 underline text-left">
          Clear all filters
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search + controls */}
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search properties..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <span className="text-sm text-gray-500">{filtered.length} results</span>
          <div className="ml-auto flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {['list', 'map'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize ${view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                {v === 'list' ? '≡ List' : '⊞ Map'}
              </button>
            ))}
          </div>
        </div>

        {view === 'map' ? (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="text-xl font-bold text-gray-700 mb-1">Map View</div>
              <div className="text-sm text-gray-500">{filtered.length} properties across {[...new Set(filtered.map(p => p.market))].length} markets</div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[...new Set(filtered.map(p => p.market))].map(m => (
                  <span key={m} className="bg-white shadow text-xs font-medium text-gray-700 px-3 py-1.5 rounded-full border border-gray-200">📍 {m}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  {['Address', 'Asset Type', 'Size', 'Year Built', 'Asking Price', 'Cap Rate', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => {
                  const ss = STATUS_STYLES[p.status] || STATUS_STYLES.Available
                  return (
                    <tr key={p.id} onClick={() => setSelected(p)}
                      className="hover:bg-amber-50 cursor-pointer transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{p.address}</div>
                        <div className="text-xs text-gray-400">{p.market}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ASSETC_COLORS[p.assetType]}`}>{p.assetType}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {p.sqft > 0 ? `${p.sqft.toLocaleString()} SF` : `${p.units} units`}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.yearBuilt}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{fmt(p.askingPrice)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-amber-600">{p.capRate}%</td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${ss.bg} ${ss.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <PropertyDetailModal property={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
