import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { listIssues } from './api/issuesApi';
import { App } from './App';
import { seedIssues } from './data/issues';

vi.mock('./api/issuesApi', () => ({
  listIssues: vi.fn(),
}));

const listIssuesMock = vi.mocked(listIssues);

beforeEach(() => {
  vi.useFakeTimers();
  listIssuesMock.mockResolvedValue({
    items: seedIssues,
    total: seedIssues.length,
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('App issue queries', () => {
  it('debounces search before requesting matching issues', async () => {
    render(<App />);

    expect(listIssuesMock).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search' }), {
      target: { value: 'Dana' },
    });

    act(() => vi.advanceTimersByTime(299));
    expect(listIssuesMock).toHaveBeenCalledTimes(1);

    await act(async () => vi.advanceTimersByTime(1));

    expect(listIssuesMock).toHaveBeenCalledTimes(2);
    expect(listIssuesMock).toHaveBeenLastCalledWith(
      { search: 'Dana', sort: 'newest', status: 'all' },
      expect.any(AbortSignal),
    );
  });

  it('combines search, status, and sorting in the same request', async () => {
    render(<App />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search' }), {
      target: { value: 'firestop' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: 'Status' }), {
      target: { value: 'open' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: 'Sort' }), {
      target: { value: 'severity' },
    });

    await act(async () => vi.advanceTimersByTime(300));

    expect(listIssuesMock).toHaveBeenLastCalledWith(
      { search: 'firestop', sort: 'severity', status: 'open' },
      expect.any(AbortSignal),
    );
  });

  it('requests the selected chronological sort order', () => {
    render(<App />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Sort' }), {
      target: { value: 'oldest' },
    });

    expect(listIssuesMock).toHaveBeenLastCalledWith(
      { search: '', sort: 'oldest', status: 'all' },
      expect.any(AbortSignal),
    );
  });
});
