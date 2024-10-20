import React, { useState } from 'react';

const Task = ({ task, removeTask, completeTask, isCompleted }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <li>
      <div className={`name ${showDetails ? 'active' : ''}`}>
        <button className="more" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? '↑' : '↓'}
        </button>
        <span>{task.name}</span>
        {!isCompleted && (
          <button className="check" onClick={() => completeTask(task)}>✔️</button>
        )}
        <button className="remove" onClick={() => removeTask(task.id, isCompleted)}>x</button>
      </div>
      <div
        className="description"
        style={{ maxHeight: showDetails ? '200px' : '0', overflow: 'hidden' }}
      >
        <p>Details: {task.desc}</p>
        <p>Difficulty: {task.difficulty}%</p>
        <p>Importance: {task.importance}%</p>
        <p>Experience given: {task.experience}xp</p>
      </div>
    </li>
  );
};

export default Task;
