'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleMainSidebar, setSelectedMainItem } from '@/lib/slices/sidebarSlice'
import { ChevronRightIcon, HomeIcon, UserIcon, CogIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const navigationItems = [
  { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
  { id: 'users', name: 'Users', icon: UserIcon },
  { id: 'reports', name: 'Reports', icon: DocumentTextIcon },
  { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  { id: 'settings', name: 'Settings', icon: CogIcon },
]

export default function MainSidebar() {
  const dispatch = useAppDispatch()
  const { selectedMainItem, isMainSidebarExpanded } = useAppSelector((state) => state.sidebar)
  const router = useRouter()

  const handleToggleMainSidebar = () => {
    dispatch(toggleMainSidebar())
  }

  const handleItemClick = (itemId: string) => {
    dispatch(setSelectedMainItem(itemId))
    if (itemId === 'dashboard') {
      router.push('/dashboard')
    } else if (itemId === 'reports') {
      router.push('/reports')
    } else if (itemId === 'users') {
      router.push('/users')
    } else if (itemId === 'analytics') {
      router.push('/analytics')
    } else if (itemId === 'settings') {
      router.push('/settings')
    }
  }

  return (
    <div className={`flex flex-col ${isMainSidebarExpanded ? 'w-64' : 'w-16'} bg-gray-900 text-white h-full transition-all duration-300`}>
      {/* Header with arrow button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isMainSidebarExpanded && <h1 className="text-xl font-bold">Navigation</h1>}
        <button
          onClick={handleToggleMainSidebar}
          className={`p-2 hover:bg-gray-700 rounded-lg transition-all duration-300 ${
            isMainSidebarExpanded ? '' : 'mx-auto'
          }`}
        >
          <ChevronRightIcon className={`w-5 h-5 transition-transform duration-300 ${
            isMainSidebarExpanded ? 'rotate-180' : ''
          }`} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center ${
                    isMainSidebarExpanded ? 'space-x-3 px-4' : 'justify-center px-2'
                  } py-3 rounded-lg transition-all duration-300 ${
                    selectedMainItem === item.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                  title={!isMainSidebarExpanded ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isMainSidebarExpanded && <span className="transition-opacity duration-300">{item.name}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}