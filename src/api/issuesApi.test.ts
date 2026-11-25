import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listIssues, resetMockIssues, updateIssueStatus } from './issuesApi';

describe('issuesApi', () => {
  beforeEach(() => {
    resetMockIssues();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  it('filters issues by status', async () => {
    const result = await listIssues({ status: 'resolved' });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((issue) => issue.status === 'resolved')).toBe(true);
  });

  it('updates an issue status', async () => {
    const updated = await updateIssueStatus('OBS-1042', 'resolved');

    expect(updated.status).toBe('resolved');
  });
});
