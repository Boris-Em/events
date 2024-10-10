import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <img src="/app-icon.jpg" alt="What's on Icon" className="app-icon" />
      <h1 className="app-title">What's on</h1>
      <p className="app-description">
      </p>
      <a 
        href="https://apps.apple.com/us/app/id6736362639" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <img src="/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg" alt="Download Card Game Rules on the AppStore" className="image-link"/>
      </a>
    </div>
  );
}

export default App;