import toast from "react-hot-toast";

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string"
  );
}

function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    // fallback in case there's an error stringifying the error
    // like with circular references for example.
    return String(error);
  }
}

export const showErrorToast = (
  error: unknown,
  defaultMessage = "An unexpected error occurred.",
) => {
  const message = getErrorMessage(error);
  toast.error(message || defaultMessage);
  // Log the error to the console for more detailed debugging
  console.error("Error handled by showErrorToast:", error);
};

// Example of a more specific error handler if needed
export const handleTrpcError = (error: unknown) => {
  // Potentially more specific tRPC error parsing here
  // For now, use the generic handler
  showErrorToast(error, "A tRPC error occurred.");
};

export const handleQueryError = (error: unknown) => {
  // Potentially more specific TanStack Query error parsing here
  // For now, use the generic handler
  showErrorToast(error, "A data fetching error occurred.");
};
