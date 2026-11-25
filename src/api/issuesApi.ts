import { seedIssues } from '../data/issues';
import type {
  Issue,
  IssueListResult,
  IssueQuery,
  IssueSeverity,
  IssueStatus,
} from '../types/issue';

let issues: Issue[] = seedIssues.map((issue) => ({ ...issue }));

const delay = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, ms);

    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException('Request aborted', 'AbortError'));
      },
      { once: true },
    );
  });

const maybeFail = () => {
  // Small failure rate to make error states observable during development.
  if (Math.random() < 0.06) {
    throw new Error('Temporary network error');
  }
};

const severityRank: Record<IssueSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export async function listIssues(
  query: IssueQuery = {},
  signal?: AbortSignal,
): Promise<IssueListResult> {
  await delay(450 + Math.random() * 550, signal);
  maybeFail();

  const normalizedSearch = query.search?.trim().toLowerCase() ?? '';

  let result = issues.filter((issue) => {
    const statusMatches =
      !query.status || query.status === 'all' || issue.status === query.status;

    const searchMatches =
      !normalizedSearch ||
      issue.title.toLowerCase().includes(normalizedSearch) ||
      issue.assignee.toLowerCase().includes(normalizedSearch);

    return statusMatches && searchMatches;
  });

  if (query.sort === 'oldest') {
    result = [...result].sort(
      (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    );
  } else if (query.sort === 'severity') {
    result = [...result].sort(
      (a, b) => severityRank[b.severity] - severityRank[a.severity],
    );
  } else {
    result = [...result].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
  }

  return {
    items: result.map((issue) => ({ ...issue })),
    total: result.length,
  };
}

export async function getIssue(
  id: string,
  signal?: AbortSignal,
): Promise<Issue> {
  await delay(300 + Math.random() * 500, signal);
  maybeFail();

  const issue = issues.find((item) => item.id === id);

  if (!issue) {
    throw new Error('Issue not found');
  }

  return { ...issue };
}

export async function updateIssueStatus(
  id: string,
  status: IssueStatus,
): Promise<Issue> {
  await delay(450);
  maybeFail();

  const index = issues.findIndex((issue) => issue.id === id);

  if (index === -1) {
    throw new Error('Issue not found');
  }

  const updated: Issue = {
    ...issues[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  issues = issues.map((issue, issueIndex) =>
    issueIndex === index ? updated : issue,
  );

  return { ...updated };
}

export function resetMockIssues() {
  issues = seedIssues.map((issue) => ({ ...issue }));
}
