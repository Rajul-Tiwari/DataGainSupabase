'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeSubSidebar, setSelectedSubSidebarItem } from '@/lib/slices/sidebarSlice'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

// Define contextual content for each main sidebar item
const contextualContent = {
  dashboard: {
    title: 'Dashboard Overview',
    items: [
      'Face Recognition',
      'Daily Visit',
      'Donate',
      'Work Orders',
      'Reports',
      'Report History',
      'Test History',
      'Calendar Type'
    ]
  },
  users: {
    title: 'User Management',
    items: [
      'All Users',
      'Active Users',
      'User Roles',
      'Permissions',
      'User Groups'
    ]
  },
  reports: {
    title: 'Reports & Documents',
    items: [
      'Monthly Reports',
      'Financial Reports',
      'Analytics Reports',
      'Custom Reports',
      'Report Templates'
    ]
  },
  analytics: {
    title: 'Analytics Tools',
    items: [
      'Traffic Analysis',
      'Conversion Rates',
      'User Behavior',
      'Revenue Metrics',
      'Performance Tracking'
    ]
  },
  settings: {
    title: 'Configuration',
    items: [
      'General Settings',
      'User Preferences',
      'System Configuration',
      'Security Settings',
      'Integration Settings'
    ]
  }
}

export default function SubSidebar() {
  const dispatch = useAppDispatch()
  const { isSubSidebarOpen, selectedMainItem, isMainSidebarExpanded, selectedSubSidebarItem } = useAppSelector((state) => state.sidebar)
  const router = useRouter()

  const handleClose = () => {
    dispatch(closeSubSidebar())
  }

  const toKebabCase = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubSidebarItemClick = (item: string) => {
    dispatch(setSelectedSubSidebarItem(item))
    if (selectedMainItem) {
      if (selectedMainItem === 'dashboard') {
        router.push(`/dashboard/${toKebabCase(item)}`)
      } else {
        router.push(`/${selectedMainItem}/${toKebabCase(item)}`)
      }
    }
  }

  if (!isSubSidebarOpen) return null

  const content = selectedMainItem ? contextualContent[selectedMainItem as keyof typeof contextualContent] : null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={handleClose}
      />
      
      {/* Sub Sidebar */}
      <div className={`fixed ${isMainSidebarExpanded ? 'left-64' : 'left-16'} top-0 h-full w-80 bg-gray-800 text-white transform transition-all duration-300 ease-in-out z-50 ${
        isSubSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">
            {content?.title || 'Sub Navigation'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {content ? (
            <ul className="space-y-2">
              {content.items.map((item, index) => (
                <li key={index}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedSubSidebarItem === item
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-700'
                    }`}
                    onClick={() => handleSubSidebarItemClick(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Select an item from the main navigation to see related options.</p>
          )}
        </div>
      </div>
    </>
  )
} 
