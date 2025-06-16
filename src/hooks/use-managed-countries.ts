import { getApiClient } from '@app/utils/axios';
import { useQuery } from '@tanstack/react-query';

export type ManagedCountries = Record<
  string,
  Record<string, [number, number, number, number]>
>;

export function useManagedCountries() {
  const {
    data: managedCountriesData,
    isLoading: managedCountriesLoading,
    isError: managedCountriesError,
  } = useQuery<ManagedCountries>({
    queryKey: ['managedCountries'],
    queryFn: async () => {
      const client = getApiClient();
      const response = await client.get<ManagedCountries>(
        '/maps/managed-countries.json',
      );
      return response.data;
    },
    staleTime: Infinity, // Data is static, so it never becomes stale
  });

  return {
    managedCountriesData,
    managedCountriesLoading,
    managedCountriesError,
  };
}
