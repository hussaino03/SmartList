import React from 'react';

const TaskButtons = ({ showCompleted, setShowCompleted, setShowTodo }) => {
  return (
    <div>
      <button onClick={() => document.getElementById('newtask-form').style.display='block'} style={{ fontSize: '20px', fontWeight: 'bold' }}>New Task</button>
      <button onClick={setShowCompleted} style={{ fontSize: '20px', fontWeight: 'bold' }}>Show completed</button>
      <button onClick={setShowTodo} style={{ fontSize: '20px', fontWeight: 'bold' }}>Show to-do</button>
    </div>
  );
};

export default TaskButtons;