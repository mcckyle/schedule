//Date: 11 April 2026
//Name: Kyle McColgan
//Filename: TaskInputModal.jsx
//Description: This file contains the React task data entry component for the weekly schedule project.

import React, { useState, useEffect, useRef } from 'react';
import './TaskInputModal.css';

const TaskInputModal = ({ slot, onClose, onSave }) => {
  const [task, setTask] = useState('');
  const inputRef = useRef(null);
  
  //Autofocus input.
  useEffect(() => {
	  inputRef.current?.focus();
  }, []);
  
  useEffect(() => {
	  const handleKeyDown = (e) => {
		  if (e.key === 'Escape')
		  {
			  onClose();
		  }
	  };
	  
	  document.addEventListener('keydown', handleKeyDown);
	  document.body.style.overflow = 'hidden';
	  
	  return () => {
		  document.removeEventListener('keydown', handleKeyDown);
		  document.body.style.overflow = '';
	  };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
	if (!task.trim())
	{
		return;
	}
    onSave(task.trim());
  };
  
  const formatHour = (hour) => {
    const isPM = hour >= 12;
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${isPM ? 'PM' : 'AM'}`;
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
	    className="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		onClick={(e) => e.stopPropagation()} //Prevent closing when clicking inside the modal.
	  >
	    <header className="modal-header">
          <h2 id="modal=title">Add Task</h2>
		  <button
		    className="modal-close"
			onClick={onClose}
			aria-label="Close"
		  >
		    ×
		  </button>
		</header>
        <p className="modal-subtext">
		  {slot.day} • {formatHour(slot.hour)}
		</p>
        <form onSubmit={handleSubmit} className="modal-form">
            <input
			  ref={inputRef}
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task..."
            />
			<div className="modal-actions">
			  <button type="submit">Save</button>
			  <button type="button" onClick={onClose} className="secondary">
			    Cancel
			  </button>
			</div>
          </form>
        </div>
      </div>
  );
};

export default TaskInputModal;
