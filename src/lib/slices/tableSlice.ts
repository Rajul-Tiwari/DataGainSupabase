import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TableRecord {
  id: string
  donor: string
  panels: string
  barcode: string
  source: string
  date: string
  amount: string
  observedBy: string
  status: 'Unable to Donate' | 'Refused' | 'Duplicate/Error' | 'Insufficient Donation' | 'Approved'
  isHighlighted?: boolean
}

export interface TableState {
  records: TableRecord[]
  searchTerm: string
  filterStatus: string
  isModalOpen: boolean
  editingRecord: TableRecord | null
  modalMode: 'create' | 'edit' | 'view'
}

const initialState: TableState = {
  records: [],
  searchTerm: '',
  filterStatus: '',
  isModalOpen: false,
  editingRecord: null,
  modalMode: 'create'
}

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload
    },
    openModal: (state, action: PayloadAction<{ mode: 'create' | 'edit' | 'view', record?: TableRecord }>) => {
      state.isModalOpen = true
      state.modalMode = action.payload.mode
      state.editingRecord = action.payload.record || null
    },
    closeModal: (state) => {
      state.isModalOpen = false
      state.editingRecord = null
    },
    createRecord: (state, action: PayloadAction<Omit<TableRecord, 'id'>>) => {
      const newRecord: TableRecord = {
        ...action.payload,
        id: Date.now().toString()
      }
      state.records.push(newRecord)
    },
    updateRecord: (state, action: PayloadAction<TableRecord>) => {
      const index = state.records.findIndex(record => record.id === action.payload.id)
      if (index !== -1) {
        state.records[index] = action.payload
      }
    },
    deleteRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter(record => record.id !== action.payload)
    },
    toggleHighlight: (state, action: PayloadAction<string>) => {
      const record = state.records.find(r => r.id === action.payload)
      if (record) {
        record.isHighlighted = !record.isHighlighted
      }
    }
  }
})

export const {
  setSearchTerm,
  setFilterStatus,
  openModal,
  closeModal,
  createRecord,
  updateRecord,
  deleteRecord,
  toggleHighlight
} = tableSlice.actions

export default tableSlice.reducer 
