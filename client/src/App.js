import React, { useState, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import TaskButtons from './components/TaskButtons';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import LevelUpModal from './components/LevelUpModal';
import StreakTracker from './components/StreakTracker';
import Leaderboard from './components/Leaderboard';
import useXPManager from './components/XPManager';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('todo');

  // Initialize XP Manager
  const {
    level,
    experience,
    showLevelUp,
    newLevel,
    calculateXP,
    resetXP,
    setShowLevelUp,
    getTotalXP
  } = useXPManager();

  const initializeUser = async () => {
    try {
      let sessionId = localStorage.getItem('sessionId');
      
      if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem('sessionId', sessionId);
      }
  
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          sessionId,
          xp: getTotalXP() // Send the correct total XP on initialization
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize user: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('userId', data.userId);
      setUserId(data.userId);

      // Load tasks from localStorage
      const loadedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const loadedCompletedTasks = JSON.parse(localStorage.getItem('completedtasks')) || [];

      setTasks(loadedTasks);
      setCompletedTasks(loadedCompletedTasks);

    } catch (error) {
      console.error('Error during initialization:', error);
      setError(error.message);
    }
  };


  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    const updateUserData = async () => {
      if (!userId) return;

      try {
        const totalXP = getTotalXP(); // Get the correct total XP
        
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            xp: totalXP, // Send the total XP, not just current level's experience
            tasksCompleted: completedTasks.length,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update user data: ${response.status}`);
        }
      } catch (error) {
        console.error('Error updating user data:', error);
        setError(error.message);
      }
    };

    updateUserData();
  }, [userId, experience, level, completedTasks]); // Added level as a dependenc

  const addTask = (newTask) => {
    try {
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      console.log('Task added successfully:', newTask);
    } catch (error) {
      console.error('Error adding task:', error);
      setError(error.message);
    }
  };

  const completeTask = (task) => {
    try {
      const updatedTasks = tasks.filter(t => t.name !== task.name);
      const completedTask = { ...task, completedAt: new Date().toISOString() };
      const updatedCompletedTasks = [...completedTasks, completedTask];

      // Calculate XP using the XP Manager
      const { newExperience, currentLevel, totalExperience } = calculateXP(task.experience);

      setTasks(updatedTasks);
      setCompletedTasks(updatedCompletedTasks);

      // Update localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      localStorage.setItem('completedtasks', JSON.stringify(updatedCompletedTasks));

      // The XP Manager now handles persisting experience and level

    } catch (error) {
      console.error('Error completing task:', error);
      setError(error.message);
    }
  };

  const removeTask = (taskName, isCompleted) => {
    try {
      if (isCompleted) {
        const updatedCompletedTasks = completedTasks.filter(t => t.name !== taskName);
        setCompletedTasks(updatedCompletedTasks);
        localStorage.setItem('completedtasks', JSON.stringify(updatedCompletedTasks));
      } else {
        const updatedTasks = tasks.filter(t => t.name !== taskName);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      }
      console.log('Task removed successfully:', {
        taskName,
        isCompleted
      });
    } catch (error) {
      console.error('Error removing task:', error);
      setError(error.message);
    }
  };

  const clearAllData = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      
      localStorage.removeItem('tasks');
      localStorage.removeItem('completedtasks');
      localStorage.removeItem('experience');
      localStorage.removeItem('level');
      
      setTasks([]);
      setCompletedTasks([]);
      const { level: resetLevel, experience: resetExp } = resetXP();

      if (userId) {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            xp: resetExp,
            tasksCompleted: 0,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to reset user data: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      setError(error.message);
    }
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
    setCurrentView(showLeaderboard ? 'todo' : 'leaderboard');
  };

  const handleShowCompleted = () => {
    setShowCompleted(true);
    setShowLeaderboard(false);
    setCurrentView('completed');
  };
  const handleShowTodo = () => {
    setShowCompleted(false);
    setShowLeaderboard(false);
    setCurrentView('todo');
  };

  return (
    <div>
      <Header />
      {error && (
        <div className="error-message" style={{ color: 'red', padding: '10px', margin: '10px' }}>
          Error: {error}
        </div>
      )}
      <ProgressBar level={level} experience={experience} />
      <StreakTracker tasks={tasks} completedTasks={completedTasks} />
      <TaskButtons 
        showCompleted={showCompleted} 
        setShowCompleted={handleShowCompleted}
        setShowTodo={handleShowTodo}
      />
      <TaskForm addTask={addTask} />
      <div className="bottom-buttons">
        <button onClick={toggleLeaderboard} className="leaderboard-toggle">
          {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
        </button>
        <button id="clear-button" onClick={clearAllData}>Clear all data</button>
      </div>
      <SwitchTransition>
        <CSSTransition
          key={currentView}
          classNames="fade"
          timeout={100}
        >
          <div>
            {currentView === 'leaderboard' && <Leaderboard />}
            {currentView === 'todo' && (
              <TaskList 
                tasks={tasks} 
                removeTask={removeTask}
                completeTask={completeTask}
                isCompleted={false}
              />
            )}
            {currentView === 'completed' && (
              <TaskList 
                tasks={completedTasks} 
                removeTask={removeTask}
                completeTask={completeTask}
                isCompleted={true}
              />
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
      <LevelUpModal 
        show={showLevelUp} 
        onClose={() => setShowLevelUp(false)} 
        level={newLevel}
      />
    </div>
  );
};

export default App;