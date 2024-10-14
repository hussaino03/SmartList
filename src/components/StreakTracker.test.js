import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StreakTracker from './StreakTracker';

describe('StreakTracker Component', () => {
  const mockToday = new Date('2023-05-15T12:00:00Z');

  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(mockToday);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('calculates current streak correctly', () => {
    const completedTasks = [
      { completedAt: '2023-05-15T10:00:00Z' }, // Today
      { completedAt: '2023-05-14T10:00:00Z' }, // Yesterday
      { completedAt: '2023-05-13T10:00:00Z' }, // 2 days ago
      { completedAt: '2023-05-11T10:00:00Z' }, // 4 days ago (break in streak)
    ];

    render(<StreakTracker completedTasks={completedTasks} today={mockToday} />);
    
    const currentStreakElement = screen.getByText('Current').nextElementSibling;
    expect(currentStreakElement).toHaveTextContent('3');
  });

  test('resets current streak when no tasks completed today', () => {
    const completedTasks = [
      { completedAt: '2023-05-13T10:00:00Z' }, // 2 days ago
      { completedAt: '2023-05-12T10:00:00Z' }, // 3 days ago
    ];

    render(<StreakTracker completedTasks={completedTasks} today={mockToday} />);
    
    const currentStreakElement = screen.getByText('Current').nextElementSibling;
    expect(currentStreakElement).toHaveTextContent('0');
  });
  test('handles empty completedTasks array', () => {
    render(<StreakTracker completedTasks={[]} />);
    
    const currentStreakElement = screen.getByText('Current').nextElementSibling;
    const longestStreakElement = screen.getByText('Longest').nextElementSibling;
    expect(currentStreakElement).toHaveTextContent('0');
    expect(longestStreakElement).toHaveTextContent('0');
  });

  test('calculates streak correctly for multiple tasks on the same day', () => {
    const completedTasks = [
      { completedAt: '2023-05-15T10:00:00Z' }, // Today
      { completedAt: '2023-05-15T11:00:00Z' }, // Today
      { completedAt: '2023-05-14T10:00:00Z' }, // Yesterday
      { completedAt: '2023-05-14T11:00:00Z' }, // Yesterday
    ];

    render(<StreakTracker completedTasks={completedTasks} />);
    
    const currentStreakElement = screen.getByText('Current').nextElementSibling;
    expect(currentStreakElement).toHaveTextContent('2');
  });
});