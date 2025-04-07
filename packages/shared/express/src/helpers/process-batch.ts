/**
 * Processes an array of items in batches using the provided async function
 * @param items Array of items to process
 * @param fn Async function to process each item
 * @param batchSize Size of each batch
 * @returns Array of processed results
 */
export const processBatch = async <T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  batchSize: number,
): Promise<R[]> => {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
};
