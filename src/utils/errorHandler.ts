import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { logger } from './logger';

/**
 * Error types supported by the application
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Standard error response structure
 */
export interface AppError {
  type: ErrorType;
  message: string;
  userMessage: string;
  status?: number;
  details?: Record<string, unknown>;
  originalError?: Error | AxiosError;
}

/**
 * Parse error and return standardized AppError
 */
export const parseError = (error: unknown): AppError => {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    return parseAxiosError(error);
  }

  // Handle standard Error
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message,
      userMessage: 'حدث خطأ غير متوقع',
      originalError: error,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      type: ErrorType.UNKNOWN,
      message: error,
      userMessage: error,
    };
  }

  // Handle unknown errors
  return {
    type: ErrorType.UNKNOWN,
    message: 'Unknown error occurred',
    userMessage: 'حدث خطأ غير متوقع',
  };
};

/**
 * Parse Axios-specific errors
 */
const parseAxiosError = (error: AxiosError): AppError => {
  const status = error.response?.status || 0;
  const data = error.response?.data as Record<string, unknown> | undefined;

  // Network error
  if (!error.response) {
    return {
      type: ErrorType.NETWORK,
      message: error.message,
      userMessage: 'لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت',
      originalError: error,
    };
  }

  // Extract error message from response
  const errorMessage = getErrorMessage(data);

  // Map status codes to error types
  switch (status) {
    case 400:
      return {
        type: ErrorType.VALIDATION,
        message: errorMessage || 'Validation failed',
        userMessage: errorMessage || 'البيانات المدخلة غير صحيحة',
        status,
        details: data,
        originalError: error,
      };

    case 401:
      return {
        type: ErrorType.AUTHENTICATION,
        message: 'Unauthorized',
        userMessage: 'جلسة انتهت الرجاء تسجيل الدخول مجدداً',
        status,
        originalError: error,
      };

    case 403:
      return {
        type: ErrorType.AUTHORIZATION,
        message: 'Forbidden',
        userMessage: 'ليس لديك صلاحية للقيام بهذا الإجراء',
        status,
        originalError: error,
      };

    case 404:
      return {
        type: ErrorType.NOT_FOUND,
        message: 'Not found',
        userMessage: 'العنصر المطلوب غير موجود',
        status,
        originalError: error,
      };

    case 409:
      return {
        type: ErrorType.CONFLICT,
        message: errorMessage || 'Conflict',
        userMessage: errorMessage || 'هناك تضارب في البيانات',
        status,
        details: data,
        originalError: error,
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: ErrorType.SERVER_ERROR,
        message: `Server error (${status})`,
        userMessage: 'حدث خطأ في الخادم. الرجاء محاولة لاحقاً',
        status,
        originalError: error,
      };

    default:
      return {
        type: ErrorType.UNKNOWN,
        message: errorMessage || `HTTP ${status}`,
        userMessage: 'حدث خطأ. الرجاء المحاولة مرة أخرى',
        status,
        details: data,
        originalError: error,
      };
  }
};

/**
 * Extract error message from response data
 */
const getErrorMessage = (data: Record<string, unknown> | undefined): string => {
  if (!data) return '';

  // Check for common error message fields
  const messageFields = ['message', 'error', 'detail', 'msg'];
  for (const field of messageFields) {
    if (data[field] && typeof data[field] === 'string') {
      return data[field] as string;
    }
  }

  // Check for form validation errors
  if (data.errors && typeof data.errors === 'object') {
    const errors = data.errors as Record<string, unknown>;
    const firstError = Object.values(errors)[0];
    if (typeof firstError === 'string') {
      return firstError;
    }
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0] as string;
    }
  }

  return '';
};

/**
 * Handle error with logging and user notification
 */
export const handleError = (
  error: unknown,
  context?: string,
  showToast = true
): AppError => {
  const appError = parseError(error);

  // Log error for debugging
  logger.error(
    context ? `[${context}] ${appError.message}` : appError.message,
    appError.originalError || error
  );

  // Show user-friendly message
  if (showToast) {
    toast.error(appError.userMessage, {
      description:
        import.meta.env.DEV && appError.message !== appError.userMessage
          ? appError.message
          : undefined,
    });
  }

  return appError;
};

/**
 * Handle success messages with optional toast
 */
export const handleSuccess = (message: string, showToast = true): void => {
  if (showToast) {
    toast.success(message);
  }
  logger.info(message);
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: AppError): boolean => {
  return error.type === ErrorType.AUTHENTICATION;
};

/**
 * Check if error is validation error
 */
export const isValidationError = (error: AppError): boolean => {
  return error.type === ErrorType.VALIDATION;
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error: AppError): boolean => {
  return error.type === ErrorType.NETWORK;
};
