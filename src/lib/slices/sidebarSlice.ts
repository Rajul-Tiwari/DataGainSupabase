import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SidebarState {
  isMainSidebarExpanded: boolean
  isSubSidebarOpen: boolean
  selectedMainItem: string | null
  subSidebarContent: string | null
  selectedSubSidebarItem: string | null
}

const initialState: SidebarState = {
  isMainSidebarExpanded: false,
  isSubSidebarOpen: false,
  selectedMainItem: null,
  subSidebarContent: null,
  selectedSubSidebarItem: null,
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleMainSidebar: (state) => {
      state.isMainSidebarExpanded = !state.isMainSidebarExpanded
    },
    toggleSubSidebar: (state) => {
      state.isSubSidebarOpen = !state.isSubSidebarOpen
    },
    setSelectedMainItem: (state, action: PayloadAction<string>) => {
      state.selectedMainItem = action.payload
      state.subSidebarContent = action.payload
      state.isSubSidebarOpen = true
      state.selectedSubSidebarItem = null
    },
    setSelectedSubSidebarItem: (state, action: PayloadAction<string>) => {
      state.selectedSubSidebarItem = action.payload
    },
    closeSubSidebar: (state) => {
      state.isSubSidebarOpen = false
    },
    openSubSidebar: (state) => {
      state.isSubSidebarOpen = true
    },
  },
})

export const { toggleMainSidebar, toggleSubSidebar, setSelectedMainItem, setSelectedSubSidebarItem, closeSubSidebar, openSubSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer 
