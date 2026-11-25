import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getIssue } from '../../api/issuesApi';
import { seedIssues } from '../../data/issues';
import { IssueDetailsPanel } from './IssueDetailsPanel';

vi.mock('../../api/issuesApi', () => ({
  getIssue: vi.fn(),
  updateIssueStatus: vi.fn(),
}));

const getIssueMock = vi.mocked(getIssue);

afterEach(cleanup);

describe('IssueDetailsPanel', () => {
  beforeEach(() => {
    getIssueMock.mockReset();
  });

  it('fetches and displays the selected issue details', async () => {
    getIssueMock.mockResolvedValue(seedIssues[0]);

    render(
      <IssueDetailsPanel
        issueId="OBS-1042"
        onClose={vi.fn()}
        onStatusUpdated={vi.fn()}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading issue details...',
    );

    expect(
      await screen.findByText('Missing firestop around cable tray'),
    ).toBeInTheDocument();
    expect(screen.getByText('OBS-1042')).toBeInTheDocument();
    expect(screen.getByText(seedIssues[0].description)).toBeInTheDocument();
    expect(screen.getByText('Dana Levi')).toBeInTheDocument();
    expect(screen.getByText('Level 8')).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(getIssueMock).toHaveBeenCalledWith(
      'OBS-1042',
      expect.any(AbortSignal),
    );
  });

  it('shows an isolated error and retries the detail request', async () => {
    const user = userEvent.setup();

    getIssueMock
      .mockRejectedValueOnce(new Error('Temporary network error'))
      .mockResolvedValueOnce(seedIssues[0]);

    render(
      <IssueDetailsPanel
        issueId="OBS-1042"
        onClose={vi.fn()}
        onStatusUpdated={vi.fn()}
      />,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Temporary network error',
    );

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(
      await screen.findByText('Missing firestop around cable tray'),
    ).toBeInTheDocument();
    expect(getIssueMock).toHaveBeenCalledTimes(2);
  });

  it('aborts the previous detail request when the selection changes', async () => {
    getIssueMock
      .mockImplementationOnce(() => new Promise(() => undefined))
      .mockResolvedValueOnce(seedIssues[1]);

    const { rerender } = render(
      <IssueDetailsPanel
        issueId="OBS-1042"
        onClose={vi.fn()}
        onStatusUpdated={vi.fn()}
      />,
    );
    const initialSignal = getIssueMock.mock.calls[0][1];

    rerender(
      <IssueDetailsPanel
        issueId="OBS-1039"
        onClose={vi.fn()}
        onStatusUpdated={vi.fn()}
      />,
    );

    expect(initialSignal?.aborted).toBe(true);
    expect(await screen.findByText('Ceiling grid alignment')).toBeInTheDocument();
    expect(getIssueMock).toHaveBeenLastCalledWith(
      'OBS-1039',
      expect.any(AbortSignal),
    );
  });
});
