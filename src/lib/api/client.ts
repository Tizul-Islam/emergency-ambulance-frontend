import axios, { type AxiosError, type AxiosInstance } from "axios";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api/v1";

type ApiBody<T> = { message?: string; data?: T };

function unwrap<T>(body: ApiBody<T> | null): T {
  return body?.data as T;
}

function messageFrom(error: AxiosError<ApiBody<unknown> & { errors?: Array<{ message: string; field?: string }> }>): string {
  const status = error.response?.status ?? 500;
  if (status === 429) return "Too many requests. Please wait a moment.";
  
  let msg = error.response?.data?.message ?? "Something went wrong. Try again.";
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const details = error.response.data.errors.map(e => `${e.field ? e.field + ': ' : ''}${e.message}`).join(", ");
    if (details) {
      msg = `${msg} [${details}]`;
    }
  }
  
  return msg;
}

export function createClient(baseURL: string, token?: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError<ApiBody<unknown> & { errors?: Array<{ message: string; field?: string }> }>) => {
      throw new ApiError(error.response?.status ?? 500, messageFrom(error));
    },
  );

  return client;
}

export async function request<T>(
  client: AxiosInstance,
  method: string,
  path: string,
  data?: unknown,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const res = await client.request<ApiBody<T>>({
    method,
    url: path,
    data,
    params,
  });
  return unwrap(res.data);
}
