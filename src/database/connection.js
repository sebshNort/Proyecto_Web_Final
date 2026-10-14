import sql from 'mssql'
import { config } from "../config.js";


let pool;


/*const dbSettings = {

    user: "Usuario_Backend",
    password: "admin9_2*-1",
    server: "localhost",
    database:"APUESTAS",
    options: {
      port:11982,
      encrypt: false,
      trustServerCertificate: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
};*/

export const getConnection = async () => {

    try {

        if(pool) return pool;

        pool = await new sql.ConnectionPool({
        user: config.db.user,
        password: config.db.password,
        server: config.db.server,
        port: config.db.port,
        database: config.db.database,
        options: config.db.options,
        pool: config.db.pool
    }).connect();

       // const pool = await sql.connect(dbSettings);
        return pool
    } catch (error) {

        console.error(error);
    }


}