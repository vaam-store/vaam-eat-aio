"use client";

import { Button } from "@app/components/button";
import { Section } from "@app/components/section";
import { Text } from "@app/components/text";
import { RefreshCw } from "react-feather";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Section as="main">
      <div className="flex flex-col gap-4 py-6">
        <Text as="h2" size="4xl" bold>
          Something went wrong!
        </Text>
        <pre className="bg-error text-error-content overflow-x-scroll rounded-lg p-2">
          {error.message}
        </pre>
        <div className="flex gap-4">
          <Button onClick={() => reset()} type="button">
            <span>Try again</span>
            <RefreshCw />
          </Button>
        </div>
      </div>
    </Section>
  );
}
