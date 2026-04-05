//Date: 4 April 2026
//Name: Kyle McColgan
//Filename: ScheduleGrid.jsx
//Description: This file contains the React parent grid component for the weekly schedule project.

import React, { useState, useEffect } from 'react';
import TaskInputModal from './TaskInputModal';
import dailySchedule from "../data/schedule.json";
import './ScheduleGrid.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 15 }, (_, index) => 8 + index); // 8 AM to 10 PM.

const ScheduleGrid = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [tasks, setTasks] = useState(() => {
    try
    {
      const savedTasks = localStorage.getItem('scheduleTasks');
      return savedTasks ? JSON.parse(savedTasks) : {};
    }
    catch (error)
    {
      console.error('Error parsing tasks from localStorage:', error);
      return {};
    }
  });
  
  // Load tasks from localStorage when component mounts.
  useEffect(() => {
	  try
	  {
		if (Object.keys(tasks).length === 0)
        {
		  setTasks(dailySchedule); // Set the tasks in state
          console.log("Loaded tasks from schedule.json:", dailySchedule);
        }
        else
        {
          console.error('Failed to fetch schedule.json');
        }
      }
      catch (error)
      {
        console.error("Error loading tasks:", error);
      }
  }, []);


  useEffect(() => {
    console.log('Updated tasks state:', tasks);  // Check the updated tasks.
  }, [tasks]);



  // Save tasks to localStorage on update.
  useEffect(() => {
    console.log('Saving tasks to localStorage:', tasks);
    localStorage.setItem('scheduleTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSlotClick = (day, hour) => {
    setSelectedSlot({ day, hour });
  };

  const addTask = (task) => {
    setTasks((prev) => ({
      ...prev,
      [`${selectedSlot.day}-${selectedSlot.hour}`]: task,
    }));
    setSelectedSlot(null);
  };

  const formatHour = (hour) => {
    const isPM = hour >= 12;
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${isPM ? 'PM' : 'AM'}`;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file)
    {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        parseTasksFromJSON(content);
      };
      reader.readAsText(file);
    }
  };

const parseTasksFromJSON = (content) => {
  try
  {
    const parsedTasks = JSON.parse(content);
    if (typeof parsedTasks === 'object' && parsedTasks !== null)
    {
      const mergedTasks = { ...tasks, ...parsedTasks }; // Merge new tasks with existing tasks.
      setTasks(mergedTasks); // Update state.
      localStorage.setItem('scheduleTasks', JSON.stringify(mergedTasks)); // Persist to localStorage.
    }
    else
    {
      console.error('Invalid JSON format for tasks.');
    }
  }
  catch (error)
  {
    console.error('Failed to parse JSON:', error);
  }
};

  return (
    <div className="schedule-grid" data-testid="schedule-grid">
      <div className="schedule-container">
        {days.map((day) => (
          <div className="day-column" key={day}>
            <h3>{day}</h3>
            {hours.map((hour) => (
              <div
                className="hour-slot"
                key={`${day}-${hour}`}
                onClick={() => handleSlotClick(day, hour)}
              >
                <div className="hour-header">
                  <strong>{formatHour(hour)}</strong>
                </div>
                <div className="task-content">
                  {tasks && tasks[`${day}-${hour}`] ? (
                    <p className="task-description">{tasks[`${day}-${hour}`]}</p>
                  ) : (
                    <p className="no-task">No activity scheduled</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {selectedSlot && (
        <TaskInputModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSave={addTask}
        />
      )}
      <div className="controls">
        <label htmlFor="file-upload">Upload Tasks (JSON): </label>
        <input
          type="file"
          id="file-upload"
          accept=".json"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => {
            setTasks({});
            localStorage.removeItem('scheduleTasks');
          }}
          className="clear-tasks-button"
        >
          Clear All Tasks
        </button>
      </div>
    </div>
  );
};

export default ScheduleGrid;
