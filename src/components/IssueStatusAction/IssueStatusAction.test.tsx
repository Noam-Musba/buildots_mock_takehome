import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { updateIssueStatus } from '../../api/issuesApi';
import { seedIssues } from '../../data/issues';
import { IssueStatusAction } from './IssueStatusAction';

vi.mock('../../api/issuesApi', () => ({
  updateIssueStatus: vi.fn(),
}));

const updateIssueStatusMock = vi.mocked(updateIssueStatus);

afterEach(cleanup);

describe('IssueStatusAction', () => {
  beforeEach(() => {
    updateIssueStatusMock.mockReset();
  });

  it.each([seedIssues[0], seedIssues[1]])(
    'resolves a $status issue and returns the updated issue',
    async (issue) => {
      const user = userEvent.setup();
      const onUpdated = vi.fn();
      const resolvedIssue = { ...issue, status: 'resolved' as const };

      updateIssueStatusMock.mockResolvedValue(resolvedIssue);

      render(<IssueStatusAction issue={issue} onUpdated={onUpdated} />);

      await user.click(
        screen.getByRole('button', { name: 'Mark as resolved' }),
      );

      expect(updateIssueStatusMock).toHaveBeenCalledWith(issue.id, 'resolved');
      expect(onUpdated).toHaveBeenCalledWith(resolvedIssue);
    },
  );

  it('moves an open issue to in progress', async () => {
    const user = userEvent.setup();
    const onUpdated = vi.fn();
    const inProgressIssue = {
      ...seedIssues[0],
      status: 'in_progress' as const,
    };

    updateIssueStatusMock.mockResolvedValue(inProgressIssue);

    render(
      <IssueStatusAction issue={seedIssues[0]} onUpdated={onUpdated} />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Mark as in progress' }),
    );

    expect(updateIssueStatusMock).toHaveBeenCalledWith(
      seedIssues[0].id,
      'in_progress',
    );
    expect(onUpdated).toHaveBeenCalledWith(inProgressIssue);
  });

  it('reopens a resolved issue as open', async () => {
    const user = userEvent.setup();
    const onUpdated = vi.fn();
    const resolvedIssue = seedIssues[2];
    const reopenedIssue = { ...resolvedIssue, status: 'open' as const };

    updateIssueStatusMock.mockResolvedValue(reopenedIssue);

    render(
      <IssueStatusAction issue={resolvedIssue} onUpdated={onUpdated} />,
    );

    await user.click(screen.getByRole('button', { name: 'Reopen issue' }));

    expect(updateIssueStatusMock).toHaveBeenCalledWith(
      resolvedIssue.id,
      'open',
    );
    expect(onUpdated).toHaveBeenCalledWith(reopenedIssue);
  });

  it('shows an error and leaves the action available after a failure', async () => {
    const user = userEvent.setup();

    updateIssueStatusMock.mockRejectedValue(new Error('Temporary network error'));

    render(
      <IssueStatusAction issue={seedIssues[0]} onUpdated={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Mark as resolved' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Temporary network error',
    );
    expect(
      screen.getByRole('button', { name: 'Mark as resolved' }),
    ).toBeEnabled();
  });
});
