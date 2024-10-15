import React, { useState, useEffect } from 'react';

const StreakTracker = ({ completedTasks, today = new Date() }) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const calculateStreak = () => {
      const todayDate = new Date(today).setHours(0, 0, 0, 0);
      let current = 0;
      let max = 0;
      let previousDate = null;

      // Sort tasks from oldest to newest (ascending order)
      const sortedCompletedTasks = completedTasks
        .filter(task => task.completedAt)
        .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt)) // ascending order
        .filter((task, index, self) =>
          index === self.findIndex((t) =>
            new Date(t.completedAt).setHours(0, 0, 0, 0) === new Date(task.completedAt).setHours(0, 0, 0, 0)
          )
        );

      for (const task of sortedCompletedTasks) {
        const completionDate = new Date(task.completedAt).setHours(0, 0, 0, 0);

        if (previousDate === null) {
          current = 1; // Starting the streak
        } else {
          const daysDifference = (completionDate - previousDate) / (1000 * 60 * 60 * 24);
          if (daysDifference === 1) {
            current += 1;
          } else if (daysDifference > 1) {
            max = Math.max(max, current); // Update max before resetting current streak
            current = 1; // Reset streak as there's a break in the sequence
          }
        }

        previousDate = completionDate;
      }

      // Update max streak if current streak is the longest
      max = Math.max(max, current);

      // Check if today's task is included
      const lastTaskCompletionDate = sortedCompletedTasks.length > 0 ? new Date(sortedCompletedTasks[sortedCompletedTasks.length - 1].completedAt).setHours(0, 0, 0, 0) : null;
      if (lastTaskCompletionDate !== todayDate) {
        current = 0;
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