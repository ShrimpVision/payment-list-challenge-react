import { API_URL } from "../../constants";
import type { GetPaymentsResponse } from "../../types/payment";
import { GetPaymentsApiError } from "./utils/errors";

export interface GetPaymentsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  currency?: string;
}

export const getPayments = async ({
  page,
  pageSize,
  search,
  currency,
}: GetPaymentsParams): Promise<GetPaymentsResponse> => {
  const queryParams = new URLSearchParams();

  if (page !== undefined) {
    queryParams.set("page", String(page));
  }

  if (pageSize !== undefined) {
    queryParams.set("pageSize", String(pageSize));
  }

  if (search) {
    queryParams.set("search", search);
  }

  if (currency) {
    queryParams.set("currency", currency);
  }
  const response = await fetch(`${API_URL}?${queryParams.toString()}`);

  if (!response.ok) {
    throw new GetPaymentsApiError(response.status);
  }

  return response.json() as Promise<GetPaymentsResponse>;
};
