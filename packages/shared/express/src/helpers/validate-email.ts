import * as z from 'zod';

export const emailValidation = (data: unknown): void => {
  const schema = z.object({
    email: z.string().email(),
  });

  schema.parse(data);
};
