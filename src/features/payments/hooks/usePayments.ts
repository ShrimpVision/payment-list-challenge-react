import { useQuery } from "@tanstack/react-query";
import { getPayments, type GetPaymentsParams } from "../api";

export const BASE_QUERY_CONFIG = {
  staleTime: 30_000,
  gcTime: 5 * 60_000,
  refetchOnWindowFocus: false,
};

export const getPaymentsQueryKey = (params: GetPaymentsParams) =>
  ["getPayments", params] as const;


export const useGetPayments = (params: GetPaymentsParams) =>
  useQuery({
    ...BASE_QUERY_CONFIG,
    queryKey: getPaymentsQueryKey(params),
    queryFn: () => getPayments(params),
  });
