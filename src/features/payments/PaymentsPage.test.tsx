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

  test("clears the submitted search and restores the initial payments", async () => {
    server.use(
      http.get(`*${API_URL}`, ({ request }) => {
        const search = new URL(request.url).searchParams.get("search");
        const payments = search ? [mockPayments134[0]] : [mockPayments134[1]];

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
    fireEvent.change(screen.getByRole("searchbox", { name: "Search payments" }), {
      target: { value: "pay_134_1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await screen.findByText("pay_134_1");
    fireEvent.click(screen.getByRole("button", { name: I18N.CLEAR_FILTERS }));

    expect(screen.getByRole("searchbox", { name: "Search payments" })).toHaveValue("");
    expect(screen.queryByRole("button", { name: I18N.CLEAR_FILTERS })).not.toBeInTheDocument();
    expect(await screen.findByText("pay_134_2")).toBeInTheDocument();
  });

  test("filters by currency and clears the selected currency", async () => {
    const receivedCurrencies: Array<string | null> = [];
    server.use(
      http.get(`*${API_URL}`, ({ request }) => {
        const currency = new URL(request.url).searchParams.get("currency");
        receivedCurrencies.push(currency);
        const payments = currency === "USD" ? [mockPayments134[0]] : [mockPayments134[1]];

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
    const currencySelect = screen.getByRole("combobox", {
      name: I18N.CURRENCY_FILTER_LABEL,
    });
    fireEvent.change(currencySelect, { target: { value: "USD" } });

    expect(receivedCurrencies).toEqual([null]);

    fireEvent.click(screen.getByRole("button", { name: I18N.SEARCH_BUTTON }));

    expect(await screen.findByText("pay_134_1")).toBeInTheDocument();
    expect(receivedCurrencies).toEqual([null, "USD"]);

    fireEvent.click(screen.getByRole("button", { name: I18N.CLEAR_FILTERS }));

    expect(currencySelect).toHaveValue("");
    expect(await screen.findByText("pay_134_2")).toBeInTheDocument();
  });

  test("submits payment ID and currency filters together", async () => {
    const receivedFilters: Array<{ currency: string | null; search: string | null }> = [];
    server.use(
      http.get(`*${API_URL}`, ({ request }) => {
        const url = new URL(request.url);
        const filters = {
          currency: url.searchParams.get("currency"),
          search: url.searchParams.get("search"),
        };
        receivedFilters.push(filters);

        const payments =
          filters.search === "pay_134" && filters.currency === "USD"
            ? [mockPayments134[0]]
            : [mockPayments134[1]];

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
    fireEvent.change(screen.getByRole("searchbox", { name: "Search payments" }), {
      target: { value: "pay_134" },
    });
    fireEvent.click(screen.getByRole("button", { name: I18N.SEARCH_BUTTON }));

    await screen.findByText("pay_134_2");
    fireEvent.change(screen.getByRole("combobox", { name: I18N.CURRENCY_FILTER_LABEL }), {
      target: { value: "USD" },
    });
    fireEvent.click(screen.getByRole("button", { name: I18N.SEARCH_BUTTON }));

    expect(await screen.findByText("pay_134_1")).toBeInTheDocument();
    expect(receivedFilters).toEqual([
      { currency: null, search: null },
      { currency: null, search: "pay_134" },
      { currency: "USD", search: "pay_134" },
    ]);
  });

  test("shows a 4xx search error without rendering the table", async () => {
    server.use(
      http.get(`*${API_URL}`, ({ request }) => {
        const search = new URL(request.url).searchParams.get("search");

        if (search === "pay_404") {
          return HttpResponse.json({ message: "Payment not found" }, { status: 404 });
        }

        return HttpResponse.json({
          payments: [mockPayments134[0]],
          total: 1,
          page: 1,
          pageSize: 5,
        });
      }),
    );

    renderPaymentsPage();

    await screen.findByText("pay_134_1");
    fireEvent.change(screen.getByRole("searchbox", { name: "Search payments" }), {
      target: { value: "pay_404" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(I18N.PAYMENT_NOT_FOUND);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: I18N.CLEAR_FILTERS })).toBeInTheDocument();
  });

  test("shows an internal server error for a 500 response without rendering the table", async () => {
    server.use(
      http.get(`*${API_URL}`, ({ request }) => {
        const search = new URL(request.url).searchParams.get("search");

        if (search === "pay_500") {
          return HttpResponse.json({ message: "Internal server error" }, { status: 500 });
        }

        return HttpResponse.json({
          payments: [mockPayments134[0]],
          total: 1,
          page: 1,
          pageSize: 5,
        });
      }),
    );

    renderPaymentsPage();

    await screen.findByText("pay_134_1");
    fireEvent.change(screen.getByRole("searchbox", { name: "Search payments" }), {
      target: { value: "pay_500" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(I18N.INTERNAL_SERVER_ERROR);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search payments" })).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("shows a generic error for a non-404 or 500 response without rendering the table", async () => {
    server.use(
      http.get(`*${API_URL}`, ({ request }) => {
        const search = new URL(request.url).searchParams.get("search");

        if (search === "pay_503") {
          return HttpResponse.json({ message: "Service unavailable" }, { status: 503 });
        }

        return HttpResponse.json({
          payments: [mockPayments134[0]],
          total: 1,
          page: 1,
          pageSize: 5,
        });
      }),
    );

    renderPaymentsPage();

    await screen.findByText("pay_134_1");
    fireEvent.change(screen.getByRole("searchbox", { name: "Search payments" }), {
      target: { value: "pay_503" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(I18N.SOMETHING_WENT_WRONG);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
