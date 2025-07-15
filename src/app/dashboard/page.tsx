'use client';

import DualSidebarLayout from '@/components/DualSidebarLayout'
import DataTable from '@/components/DataTable'
import { useAppSelector } from '@/lib/hooks'

export default function DashboardHomePage() {
  const selectedSubSidebarItem = useAppSelector(state => state.sidebar.selectedSubSidebarItem)

  return (
    <DualSidebarLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600">Welcome to the dashboard overview.</p>
      {selectedSubSidebarItem === 'Reports' && (
        <div className="mt-6">
          <DataTable />
        </div>
      )}
    </DualSidebarLayout>
  );
} 