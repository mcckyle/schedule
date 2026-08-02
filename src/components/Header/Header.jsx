//Filename: Header.jsx
//Name: Kyle McColgan
//Date: 1 August 2026
//Description: This file contains the Header component for the daily planner React project.

import './Header.css'; //Custom styling.

const Header = () => {
  return (
    <header className="app-header">
	    <div className="page-container app-header-content">
		  <p className="app-eyebrow">Weekly Planning</p>
          <h1>Daily Planner</h1>
		  <p className="app-subtitle">
		    Organize your schedule with clarity and focus.
		  </p>
		</div>
    </header>
  );
};

export default Header;