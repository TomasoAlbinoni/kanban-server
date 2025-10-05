import { Pool } from "pg";
import { DBUSER, DBHOST, DB, DBPASS, DBPORT } from "../config.js";

export const pool = new Pool({
  user: DBUSER,
  host: DBHOST,
  database: DB,
  password: DBPASS,
  port: DBPORT,
})