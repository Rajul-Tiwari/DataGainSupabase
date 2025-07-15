'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { 
  setSearchTerm, 
  setFilterStatus, 
  openModal, 
  deleteRecordAsync, 
  toggleHighlightAsync,
  fetchRecordsAsync,
  clearError
} from '@/lib/slices/supabaseTableSlice'
import { MagnifyingGlassIcon, FunnelIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { PlusIcon, PencilIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useState, useEffect, useRef } from 'react'
import RecordModal from './RecordModal'

export default function DataTable() {
  const dispatch = useAppDispatch()
  const { records, searchTerm, filterStatus, loading, error } = useAppSelector((state) => state.table)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch records on component mount
  useEffect(() => {
    dispatch(fetchRecordsAsync())
  }, [dispatch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Clear error on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError())
      }
    }
  }, [error, dispatch])

  // Filter records based on search term and filter status
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === '' || 
      Object.values(record).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesFilter = filterStatus === '' || record.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value))
  }

  const handleFilterChange = (value: string) => {
    dispatch(setFilterStatus(value))
  }

  const handleCreateNew = () => {
    dispatch(openModal({ mode: 'create' }))
  }

  const handleEdit = (record: typeof records[0]) => {
    dispatch(openModal({ mode: 'edit', record }))
    setActiveDropdown(null)
  }

  const handleView = (record: typeof records[0]) => {
    dispatch(openModal({ mode: 'view', record }))
    setActiveDropdown(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      dispatch(deleteRecordAsync(id))
    }
    setActiveDropdown(null)
  }

  const handleHighlight = (id: string) => {
    const record = records.find(r => r.id === id)
    if (record) {
      dispatch(toggleHighlightAsync({ id, isHighlighted: !record.isHighlighted }))
    }
    setActiveDropdown(null)
  }

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unable to Donate':
        return 'text-red-600 bg-red-50'
      case 'Refused':
        return 'text-orange-600 bg-orange-50'
      case 'Duplicate/Error':
        return 'text-yellow-600 bg-yellow-50'
      case 'Insufficient Donation':
        return 'text-blue-600 bg-blue-50'
      case 'Approved':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 mx-4 mt-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header with Date Range and Actions */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Date: 06/01/2023 - 7/18/2023
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCreateNew}
              className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add New
            </button>
            <button className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
              <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
              SEARCH
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FunnelIcon className="w-4 h-4 mr-2" />
              FILTERS
              <span className="ml-2 bg-teal-500 text-white rounded-full px-2 py-1 text-xs">9</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Unable to Donate">Unable to Donate</option>
            <option value="Refused">Refused</option>
            <option value="Duplicate/Error">Duplicate/Error</option>
            <option value="Insufficient Donation">Insufficient Donation</option>
            <option value="Approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DONOR</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PANELS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BARCODE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SOURCE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT(S)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OBSERVED BY</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                    <span className="text-gray-500">Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm || filterStatus ? 'No records match your search criteria.' : 'No records found.'}
                </td>
              </tr>
            ) : (
            filteredRecords.map((record) => (
              <tr 
                key={record.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  record.isHighlighted ? 'bg-pink-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-teal-600">{record.donor}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.panels}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-teal-600">{record.barcode}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.source}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.observedBy}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative" ref={activeDropdown === record.id ? dropdownRef : null}>
                    <button
                      onClick={() => toggleDropdown(record.id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    >
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                    
                    {activeDropdown === record.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => handleView(record)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleEdit(record)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit Record
                          </button>
                          <button
                            onClick={() => handleHighlight(record.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {record.isHighlighted ? '🔆' : '✨'} 
                            <span className="ml-2">{record.isHighlighted ? 'Remove Highlight' : 'Highlight Row'}</span>
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete Record
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results Summary */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {filteredRecords.length} of {records.length} records
        </div>
      </div>

      {/* Modal */}
      <RecordModal />
    </div>
  )
} 
