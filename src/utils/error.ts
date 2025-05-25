import { AxiosError } from 'axios'

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Handle Axios error response
    if (error.response?.data?.error) {
      return error.response.data.error
    }
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (error.message) {
      return error.message
    }
  }

  // Handle other types of errors
  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}
