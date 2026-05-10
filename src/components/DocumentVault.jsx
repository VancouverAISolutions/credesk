import { useState, useMemo } from 'react'
import { documentFolders } from '../data/mockData'

const TYPE_STYLES = {
  PDF:   { bg: 'bg-red-100',   text: 'text-red-600',   icon: 'PDF' },
  Excel: { bg: 'bg-green-100', text: 'text-green-600', icon: 'XLS' },
  Word:  { bg: 'bg-blue-100',  text: 'text-blue-600',  icon: 'DOC' },
  ZIP:   { bg: 'bg-gray-100',  text: 'text-gray-600',  icon: 'ZIP' },
}

function FileIcon({ type }) {
  const ts = TYPE_STYLES[type] || TYPE_STYLES.PDF
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold ${ts.bg} ${ts.text}`}>
      {ts.icon}
    </div>
  )
}

export default function DocumentVault() {
  const [selectedFolder, setSelectedFolder] = useState(documentFolders[0].id)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  const allFiles = useMemo(() => documentFolders.flatMap(f => f.files.map(file => ({ ...file, folderName: f.name }))), [])
  const isSearching = search.length > 0

  const currentFolder = documentFolders.find(f => f.id === selectedFolder)

  const displayFiles = useMemo(() => {
    let files = isSearching ? allFiles : (currentFolder?.files || [])
    if (search) files = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())))
    if (typeFilter !== 'All') files = files.filter(f => f.type === typeFilter)
    return files
  }, [search, typeFilter, currentFolder, allFiles, isSearching])

  const totalFiles = documentFolders.reduce((s, f) => s + f.files.length, 0)

  return (
    <div className="flex h-full overflow-hidden">
      {/* Folder Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Folders</div>
          <div className="text-xs text-gray-500 mt-0.5">{totalFiles} total files</div>
        </div>
        <div className="p-2">
          {documentFolders.map(folder => (
            <button
              key={folder.id}
              onClick={() => { setSelectedFolder(folder.id); setSearch('') }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                selectedFolder === folder.id && !isSearching
                  ? 'bg-amber-50 text-amber-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className={`w-4 h-4 flex-shrink-0 ${selectedFolder === folder.id && !isSearching ? 'text-amber-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
              <span className="truncate flex-1">{folder.name}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                selectedFolder === folder.id && !isSearching ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>{folder.files.length}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search all documents..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>

          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
            {['All', 'PDF', 'Excel', 'Word'].map(t => <option key={t}>{t}</option>)}
          </select>

          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-2 flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
          <span>Document Vault</span>
          <span>/</span>
          <span className="font-semibold text-gray-700">
            {isSearching ? `Search: "${search}"` : currentFolder?.name}
          </span>
          <span className="ml-auto text-gray-400">{displayFiles.length} files</span>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-4">
          {displayFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-sm">No documents found</div>
            </div>
          ) : (
            <div className="space-y-1.5">
              {/* Column headers */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                <div className="col-span-5">Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Uploaded By</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Size</div>
                <div className="col-span-1" />
              </div>

              {displayFiles.map((file) => {
                const ts = TYPE_STYLES[file.type] || TYPE_STYLES.PDF
                return (
                  <div key={file.id}
                    className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl hover:bg-amber-50 group transition-colors border border-transparent hover:border-amber-200">
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <FileIcon type={file.type} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                        {isSearching && (
                          <div className="text-xs text-gray-400 truncate">{file.folderName}</div>
                        )}
                        {file.tags && (
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {file.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ts.bg} ${ts.text}`}>{file.type}</span>
                    </div>
                    <div className="col-span-2 text-sm text-gray-600 truncate">{file.uploadedBy}</div>
                    <div className="col-span-1 text-xs text-gray-500 whitespace-nowrap">{file.date}</div>
                    <div className="col-span-1 text-xs text-gray-500">{file.size}</div>
                    <div className="col-span-1 flex justify-end gap-1">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-amber-600 hover:border-amber-300">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
