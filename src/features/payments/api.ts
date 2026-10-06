import { API_URL } from "../../constants";
import type { GetPaymentsResponse } from "../../types/payment";

export interface GetPaymentsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const getPayments = async ({
  page,
  pageSize,
  search,
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
  const response = await fetch(`${API_URL}?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Unable to fetch payments: ${response.status}`);
  }

  return response.json() as Promise<GetPaymentsResponse>;
};
