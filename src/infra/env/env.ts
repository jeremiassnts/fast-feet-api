import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  JWT_KEY: z.string(),
  DATABASE_URL: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  E2E_VALID_CPF: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
});

export type Env = z.infer<typeof envSchema>;
