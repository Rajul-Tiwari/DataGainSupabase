'use client';
import { useState } from 'react';

export default function DashboardWorkOdersPage() {
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [agency, setAgency] = useState('');
  const [format, setFormat] = useState('');
  const [useDate, setUseDate] = useState('collected');

  return (
    <>
      <form className=" p-8 rounded-xl w-11/12 mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1   gap-6">
          <select
            className="p-4 rounded-lg bg-[#eaecec] text-gray-700 focus:outline-none"
            value={reportType}
            onChange={e => setReportType(e.target.value)}
          >
            <option value="">Select Report Type</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
          </select>
        
       
       
        </div>
      
        <div className="flex gap-6">
            <input
              type="date"
              className="p-4 rounded-lg bg-[#eaecec] text-gray-700 focus:outline-none w-full"
              placeholder="Start Date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="p-4 rounded-lg bg-[#eaecec] text-gray-700 focus:outline-none w-full"
              placeholder="Due Date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <select
            className="p-4 rounded-lg bg-[#eaecec] text-gray-700 focus:outline-none"
            value={agency}
            onChange={e => setAgency(e.target.value)}
          >
            <option value="">Agency</option>
            <option value="agency1">Agency 1</option>
            <option value="agency2">Agency 2</option>
          </select>
          <select
            className="p-4 rounded-lg bg-[#eaecec] text-gray-700 focus:outline-none"
            value={format}
            onChange={e => setFormat(e.target.value)}
          >
            <option value="">Select Format</option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        </div>
          <label className="font-bold text-lg text-gray-800 mb-2 block mt-8">Use Date</label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="radio"
              id="collected"
              name="useDate"
              value="collected"
              checked={useDate === 'collected'}
              onChange={() => setUseDate('collected')}
              className="accent-teal-400 w-5 h-5"
            />
            <label htmlFor="collected" className="text-gray-700 font-medium">Collected</label>
          </div>
        </div>
        <div className="flex justify-end shadow-md py-6 rounded-xl pr-4">
          <button
            type="submit"
            className="bg-teal-400 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-teal-500 transition-all"
          >
            SUBMIT
          </button>
        </div>
      </form>
      </>
    
  );
} 