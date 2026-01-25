import { useCallback } from 'react';
import { handleError, handleSuccess } from '@/utils/errorHandler';

/**
 * Custom hook for handling errors and success messages
 */
export const useErrorHandler = () => {
  const onError = useCallback(
    (error: unknown, context?: string, showToast = true) => {
      return handleError(error, context, showToast);
    },
    []
  );

  const onSuccess = useCallback((message: string, showToast = true) => {
    handleSuccess(message, showToast);
  }, []);

  return { onError, onSuccess };
};
