import { hashPassword, verifyPassword } from "../auth/password.js"
import pool from "../database.js"

type User = {
  id: string
}

async function findUserById(id: string): Promise<User | null> {
  const client = await pool.connect()
  try {
    const response = await client.query(`SELECT id FROM users WHERE id = $1`, [
      id,
    ])
    if (response.rowCount === 0) {
      return null
    }
    return { id: response.rows[0].id }
  } finally {
    client.release()
  }
}

async function findUserBasedOnCredential(
  username: string,
  password: string
): Promise<User | null> {
  const client = await pool.connect()
  try {
    const response = await client.query(
      `SELECT id, hashed_password FROM users WHERE username = $1`,
      [username]
    )
    if (response.rowCount === 0) {
      return null
    }
    const hashedPassword = response.rows[0]["hashed_password"]
    const isValidPassword = await verifyPassword(password, hashedPassword)
    if (!isValidPassword) {
      return null
    }
    return { id: response.rows[0].id }
  } finally {
    client.release()
  }
}

async function createUser(username: string, password: string) {
  const hash = await hashPassword(password)
  if (hash == null) {
    throw new Error("Could not create user")
  }
  const client = await pool.connect()
  try {
    const response = await client.query(
      `INSERT INTO users (username, hashed_password) VALUES ($1, $2)
      RETURNING id`,
      [username, hash]
    )
    if (response.rowCount !== 1) {
      throw new Error("Could not create user")
    }
    return { id: response.rows[0].id }
  } catch (error) {
    throw new Error("Could not create user")
  } finally {
    client.release()
  }
}

export { findUserById, findUserBasedOnCredential, createUser }
