//Date: 5 April 2026
//Name: Kyle McColgan
//Filename: App.test.js
//Description: This file contains the main entry component tests for the weekly schedule project.

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/my daily planner/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders the schedule grid component', () => {
  render(<App />);
  const scheduleGridElement = screen.getByTestId('schedule-grid');
  expect(scheduleGridElement).toBeInTheDocument();
});

test('renders the footer with the correct year', () => {
  render(<App />);
  const year = new Date().getFullYear();
  const footerElement = screen.getByText(`© ${year} My Schedule App`);
  expect(footerElement).toBeInTheDocument();
});
