import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getIssue, listIssues, updateIssueStatus } from './api/issuesApi';
import { App } from './App';
import { seedIssues } from './data/issues';

vi.mock('./api/issuesApi', () => ({
  getIssue: vi.fn(),
  listIssues: vi.fn(),
  updateIssueStatus: vi.fn(),
}));

const getIssueMock = vi.mocked(getIssue);
const listIssuesMock = vi.mocked(listIssues);
const updateIssueStatusMock = vi.mocked(updateIssueStatus);

beforeEach(() => {
  vi.useFakeTimers();
  listIssuesMock.mockResolvedValue({
    items: seedIssues,
    total: seedIssues.length,
  });
  getIssueMock.mockResolvedValue(seedIssues[0]);
  updateIssueStatusMock.mockResolvedValue({
    ...seedIssues[0],
    status: 'resolved',
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

  it('aborts the previous list request when the query changes', () => {
    render(<App />);

    const initialSignal = listIssuesMock.mock.calls[0][1];

    fireEvent.change(screen.getByRole('combobox', { name: 'Status' }), {
      target: { value: 'resolved' },
    });

    expect(initialSignal?.aborted).toBe(true);
  });
});

describe('App issue details', () => {
  it('opens the selected issue in the details panel', async () => {
    render(<App />);
    await act(async () => undefined);

    fireEvent.click(screen.getAllByRole('button', { name: 'View' })[0]);
    await act(async () => undefined);

    const dialog = screen.getByRole('dialog', { name: 'Issue details' });

    expect(dialog).toBeVisible();
    expect(
      within(dialog).getByText('Missing firestop around cable tray'),
    ).toBeInTheDocument();
    expect(getIssueMock).toHaveBeenCalledWith(
      'OBS-1042',
      expect.any(AbortSignal),
    );
  });

  it('keeps the issue list available when the detail request fails', async () => {
    getIssueMock.mockRejectedValue(new Error('Temporary network error'));

    render(<App />);
    await act(async () => undefined);

    fireEvent.click(screen.getAllByRole('button', { name: 'View' })[0]);
    await act(async () => undefined);

    const dialog = screen.getByRole('dialog', { name: 'Issue details' });

    expect(within(dialog).getByRole('alert')).toHaveTextContent(
      'Temporary network error',
    );
    expect(screen.getByRole('table')).toBeVisible();
    expect(screen.getByText('OBS-1042')).toBeInTheDocument();
  });

  it('keeps the panel and list consistent after a status update', async () => {
    const resolvedIssue = { ...seedIssues[0], status: 'resolved' as const };

    listIssuesMock
      .mockResolvedValueOnce({
        items: seedIssues,
        total: seedIssues.length,
      })
      .mockResolvedValue({
        items: [resolvedIssue, ...seedIssues.slice(1)],
        total: seedIssues.length,
      });
    updateIssueStatusMock.mockResolvedValue(resolvedIssue);

    render(<App />);
    await act(async () => undefined);

    fireEvent.click(screen.getAllByRole('button', { name: 'View' })[0]);
    await act(async () => undefined);

    fireEvent.click(screen.getByRole('button', { name: 'Mark as resolved' }));
    await act(async () => undefined);

    const dialog = screen.getByRole('dialog', { name: 'Issue details' });
    const issueRow = within(screen.getByRole('table'))
      .getByText('OBS-1042')
      .closest('tr');

    expect(updateIssueStatusMock).toHaveBeenCalledWith(
      'OBS-1042',
      'resolved',
    );
    expect(within(dialog).getByText('Resolved')).toBeInTheDocument();
    expect(issueRow).not.toBeNull();
    expect(within(issueRow!).getByText('Resolved')).toBeInTheDocument();
    expect(listIssuesMock).toHaveBeenCalledTimes(2);
  });
});
