//Date: 4 April 2026
//Name: Kyle McColgan
//Filename: App.jx
//Description: This file contains the entry point for the React schedule project.

import React from 'react';
import ScheduleGrid from './components/ScheduleGrid';
import './App.css'; //Custom global styling.

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>My Daily Planner</h1>
      </header>
      <main className="app-main">
        <ScheduleGrid />
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} My Schedule App</p>
      </footer>
    </div>
  );
};

export default App;