//Filename: ScheduleGrid.jsx
//Name: Kyle McColgan
//Date: 10 October 2026
//Description: This file contains the parent grid component for the weekly schedule React project.

import React, { useState, useEffect, useRef } from 'react';
import dailySchedule from "../../data/schedule.json";
import './ScheduleGrid.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 15 }, (_, index) => 8 + index); // 8 AM to 10 PM.

const formatHour = (hour) => {
	const isPM = hour >= 12;
	const formattedHour = hour % 12 || 12;
	return `${formattedHour} ${isPM ? 'PM' : 'AM'}`;
};

//Accept only valid task maps containing string values.
const normalizeTaskMap = (value) => {
	if ((value === null) || (typeof value !== 'object') || (Array.isArray(value)))
	{
		return null;
	}
	
	return Object.fromEntries(Object.entries(value).filter(([, task]) => typeof task === 'string'));
};

//Preserve the existing default schedule when available.
const getDefaultTasks = () => {
	if (typeof dailySchedule === 'undefined')
	{
		return {};
	}
	
	return normalizeTaskMap(dailySchedule) ?? {};
};

//Restore saved activities without allowing invalid storage to crash the app.
const getInitialTasks = () => {
	const fallback = getDefaultTasks();
	
	if (typeof window === 'undefined')
	{
		return fallback;
	}
	
	try
	{
		const savedTasks = window.localStorage.getItem('scheduleTasks');
		
		if (savedTasks === null)
		{
			return fallback;
		}
		
		return normalizeTaskMap(JSON.parse(savedTasks)) ?? fallback;
	}
	catch
	{
		return fallback;
	}
};

const ScheduleGrid = () => {
  const [editingKey, setEditingKey] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [tasks, setTasks] = useState(getInitialTasks);
  const skipBlurSaveRef = useRef(false);
  
  //Persist activities.  
  useEffect(() => {
	  try
	  {
		  window.localStorage.setItem('scheduleTasks', JSON.stringify(tasks));
	  }
	  catch
	  {
		  //Keep the planner usable when storage is unavailable.
	  }
  }, [tasks]);
  
  //Refresh the current time once per minute.
  useEffect(() => {
	  const updateTime = () => {
		  setCurrentTime(new Date());
	  };
	  
	  updateTime();
	  const intervalId = window.setInterval(updateTime, 60000);
	  
	  return () => window.clearInterval(intervalId);
  }, []);
  
  const currentDay = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  
  const currentHour = currentTime.getHours();
  const resetEditor = () => {
	  setEditingKey(null);
	  setEditingValue('');
  };
  
  const handleSlotClick = (key, value) => {
	skipBlurSaveRef.current = false;
    setEditingKey(key);
	setEditingValue(value);
  };
  
  const saveTask = () => {
	if (editingKey === null)
	{
		return;
	}
	
	const key = editingKey;
	const trimmedValue = editingValue.trim();
	
	setTasks((previous) => {
	  const updated = { ...previous };
	  
	  if (trimmedValue)
	  {
		  updated[key] = trimmedValue;
	  }
	  else
	  {
		  delete updated[key];
	  }
	  
	  return updated;
    });
  
    resetEditor();
  };
  
  const handleEditorBlur = () => {
	  if (skipBlurSaveRef.current)
	  {
		  skipBlurSaveRef.current = false;
		  return;
	  }
	  
	  saveTask();
  };
  
  const cancelEditing = (event) => {
	  event.preventDefault();
	  
	  skipBlurSaveRef.current = true;
	  event.currentTarget.blur();
	  
	  resetEditor();
  };
  
  const clearAllTasks = () => {
	  setTasks({});
	  resetEditor();
  };
  
  const handleFileUpload = (file) => {
	if (!file)
	{
	  return;
	}
	
	const reader = new FileReader();
	reader.onload = () => {
	  try
	  {
		const parsed = normalizeTaskMap(JSON.parse(reader.result));
		
		if (parsed === null)
		{
			throw new Error('The imported file must contain a JSON object!');
		}
		
		setTasks((previous) => ({ ...previous, ...parsed }));
	  }
	  catch(error)
	  {
		  console.error('Unable to import schedule:', error);
	  }
	};
	reader.onerror = () => {
		console.error('Unable to read the selected schedule file.');
	};
	reader.readAsText(file);
  };
  
  return (
    <section className="schedule-grid" data-testid="schedule-grid" aria-label="Weekly schedule">
      <div className="schedule-container">
        {days.map((day) => {
		  const isCurrentDay = currentDay === day;
		  const headingId = `day-${day.toLowerCase()}`;
          return (
		   <section
		    key={day}
			className={`day-column ${isCurrentDay ? 'today-column' : ''}`}
			aria-label={headingId}
		  >
            <header className="day-header">
			  <h2 id={headingId}>{day}</h2>
			  {isCurrentDay && (
			    <span className="today-badge">Today</span>
			  )}
			</header>
			<div className="day-slots">
            {hours.map((hour) => {
			  const key = `${day}-${hour}`;
			  const task = tasks[key] || '';
			  const isNow = isCurrentDay && (currentHour === hour);
			  const isEditing = editingKey === key;
			  
			  if (isEditing)
			  {
				  return (
				    <div key={key} className={`hour-slot editing ${isNow ? 'current' : ''}`}>
					   <span className="hour-header">
					     {formatHour(hour)}
					    </span>
						<input
						  className="task-input"
						  type="text"
						  autoFocus
						  value={editingValue}
						  placeholder="Add an activity"
						  aria-label={`${day} ${formatHour(hour)} activity`}
						  onChange={(event) => setEditingValue(event.target.value)}
						  onBlur={handleEditorBlur}
						  onKeyDown={(event) => {
							  if (event.key === 'Enter')
							  {
								  event.preventDefault();
								  event.currentTarget.blur();
							  }
							  
							  if(event.key === 'Escape')
							  {
								  cancelEditing(event);
							  }
						  }}
						/>
					  </div>
				  );
			  }
			  
			  return (
			    <button
				  key={key}
				  type="button"
				  className={`hour-slot ${isNow ? 'current' : ''}`}
				  onClick={() => handleSlotClick(key, task)}
				  aria-label={`${day} ${formatHour(hour)}${task ? `: ${task}` : ''}`}
				>
                  <span className="hour-header">{formatHour(hour)}</span>
                  <span className="task-content">
                    {task || (
					  <span className="no-task">
					    No activity
					  </span>
					)}
                  </span>
                </button>
              );
			})}
			</div>
          </section>
		  );
        })}
      </div>
      <div className="controls" role="group" aria-label="Schedule actions">
	    <label className="upload-control">
		  <span>Import Schedule</span>
			<input
			  type="file"
			  accept=".json,application/json"
			  onChange={(event) => {
				  const input = event.currentTarget;
				  handleFileUpload(input.files?.[0]);
				  input.value= '';
			  }}
			/>
		</label>
		<button
		  type="button"
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
