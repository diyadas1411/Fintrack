import mysql from 'mysql2/promise'

export const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fintrack',
}

export const getConnection = async () => {
  return await mysql.createConnection(dbConfig)
}
