import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <img src="/app-icon.jpg" alt="What's on Icon" className="app-icon" />
      <h1 className="app-title">Card Game Rules</h1>
      <p className="app-description">
        Card Game Rules is your pocket guide to mastering any card game. 
        With clear, concise rules for over 100 popular card games, you'll 
        never be left wondering how to play again.
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