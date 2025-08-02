import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // add if you have one
  database: 'fintrack',
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const connection = await mysql.createConnection(dbConfig)

    const [existing] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if ((existing as any[]).length > 0) {
      await connection.end()
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    await connection.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    await connection.end()
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
