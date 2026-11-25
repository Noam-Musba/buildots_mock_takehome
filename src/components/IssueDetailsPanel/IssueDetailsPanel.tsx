import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { getIssue } from "../../api/issuesApi";
import type { Issue } from "../../types/issue";
import { ErrorState } from "../ErrorState/ErrorState";
import { SidePanel } from "../SidePanel/SidePanel";
import { Spinner } from "../Spinner/Spinner";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import styles from "./IssueDetailsPanel.module.css";

interface IssueDetailsPanelProps {
  issueId: string | null;
  onClose: () => void;
}

export function IssueDetailsPanel({
  issueId,
  onClose,
}: IssueDetailsPanelProps) {
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
          requestError.name === "AbortError"
        ) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load issue details",
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [issueId, reloadVersion]);

  return (
    <SidePanel open={issueId !== null} title="Issue details" onClose={onClose}>
      {loading ? <Spinner label="Loading issue details..." /> : null}

      {!loading && error ? (
        <ErrorState
          message={error}
          onRetry={() => setReloadVersion((version) => version + 1)}
        />
      ) : null}

      {!loading && !error && issue ? (
        <article className={styles.details}>
          <IssueSummary issue={issue} />
          <IssueMetadata issue={issue} />
        </article>
      ) : null}
    </SidePanel>
  );
}

function IssueSummary({ issue }: { issue: Issue }) {
  const { id, title, description } = issue;

  return (
    <>
      <div className={styles.heading}>
        <p className={styles.issueId}>{id}</p>
        <h3>{title}</h3>
      </div>

      <p className={styles.description}>{description}</p>
    </>
  );
}

function IssueMetadata({ issue }: { issue: Issue }) {
  const { assignee, floor, severity, status } = issue;
  const fields = [
    { label: "Assignee", value: assignee },
    { label: "Floor", value: floor },
    {
      label: "Severity",
      value: <span className={styles.capitalize}>{severity}</span>,
    },
    {
      label: "Status",
      value: <StatusBadge status={status} />,
    },
  ];

  return (
    <dl className={styles.metadata}>
      {fields.map(({ label, value }) => (
        <DetailField key={label} label={label}>
          {value}
        </DetailField>
      ))}
    </dl>
  );
}

interface DetailFieldProps extends PropsWithChildren {
  label: string;
}

function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
