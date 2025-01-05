import { z } from "zod";

export const envSchema = z.object({
    PORT: z.coerce.number().optional().default(3333),
    TEST_CPF: z.string()
})

export type Env = z.infer<typeof envSchema>