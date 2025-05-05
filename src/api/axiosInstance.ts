import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const API_TIMEOUT = 30000 // 30 seconds timeout

// Custom error interface
interface ApiError {
  status: number
  message: string
  code?: string
  errors?: Record<string, string[]>
}

/**
 * Configuration for the axios instance
 * This can be extended based on your needs
 */
class Api {
  private instance: AxiosInstance
  private defaultConfig: AxiosRequestConfig = {
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({
      ...this.defaultConfig,
      ...config,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        // If we're already passing Authorization header, use that
        if (config.headers.Authorization) {
          return config
        }

        // Otherwise try to get token from Supabase

        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const { response } = error
        const errorData = response?.data as ApiError | undefined
        let errorMessage = 'An unexpected error occurred'

        // Handle different error statuses with more specific messages
        if (response) {
          // Authentication errors
          if (response.status === 401) {
            errorMessage = 'Authentication required. Please log in again.'
            // You could redirect to login here if needed
          }
          // Not found errors
          else if (response.status === 404) {
            errorMessage = 'Resource not found'
          }
          // Validation errors
          else if (response.status === 422) {
            errorMessage = 'Validation error'
          }
          // Server errors
          else if (response.status >= 500) {
            errorMessage = 'Server error. Please try again later'
          }

          // Use error message from response if available
          if (errorData?.message) {
            errorMessage = errorData.message
          }
        } else {
          // Network error or server is down
        }

        return Promise.reject({ ...error, message: errorMessage })
      }
    )
  }

  // Get the axios instance
  public getAxiosInstance(): AxiosInstance {
    return this.instance
  }
}

// Create default axios instance
const axiosInstance = new Api().getAxiosInstance()

export default axiosInstance
