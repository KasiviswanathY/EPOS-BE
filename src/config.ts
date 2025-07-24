export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres10@localhost:5432/inventory_management?schema=public',
  serverUrl: process.env.SERVER_URL || 'http://localhost',
};
