import { HomeSearch } from "@app/components/home/home-search";
import { HomeSearchSkeleton } from "@app/components/home/home-search-skeleton";
import { Section } from "@app/components/section/section";
import { Text } from "@app/components/text/text";
import { Title } from "@app/components/text/title";
import { Suspense } from "react";

export function HomeLanding() {
  return (
    <Section className="flex flex-col items-center gap-4 md:gap-8">
      <Title heading className="text-center leading-[normal]">
        Homemade Delights
      </Title>

      <Text className="max-w-md text-center">
        Discover amazing homemade food from talented home chefs in your
        neighborhood
      </Text>

      <div className="w-full max-w-lg">
        <Suspense fallback={<HomeSearchSkeleton />}>
          <HomeSearch />
        </Suspense>
      </div>
    </Section>
  );
}
