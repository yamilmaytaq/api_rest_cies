import {config} from "dotenv";

config();

export const PORT = process.env.PORT || 4000;
export const DBPORT = process.env.DBPORT || "";
export const HOST = process.env.HOST || "";
export const DATABASE = process.env.DATABASE || "";
export const DBUSER = process.env.DBUSER || "";
export const PASSWORD = process.env.PASSWORD || "";
