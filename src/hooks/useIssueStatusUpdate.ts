import { useEffect, useRef, useState } from 'react';
import { updateIssueStatus } from '../api/issuesApi';
import type { Issue, IssueStatus } from '../types/issue';

interface UseIssueStatusUpdateResult {
  error: string | null;
  updatingTo: IssueStatus | null;
  updateStatus: (status: IssueStatus) => Promise<void>;
}

export function useIssueStatusUpdate(
  issueId: string,
  onUpdated: (issue: Issue) => void,
): UseIssueStatusUpdateResult {
  const [updatingTo, setUpdatingTo] = useState<IssueStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);

  useEffect(() => {
    requestVersion.current += 1;
    setUpdatingTo(null);
    setError(null);
  }, [issueId]);

  useEffect(
    () => () => {
      requestVersion.current += 1;
    },
    [],
  );

  const updateStatus = async (status: IssueStatus) => {
    const currentRequest = ++requestVersion.current;

    setUpdatingTo(status);
    setError(null);

    try {
      const updatedIssue = await updateIssueStatus(issueId, status);

      onUpdated(updatedIssue);

      if (currentRequest === requestVersion.current) {
        setUpdatingTo(null);
      }
    } catch (requestError: unknown) {
      if (currentRequest !== requestVersion.current) {
        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not update issue status',
      );
      setUpdatingTo(null);
    }
  };

  return {
    error,
    updatingTo,
    updateStatus,
  };
}
