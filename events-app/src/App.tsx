import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventList from './EventList';
import VenueList from './VenueList';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/settings" element={<VenueList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;