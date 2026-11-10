import { useState } from "react";
import { CheckCircle2, CircleX, LoaderCircle, Plus, RefreshCw } from "lucide-react";
import { useHealth } from "@/api/health/queries";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [count, setCount] = useState(0);
  const { data, isError, isFetching, isPending, refetch } = useHealth();

  const status = isPending ? "checking" : !isError && data?.status === "ok" ? "active" : "inactive";

  return (
    <PageLayout>
      <section className="w-full max-w-3xl rounded-2xl border border-border bg-white p-8 shadow-sm sm:p-12">
        <h1 className="max-w-xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Frontend boilerplate ready for the next feature.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
          The connection check calls the backend health endpoint when this page loads. Refresh it
          to run the request again, or increment the counter to verify local React state.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-border bg-muted p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              API connection
            </p>
            <div className="mt-3 flex items-center gap-3" role="status" aria-live="polite">
              {status === "checking" && (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="font-semibold text-muted-foreground">Checking backend...</span>
                </>
              )}
              {status === "active" && (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700">Backend active</span>
                </>
              )}
              {status === "inactive" && (
                <>
                  <CircleX className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-700">Backend inactive</span>
                </>
              )}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A valid response from <code>/api/health</code> marks the service active.
            </p>
            <Button
              className="mt-4 gap-2"
              variant="outline"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Checking..." : "Refresh connection"}
            </Button>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-border p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Local counter
              </p>
              <p className="mt-3 text-4xl font-bold tabular-nums text-foreground">{count}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This value only lives in the frontend.
              </p>
            </div>
            <Button className="mt-4 gap-2" onClick={() => setCount((value) => value + 1)}>
              <Plus className="h-4 w-4" />
              Increment counter
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
