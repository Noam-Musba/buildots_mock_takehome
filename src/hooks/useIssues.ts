import { useEffect, useState } from 'react';
import { listIssues } from '../api/issuesApi';
import type { Issue, IssueStatus } from '../types/issue';

interface UseIssuesResult {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useIssues(status: IssueStatus | 'all'): UseIssuesResult {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    listIssues({ status }, controller.signal)
      .then((result) => {
        setIssues(result.items);
        setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        ) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Could not load issues',
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [status, reloadVersion]);

  return {
    issues,
    loading,
    error,
    reload: () => setReloadVersion((version) => version + 1),
  };
}
