//Filename: Footer.jsx
//Name: Kyle McColgan
//Date: 1 August 2026
//Description: This file contains the Footer component for the daily planner React project.

import './Footer.css'; //Custom styling.

const Footer = () => {
  const year = new Date().getFullYear();
  return (
      <footer className="app-footer">
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
      </footer>
  );
};

export default Footer;