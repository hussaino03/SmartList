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
  
  const username = useMemo(() => generateUsername(user?._id), [user?._id]);

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
        <p>XP: {user?.xp || 0}</p>
        <p>Tasks Completed: {user?.tasksCompleted || 0}</p>
        <p>Level: {user?.level || 1}</p>
      </div>
    </li>
  );
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch('https://smart-list-server-ruddy.vercel.app/api/leaderboard')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard data:', data);  // This will only show in browser console
        setLeaderboard(data);
      })
      .catch(error => {
        console.error('Error:', error);  // This will only show in browser console
      });
  }, []);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((user, index) => (
          <LeaderboardEntry key={user._id} user={user} index={index} />
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;