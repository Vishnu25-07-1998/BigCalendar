import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

export default function TaskCalendarWithCheckboxFilter() {
  const [events, setEvents] = useState([
    {
      id: 0,
      title: 'Project Kickoff',
      start: new Date(2025, 7, 12, 9, 0),
      end: new Date(2025, 7, 12, 10, 30),
      category: 'Work',
    },
    {
      id: 1,
      title: 'Design Review',
      start: new Date(2025, 7, 13, 13, 0),
      end: new Date(2025, 7, 13, 15, 0),
      category: 'Work',
    },
    {
      id: 2,
      title: 'Doctor Appointment',
      start: new Date(2025, 7, 14, 11, 0),
      end: new Date(2025, 7, 14, 11, 30),
      category: 'Personal',
    },
    {
      id: 3,
      title: 'Gym',
      start: new Date(2025, 7, 15, 18, 0),
      end: new Date(2025, 7, 15, 19, 0),
      category: 'Health',
    },
  ]);

  const [selectedCategories, setSelectedCategories] = useState(['Work', 'Personal', 'Health']);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('Enter task title:');
    const category = window.prompt('Enter category (Work / Personal / Health):');
    if (title && category) {
      setEvents((prev) => [
        ...prev,
        {
          id: prev.length ? Math.max(...prev.map((e) => e.id)) + 1 : 0,
          title,
          start,
          end,
          category,
        },
      ]);
    }
  };

  const onEventDrop = ({ event, start, end }) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, start, end } : e))
    );
  };

  const onEventResize = ({ event, start, end }) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, start, end } : e))
    );
  };

  const filteredEvents = events.filter((e) => selectedCategories.includes(e.category));

  const categories = ['Work', 'Personal', 'Health'];

  return (
    <div style={{ padding: 12 }}>
      <h2>📅 Task Planner with Category Filter</h2>

      <div style={{ marginBottom: 10 }}>
        {categories.map((cat) => (
          <label key={cat} style={{ marginRight: 15 }}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
            />{' '}
            {cat}
          </label>
        ))}
      </div>

      <div style={{ height: 700 }}>
        <DnDCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          resizable
          defaultView="month"
          onSelectSlot={handleSelectSlot}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}