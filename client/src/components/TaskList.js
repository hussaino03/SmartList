import React from 'react';
import Task from './Task';

const TaskList = ({ tasks, removeTask, completeTask, isCompleted }) => {
  return (
    <div className="main">
      <h2>{isCompleted ? 'Completed' : 'To-do'}</h2>
      <ul id="list">
        {tasks.map((task) => (
          <Task 
            key={task.id} 
            task={task} 
            removeTask={removeTask} 
            completeTask={completeTask}
            isCompleted={isCompleted}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;