import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DataBoundary from "./data-boundary";

const query = vi.hoisted(() => ({
  isPending: false,
  isError: false,
  data: { courses: [], summaries: [], events: [] },
  refetch: vi.fn(),
}));

vi.mock("../api/education/queries", () => ({ useEducationData: () => query }));

beforeEach(() => {
  query.isPending = false;
  query.isError = false;
  query.refetch.mockReset();
});

describe("data states", () => {
  it("announces loading without showing incomplete resource controls", () => {
    query.isPending = true;
    render(<DataBoundary>{() => <p>Resource results</p>}</DataBoundary>);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading academic resources",
    );
    expect(screen.queryByText("Resource results")).not.toBeInTheDocument();
  });

  it("provides a retry action on retrieval failure", async () => {
    query.isError = true;
    render(<DataBoundary>{() => <p>Resource results</p>}</DataBoundary>);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Resources could not be loaded",
    );
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(query.refetch).toHaveBeenCalledOnce();
  });

  it("passes an empty dataset through to the page", () => {
    render(
      <DataBoundary>
        {(data) => (
          <p>{data.summaries.length ? "Available" : "No summaries"}</p>
        )}
      </DataBoundary>,
    );
    expect(screen.getByText("No summaries")).toBeInTheDocument();
  });
});
