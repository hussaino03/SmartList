import { renderHook, act } from '@testing-library/react';
import useXPManager from './XPManager';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('XPManager Hook Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Level up from 41 to 42 with correct XP', () => {
    localStorage.setItem('level', '41');
    localStorage.setItem('experience', '0');

    const { result } = renderHook(() => useXPManager());

    expect(result.current.level).toBe(41);
    expect(result.current.experience).toBe(0);

    act(() => {
      result.current.calculateXP(8200);
    });

    expect(result.current.level).toBe(42);
    expect(result.current.experience).toBe(0);
    expect(result.current.showLevelUp).toBe(true);
  });

  test('XP gain without level up', () => {
    localStorage.setItem('level', '10');
    localStorage.setItem('experience', '0');

    const { result } = renderHook(() => useXPManager());

    expect(result.current.level).toBe(10);
    expect(result.current.experience).toBe(0);

    act(() => {
      result.current.calculateXP(500);
    });

    expect(result.current.level).toBe(10);
    expect(result.current.experience).toBe(500);
    expect(result.current.showLevelUp).toBe(false);
  });

  test('XP gain with level up', () => {
    localStorage.setItem('level', '10');
    localStorage.setItem('experience', '500');

    const { result } = renderHook(() => useXPManager());

    expect(result.current.level).toBe(10);
    expect(result.current.experience).toBe(500);

    act(() => {
      result.current.calculateXP(1700);
    });

    expect(result.current.level).toBe(11);
    expect(result.current.experience).toBe(200); // 2200 - (10 * 200)
    expect(result.current.showLevelUp).toBe(true);
  });

  test('Reset functionality', () => {
    localStorage.setItem('level', '10');
    localStorage.setItem('experience', '500');

    const { result } = renderHook(() => useXPManager());

    expect(result.current.level).toBe(10);
    expect(result.current.experience).toBe(500);

    act(() => {
      result.current.resetXP();
    });

    expect(result.current.level).toBe(1);
    expect(result.current.experience).toBe(0);
    expect(result.current.showLevelUp).toBe(false);
  });

  test('Get total XP', () => {
    localStorage.setItem('level', '3');
    localStorage.setItem('experience', '150');

    const { result } = renderHook(() => useXPManager());

    const expectedTotalXP = 200 + 400 + 150;

    expect(result.current.getTotalXP()).toBe(expectedTotalXP);
  });
});