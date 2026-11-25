import { useEffect, useState } from 'react';
import { getIssue } from '../api/issuesApi';
import type { Issue } from '../types/issue';

interface UseIssueDetailsResult {
  issue: Issue | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
  replaceIssue: (issue: Issue) => void;
}

export function useIssueDetails(
  issueId: string | null,
): UseIssueDetailsResult {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    if (!issueId) {
      setIssue(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    setIssue(null);
    setLoading(true);
    setError(null);

    getIssue(issueId, controller.signal)
      .then((result) => {
        setIssue(result);
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
            : 'Could not load issue details',
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [issueId, reloadVersion]);

  return {
    issue,
    loading,
    error,
    reload: () => setReloadVersion((version) => version + 1),
    replaceIssue: (updatedIssue) =>
      setIssue((currentIssue) =>
        currentIssue?.id === updatedIssue.id ? updatedIssue : currentIssue,
      ),
  };
}
