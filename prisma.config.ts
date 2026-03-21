import { config } from "dotenv";
// Load .env.local in development; on Vercel the vars are injected automatically
config({ path: ".env.local", override: false });
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
