//Filename: ScheduleGrid.jsx
//Name: Kyle McColgan
//Date: 2 May 2026
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
    catch (error)
    {
		return dailySchedule;
    }
  });
  
  //Persist tasks.  
  useEffect(() => {
	if (Object.keys(tasks).length > 0)
	{
		localStorage.setItem('scheduleTasks', JSON.stringify(tasks));
	}
  }, [tasks]);
  
  const handleSlotClick = (key, value) => {
    setEditingKey(key);
	setEditingValue(value || '');
  };

  const saveTask = () => {
	const trimmed = editingValue.trim();
	
	setTasks((prev) => {
	  if (!trimmed)
	  {
		  const updated = { ...prev };
		  delete updated[editingKey];
		  return updated;
	  }
	  
	  return {
      ...prev,
      [editingKey]: trimmed,
    };
  });
  
  setEditingKey(null);
  setEditingValue('');
  };

  const formatHour = (hour) => {
    const isPM = hour >= 12;
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${isPM ? 'PM' : 'AM'}`;
  };
  
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
				  onClick={() => handleSlotClick(key, task)}
				  aria-label={`${day} ${formatHour(hour)}`}
				>
                  <span className="hour-header">{formatHour(hour)}</span>
				  {editingKey === key ? (
				    <input
					  className="task-input"
					  aria-label={`Edit task for ${day} at ${formatHour(hour)}`}
					  value={editingValue}
					  autoFocus
					  onChange={(e) => setEditingValue(e.target.value)}
					  onBlur={saveTask}
					  onKeyDown={(e) => {
						  if (e.key === 'Enter')
						  {
							  e.preventDefault();
							  saveTask();
						  }
						  
						  if(e.key === 'Escape')
						  {
							  setEditingKey(null);
							  setEditingValue('');
						  }
					  }}
					  onClick={(e) => e.stopPropagation()}
					  placeholder="Enter task..."
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
