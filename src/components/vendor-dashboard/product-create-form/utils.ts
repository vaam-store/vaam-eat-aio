import type { ProductCreateFormValues } from './../product-create-form'; // Adjust path as needed

// Helper function to generate cartesian product of option values
export const getVariationCombinations = (
  options: ProductCreateFormValues['options']['createMany']['data'],
): number[][] => {
  if (!options || options.length === 0) {
    return [];
  }

  const valueArrays = options.map((opt) => opt.values.map((_, i) => i)); // array of arrays of value indices

  // If any option has no values, or an option itself is somehow undefined/null (though schema should prevent latter)
  if (
    valueArrays.some((arr) => arr.length === 0) ||
    options.some((opt) => !opt?.values)
  ) {
    return [];
  }

  return valueArrays.reduce<number[][]>((acc, currentValues) => {
    if (acc.length === 0) {
      // For the first option, its values (indices) are the initial combinations
      return currentValues.map((v) => [v]);
    }
    const newCombinations: number[][] = [];
    acc.forEach((existingCombination) => {
      currentValues.forEach((currentValue) => {
        newCombinations.push([...existingCombination, currentValue]);
      });
    });
    return newCombinations;
  }, []);
};
