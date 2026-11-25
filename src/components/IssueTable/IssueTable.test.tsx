import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { seedIssues } from '../../data/issues';
import { IssueTable } from './IssueTable';

afterEach(cleanup);

describe('IssueTable', () => {
  it('renders issue information', () => {
    render(<IssueTable issues={[seedIssues[0]]} />);

    expect(
      screen.getByText('Missing firestop around cable tray'),
    ).toBeInTheDocument();
    expect(screen.getByText('Dana Levi')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('notifies the parent when an issue is selected', async () => {
    const user = userEvent.setup();
    const onSelectIssue = vi.fn();

    render(
      <IssueTable
        issues={[seedIssues[0]]}
        onSelectIssue={onSelectIssue}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'View' }));

    expect(onSelectIssue).toHaveBeenCalledWith('OBS-1042');
  });
});
