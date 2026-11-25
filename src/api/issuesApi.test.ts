import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getIssue,
  listIssues,
  resetMockIssues,
  updateIssueStatus,
} from './issuesApi';

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

  it('matches search text against titles and assignees', async () => {
    const [titleResult, assigneeResult] = await Promise.all([
      listIssues({ search: 'FIRESTOP' }),
      listIssues({ search: 'dana levi' }),
    ]);

    expect(titleResult.items.map((issue) => issue.id)).toEqual(['OBS-1042']);
    expect(assigneeResult.items.map((issue) => issue.id)).toEqual([
      'OBS-1042',
      'OBS-1028',
    ]);
  });

  it('applies search, status, and severity sorting together', async () => {
    const result = await listIssues({
      search: 'dana',
      sort: 'severity',
      status: 'open',
    });

    expect(result.items.map((issue) => issue.id)).toEqual([
      'OBS-1042',
      'OBS-1028',
    ]);
  });

  it('sorts issues from oldest to newest when requested', async () => {
    const result = await listIssues({ sort: 'oldest' });

    expect(result.items[0].id).toBe('OBS-1007');
    expect(result.items.at(-1)?.id).toBe('OBS-1042');
  });

  it('updates an issue status', async () => {
    const updated = await updateIssueStatus('OBS-1042', 'resolved');
    const latestIssue = await getIssue('OBS-1042');

    expect(updated.status).toBe('resolved');
    expect(latestIssue.status).toBe('resolved');
  });
});
