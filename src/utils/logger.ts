/**
 * Production-safe logging utility
 * Logs only in development, sends to error tracking in production
 * استخدم هذا بدلاً من console.log/console.error
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * Debug level - Most detailed information, typically only of interest when diagnosing problems.
   */
  debug: (message: string, data?: unknown): void => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },

  /**
   * Info level - Confirmation that things are working as expected.
   */
  info: (message: string, data?: unknown): void => {
    if (isDev) {
      console.info(`[INFO] ${message}`, data);
    }
  },

  /**
   * Warning level - Something unexpected happened, or indicative of some problem in the future.
   */
  warn: (message: string, data?: unknown): void => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, data);
    }
    // In production, send to error tracking service
    if (!isDev) {
      captureWarning(message, data);
    }
  },

  /**
   * Error level - Serious problem, something must be done immediately.
   */
  error: (message: string, error?: Error | unknown): void => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, error);
    }
    // Always send to error tracking in production
    captureError(message, error);
  },
};

/**
 * Send error to tracking service (Sentry, LogRocket, etc.)
 */
const captureError = (message: string, error: unknown) => {
  try {
    // Example integration with Sentry
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          severity: 'error',
        },
        extra: {
          message,
        },
      });
    }

    // Fallback: send to backend
    sendToBackend({
      level: 'error',
      message,
      error: error instanceof Error ? error.message : String(error),
    });
  } catch (e) {
    // Silent fail - don't let logging break the app
  }
};

/**
 * Send warning to tracking service
 */
const captureWarning = (message: string, data?: unknown): void => {
  try {
    if (window.Sentry) {
      window.Sentry.captureMessage(message, {
        level: 'warning',
        extra: { data },
      });
    }

    sendToBackend({
      level: 'warning',
      message,
      data,
    });
  } catch (_e) {
    // Silent fail
  }
};

/**
 * Send log to backend logging endpoint
 */
const sendToBackend = async (payload: {
  level: string;
  message: string;
  error?: string;
  data?: unknown;
}): Promise<void> => {
  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    await fetch(`${apiUrl}/logs/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    });
  } catch (_e) {
    // Silent fail - don't break app if logging fails
  }
};

// Type augmentation for Sentry
declare global {
  interface Window {
    Sentry?: any;
  }
}
