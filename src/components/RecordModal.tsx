'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeModal, createRecordAsync, updateRecordAsync } from '@/lib/slices/supabaseTableSlice'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import type { TableRecord } from '@/lib/slices/supabaseTableSlice'

export default function RecordModal() {
  const dispatch = useAppDispatch()
  const { isModalOpen, modalMode, editingRecord, loading } = useAppSelector((state) => state.table)
  
  const [formData, setFormData] = useState({
    donor: '',
    panels: '',
    barcode: '',
    source: 'medicaid',
    date: '',
    amount: '',
    observedBy: '',
    status: 'Unable to Donate' as TableRecord['status']
  })

  useEffect(() => {
    if (editingRecord) {
      // Convert MM/DD/YYYY to YYYY-MM-DD for date input
      const dateParts = editingRecord.date.split('/')
      const formattedDate = dateParts.length === 3 
        ? `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`
        : editingRecord.date
      
      setFormData({
        donor: editingRecord.donor,
        panels: editingRecord.panels,
        barcode: editingRecord.barcode,
        source: editingRecord.source,
        date: formattedDate,
        amount: editingRecord.amount,
        observedBy: editingRecord.observedBy,
        status: editingRecord.status
      })
    } else {
      // Reset form for new record
      setFormData({
        donor: '',
        panels: '',
        barcode: '',
        source: 'medicaid',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        observedBy: '',
        status: 'Unable to Donate'
      })
    }
  }, [editingRecord, isModalOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    // Convert date from YYYY-MM-DD to MM/DD/YYYY for storage
    const dateParts = formData.date.split('-')
    const displayDate = dateParts.length === 3 
      ? `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`
      : formData.date
    
    const recordData = {
      ...formData,
      date: displayDate
    }
    
    try {
      if (modalMode === 'create') {
        await dispatch(createRecordAsync(recordData)).unwrap()
      } else if (modalMode === 'edit' && editingRecord) {
        await dispatch(updateRecordAsync({
          ...recordData,
          id: editingRecord.id
        })).unwrap()
      }
      
      dispatch(closeModal())
    } catch (error) {
      // Error is handled by the slice
      console.error('Error saving record:', error)
    }
  }

  const handleClose = () => {
    dispatch(closeModal())
  }

  if (!isModalOpen) return null

  const isReadOnly = modalMode === 'view'
  const title = modalMode === 'create' ? 'Add New Record' : 
               modalMode === 'edit' ? 'Edit Record' : 'View Record'

  console.log('Modal is open:', isModalOpen, 'Mode:', modalMode, 'Editing record:', editingRecord)

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ zIndex: 9999 }}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[9998]"
          onClick={handleClose}
          style={{ zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.5)' }}
        />

        {/* Modal panel */}
        <div 
          className="relative bg-white rounded-lg text-left text-black overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full mx-4 z-[9999]"
          style={{ 
            minHeight: '300px',
            backgroundColor: 'white',
            zIndex: 9999,
            position: 'relative'
          }}
        >
          {/* Header */}
          <div className="bg-white px-6 pt-6 pb-4" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900" style={{ color: 'black' }}>
                {title}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                style={{ color: 'gray' }}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 px-6 pb-4" style={{ backgroundColor: 'white' }}>
              <div>
                <label htmlFor="donor" className="block text-sm font-medium text-gray-700">
                  Donor Name
                </label>
                <input
                  type="text"
                  name="donor"
                  id="donor"
                  required
                  readOnly={isReadOnly}
                  value={formData.donor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border text-black  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="panels" className="block text-sm font-medium text-gray-700">
                  Panels
                </label>
                <input
                  type="text"
                  name="panels"
                  id="panels"
                  required
                  readOnly={isReadOnly}
                  value={formData.panels}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
                  Barcode
                </label>
                <input
                  type="text"
                  name="barcode"
                  id="barcode"
                  required
                  readOnly={isReadOnly}
                  value={formData.barcode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                  Source
                </label>
                <select
                  name="source"
                  id="source"
                  required
                  disabled={isReadOnly}
                  value={formData.source}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-50"
                >
                  <option value="medicaid">Medicaid</option>
                  <option value="Self Pay">Self Pay</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  readOnly={isReadOnly}
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  required
                  readOnly={isReadOnly}
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="e.g., $0.00"
                  className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="observedBy" className="block text-sm font-medium text-gray-700">
                  Observed By
                </label>
                <input
                  type="text"
                  name="observedBy"
                  id="observedBy"
                  required
                  readOnly={isReadOnly}
                  value={formData.observedBy}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  required
                  disabled={isReadOnly}
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-50"
                >
                  <option value="Unable to Donate">Unable to Donate</option>
                  <option value="Refused">Refused</option>
                  <option value="Duplicate/Error">Duplicate/Error</option>
                  <option value="Insufficient Donation">Insufficient Donation</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
            </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" style={{ backgroundColor: '#f9fafb' }}>
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                  </div>
                ) : (
                  modalMode === 'create' ? 'Create Record' : 'Update Record'
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
