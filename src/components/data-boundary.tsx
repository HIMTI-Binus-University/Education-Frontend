import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useEducationData, type EducationData } from "../api/education/queries";

export default function DataBoundary({
  children,
}: {
  children: (data: EducationData) => ReactNode;
}) {
  const query = useEducationData();
  if (query.isPending)
    return (
      <div className="page-content app-loading" role="status" aria-busy="true">
        <img src="/logo-himti.png" width="72" height="72" alt="" />
        <span>Loading academic resources…</span>
      </div>
    );
  if (query.isError)
    return (
      <div className="page-content">
        <div className="empty-state panel" role="alert">
          <AlertCircle size={32} aria-hidden="true" />
          <h1>Resources could not be loaded</h1>
          <p>Please try again. Your filters will stay in place.</p>
          <button
            className="button primary"
            onClick={() => void query.refetch()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  return children(query.data);
}

export function NotFound({ subject = "Page" }: { subject?: string }) {
  return (
    <div className="page-content">
      <div className="empty-state panel">
        <h1>{subject} not available</h1>
        <p>
          This link may be incorrect, or this resource may no longer be public.
        </p>
        <Link to="/courses" className="button primary">
          Browse courses
        </Link>
      </div>
    </div>
  );
}
