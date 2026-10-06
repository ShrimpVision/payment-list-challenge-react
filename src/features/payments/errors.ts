export class GetPaymentsApiError extends Error {
  constructor(public readonly status: number) {
    super(`Unable to fetch payments: ${status}`);
    this.name = "GetPaymentsApiError";
  }
}

export const isNotFoundError = (error: unknown) =>
  error instanceof GetPaymentsApiError && error.status === 404;
