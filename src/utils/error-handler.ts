import toast, { type ToastOptions } from 'react-hot-toast';

export enum ErrorCategory {
  Network = 'Network',
  Validation = 'Validation',
  Server = 'Server',
  Authentication = 'Authentication',
  Authorization = 'Authorization',
  NotFound = 'NotFound',
  Timeout = 'Timeout',
  ThirdParty = 'ThirdParty',
  Unknown = 'Unknown',
}

export enum ErrorSeverity {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  Critical = 'Critical',
}

interface ErrorWithMessage {
  message: string;
}

interface CategorizedError {
  originalError: unknown;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  statusCode?: number;
}

// Store recently shown error messages (e.g., for the last 5 seconds)
const recentErrors = new Map<string, number>();
const DEDUPLICATION_WINDOW_MS = 5000; // 5 seconds

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  // Attempt to extract message from TRPCError
  if (
    typeof error === 'object' &&
    error !== null &&
    'shape' in error &&
    typeof (error as any).shape === 'object' &&
    (error as any).shape !== null &&
    'message' in (error as any).shape &&
    typeof (error as any).shape.message === 'string'
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (error as any).shape.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function categorizeError(error: unknown): CategorizedError {
  const message = getErrorMessage(error);
  let category = ErrorCategory.Unknown;
  let severity = ErrorSeverity.Error;
  let statusCode: number | undefined;

  // Basic TRPC error check (can be expanded)
  if (typeof error === 'object' && error !== null) {
    if (
      'name' in error &&
      (error as { name: string }).name === 'TRPCClientError'
    ) {
      category = ErrorCategory.Server; // Or more specific based on TRPC error codes
      if (
        'data' in error &&
        typeof (error as any).data === 'object' &&
        (error as any).data !== null
      ) {
        statusCode = (error as any).data.httpStatus as number;
        if (statusCode) {
          if (statusCode >= 500) category = ErrorCategory.Server;
          else if (statusCode === 400) category = ErrorCategory.Validation;
          else if (statusCode === 401) category = ErrorCategory.Authentication;
          else if (statusCode === 403) category = ErrorCategory.Authorization;
          else if (statusCode === 404) category = ErrorCategory.NotFound;
          else if (statusCode === 408 || statusCode === 504)
            category = ErrorCategory.Timeout;
        }
      }
    } else if (error instanceof TypeError) {
      category = ErrorCategory.Validation; // Often indicates programming errors or unexpected data
      severity = ErrorSeverity.Warning;
    } else if (
      message.toLowerCase().includes('network error') ||
      message.toLowerCase().includes('failed to fetch')
    ) {
      category = ErrorCategory.Network;
      severity = ErrorSeverity.Critical;
    }
    // Add more specific checks here, e.g., for validation libraries
  }

  return {
    originalError: error,
    message,
    category,
    severity,
    statusCode,
  };
}

function getToastDuration(severity: ErrorSeverity): number {
  switch (severity) {
    case ErrorSeverity.Info:
      return 3000;
    case ErrorSeverity.Warning:
      return 5000;
    case ErrorSeverity.Error:
      return 7000;
    case ErrorSeverity.Critical:
      return 10000; // Longer for critical errors
    default:
      return 5000;
  }
}

function formatErrorMessage(categorizedError: CategorizedError): string {
  // Basic formatting, can be expanded
  let prefix = '';
  switch (categorizedError.category) {
    case ErrorCategory.Network:
      prefix = 'Network Error: ';
      break;
    case ErrorCategory.Validation:
      prefix = 'Validation Error: ';
      break;
    case ErrorCategory.Server:
      prefix = `Server Error (Code: ${categorizedError.statusCode ?? 'N/A'}): `;
      break;
    // Add more cases as needed
  }
  return `${prefix}${categorizedError.message}`;
}

export const showErrorToast = (
  error: unknown,
  defaultMessage = 'An unexpected error occurred.',
  options?: {
    severity?: ErrorSeverity;
    category?: ErrorCategory;
  },
) => {
  const now = Date.now();
  // Clean up old entries from recentErrors
  for (const [msg, timestamp] of recentErrors.entries()) {
    if (now - timestamp > DEDUPLICATION_WINDOW_MS) {
      recentErrors.delete(msg);
    }
  }

  const categorized = categorizeError(error);
  const finalSeverity = options?.severity ?? categorized.severity;
  const finalCategory = options?.category ?? categorized.category;

  const displayMessage = formatErrorMessage({
    ...categorized,
    message: categorized.message || defaultMessage, // Ensure message is not empty
    category: finalCategory,
    severity: finalSeverity,
  });

  // Deduplication check
  if (recentErrors.has(displayMessage)) {
    console.warn(
      'Duplicate error suppressed:',
      displayMessage,
      categorized.originalError,
    );
    return; // Don't show the toast
  }
  recentErrors.set(displayMessage, now);

  const toastOptions: ToastOptions = {
    duration: getToastDuration(finalSeverity),
    id: displayMessage, // Use message as ID for potential manual dismissal or updates
  };

  switch (finalSeverity) {
    case ErrorSeverity.Info:
      toast.success(displayMessage, toastOptions); // Or toast(displayMessage, { icon: 'ℹ️', ...toastOptions });
      break;
    case ErrorSeverity.Warning:
      toast(displayMessage, { icon: '⚠️', ...toastOptions });
      break;
    case ErrorSeverity.Critical:
    case ErrorSeverity.Error:
    default:
      toast.error(displayMessage, toastOptions);
      break;
  }

  console.error(
    `Error Handled [${finalCategory} - ${finalSeverity}]:`,
    displayMessage,
    categorized.originalError,
  );
};

export const handleTrpcError = (
  error: unknown,
  defaultMessage = 'A tRPC error occurred.',
) => {
  // TRPC errors might already have good categorization potential within categorizeError
  // We can pass along a default severity if needed, or let categorizeError decide.
  showErrorToast(error, defaultMessage, { category: ErrorCategory.Server });
};

export const handleQueryError = (
  error: Error,
  // These parameters are part of TanStack Query's onError signature but not used here.
  // Including them (commented out or as unused variables) helps with type compatibility.

  _variables?: unknown, // For mutations

  _context?: unknown, // For mutations

  _queryOrMutation?: unknown, // For queries or mutations
) => {
  const defaultMessage = 'A data fetching error occurred.';
  // TanStack Query errors often relate to network or server issues.
  // categorizeError should pick up network issues.
  // We can default to Server if it's not clearly a network one.
  const categorized = categorizeError(error); // error is an Error instance
  showErrorToast(error, defaultMessage, {
    category:
      categorized.category === ErrorCategory.Unknown
        ? ErrorCategory.Server
        : categorized.category,
  });
};

// General purpose error handler
export const handleGenericError = (
  error: unknown,
  defaultMessage = 'An unexpected error occurred.',
  severity: ErrorSeverity = ErrorSeverity.Error,
  category: ErrorCategory = ErrorCategory.Unknown,
) => {
  showErrorToast(error, defaultMessage, { severity, category });
};
