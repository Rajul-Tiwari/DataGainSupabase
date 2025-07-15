import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'

// Import your slices here
import sidebarSlice from './slices/sidebarSlice'
import supabaseTableSlice from './slices/supabaseTableSlice'

const rootReducer = combineReducers({
  // Add your reducers here
  sidebar: sidebarSlice,
  table: supabaseTableSlice,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['sidebar'], // Only persist sidebar state, table data comes from Supabase
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 
