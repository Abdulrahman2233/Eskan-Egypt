# Advanced API Interceptors Guide

## Overview

The API layer now includes advanced interceptors that provide:

- ✅ **Automatic Retry Logic** - Retries failed requests up to 3 times with exponential backoff
- ✅ **Request Timeout Management** - 30-second timeout to prevent hanging requests
- ✅ **Comprehensive Logging** - Request/response logging for debugging
- ✅ **Authentication Handling** - Auto-redirect to login on 401 errors
- ✅ **Intelligent Status Code Handling** - Different handling for different error codes

## Configuration

Located at: `src/api.ts`

### Retry Configuration

```typescript
const MAX_RETRIES = 3;           // Maximum retry attempts
const RETRY_DELAY = 1000;        // Initial delay in ms
const REQUEST_TIMEOUT = 30000;   // 30 seconds timeout
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];
```

### Retryable Status Codes

| Code | Meaning | Retried |
|------|---------|---------|
| 408 | Request Timeout | ✅ Yes |
| 429 | Too Many Requests | ✅ Yes |
| 500 | Server Error | ✅ Yes |
| 502 | Bad Gateway | ✅ Yes |
| 503 | Service Unavailable | ✅ Yes |
| 504 | Gateway Timeout | ✅ Yes |
| Other | Client/Auth errors | ❌ No |

## How It Works

### Request Flow

```
1. Client makes API request
   ↓
2. Request Interceptor
   - Add auth token
   - Initialize retry count
   - Log request (dev mode)
   ↓
3. API call
   ↓
4. Response Interceptor
   - Log response (dev mode)
   - Handle errors with retry logic
   - Redirect on auth errors
```

### Retry Logic

When a request fails with a retryable status code:

```
Attempt 1 → Failure (status 503)
  ↓
Wait 1000ms (exponential backoff)
  ↓
Attempt 2 → Failure (status 503)
  ↓
Wait 2000ms (exponential backoff)
  ↓
Attempt 3 → Failure (status 503)
  ↓
Wait 4000ms (exponential backoff)
  ↓
Final Attempt → Success or return error
```

## Features

### 1. Automatic Retries

Failed requests are automatically retried up to 3 times with exponential backoff:
- 1st retry: 1 second delay
- 2nd retry: 2 seconds delay
- 3rd retry: 4 seconds delay

This helps handle:
- Temporary network issues
- Server being temporarily unavailable
- High traffic situations

### 2. Request Timeout

Each request has a 30-second timeout. If the server doesn't respond within this time:
- Request is cancelled
- Error is returned
- Automatic retry is triggered (if retryable)

### 3. Authentication Handling

When a 401 (Unauthorized) error occurs:
1. User is logged out (tokens removed)
2. User is redirected to `/auth`
3. No retry is attempted (401 is not retryable)

### 4. Comprehensive Logging

**In Development Mode:**
- All requests are logged with method, URL, headers, and data
- All responses are logged with status code and data
- All errors are logged with details

**In Production:**
- Only errors are logged
- Sent to backend logging endpoint

### 5. Timeout Protection

Requests that exceed 30 seconds are automatically cancelled to prevent:
- App hanging
- Memory leaks
- Poor user experience

## Usage

### Basic Usage

All API calls automatically benefit from these interceptors:

```typescript
import API from '@/api';

// Automatic retry and timeout handling
const response = await API.get('/properties');
```

### With Error Handling

```typescript
import { useErrorHandler } from '@/hooks/use-error-handler';

const { onError } = useErrorHandler();

try {
  const data = await fetchProperty(id);
  // Success - possibly retried automatically
} catch (error) {
  // Error after all retries exhausted
  onError(error, "Fetch Property");
}
```

### Checking Request Status

All errors include information about retry attempts:

```typescript
try {
  await fetchSomething();
} catch (error) {
  // error.details might contain:
  // {
  //   retries: 3,  // Number of retries attempted
  //   originalStatus: 503,
  //   url: '/api/endpoint'
  // }
}
```

## Real-World Examples

### Example 1: Network Hiccup

```
User makes API call
  ↓
Server temporarily down (503)
  ↓
Automatic retry after 1s
  ↓
Server is back up
  ↓
Request succeeds ✅
User doesn't notice any issue
```

### Example 2: Rate Limiting

```
User makes many API calls
  ↓
Server rate limits (429)
  ↓
Automatic retry after 1s
  ↓
Rate limit window passes
  ↓
Request succeeds ✅
Graceful degradation
```

### Example 3: Session Timeout

```
User has invalid token (401)
  ↓
No retry (401 not retryable)
  ↓
User logged out
  ↓
Redirected to login
User needs to re-authenticate
```

## Best Practices

1. **Don't disable retries** - They're essential for reliability
   ```typescript
   // ❌ Don't do this
   const response = await axios.get(url); // bypasses interceptors
   ```

2. **Always use the API instance**:
   ```typescript
   // ✅ Good
   const response = await API.get(url);
   ```

3. **Use error handler with context**:
   ```typescript
   // ✅ Good
   try {
     await createProperty(data);
   } catch (error) {
     onError(error, "Create Property");
   }
   ```

4. **Let retries happen silently** - User experience improves automatically

5. **Trust the timeout** - Don't set longer timeouts unless necessary

## Logging Examples

### Development Mode

```
📤 API Request: GET /api/listings/properties/?area=Cairo
  headers: { Authorization: 'Token xxx...' }
  
📥 API Response: 200 /api/listings/properties/?area=Cairo
  data: { count: 45, results: [...] }

🔄 Retrying request (2/3) after 2000ms
  url: /api/properties/123/
  status: 503

❌ API Error: 503 /api/properties/123/
  status: 503
  retries: 3
```

### Monitoring

In production, errors are automatically sent to the backend for monitoring:
- Error type
- Status code
- URL
- Timestamp
- User agent

## Performance Impact

The advanced interceptors add minimal overhead:
- **Request:** <1ms (token injection)
- **Response:** <1ms (logging)
- **Retry logic:** Only when errors occur

No performance degradation for successful requests.

## Troubleshooting

### Request keeps timing out

Check:
1. Is the server actually responding?
2. Is the endpoint correct?
3. Does the user have permission (authentication)?

Increase timeout if needed:
```typescript
const API = axios.create({
  timeout: 60000, // 60 seconds
  // ... other config
});
```

### No retry attempts

Check request status code:
```typescript
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];
// If your error code is not in this list, it won't retry
```

Add the status code if needed:
```typescript
RETRYABLE_STATUS_CODES.push(418); // Add teapot status
```

### Auth redirect happens unexpectedly

Check:
1. Is your token expired?
2. Is it in the right storage (localStorage)?
3. Check browser console for 401 errors

Token refresh would need to be implemented separately if auto-refresh is needed.
