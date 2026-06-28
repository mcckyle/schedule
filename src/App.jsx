//Filename: App.jx
//Name: Kyle McColgan
//Date: 28 June 2026
//Description: This file contains the entry point for the daily planner React project.

import React from 'react';
import ScheduleGrid from './components/ScheduleGrid';
import './App.css'; //Custom global styling.

const App = () => {
  const year = new Date().getFullYear();
  return (
    <div className="app">
	  <div className="app-background" aria-hidden="true" />
	  
	  <header className="app-header">
	    <div className="app-header-content">
		  <span className="app-eyebrow">Weekly Planning</span>
          <h1>Daily Planner</h1>
		  <p className="app-subtitle">
		    Organize your schedule with clarity and focus.
		  </p>
		</div>
      </header>
      <main className="app-main">
        <ScheduleGrid />
      </main>
      <footer className="app-footer">
        <p className="footer-text">
          <span className="footer-muted">
            Designed in Saint Louis by{" "}
          </span>
          <a
            className="footer-link"
            href="https://mcckyle.github.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kyle McColgan
          </a>
		  {" "}
		  <span className="footer-muted">
          · React + Vite · {year}
          </span>
	    </p>
      </footer>
    </div>
  );
};

export default App;