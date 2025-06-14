import { HomeSearchSkeleton } from "@app/components/home/home-search-skeleton";
import { SearchHeader } from "@app/components/search/search-header";
import { Section } from "@app/components/section/section";
import { Title } from "@app/components/text/title";
import { Suspense } from "react";

export function SearchLanding() {
  return (
    <Section className="flex flex-col gap-4 md:gap-8">
      <Title>Search</Title>

      <div className="w-full">
        <Suspense fallback={<HomeSearchSkeleton />}>
          <SearchHeader />
        </Suspense>
      </div>
    </Section>
  );
}
