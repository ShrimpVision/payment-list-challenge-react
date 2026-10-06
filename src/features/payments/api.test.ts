import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { http, HttpResponse } from "msw";
import { API_URL } from "../../constants";
import { server } from "../../mocks/node";
import { mockPayments134 } from "../../mocks/mockPaymentsData";
import { GetPaymentsApiError } from "./errors";
import { getPayments } from "./api";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("getPayments", () => {
  test("sends pagination as URL search parameters and returns the API response", async () => {
    let receivedPage: string | null = null;
    let receivedPageSize: string | null = null;

    server.use(
      http.get(`*${API_URL}`, ({ request }) => {
        const url = new URL(request.url);
        receivedPage = url.searchParams.get("page");
        receivedPageSize = url.searchParams.get("pageSize");

        return HttpResponse.json({
          payments: mockPayments134,
          total: mockPayments134.length,
          page: 1,
          pageSize: 5,
        });
      }),
    );

    const response = await getPayments({ page: 1, pageSize: 5 });

    expect(receivedPage).toBe("1");
    expect(receivedPageSize).toBe("5");
    expect(response.payments).toEqual(mockPayments134);
    expect(response).toMatchObject({ total: 5, page: 1, pageSize: 5 });
  });

  test("sends only the search parameter for a payment ID search", async () => {
    let receivedPage: string | null = null;
    let receivedPageSize: string | null = null;
    let receivedSearch: string | null = null;

    server.use(
      http.get(`*${API_URL}`, ({ request }) => {
        const url = new URL(request.url);
        receivedPage = url.searchParams.get("page");
        receivedPageSize = url.searchParams.get("pageSize");
        receivedSearch = url.searchParams.get("search");

        return HttpResponse.json({
          payments: [mockPayments134[0]],
          total: 1,
          page: 1,
          pageSize: 1,
        });
      }),
    );

    await getPayments({ search: "pay_134_1" });

    expect(receivedSearch).toBe("pay_134_1");
    expect(receivedPage).toBeNull();
    expect(receivedPageSize).toBeNull();
  });

  test("sends only the currency parameter for a currency filter", async () => {
    let receivedCurrency: string | null = null;
    let receivedPage: string | null = null;
    let receivedPageSize: string | null = null;

    server.use(
      http.get(`*${API_URL}`, ({ request }) => {
        const url = new URL(request.url);
        receivedCurrency = url.searchParams.get("currency");
        receivedPage = url.searchParams.get("page");
        receivedPageSize = url.searchParams.get("pageSize");

        return HttpResponse.json({
          payments: [mockPayments134[0]],
          total: 1,
          page: 1,
          pageSize: 1,
        });
      }),
    );

    await getPayments({ currency: "USD" });

    expect(receivedCurrency).toBe("USD");
    expect(receivedPage).toBeNull();
    expect(receivedPageSize).toBeNull();
  });

  test("throws a typed error for an unsuccessful response", async () => {
    server.use(
      http.get(`*${API_URL}`, () =>
        HttpResponse.json({ message: "Payment not found" }, { status: 404 }),
      ),
    );

    await expect(getPayments({ search: "pay_404" })).rejects.toBeInstanceOf(GetPaymentsApiError);
    await expect(getPayments({ search: "pay_404" })).rejects.toMatchObject({ status: 404 });
  });
});
