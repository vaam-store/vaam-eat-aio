"use client";

import { Button } from "@app/components/button";
import { Section } from "@app/components/section";
import { Text } from "@app/components/text";
import { Home } from "react-feather";

export default function NotFound() {
  return (
    <Section as="main">
      <div className="flex flex-col gap-4 py-6">
        <Text as="h2" size="4xl" bold>
          Page not found
        </Text>
        <p className="text-lg">The page you're looking for doesn't exist.</p>
        <div className="flex gap-4">
          <Button onClick={() => window.location.replace("/")} type="button">
            <span>Go home</span>
            <Home />
          </Button>
        </div>
      </div>
    </Section>
  );
}
