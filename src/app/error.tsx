"use client";

import { useEffect } from "react";
import { Button } from "@app/components/button";
import { Section } from "@app/components/section";
import { Text } from "@app/components/text";
import {
  ErrorCategory,
  ErrorSeverity,
  showErrorToast,
} from "@app/utils/error-handler";
import { Home, RefreshCw } from "react-feather";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }; // Next.js errors can have a digest
  reset: () => void;
}) {
  useEffect(() => {
    // Determine category and severity based on the error if possible
    // For a generic app-level boundary, we might not have much context
    // but we can try to infer or use defaults.
    let category = ErrorCategory.Unknown;
    if (error.message.toLowerCase().includes("fetch")) {
      category = ErrorCategory.Network;
    }
    // You could add more sophisticated checks here if error objects have specific properties

    showErrorToast(error, "An application error occurred. Please try again.", {
      severity: ErrorSeverity.Error,
      category,
    });
  }, [error]);

  return (
    <Section as="main">
      <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
        <Text as="h1" size="5xl" bold className="text-error">
          Oops! Something went wrong.
        </Text>
        <Text size="lg" className="text-base-content/80">
          We&apos;ve encountered an unexpected issue. Our team has been
          notified.
        </Text>
        <Text size="md" className="text-base-content/70">
          You can try to refresh the page or go back to the homepage.
        </Text>

        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mt-4 w-full max-w-2xl text-left">
            <Text as="h3" size="lg" bold className="mb-2">
              Error Details (Development Mode):
            </Text>
            <pre className="bg-base-200 text-error-content overflow-x-auto rounded-lg p-4 text-sm">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
              {error.stack && `\nStack: ${error.stack}`}
            </pre>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={() => reset()} type="button" className="btn-primary">
            <RefreshCw size={18} className="mr-2" />
            <span>Try again</span>
          </Button>
          <Button as={Link} href="/" className="btn-outline">
            <Home size={18} className="mr-2" />
            <span>Go to Homepage</span>
          </Button>
        </div>
      </div>
    </Section>
  );
}
