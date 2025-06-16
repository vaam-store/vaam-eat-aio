import { SearchLanding } from '@app/components/search/search-landing';
import { Section } from '@app/components/section/section';

export default function SearchPage() {
  return (
    <div className='pt-4'>
      <SearchLanding />
      <Section>Miaou</Section>
    </div>
  );
}
