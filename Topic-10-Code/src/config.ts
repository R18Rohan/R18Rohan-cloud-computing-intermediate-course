// Environment Variables configuration loader with typed validation checks

export interface IConfig {
  port: number;
  environment: string;
  apiSecretKey: string;
}

export function loadConfig(env: Record<string, string | undefined>): IConfig {
  const rawPort = env.PORT;
  const rawEnv = env.NODE_ENV;
  const rawKey = env.API_SECRET_KEY;

  if (!rawPort || !rawEnv || !rawKey) {
    throw new Error('Configuration Error: Missing required environment variables (PORT, NODE_ENV, API_SECRET_KEY).');
  }

  const port = parseInt(rawPort, 10);
  if (isNaN(port)) {
    throw new Error('Configuration Error: PORT environment variable must be a valid number.');
  }

  return {
    port,
    environment: rawEnv,
    apiSecretKey: rawKey
  };
}
