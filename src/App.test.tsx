import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import App from "@/App";

const { useHealthMock, refetchMock } = vi.hoisted(() => ({
  useHealthMock: vi.fn(),
  refetchMock: vi.fn(),
}));

vi.mock("@/api/health/queries", () => ({ useHealth: useHealthMock }));

beforeEach(() => {
  refetchMock.mockReset();
  useHealthMock.mockReturnValue({
    data: { status: "ok", uptime: 10, timestamp: "2026-01-01T00:00:00.000Z" },
    isError: false,
    isFetching: false,
    isPending: false,
    refetch: refetchMock,
  });
});

function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
}

test("shows the backend connection and interactive examples", async () => {
  const user = userEvent.setup();
  renderApp();

  expect(screen.getByRole("heading", { name: /frontend boilerplate/i })).toBeInTheDocument();
  expect(screen.getByText("Backend active")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Refresh connection" }));
  expect(refetchMock).toHaveBeenCalledOnce();

  await user.click(screen.getByRole("button", { name: "Increment counter" }));
  expect(screen.getByText("1")).toBeInTheDocument();
});

test("shows an inactive backend after a failed health check", () => {
  useHealthMock.mockReturnValue({
    data: undefined,
    isError: true,
    isFetching: false,
    isPending: false,
    refetch: refetchMock,
  });

  renderApp();

  expect(screen.getByText("Backend inactive")).toBeInTheDocument();
});
