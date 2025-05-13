import * as z from 'zod';

export const validate = (data: unknown): void => {
  const schema = z.object({
    userId: z.string(),
    sessionId: z.string().min(1),
  });

  schema.parse(data);
};
