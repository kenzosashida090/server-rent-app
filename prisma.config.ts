import { defineConfig, env, PrismaConfig } from "prisma/config";
import 'dotenv/config';
export default ({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL!
  },
}) satisfies PrismaConfig
