import React, { useState, useEffect } from 'react';

const StreakTracker = ({ completedTasks, today = new Date() }) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const calculateStreak = () => {
      const todayDate = new Date(today).setHours(0, 0, 0, 0);
      let streak = 0;
      let maxStreak = 0;
      let lastDate = todayDate;

      const sortedCompletedTasks = completedTasks
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .filter((task, index, self) => 
          index === self.findIndex((t) => 
            new Date(t.completedAt).setHours(0, 0, 0, 0) === new Date(task.completedAt).setHours(0, 0, 0, 0)
          )
        );

      for (const task of sortedCompletedTasks) {
        const completionDate = new Date(task.completedAt).setHours(0, 0, 0, 0);
        const daysDifference = (lastDate - completionDate) / (1000 * 60 * 60 * 24);
        
        if (daysDifference <= 1) {
          streak++;
        } else {
          maxStreak = Math.max(maxStreak, streak);
          break; // Stop counting as soon as we find a break in the streak
        }
        
        lastDate = completionDate;
      }

      maxStreak = Math.max(maxStreak, streak);

      setCurrentStreak(streak);
      setLongestStreak(maxStreak);
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