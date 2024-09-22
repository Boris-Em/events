import React, { useState, useEffect } from 'react';
import mockVenueData from './mock-venues-data.json';
import './VenueList.css';

interface Venue {
  id: number;
  name: string;
  description: string;
  address: string;
  isActive: boolean;
}

const VenueList: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchVenues();
  }, []);

  const toggleVenue = (id: number) => {
    setVenues(prevVenues =>
      prevVenues.map(venue =>
        venue.id === id ? { ...venue, isActive: !venue.isActive } : venue
      )
    );
  };

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://events-aggregator-d0338ed631c8.herokuapp.com/venues?city=amsterdam');
      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }
      const data = await response.json();
      setVenues(data.venues);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('An error occured while fetching venues');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="venue-list">
      <h1 className="venue-list-title">Venues</h1>
      <p className="venue-list-info">
        Don't see your favorite venue? Email us at{' '}
        <a href="mailto:contact@whats-on.life" className="email-link">
          contact@whats-on.life
        </a>
      </p>
      <div className="venue-grid">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card">
            <div className="venue-header">
              <h2 className="venue-name">{venue.name}</h2>
              <label className="venue-toggle">
                <input
                  type="checkbox"
                  checked={venue.isActive}
                  onChange={() => toggleVenue(venue.id)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <p className="venue-description">{venue.description}</p>
            <p className="venue-address">{venue.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueList;