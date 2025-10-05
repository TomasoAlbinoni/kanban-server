import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DB,
  password: process.env.DBPASS,
  port: Number(process.env.DBPORT ?? 5432),
})