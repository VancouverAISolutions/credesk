import { useState } from 'react'
import Sidebar from './components/Sidebar'
import DealPipeline from './components/DealPipeline'
import PropertyDatabase from './components/PropertyDatabase'
import InvestorNetwork from './components/InvestorNetwork'
import MarketIntelligence from './components/MarketIntelligence'
import DocumentVault from './components/DocumentVault'
import Analytics from './components/Analytics'

const MODULE_LABELS = {
  pipeline:   'Deal Pipeline',
  properties: 'Property Database',
  investors:  'Investor Network',
  market:     'Market Intelligence',
  documents:  'Document Vault',
  analytics:  'Analytics',
}

const MODULE_SUBS = {
  pipeline:   'Track and manage active CRE transactions',
  properties: 'Search and analyze property inventory',
  investors:  'Manage relationships with buyers and capital partners',
  market:     'Market data, trends, and AI-powered insights',
  documents:  'Centralized deal document management',
  analytics:  'Portfolio performance and KPI reporting',
}

export default function App() {
  const [activeModule, setActiveModule] = useState('pipeline')

  const renderModule = () => {
    switch (activeModule) {
      case 'pipeline':   return <DealPipeline />
      case 'properties': return <PropertyDatabase />
      case 'investors':  return <InvestorNetwork />
      case 'market':     return <MarketIntelligence />
      case 'documents':  return <DocumentVault />
      case 'analytics':  return <Analytics />
      default:           return <DealPipeline />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Top header bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="min-w-0">
            <h1 className="text-base font-bold text-gray-900 leading-tight">{MODULE_LABELS[activeModule]}</h1>
            <p className="text-xs text-gray-500 hidden sm:block">{MODULE_SUBS[activeModule]}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Global search */}
            <div className="hidden md:block relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Quick search..." readOnly
                className="w-48 pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 cursor-pointer" />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:'18px',height:'18px'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            </button>

            {/* Status badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Live</span>
            </div>

            {/* Date */}
            <div className="hidden md:flex text-xs text-gray-500 items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              May 10, 2026
            </div>
          </div>
        </header>

        {/* Module content */}
        <main className="flex-1 overflow-hidden flex flex-col pb-16 md:pb-0">
          {renderModule()}
        </main>
      </div>
    </div>
  )
}
