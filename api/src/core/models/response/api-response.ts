// src/core/models/response/api-response.ts

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export function apiSuccess<T>(message: string, data: T): ApiSuccess<T> {
  return { success: true, message, data };
}
