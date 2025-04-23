import * as z from 'zod';

export const userIdValidation = (data: unknown): void => {
  const schema = z.object({
    userId: z.string(),
  });

  schema.parse(data);
};
