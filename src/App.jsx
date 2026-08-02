//Filename: App.jx
//Name: Kyle McColgan
//Date: 1 August 2026
//Description: This file contains the entry point for the daily planner React project.

import React from 'react';
import Header from './components/Header/Header';
import ScheduleGrid from './components/ScheduleGrid/ScheduleGrid';
import Footer from './components/Footer/Footer';
import './App.css'; //Custom global styling.

const App = () => {
  return (
    <div className="app">
	  <div className="app-background" aria-hidden="true" />
	  <Header />
	  <main className="page-container app-main">
        <ScheduleGrid />
      </main>
	  <Footer />
    </div>
  );
};

export default App;