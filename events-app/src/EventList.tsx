import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadBlockedVenues } from './VenuePersistence'
import './EventList.css';

interface Event {
  event_title: string;
  date: string;
  event_type: string;
  event_description: string;
  url: string;
  id: number;
  venue_id: number;
  photo_url: string;  // Added this line
}

interface Venue {
  id: number;
  name: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<{ [id: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('Amsterdam');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState<boolean>(false);

  const locations = ['Amsterdam', 'New York', 'Paris', 'London'];

  useEffect(() => {
    fetchEvents();
    fetchVenues();
  }, [selectedLocation]);

  useEffect(() => {
    filterEvents();
  }, [events, typeFilter, date]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://events-aggregator-d0338ed631c8.herokuapp.com/api/v1/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      setError('An error occurred while fetching events');
      setLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await fetch('https://events-aggregator-d0338ed631c8.herokuapp.com/api/v1/venues');
      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }
      const data: Venue[] = await response.json();
      const venueMap = data.reduce((acc, venue) => {
        acc[venue.id] = venue.name;
        return acc;
      }, {} as { [id: number]: string });
      setVenues(venueMap);
    } catch (err) {
      console.error('An error occurred while fetching venues', err);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (typeFilter) {
      filtered = filtered.filter(event => event.event_type.toLowerCase() === typeFilter.toLowerCase());
    }

    if (date) {
      filtered = filtered.filter(event => new Date(event.date).getDate() === new Date(date).getDate());
    }

    let blockedVenueIds = loadBlockedVenues();

    if (Object.keys(blockedVenueIds).length !== 0) {
      filtered = filtered.filter(event => blockedVenueIds[event.venue_id])
    }

    if (filtered.length === 0) {
      setError('No events found. Please adjust your filters.');
    } else {
      setError(null);
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

  if (loading) return <div className="loading">Loading your events...</div>;
  if (error) return (
    <div className="error">{error}
      <Link to="/settings" className="settings-button">Settings
      </Link>
    </div>
  );

  const eventTypes = Array.from(new Set(events.map(event => event.event_type)));

  return (
    <div className="event-list">
      <Link to="/settings" className="settings-button">Preferences</Link>
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
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="filter-date"
          placeholder="Start Date"
        />
      </div>
      <div className="event-grid">
        {filteredEvents.map((event, index) => (
          <div key={index} className="event-card">
            {event.photo_url && (
              <div className="event-image">
                <img src={event.photo_url} alt={event.event_title} onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }} />
              </div>
            )}
            <div className="event-header">
              <h2 className="event-title">{event.event_title}</h2>
              <span className="event-type">{event.event_type}</span>
            </div>
            <div className="event-body">
              <p className="event-date">{formatDate(event.date)}</p>
              <p className="event-venue">{venues[event.venue_id] || 'Unknown Venue'}</p>
              <p className="event-description">{event.event_description}</p>
              <a href={event.url} target="_blank" rel="noopener noreferrer" className="event-link">More Info</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;