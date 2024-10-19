import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then(response => response.json())
      .then(data => setLeaderboard(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((user, index) => (
          <li key={user.id}>
            {index + 1}. User {user.id.slice(0, 6)} - XP: {user.xp}, Tasks Completed: {user.tasksCompleted}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;