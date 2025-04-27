import { z } from 'zod';

export const validate = (data: unknown): void => {
  const schema = z.object({
    userId: z.string(),
    displayName: z.string(),
    name: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
    profilePictureUrl: z.string().url().optional(),
    isEmailVerified: z.boolean(),
    isPhoneNumberVerified: z.boolean().optional(),
  });

  schema.parse(data);
};
