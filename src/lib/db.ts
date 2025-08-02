// db.ts or dbConfig.ts
import mysql from 'mysql2/promise'

export const dbConfig = {
  host: process.env.MYSQLHOST!,
  user: process.env.MYSQLUSER!,
  password: process.env.MYSQLPASSWORD!,
  database: process.env.MYSQLDATABASE!,
  port: Number(process.env.MYSQLPORT || 3306),
}

export const getConnection = async () => {
  return await mysql.createConnection(dbConfig)
}
