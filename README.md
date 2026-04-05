# Schedule

A lightweight, modern daily planning application built with React and
Vite. The interface presents a clean weekly grid where tasks can be added and edited.

The project focuses on simplicity and clarity while maintaining a modern user experience.

## Overview

The planner displays a structured schedule from Monday through Friday,
covering hourly time slots from morning to evening. Each slot is
interactive, allowing users to quickly assign tasks and organize their
day with minimal friction.

All task data is stored locally, enabling persistence across sessions
without requiring a backend service.

## Features

View and interact with a responsive weekly schedule grid.

Add tasks by selecting any time slot through a focused modal interface.

Upload task data from a JSON file to quickly populate the schedule.

Persist all changes using localStorage so data remains after reload.

Reset the schedule at any time with a single action.

## Tech Stack

React is used for component-based UI development.

Vite provides a fast development server and optimized build process.

Vitest and Testing Library support unit testing.

LocalStorage is used for client-side persistence.

## Getting Started

Clone the repository:
   ```bash
   git clone https://github.com/mcckyle/schedule
   ```

Navigate into the project directory:
   ```bash
   cd schedule
   ```

Install dependencies:
   ```bash
   npm install
   ```

Start the development server:
   ```bash
   npm run dev
   ```

Open the app in your browser at:

http://localhost:5173/

## Data Format

Tasks can be imported using a JSON file structured as key-value pairs,
where each key represents a day and hour combination.

```json
{
  "Monday-8": "Morning Routine",
  "Monday-9": "Deep Work Session",
  "Tuesday-10": "Team Meeting"
}
```

## Deployment

The application is deployed automatically using GitHub Actions. Each
push to the main branch triggers a build and publishes the latest
version to GitHub Pages.

The deployed app is available at:

https://your_username.github.io/schedule

## Design Philosophy

This project emphasizes a minimal and consistent design system. Styles
are centralized through reusable tokens, reducing redundancy and
avoiding conflicts across components.

The interface is intentionally restrained, focusing on clarity and
subtle interaction rather than visual noise.

## License

This project is released under the MIT License.
