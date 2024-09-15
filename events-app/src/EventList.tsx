import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EventList.css';

interface Event {
  event_title: string;
  date: string;
  event_type: string;
  event_description: string;
  url: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('Amsterdam');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState<boolean>(false);

  const locations = ['Amsterdam', 'New York', 'Paris', 'London'];

  useEffect(() => {
    fetchEvents();
  }, [selectedLocation]);

  useEffect(() => {
    filterEvents();
  }, [events, typeFilter, startDate, endDate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://events-aggregator-d0338ed631c8.herokuapp.com/events?location=${selectedLocation}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.events);
      setLoading(false);
    } catch (err) {
      setError('An error occurred while fetching events');
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (typeFilter) {
      filtered = filtered.filter(event => event.event_type.toLowerCase() === typeFilter.toLowerCase());
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  const eventTypes = Array.from(new Set(events.map(event => event.event_type)));

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
        {filteredEvents.map((event, index) => (
          <div key={index} className="event-card">
            <div className="event-header">
              <h2 className="event-title">{event.event_title}</h2>
              <span className="event-type">{event.event_type}</span>
            </div>
            <div className="event-body">
              <p className="event-date">{formatDate(event.date)}</p>
              <p className="event-description">{event.event_description}</p>
              <a href={event.url} target="_blank" rel="noopener noreferrer" className="event-link">More Info</a>
            </div>
          </div>
        ))}
      </div>
      <Link to="/settings" className="settings-button">Settings</Link>
    </div>
  );
};

export default EventList;