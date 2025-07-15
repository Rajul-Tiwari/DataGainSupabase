'use client';

import { useParams } from 'next/navigation';
import DualSidebarLayout from '@/components/DualSidebarLayout';
import DataTable from '@/components/DataTable';
import CalendarType from '@/components/CalendarType';
import DashboardWorkOdersPage from '@/components/WorkOrder';

export default function DashboardSubmenuPage() {
  const params = useParams();
  const { submenu } = params;

  let content = null;
  switch (submenu) {
    case 'reports':
      content = (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Manage donor records with full CRUD operations, search, and filtering capabilities.</p>
          <div className="mt-6">
            <DataTable />
          </div>
        </>
      );
      break;
    case 'calendar-type':
      content = <CalendarType />;
      break;
    case 'face-recognition':
      content = (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Face Recognition</h1>
          <p className="text-gray-600">Face recognition dashboard content goes here.</p>
        </>
      );
      break;
    case 'daily-visit':
      content = (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Daily Visit</h1>
          <p className="text-gray-600">Daily visit dashboard content goes here.</p>
        </>
      );
      break;
    case 'donate':
      content = (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Donate</h1>
          <p className="text-gray-600">Donate dashboard content goes here.</p>
        </>
      );
      break;
    case 'report-history':
      content = (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report History</h1>
          <p className="text-gray-600">Report history dashboard content goes here.</p>
        </>
      );
      break;
    case 'test-history':
      content = (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Test History</h1>
          <p className="text-gray-600">Test history dashboard content goes here.</p>
        </>
      );
      break;
    case 'work-orders':
      content = (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Work Orders</h1>
          <DashboardWorkOdersPage/>
        </>
      );
      break;
    default:
      content = (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{submenu?.toString().replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h1>
          <p className="text-gray-600">This is the <span className="font-mono">{submenu}</span> submenu page.</p>
        </>
      );
  }

  return (
    <DualSidebarLayout>
      {content}
    </DualSidebarLayout>
  );
} 