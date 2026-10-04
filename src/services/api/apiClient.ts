import { ApiError } from '../../types';

// API Configuration
// Designed to connect to production Django REST Framework / FastAPI / Node backend
// Supports HttpOnly secure cookies, SameSite protection, and CSRF tokens.

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8000/api';
const IS_DEMO_MODE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE) !== 'false';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Simulated latency for realistic production feel during development
  protected async simulateNetworkLatency(ms: number = 200): Promise<void> {
    if (IS_DEMO_MODE) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  }

  public async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (IS_DEMO_MODE) {
      await this.simulateNetworkLatency();
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Important: Transmits HttpOnly secure cookies automatically
        ...options,
      });

      return await this.handleResponse<T>(response);
    } catch (err: any) {
      throw this.normalizeError(err);
    }
  }

  public async post<T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
    if (IS_DEMO_MODE) {
      await this.simulateNetworkLatency();
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } catch (err: any) {
      throw this.normalizeError(err);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 429) {
      throw {
        status: 429,
        code: 'RATE_LIMIT_EXCEEDED',
        message: "You've made too many requests. Please wait a moment and try again.",
      } as ApiError;
    }

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw {
        status: response.status,
        code: errorData.code || 'API_ERROR',
        message: errorData.message || 'An unexpected error occurred. Please try again.',
        details: errorData.details,
      } as ApiError;
    }

    return await response.json();
  }

  private normalizeError(err: any): ApiError {
    if (err.status && err.message) {
      return err as ApiError;
    }
    return {
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'Unable to connect to the server. Please check your internet connection.',
      details: { original: err.message },
    };
  }
}

export const apiClient = new ApiClient();
