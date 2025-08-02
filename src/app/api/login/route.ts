import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "fintrack",
};

export async function POST(req: Request) {
  let connection;

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute<any[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Login successful", userId: user.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
