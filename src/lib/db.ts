import mysql from 'mysql2/promise'

export const dbConfig = {
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'tAxxpQABIDiTSEQOYRDahSykTqXFdyOH',
  database: 'railway',
  port: 3306,
}



export const getConnection = async () => {
  return await mysql.createConnection(dbConfig)
}
