import dotenv from "dotenv";
dotenv.config();

export const PORT = Number(process.env.PORT ?? 3000);
export const SECRET_KEY = process.env.SECRETKEY!;
export const DBUSER = process.env.DBUSER;
export const DBHOST = process.env.DBHOST;
export const DB = process.env.DB;
export const DBPASS = process.env.DBPASS;
export const DBPORT = Number(process.env.DBPORT ?? 5432);

