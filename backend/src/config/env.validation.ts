import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3001),
  API_PREFIX: Joi.string().default('api/v1'),
  DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(12).max(15).default(12),
  ADMIN_NAME: Joi.string().min(2).required(),
  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PASSWORD: Joi.string().min(8).required(),
  CORS_ALLOWED_ORIGINS: Joi.string().default(''),
  STORAGE_DRIVER: Joi.string().valid('local', 's3').default('local'),
  S3_BUCKET: Joi.when('STORAGE_DRIVER', { is: 's3', then: Joi.string().required(), otherwise: Joi.string().optional() }),
  S3_REGION: Joi.when('STORAGE_DRIVER', { is: 's3', then: Joi.string().required(), otherwise: Joi.string().optional() }),
  S3_ENDPOINT: Joi.string().uri().optional(),
  S3_PUBLIC_BASE_URL: Joi.string().uri().optional(),
  REDIS_URL: Joi.string().uri({ scheme: ['redis', 'rediss'] }).optional(),
  SENTRY_DSN: Joi.string().uri({ scheme: ['https'] }).optional(),
});