import { API_URL } from "../../constants";
import type { GetPaymentsResponse } from "../../types/payment";

export interface GetPaymentsParams {
  page: number;
  pageSize: number;
}

export const getPayments = async ({
  page,
  pageSize,
}: GetPaymentsParams): Promise<GetPaymentsResponse> => {
  const queryParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  const response = await fetch(`${API_URL}?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Unable to fetch payments: ${response.status}`);
  }

  return response.json() as Promise<GetPaymentsResponse>;
};
