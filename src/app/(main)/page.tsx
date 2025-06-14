import { HomeBecomeChef } from "@app/components/home/home-become-chef";
import { HomeCategories } from "@app/components/home/home-categories";
import { HomeLanding } from "@app/components/home/home-landing";
import { HomePopular } from "@app/components/home/home-popular";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col gap-6 py-4">
      <HomeLanding />
      <div className="h-4" />
      <HomeCategories />
      <HomePopular />

      <HomeBecomeChef />
    </div>
  );
}
