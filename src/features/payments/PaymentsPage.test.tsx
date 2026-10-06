import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { delay, http, HttpResponse } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { API_URL } from "../../constants";
import { server } from "../../mocks/node";
import { mockPayments134 } from "../../mocks/mockPaymentsData";
import { PaymentsPage } from "./PaymentsPage";

const firstPageResponse = {
  payments: mockPayments134,
  total: mockPayments134.length,
  page: 1,
  pageSize: 5,
};

const renderPaymentsPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <PaymentsPage />
    </QueryClientProvider>,
  );
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("PaymentsPage", () => {
  test("shows the table loading state before payments are returned", () => {
    server.use(
      http.get(`*${API_URL}`, async () => {
        await delay(100);
        return HttpResponse.json(firstPageResponse);
      }),
    );

    renderPaymentsPage();

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  test("renders the first page of payments returned by the API", async () => {
    server.use(http.get(`*${API_URL}`, () => HttpResponse.json(firstPageResponse)));

    renderPaymentsPage();

    expect(await screen.findByText("pay_134_1")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(6);
  });
});
