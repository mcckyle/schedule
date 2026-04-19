//Name: Kyle McColgan
//Date: 18 April 2026
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
      return savedTasks ? JSON.parse(savedTasks) : dailySchedule;
    }
    catch (error)
    {
		return dailySchedule;
    }
  });
  
  //Persist tasks.  
  useEffect(() => {
    //console.log('Saving tasks to localStorage:', tasks);
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
  
  //Current time highlighting.
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentHour = now.getHours();
  
  const handleFileUpload = (file) => {
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
		  console.error('Invalid JSON file!');
	  }
	};
	reader.readAsText(file);
  };
  
  return (
    <div className="schedule-grid" data-testid="schedule-grid">
      <div className="schedule-container" role="grid">
        {days.map((day) => (
          <section
		    className="day-column"
			key={day}
			aria-label={day}
		  >
            <h3 className="day-header">{day}</h3>
            {hours.map((hour) => {
			  const key = `${day}-${hour}`;
			  const task = tasks[key];
			  const isNow = day === (currentDay) && (hour) === currentHour;
			  
			  return (
			    <button
				  key={key}
				  className={`hour-slot ${isNow ? 'current' : ''}`}
				  onClick={() => handleSlotClick(day, hour)}
				  aria-label={`${day} ${formatHour(hour)}`}
				>
                  <span className="hour-header">{formatHour(hour)}</span>
                  <span className="task-content">
                    {task || <span className="no-task">No activity</span>}
                  </span>
                </button>
              );
			})}
          </section>
        ))}
      </div>
      {selectedSlot && (
	    (() => {
			const key = `${selectedSlot.day}-${selectedSlot.hour}`;
			return (
				<TaskInputModal
				  slot={selectedSlot}
				  onClose={() => setSelectedSlot(null)}
				  onSave={addTask}
				  initialValue={tasks[key] || ''}
				/>
			);
		})()
      )}
      <div className="controls">
        <input
          type="file"
		  accept=".json"
		  onChange={(e) => handleFileUpload(e.target.files[0])}
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
