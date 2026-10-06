import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { delay, http, HttpResponse } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { API_URL } from "../../constants";
import { I18N } from "../../constants/i18n";
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

  test("submits a formatted payment ID only after Search is clicked", async () => {
    const receivedSearches: Array<string | null> = [];
    server.use(
      http.get(`*${API_URL}`, ({ request }) => {
        const search = new URL(request.url).searchParams.get("search");
        receivedSearches.push(search);
        const payments = search === "pay_134_1" ? [mockPayments134[0]] : [mockPayments134[1]];

        return HttpResponse.json({
          payments,
          total: payments.length,
          page: 1,
          pageSize: 5,
        });
      }),
    );

    renderPaymentsPage();

    await screen.findByText("pay_134_2");
    const searchInput = screen.getByRole("searchbox", { name: "Search payments" });
    fireEvent.change(searchInput, { target: { value: "  PAY_134_1  " } });

    expect(receivedSearches).toEqual([null]);

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(await screen.findByText("pay_134_1")).toBeInTheDocument();
    expect(receivedSearches).toEqual([null, "pay_134_1"]);
  });

  test("shows validation feedback and does not submit an invalid payment ID", async () => {
    let requestCount = 0;
    server.use(
      http.get(`*${API_URL}`, () => {
        requestCount += 1;
        return HttpResponse.json(firstPageResponse);
      }),
    );

    renderPaymentsPage();

    await screen.findByText("pay_134_1");
    fireEvent.change(screen.getByRole("searchbox", { name: "Search payments" }), {
      target: { value: "f" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(requestCount).toBe(1);
    expect(screen.getByRole("alert")).toHaveTextContent(I18N.INVALID_PAYMENT_ID);
    expect(screen.getByRole("searchbox", { name: "Search payments" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
