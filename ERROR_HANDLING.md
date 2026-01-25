# Error Handling Guide

## Overview

The application now has a centralized, unified error handling system that provides:

- ✅ **Consistent error responses** across the entire app
- ✅ **User-friendly error messages** in Arabic
- ✅ **Automatic error logging** for debugging
- ✅ **Type-safe error handling** with TypeScript
- ✅ **Authentication error handling** with auto-redirect to login

## Error Handler Utility

Located at: `src/utils/errorHandler.ts`

### Error Types

The system supports the following error types:

```typescript
enum ErrorType {
  NETWORK = 'NETWORK',           // No internet connection
  VALIDATION = 'VALIDATION',     // Input validation error (400)
  AUTHENTICATION = 'AUTHENTICATION', // Not logged in (401)
  AUTHORIZATION = 'AUTHORIZATION',  // No permission (403)
  NOT_FOUND = 'NOT_FOUND',       // Resource not found (404)
  CONFLICT = 'CONFLICT',         // Data conflict (409)
  SERVER_ERROR = 'SERVER_ERROR', // Server error (5xx)
  UNKNOWN = 'UNKNOWN',           // Unknown error
}
```

### Main Functions

#### 1. `handleError(error, context?, showToast?)`

Handle any error with automatic logging and user notification.

**Parameters:**
- `error` (unknown) - The error to handle
- `context` (string, optional) - Context string for logging
- `showToast` (boolean, default: true) - Whether to show toast notification

**Returns:** `AppError` object

**Example:**
```typescript
import { handleError } from '@/utils/errorHandler';

try {
  // Some API call
} catch (error) {
  const appError = handleError(error, "Create Property");
  // appError contains type, message, userMessage, etc.
}
```

#### 2. `handleSuccess(message, showToast?)`

Show success message to user.

**Example:**
```typescript
import { handleSuccess } from '@/utils/errorHandler';

handleSuccess("تم حفظ البيانات بنجاح");
```

#### 3. Error Type Checkers

```typescript
isAuthError(error)      // Check if authentication error
isValidationError(error) // Check if validation error
isNetworkError(error)    // Check if network error
```

## Using the Hook

For easier usage in React components, use the `useErrorHandler` hook:

Located at: `src/hooks/use-error-handler.ts`

**Example:**
```typescript
import { useErrorHandler } from '@/hooks/use-error-handler';

const MyComponent = () => {
  const { onError, onSuccess } = useErrorHandler();

  const handleSubmit = async (data) => {
    try {
      const response = await submitForm(data);
      onSuccess("تم الحفظ بنجاح");
    } catch (error) {
      const appError = onError(error, "Submit Form");
    }
  };

  return (
    // Component JSX
  );
};
```

## API Integration

### Request Interceptor

Automatically adds authentication token:
```typescript
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});
```

### Response Interceptor

Automatically handles errors:
```typescript
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError = handleError(error, "API Request", false);
    
    // Auto-redirect to login on auth errors
    if (isAuthError(appError)) {
      localStorage.removeItem("access_token");
      window.location.href = "/auth";
    }
    
    return Promise.reject(appError);
  }
);
```

## Error Messages

### By Error Type

| Type | HTTP Status | User Message |
|------|------------|-------------|
| NETWORK | None | "لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت" |
| VALIDATION | 400 | (extracted from response or default) |
| AUTHENTICATION | 401 | "جلسة انتهت الرجاء تسجيل الدخول مجدداً" |
| AUTHORIZATION | 403 | "ليس لديك صلاحية للقيام بهذا الإجراء" |
| NOT_FOUND | 404 | "العنصر المطلوب غير موجود" |
| CONFLICT | 409 | "هناك تضارب في البيانات" |
| SERVER_ERROR | 500-504 | "حدث خطأ في الخادم. الرجاء محاولة لاحقاً" |
| UNKNOWN | - | "حدث خطأ. الرجاء المحاولة مرة أخرى" |

## Development vs Production

### Development Mode (`DEV`)
- Error details shown in toast
- Full stack trace logged to console
- Detailed error messages

### Production Mode
- Only user-friendly messages shown
- Errors logged to backend
- Stack traces hidden from users

## Best Practices

1. **Always provide context** when handling errors:
   ```typescript
   const appError = onError(error, "Create Property");
   ```

2. **Use the hook** in components instead of importing function directly:
   ```typescript
   const { onError } = useErrorHandler(); // ✅ Good
   ```

3. **Let the interceptor handle API errors**:
   ```typescript
   // API calls already have error handling
   const data = await fetchProperty(id); // Error is auto-handled
   ```

4. **Check error type when needed**:
   ```typescript
   try {
     // Some async operation
   } catch (error) {
     const appError = onError(error);
     if (isValidationError(appError)) {
       // Handle validation error differently
     }
   }
   ```

5. **Disable toast when error is already handled**:
   ```typescript
   const appError = onError(error, context, false); // showToast: false
   // Then show custom error handling
   ```

## Examples

### Form Submission with Error Handling

```typescript
import { useErrorHandler } from '@/hooks/use-error-handler';

const AddPropertyForm = () => {
  const { onError, onSuccess } = useErrorHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const result = await createProperty(formData);
      onSuccess("تم إضافة العقار بنجاح");
      // Redirect or refresh data
    } catch (error) {
      const appError = onError(error, "Add Property");
      // Error toast is already shown
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Form JSX
  );
};
```

### Custom Error Handling

```typescript
const fetchUserProperties = async () => {
  try {
    const properties = await getUserProperties();
    return properties;
  } catch (error) {
    const appError = onError(error, "Fetch Properties", false);
    
    // Custom handling based on error type
    if (isAuthError(appError)) {
      // Redirect to login
      window.location.href = '/auth';
    } else if (isNetworkError(appError)) {
      // Show offline UI
      setOfflineMode(true);
    } else {
      // Show generic error
      console.error(appError.userMessage);
    }
  }
};
```

## Logging

All errors are automatically logged using the `logger` utility:

- Development: Logs to browser console
- Production: Sends to backend logging endpoint

Check `src/utils/logger.ts` for more details.
