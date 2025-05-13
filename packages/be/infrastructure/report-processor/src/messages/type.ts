export type FetcherFunction<T, K> = (data: T) => Promise<K>;

export type MessageHandler<T> = (data: T) => Promise<void>;
