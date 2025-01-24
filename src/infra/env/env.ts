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
  SENDING_EMAIL_USERNAME: z.string(),
  SENDING_EMAIL_PASSWORD: z.string(),
  SENDING_EMAIL_PORT: z.coerce.number().default(587),
  SENDING_EMAIL_HOST: z.string(),
  SENDING_EMAIL_FROM: z.string(),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_DB: z.coerce.number().optional().default(0),
});

export type Env = z.infer<typeof envSchema>;
