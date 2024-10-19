import React from 'react';

const ProgressBar = ({ level, experience }) => {
  let experienceNeededToLevel = level * 200;
  let barWidth = (experience / experienceNeededToLevel) * 100;

  const remainingXP = experienceNeededToLevel - experience;

  return (
    <div className="progress-container">
      <div className="level-info">
        Welcome back! - Level {level} | {remainingXP}xp to go!
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${barWidth}%` }}
        ></div>
        <span className="progress-tooltip" style={{ left: `${barWidth}%` }}>
          {Math.round(barWidth)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;