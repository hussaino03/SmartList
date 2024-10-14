import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';


// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('App XP and Level Up Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Level up from 41 to 42 with correct XP', async () => {
    // Set initial state
    localStorage.setItem('level', '41');
    localStorage.setItem('experience', '0');
    localStorage.setItem('tasks', JSON.stringify([
      { name: 'Test Task', desc: 'Description', difficulty: 50, importance: 50, experience: 8200 }
    ]));

    render(<App />);

    // Verify initial state
    expect(screen.getByText(/Level 41/)).toBeInTheDocument();
    expect(screen.getByText(/8200xp to go!/)).toBeInTheDocument();

    // Complete the task
    const completeButton = screen.getByText('✔️');
    fireEvent.click(completeButton);

    // Check if level up modal appears
    await screen.findByText(/Level up! You are now level 42!/);

    // Verify new state
    expect(screen.getByText(/Level 42/)).toBeInTheDocument();
    expect(screen.getByText(/0xp to go!/)).toBeInTheDocument();

    // Wait for modal to close
    act(() => {
      jest.advanceTimersByTime(5000);
    });
     // Verify modal is closed
     expect(screen.queryByText(/Level up!/)).not.toBeInTheDocument();
  });

  test('Level up modal shows only when leveling up, not for regular XP gain', async () => {
    // Set initial state
    localStorage.setItem('level', '10');
    localStorage.setItem('experience', '0');
    localStorage.setItem('tasks', JSON.stringify([
      { name: 'Small Task', desc: 'Description', difficulty: 25, importance: 25, experience: 500 },
      { name: 'Big Task', desc: 'Description', difficulty: 75, importance: 75, experience: 1700 }
    ]));

    render(<App />);

    // Verify initial state
    expect(screen.getByText(/Level 10/)).toBeInTheDocument();
    expect(screen.getByText(/2000xp to go!/)).toBeInTheDocument();

    // Complete the small task
    const completeSmallTask = screen.getAllByText('✔️')[0];
    fireEvent.click(completeSmallTask);

    // Check that level up modal does not appear
    expect(screen.queryByText(/Level up!/)).not.toBeInTheDocument();

    // Verify new state without level up
    expect(screen.getByText(/Level 10/)).toBeInTheDocument();
    expect(screen.getByText(/1500xp to go!/)).toBeInTheDocument();

    // Complete the big task
    const completeBigTask = screen.getAllByText('✔️')[0];
    fireEvent.click(completeBigTask);

    // Check if level up modal appears
    await screen.findByText(/Level up! You are now level 11!/);

    // Verify new state after level up
    expect(screen.getByText(/Level 11/)).toBeInTheDocument();
    expect(screen.getByText(/2000xp to go!/)).toBeInTheDocument();

    // Wait for modal to close
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Verify modal is closed
    expect(screen.queryByText(/Level up!/)).not.toBeInTheDocument();
  });
});
jest.mock('./components/StreakTracker', () => {
  return function MockedStreakTracker({ tasks, completedTasks }) {
    const currentStreak = 3; // Mock current streak
    const longestStreak = 5; // Mock longest streak

    return (
      <div>
        <h3>🔥 Streak</h3>
        <div>
          <p>Current: {currentStreak}</p>
          <p>Longest: {longestStreak}</p>
        </div>
      </div>
    );
  };
});

describe('StreakTracker Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('StreakTracker displays current and longest streak', () => {
    const initialTasks = [
      { name: 'Task 1', desc: 'Description 1', difficulty: 50, importance: 50, experience: 100 },
      { name: 'Task 2', desc: 'Description 2', difficulty: 50, importance: 50, experience: 100 },
    ];
    const initialCompletedTasks = [
      { name: 'Completed Task 1', desc: 'Description', difficulty: 50, importance: 50, experience: 100, completedAt: new Date().toISOString() },
    ];

    localStorage.setItem('tasks', JSON.stringify(initialTasks));
    localStorage.setItem('completedtasks', JSON.stringify(initialCompletedTasks));

    render(<App />);

    // Check if StreakTracker is rendered with mocked values
    expect(screen.getByText('🔥 Streak')).toBeInTheDocument();
    expect(screen.getByText('Current: 3')).toBeInTheDocument();
    expect(screen.getByText('Longest: 5')).toBeInTheDocument();
  });
});