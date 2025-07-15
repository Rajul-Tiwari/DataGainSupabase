import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as recordsApi from '../api/records'
import type { Record } from '../supabase'

// Convert Supabase record to frontend format
const convertSupabaseRecord = (record: Record): TableRecord => ({
  id: record.id,
  donor: record.donor,
  panels: record.panels,
  barcode: record.barcode,
  source: record.source,
  date: record.date,
  amount: record.amount,
  observedBy: record.observed_by,
  status: record.status as TableRecord['status'],
  isHighlighted: record.is_highlighted
})

// Convert frontend record to Supabase format
const convertToSupabaseRecord = (record: Omit<TableRecord, 'id'>): Omit<Record, 'id' | 'created_at' | 'updated_at'> => ({
  donor: record.donor,
  panels: record.panels,
  barcode: record.barcode,
  source: record.source,
  date: record.date,
  amount: record.amount,
  observed_by: record.observedBy,
  status: record.status,
  is_highlighted: record.isHighlighted || false
})

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
  loading: boolean
  error: string | null
}

const initialState: TableState = {
  records: [],
  searchTerm: '',
  filterStatus: '',
  isModalOpen: false,
  editingRecord: null,
  modalMode: 'create',
  loading: false,
  error: null
}

// Async thunks
export const fetchRecordsAsync = createAsyncThunk(
  'table/fetchRecords',
  async () => {
    const response = await recordsApi.fetchRecords()
    if (response.error) {
      throw new Error(response.error)
    }
    return response.data?.map(convertSupabaseRecord) || []
  }
)

export const createRecordAsync = createAsyncThunk(
  'table/createRecord',
  async (record: Omit<TableRecord, 'id'>) => {
    const supabaseRecord = convertToSupabaseRecord(record)
    const response = await recordsApi.createRecord(supabaseRecord)
    if (response.error) {
      throw new Error(response.error)
    }
    return convertSupabaseRecord(response.data!)
  }
)

export const updateRecordAsync = createAsyncThunk(
  'table/updateRecord',
  async (record: TableRecord) => {
    const { id, ...updates } = record
    const supabaseUpdates = convertToSupabaseRecord(updates)
    const response = await recordsApi.updateRecord(id, supabaseUpdates)
    if (response.error) {
      throw new Error(response.error)
    }
    return convertSupabaseRecord(response.data!)
  }
)

export const deleteRecordAsync = createAsyncThunk(
  'table/deleteRecord',
  async (id: string) => {
    const response = await recordsApi.deleteRecord(id)
    if (response.error) {
      throw new Error(response.error)
    }
    return id
  }
)

export const toggleHighlightAsync = createAsyncThunk(
  'table/toggleHighlight',
  async ({ id, isHighlighted }: { id: string; isHighlighted: boolean }) => {
    const response = await recordsApi.toggleHighlight(id, isHighlighted)
    if (response.error) {
      throw new Error(response.error)
    }
    return convertSupabaseRecord(response.data!)
  }
)

const supabaseTableSlice = createSlice({
  name: 'supabaseTable',
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
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch records
      .addCase(fetchRecordsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecordsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.records = action.payload
      })
      .addCase(fetchRecordsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch records'
      })
      
      // Create record
      .addCase(createRecordAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createRecordAsync.fulfilled, (state, action) => {
        state.loading = false
        state.records.unshift(action.payload)
      })
      .addCase(createRecordAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create record'
      })
      
      // Update record
      .addCase(updateRecordAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateRecordAsync.fulfilled, (state, action) => {
        state.loading = false
        const index = state.records.findIndex(record => record.id === action.payload.id)
        if (index !== -1) {
          state.records[index] = action.payload
        }
      })
      .addCase(updateRecordAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update record'
      })
      
      // Delete record
      .addCase(deleteRecordAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteRecordAsync.fulfilled, (state, action) => {
        state.loading = false
        state.records = state.records.filter(record => record.id !== action.payload)
      })
      .addCase(deleteRecordAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete record'
      })
      
      // Toggle highlight
      .addCase(toggleHighlightAsync.pending, (state) => {
        state.error = null
      })
      .addCase(toggleHighlightAsync.fulfilled, (state, action) => {
        const index = state.records.findIndex(record => record.id === action.payload.id)
        if (index !== -1) {
          state.records[index] = action.payload
        }
      })
      .addCase(toggleHighlightAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to toggle highlight'
      })
  }
})

export const {
  setSearchTerm,
  setFilterStatus,
  openModal,
  closeModal,
  clearError
} = supabaseTableSlice.actions

export default supabaseTableSlice.reducer 
