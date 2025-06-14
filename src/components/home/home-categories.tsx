import { CategoryGrid } from '@app/components/home/category-grid';
import { CategorySkeleton } from '@app/components/home/category-skeleton';
import { Section } from '@app/components/section/section';
import { Title } from '@app/components/text/title';
import { Suspense } from 'react';

export function HomeCategories() {
	return (
		<Section className="flex flex-col gap-4 md:gap-8">
			<Title>Browse per category</Title>

			<Suspense fallback={<CategorySkeleton />}>
				<CategoryGrid />
			</Suspense>
		</Section>
	);
}
