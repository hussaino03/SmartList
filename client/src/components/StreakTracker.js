import React, { useState, useEffect } from 'react';

const StreakTracker = ({ completedTasks, today = new Date() }) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const calculateStreak = () => {
      if (!completedTasks.length) {
        setCurrentStreak(0);
        setLongestStreak(0);
        return;
      }

      const todayDate = new Date(today).setHours(0, 0, 0, 0);
      let current = 0;
      let max = 0;
      let previousDate = null;

      // Sort tasks by completion date and remove duplicate dates
      const sortedTasks = [...completedTasks]
        .filter(task => task.completedAt)
        .map(task => ({
          ...task,
          normalizedDate: new Date(task.completedAt).setHours(0, 0, 0, 0)
        }))
        .sort((a, b) => a.normalizedDate - b.normalizedDate)
        .filter((task, index, self) => 
          index === self.findIndex(t => t.normalizedDate === task.normalizedDate)
        );

      for (let i = 0; i < sortedTasks.length; i++) {
        const taskDate = sortedTasks[i].normalizedDate;
        
        if (previousDate === null) {
          current = 1;
        } else {
          const daysDifference = Math.round((taskDate - previousDate) / (1000 * 60 * 60 * 24));
          
          if (daysDifference === 1) {
            current += 1;
          } else {
            // If there's a gap, update max and reset current
            max = Math.max(max, current);
            current = 1;
          }
        }
        
        previousDate = taskDate;
      }

      // Update max one final time
      max = Math.max(max, current);

      // Check if the streak is still active (last task was today or yesterday)
      const lastTaskDate = sortedTasks[sortedTasks.length - 1].normalizedDate;
      const daysSinceLastTask = Math.round((todayDate - lastTaskDate) / (1000 * 60 * 60 * 24));

      if (daysSinceLastTask > 1) {
        // If the last task was completed more than 1 day ago, current streak is 0
        current = 0;
      } else if (daysSinceLastTask === 1) {
        // If the last task was yesterday and no task today, streak is still active but frozen
        // Keep current value
      } else if (daysSinceLastTask === 0) {
        // If we completed a task today after a break, and it's the only task, current should be 1
        if (sortedTasks.length === 1 || 
            Math.round((lastTaskDate - sortedTasks[sortedTasks.length - 2].normalizedDate) / (1000 * 60 * 60 * 24)) > 1) {
          current = 1;
        }
      }

      setCurrentStreak(current);
      setLongestStreak(max);
    };

    calculateStreak();
  }, [completedTasks, today]);

  return (
    <div className="streak-tracker">
      <h3>🔥 Streak</h3>
      <div className="streak-content">
        <div className="streak-item">
          <p className="streak-label">Current</p>
          <p className="streak-value">{currentStreak}</p>
        </div>
        <div className="streak-item">
          <p className="streak-label">Longest</p>
          <p className="streak-value">{longestStreak}</p>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;