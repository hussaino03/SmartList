import React from 'react';

const TaskButtons = ({ showCompleted, setShowCompleted }) => {
  return (
    <div>
      <button onClick={() => document.getElementById('newtask-form').style.display='block'} style={{ fontSize: '20px', fontWeight: 'bold' }}>New Task</button>
      <button onClick={() => setShowCompleted(true)} style={{ fontSize: '20px', fontWeight: 'bold' }}>Show completed</button>
      <button onClick={() => setShowCompleted(false)} style={{ fontSize: '20px', fontWeight: 'bold' }}>Show to-do</button>
    </div>
  );
};

export default TaskButtons;