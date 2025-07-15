import DualSidebarLayout from '@/components/DualSidebarLayout'
// import DataTable from '@/components/DataTable' // Remove DataTable import

export default function Home() {
  return (
    <DualSidebarLayout>
      <div className="max-w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to the Dashboard
          </h1>
          <p className="text-gray-600">
            Please select a section from the sidebar to get started.
          </p>
        </div>
        {/* DataTable removed from here */}
      </div>
    </DualSidebarLayout>
  );
}
