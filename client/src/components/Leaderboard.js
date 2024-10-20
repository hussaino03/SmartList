import React, { useState, useEffect, useMemo } from 'react';

// Lists for generating usernames
const adjectives = [
  'Happy', 'Clever', 'Brave', 'Wise', 'Swift', 'Calm', 'Bright', 'Noble',
  'Lucky', 'Witty', 'Bold', 'Quick', 'Kind', 'Cool', 'Keen', 'Pure'
];

const nouns = [
  'Panda', 'Eagle', 'Tiger', 'Wolf', 'Bear', 'Fox', 'Hawk', 'Lion',
  'Deer', 'Seal', 'Owl', 'Duck', 'Cat', 'Dog', 'Bat', 'Elk'
];

// Function to generate a consistent random number from a string
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Function to generate a consistent username from a user ID
const generateUsername = (userId) => {
  const hash = hashCode(userId);
  const adjIndex = hash % adjectives.length;
  const nounIndex = Math.floor(hash / adjectives.length) % nouns.length;
  const number = hash % 1000; // Add a number at the end for more uniqueness
  
  return `${adjectives[adjIndex]}${nouns[nounIndex]}${number}`;
};

const LeaderboardEntry = ({ user, index }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Generate consistent username for this user
  const username = useMemo(() => generateUsername(user.id), [user.id]);

  return (
    <li>
      <div className={`name ${showDetails ? 'active' : ''}`}>
        <button className="more" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? '↑' : '↓'}
        </button>
        <span>{index + 1}. {username}</span>
      </div>
      <div
        className="description"
        style={{ maxHeight: showDetails ? '200px' : '0', overflow: 'hidden' }}
      >
        <p>XP: {user.xp}</p>
        <p>Tasks Completed: {user.tasksCompleted}</p>
        <p>Level: {user.level}</p>
      </div>
    </li>
  );
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        return response.json();
      })
      .then(data => setLeaderboard(data))
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div className="error">Error loading leaderboard: {error}</div>;
  }

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((user, index) => (
          <LeaderboardEntry key={user.id} user={user} index={index} />
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;