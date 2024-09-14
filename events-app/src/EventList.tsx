import React, { useState, useEffect } from 'react';
import mockEventsData from './mock-events-data.json';
import './EventList.css';

interface Event {
  id: number;
  event: string;
  date: string;
  type: string;
  age: string;
  description: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [ageFilter, setAgeFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('Amsterdam');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState<boolean>(false);

  const locations = ['Amsterdam', 'New York', 'Paris', 'London'];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, typeFilter, ageFilter, startDate, endDate, selectedLocation]);

  const fetchEvents = async () => {
    try {
      setEvents(mockEventsData.events);
      setLoading(false);
    } catch (err) {
      setError('An error occurred while fetching events');
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (typeFilter) {
      filtered = filtered.filter(event => event.type.toLowerCase() === typeFilter.toLowerCase());
    }

    if (ageFilter) {
      filtered = filtered.filter(event => {
        const eventAge = event.age.toLowerCase();
        if (ageFilter === 'adults') {
          return !eventAge.includes('+') && !eventAge.includes('-') && eventAge !== 'all ages';
        } else if (ageFilter === 'children') {
          return eventAge.includes('+') || eventAge.includes('-') || eventAge === 'all ages';
        }
        return true;
      });
    }

    if (startDate) {
      filtered = filtered.filter(event => new Date(event.date) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(event => new Date(event.date) <= new Date(endDate));
    }

    setFilteredEvents(filtered);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const eventTypes = Array.from(new Set(events.map(event => event.type)));

  return (
    <div className="event-list">
      <div className="event-list-header">
        <h1 className="event-list-title">What's On</h1>
        <div className="location-selector">
          <h2 className="event-list-subtitle" onClick={toggleLocationDropdown}>{selectedLocation}</h2>
          {isLocationDropdownOpen && (
            <ul className="location-dropdown">
              {locations.map((location) => (
                <li key={location} onClick={() => handleLocationSelect(location)}>{location}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="filters">
        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          {eventTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select 
          value={ageFilter} 
          onChange={(e) => setAgeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Ages</option>
          <option value="children">Children</option>
          <option value="adults">Adults</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="filter-date"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="filter-date"
          placeholder="End Date"
        />
      </div>
      <div className="event-grid">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h2 className="event-title">{event.event}</h2>
              <span className="event-type">{event.type}</span>
            </div>
            <div className="event-body">
              <p className="event-date">{formatDate(event.date)}</p>
              <p className="event-age">Age: {event.age}</p>
              <p className="event-description">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;