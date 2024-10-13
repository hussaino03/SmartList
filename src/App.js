import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import TaskButtons from './components/TaskButtons';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import LevelUpModal from './components/LevelUpModal';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1); // Track new level for the modal

  useEffect(() => {
    // Load tasks, completed tasks, level, and experience from localStorage
    const loadedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const loadedCompletedTasks = JSON.parse(localStorage.getItem('completedtasks')) || [];
    const loadedLevel = JSON.parse(localStorage.getItem('level')) || 1;
    const loadedExperience = JSON.parse(localStorage.getItem('experience')) || 0;

    setTasks(loadedTasks);
    setCompletedTasks(loadedCompletedTasks);
    setLevel(loadedLevel);
    setExperience(loadedExperience);
  }, []);

  const addTask = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const completeTask = (task) => {
    const updatedTasks = tasks.filter(t => t.name !== task.name);
    const updatedCompletedTasks = [...completedTasks, task];
    let newExperience = experience + task.experience;
    const experienceNeededToLevel = level * 200;
    let currentLevel = level;

    setTasks(updatedTasks);
    setCompletedTasks(updatedCompletedTasks);

    // Check for level-up
    if (newExperience >= experienceNeededToLevel) {
      // Calculate the new level and remaining experience
      while (newExperience >= currentLevel * 200) {
        newExperience -= currentLevel * 200;
        currentLevel += 1;
      }
      setNewLevel(currentLevel); // Set new level for the modal
      setLevel(currentLevel);
      setShowLevelUp(true); // Show the modal only after updating the level
    }
    
    setExperience(newExperience);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    localStorage.setItem('completedtasks', JSON.stringify(updatedCompletedTasks));
    localStorage.setItem('experience', JSON.stringify(newExperience));
    localStorage.setItem('level', JSON.stringify(currentLevel));
  };

  const removeTask = (taskName, isCompleted) => {
    if (isCompleted) {
      const updatedCompletedTasks = completedTasks.filter(t => t.name !== taskName);
      setCompletedTasks(updatedCompletedTasks);
      localStorage.setItem('completedtasks', JSON.stringify(updatedCompletedTasks));
    } else {
      const updatedTasks = tasks.filter(t => t.name !== taskName);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  const clearAllData = () => {
    setTasks([]);
    setCompletedTasks([]);
    setLevel(1);
    setExperience(0);
    localStorage.clear();
  };

  return (
    <div>
      <Header />
      <ProgressBar level={level} experience={experience} />
      <TaskButtons 
        showCompleted={showCompleted} 
        setShowCompleted={setShowCompleted}
      />
      <TaskForm addTask={addTask} />
      <button id="clear-button" onClick={clearAllData}>Clear all data</button>
      <TaskList 
        tasks={showCompleted ? completedTasks : tasks} 
        removeTask={removeTask}
        completeTask={completeTask}
        isCompleted={showCompleted}
      />
      <LevelUpModal 
        show={showLevelUp} 
        onClose={() => setShowLevelUp(false)} 
        level={newLevel} // Ensure modal shows the correct new level
      />
    </div>
  );
};

export default App;
