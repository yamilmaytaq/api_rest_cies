
import {createPool} from "mysql2/promise";
import {
    DBPORT,
    HOST,
    DATABASE,
    DBUSER,
    PASSWORD
} from "./../config.js";

export const getConnection = createPool({
    host: HOST,
    user: DBUSER,
    password: PASSWORD,
    port: DBPORT,
    database: DATABASE
});

