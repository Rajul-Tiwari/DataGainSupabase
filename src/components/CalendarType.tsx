'use client';
import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

type EventType = {
  title: string;
  start: Date;
  end: Date;
  type: 'event' | 'reminder';
  allDay: boolean;
};

export default function CalendarType() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'event' | 'reminder' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setModalOpen(true);
    setModalType(null);
    setInputValue('');
  };

  const handleAdd = (type: 'event' | 'reminder') => {
    setModalType(type);
    setInputValue('');
  };

  const handleSave = () => {
    if (!selectedSlot || !modalType || !inputValue.trim()) return;
    setEvents((prev) => [
      ...prev,
      {
        title: inputValue,
        start: selectedSlot.start,
        end: selectedSlot.end,
        type: modalType,
        allDay: true,
      },
    ]);
    setModalOpen(false);
    setModalType(null);
    setInputValue('');
    setSelectedSlot(null);
  };

  // Custom event style
  const eventPropGetter = (event: EventType) => {
    if (event.type === 'event') {
      return {
        style: {
          backgroundColor: '#60a5fa', // blue-400
          color: '#1e3a8a', // blue-900
          borderRadius: '8px',
        },
      };
    } else if (event.type === 'reminder') {
      return {
        style: {
          backgroundColor: '#fdba74', // orange-300
          color: '#7c2d12', // orange-900
          borderRadius: '8px',
        },
      };
    }
    return {};
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Calendar Type</h1>
      <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto text-black">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventPropGetter}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
        />
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs">
            {!modalType ? (
              <>
                <h2 className="text-lg font-bold mb-4 text-black">Add to {selectedSlot?.start.toDateString()}</h2>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handleAdd('event')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Event</button>
                  <button onClick={() => handleAdd('reminder')} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Add Reminder</button>
                  <button onClick={() => setModalOpen(false)} className="mt-2 text-gray-500 hover:underline">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4">Add {modalType === 'event' ? 'Event' : 'Reminder'}</h2>
                <input
                  className="w-full p-2 text-black border rounded mb-4"
                  placeholder={`Enter ${modalType === 'event' ? 'event' : 'reminder'}...`}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">Save</button>
                  <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:underline">Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
} 