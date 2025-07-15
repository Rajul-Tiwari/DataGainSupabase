'use client'

import { useAppSelector } from '@/lib/hooks'
import MainSidebar from './MainSidebar'
import SubSidebar from './SubSidebar'

interface DualSidebarLayoutProps {
  children: React.ReactNode
}

export default function DualSidebarLayout({ children }: DualSidebarLayoutProps) {
  const { isSubSidebarOpen } = useAppSelector((state) => state.sidebar)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Sidebar */}
      <div className="flex-shrink-0">
        <MainSidebar />
      </div>

      {/* Sub Sidebar */}
      <SubSidebar />

      {/* Main Content Area */}
      <main className={`flex-1 overflow-auto transition-all duration-300 ${
        isSubSidebarOpen ? 'ml-80' : 'ml-0'
      }`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 
