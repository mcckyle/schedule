//Filename: ScheduleGrid.jsx
//Name: Kyle McColgan
//Date: 16 May 2026
//Description: This file contains the parent grid component for the weekly schedule React project.

import React, { useState, useEffect } from 'react';
import dailySchedule from "../data/schedule.json";
import './ScheduleGrid.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 15 }, (_, index) => 8 + index); // 8 AM to 10 PM.

const ScheduleGrid = () => {
  const [editingKey, setEditingKey] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState(() => {
    try
    {
      const savedTasks = localStorage.getItem('scheduleTasks');
      return savedTasks ? JSON.parse(savedTasks) : dailySchedule;
    }
    catch
    {
		return dailySchedule;
    }
  });
  
  //Persist tasks.  
  useEffect(() => {
	  localStorage.setItem('scheduleTasks', JSON.stringify(tasks));
  }, [tasks]);
  
  //Current time highlighting.
  useEffect(() => {
	  const interval = setInterval(() => {
		  setCurrentTime(new Date());
	  }, 60000);
	  
	  return () => clearInterval(interval);
  }, []);
  
  const currentDay = currentTime.toLocaleDateString(
    'en-US',
	{ weekday: 'long' }
  );
  
  const currentHour = currentTime.getHours();
  
  const formatHour = (hour) => {
    const isPM = hour >= 12;
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${isPM ? 'PM' : 'AM'}`;
  };
  
  const handleSlotClick = (key, value) => {
    setEditingKey(key);
	setEditingValue(value || '');
  };
  
  const resetEditor = () => {
    setEditingKey(null);
	setEditingValue('');
  };
  
  const saveTask = () => {
	const trimmed = editingValue.trim();
	
	setTasks((previous) => {
	  if (!trimmed)
	  {
		  const updated = { ...previous };
		  delete updated[editingKey];
		  return updated;
	  }
	  
	  return {
      ...previous,
      [editingKey]: trimmed,
    };
  });
  
    resetEditor();
  };
  
  const clearAllTasks = () => {
	  setTasks({});
	  localStorage.removeItem('scheduleTasks');
  };
  
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
		setTasks((previous) => ({ ...previous, ...parsed }));
	  }
	  catch
	  {
		  console.error('Invalid JSON file!');
	  }
	};
	reader.readAsText(file);
  };
  
  return (
    <section className="schedule-grid" data-testid="schedule-grid">
      <div className="schedule-container" role="grid">
        {days.map((day) => (
          <section
		    key={day}
			className="day-column"
			aria-label={day}
		  >
            <header className="day-header">
			  <h2>{day}</h2>
			</header>
            {hours.map((hour) => {
			  const key = `${day}-${hour}`;
			  const task = tasks[key];
			  const isNow = (currentDay === day) && (currentHour === hour);
			  
			  return (
			    <button
				  key={key}
				  className={`hour-slot ${isNow ? 'current' : ''}`}
				  onClick={() => handleSlotClick(key, task)}
				  aria-label={`${day} ${formatHour(hour)}`}
				>
                  <span className="hour-header">{formatHour(hour)}</span>
				  {editingKey === key ? (
				    <input
					  className="task-input"
					  autoFocus
					  value={editingValue}
					  placeholder="Add task..."
					  onChange={(event) => setEditingValue(event.target.value)}
					  onBlur={saveTask}
					  onClick={(event) => event.stopPropagation()}
					  onKeyDown={(event) => {
						  if (event.key === 'Enter')
						  {
							  event.preventDefault();
							  saveTask();
						  }
						  
						  if(event.key === 'Escape')
						  {
							  resetEditor();
						  }
					  }}
					/>
				) : (
                  <span className="task-content">
                    {task || (
					  <span className="no-task">
					    No activity
					  </span>
					)}
                  </span>
				  )}
                </button>
              );
			})}
          </section>
        ))}
      </div>
      <div className="controls">
	    <label className="upload-control">
		  <span>Import Schedule</span>
			<input
			  type="file"
			  accept=".json"
			  onChange={(event) => handleFileUpload(event.target.files[0])}
			/>
		</label>
		<button
		  className="clear-button"
		  onClick={clearAllTasks}
		>
		  Clear Schedule
		</button>
	  </div>
    </section>
  );
};

export default ScheduleGrid;
