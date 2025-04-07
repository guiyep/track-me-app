import { processBatch } from '../process-batch';

describe('processBatch', () => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const mockAsyncFunction = async (item: number): Promise<number> => {
    await delay(10);
    return item * 2;
  };

  it('should process all items in batches', async () => {
    const items = [1, 2, 3, 4, 5, 6];
    const batchSize = 2;

    const results = await processBatch(items, mockAsyncFunction, batchSize);

    expect(results).toEqual([2, 4, 6, 8, 10, 12]);
  });

  it('should handle empty array', async () => {
    const items: number[] = [];
    const batchSize = 2;

    const results = await processBatch(items, mockAsyncFunction, batchSize);

    expect(results).toEqual([]);
  });

  it('should process partial last batch', async () => {
    const items = [1, 2, 3, 4, 5];
    const batchSize = 2;

    const results = await processBatch(items, mockAsyncFunction, batchSize);

    expect(results).toEqual([2, 4, 6, 8, 10]);
  });

  it('should process single batch when batch size equals array length', async () => {
    const items = [1, 2, 3];
    const batchSize = 3;

    const results = await processBatch(items, mockAsyncFunction, batchSize);

    expect(results).toEqual([2, 4, 6]);
  });

  it('should handle batch size larger than array length', async () => {
    const items = [1, 2];
    const batchSize = 5;

    const results = await processBatch(items, mockAsyncFunction, batchSize);

    expect(results).toEqual([2, 4]);
  });

  it('should maintain order of processed items', async () => {
    const items = [3, 1, 4, 2];
    const batchSize = 2;

    const results = await processBatch(items, mockAsyncFunction, batchSize);

    expect(results).toEqual([6, 2, 8, 4]);
  });
});
