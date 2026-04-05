//Date: 4 April 2026
//Name: Kyle McColgan
//Filename: TaskInputModal.jsx
//Description: This file contains the React task data entry component for the weekly schedule project.

import React, { useState } from 'react';

const TaskInputModal = ({ slot, onClose, onSave }) => {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(task);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Task</h3>
        <p>{`Day: ${slot.day}, Time: ${slot.hour}`}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default TaskInputModal;
