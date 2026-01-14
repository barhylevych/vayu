import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseSchema = z.object({
  url: z.string().url('DATABASE_URL must be a valid URL'),
});

const serverSchema = z.object({
  port: z.coerce.number().int().positive().max(65535).default(8080),
});

const appSchema = z.object({
  nodeEnv: z
    .enum(['development', 'production', 'test'], {
      errorMap: () => ({
        message: 'NODE_ENV must be development, production, or test',
      }),
    })
    .default('development'),
});

const configSchema = z.object({
  database: databaseSchema,
  server: serverSchema,
  app: appSchema,
});

// Parse and validate environment variables
const parseConfig = () => {
  try {
    const rawEnv = {
      database: {
        url: process.env.DATABASE_URL,
      },
      server: {
        port: process.env.PORT,
      },
      app: {
        nodeEnv: process.env.NODE_ENV,
      },
    };

    return configSchema.parse(rawEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(
        `Environment variable validation failed:\n${errorMessages}`
      );
    }
    throw error;
  }
};

export const config = parseConfig();
