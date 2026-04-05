//Date: 5 April 2026
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
  
  //Load default schedule ONLY if no saved data exists.
  useEffect(() => {
	    if (Object.keys(tasks).length === 0)
        {
		  setTasks(dailySchedule); // Set the tasks in state
          console.log("Loaded tasks from schedule.json:", dailySchedule);
        }
        else
        {
          console.error('Failed to fetch schedule.json');
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
  
  return (
    <div className="schedule-grid" data-testid="schedule-grid">
      <div className="schedule-container">
        {days.map((day) => (
          <section className="day-column" key={day}>
            <h3 className="day-header">{day}</h3>
            {hours.map((hour) => {
			  const key = `${day}-${hour}`;
			  const task = tasks[key];
			  
			  return (
			    <button
				  key={key}
				  className="hour-slot"
				  onClick={() => handleSlotClick(day, hour)}
				>
                  <div className="hour-header">{formatHour(hour)}</div>
                  <div className="task-content">
                    {task ? (
                      <span className="task-description">{task}</span>
                    ) : (
                      <span className="no-task">No activity</span>
                    )}
                </div>
              </button>
              );
			})}
          </section>
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
        <input
          type="file"
		  accept=".json"
		  onChange={(e) => {
		    const file = e.target.files[0];
			if (!file)
			{
			  return;
			}
			const reader = new FileReader();
			reader.onload = (event) => {
			  try
			  {
			    const parsed = JSON.parse(event.target.result);
				setTasks((prev) => ({ ...prev, ...parsed }));
			  }
			  catch
			  {
				  console.error('Invalid JSON file');
			  }
			};
			reader.readAsText(file);
		  }}
        />
        <button
          onClick={() => {
            setTasks({});
            localStorage.removeItem('scheduleTasks');
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ScheduleGrid;
