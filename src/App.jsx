//Filename: App.jx
//Name: Kyle McColgan
//Date: 2 May 2026
//Description: This file contains the entry point for the React schedule project.

import React from 'react';
import ScheduleGrid from './components/ScheduleGrid';
import './App.css'; //Custom global styling.

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
	    <div className="app-header-content">
          <h1>My Daily Planner</h1>
		  <p className="app-subtitle">
		    Organize your week with clarity and focus.
		  </p>
		</div>
      </header>
      <main className="app-main" role="main">
        <ScheduleGrid />
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} My Schedule App</p>
      </footer>
    </div>
  );
};

export default App;