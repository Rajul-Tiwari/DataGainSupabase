import { supabase, type Record, type RecordInsert, type RecordUpdate } from '../supabase'

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

// Fetch all records
export const fetchRecords = async (): Promise<ApiResponse<Record[]>> => {
  try {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching records:', error)
      return { data: null, error: error.message, loading: false }
    }

    return { data: data || [], error: null, loading: false }
  } catch (error) {
    console.error('Error fetching records:', error)
    return { data: null, error: 'Failed to fetch records', loading: false }
  }
}

// Create a new record
export const createRecord = async (record: RecordInsert): Promise<ApiResponse<Record>> => {
  try {
    const { data, error } = await supabase
      .from('records')
      .insert([{
        ...record,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating record:', error)
      return { data: null, error: error.message, loading: false }
    }

    return { data, error: null, loading: false }
  } catch (error) {
    console.error('Error creating record:', error)
    return { data: null, error: 'Failed to create record', loading: false }
  }
}

// Update an existing record
export const updateRecord = async (id: string, updates: RecordUpdate): Promise<ApiResponse<Record>> => {
  try {
    const { data, error } = await supabase
      .from('records')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating record:', error)
      return { data: null, error: error.message, loading: false }
    }

    return { data, error: null, loading: false }
  } catch (error) {
    console.error('Error updating record:', error)
    return { data: null, error: 'Failed to update record', loading: false }
  }
}

// Delete a record
export const deleteRecord = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase
      .from('records')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting record:', error)
      return { data: null, error: error.message, loading: false }
    }

    return { data: null, error: null, loading: false }
  } catch (error) {
    console.error('Error deleting record:', error)
    return { data: null, error: 'Failed to delete record', loading: false }
  }
}

// Toggle highlight status
export const toggleHighlight = async (id: string, isHighlighted: boolean): Promise<ApiResponse<Record>> => {
  try {
    const { data, error } = await supabase
      .from('records')
      .update({
        is_highlighted: isHighlighted,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error toggling highlight:', error)
      return { data: null, error: error.message, loading: false }
    }

    return { data, error: null, loading: false }
  } catch (error) {
    console.error('Error toggling highlight:', error)
    return { data: null, error: 'Failed to toggle highlight', loading: false }
  }
}

// Search records
export const searchRecords = async (searchTerm: string): Promise<ApiResponse<Record[]>> => {
  try {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .or(`donor.ilike.%${searchTerm}%,panels.ilike.%${searchTerm}%,barcode.ilike.%${searchTerm}%,source.ilike.%${searchTerm}%,observed_by.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching records:', error)
      return { data: null, error: error.message, loading: false }
    }

    return { data: data || [], error: null, loading: false }
  } catch (error) {
    console.error('Error searching records:', error)
    return { data: null, error: 'Failed to search records', loading: false }
  }
}

// Filter records by status
export const filterRecordsByStatus = async (status: string): Promise<ApiResponse<Record[]>> => {
  try {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error filtering records:', error)
      return { data: null, error: error.message, loading: false }
    }

    return { data: data || [], error: null, loading: false }
  } catch (error) {
    console.error('Error filtering records:', error)
    return { data: null, error: 'Failed to filter records', loading: false }
  }
} 
