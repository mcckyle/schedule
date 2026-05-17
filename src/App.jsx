//Filename: App.jx
//Name: Kyle McColgan
//Date: 16 May 2026
//Description: This file contains the entry point for the daily planner React project.

import React from 'react';
import ScheduleGrid from './components/ScheduleGrid';
import './App.css'; //Custom global styling.

const App = () => {
  return (
    <div className="app">
	  <div className="app-background" />
	  
	  <header className="app-header">
	    <div className="app-header-content">
		  <p className="app-eyebrow">Weekly Planning</p>
          <h1>Daily Planner</h1>
		  <p className="app-subtitle">
		    Organize your schedule with structure and clarity.
		  </p>
		</div>
      </header>
      <main className="app-main" role="main">
        <ScheduleGrid />
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Daily Planner</p>
      </footer>
    </div>
  );
};

export default App;