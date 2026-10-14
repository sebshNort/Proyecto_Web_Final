import dotenv from 'dotenv'
dotenv.config();


export const config = {

    db: {
    server: process.env.SQLSERVER_SERVER,
    port: parseInt(process.env.SQLSERVER_PORT, 10),
    user: process.env.SQLSERVER_USER,
    password: process.env.SQLSERVER_PASSWORD,
    database: process.env.SQLSERVER_DATABASE,
    options: {
      encrypt: false,
      trustServerCertificate: (process.env.TRUST_SERVER_CERTIFICATE || 'true').toLowerCase() === 'true'
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }

}