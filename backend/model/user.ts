import argon2 from "argon2"
import pool from "../database.js"

type User = {
  id: string
}

async function hashPassword(password: string) {
  try {
    const hash = await argon2.hash(password)
    return hash
  } catch (error) {
    return null
  }
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
  const hash = await hashPassword(password)
  if (hash == null) {
    return null
  }
  const client = await pool.connect()
  try {
    const response = await client.query(
      `SELECT id FROM users WHERE username = $1 AND hashed_password = $2`,
      [username, hash]
    )
    if (response.rowCount === 0) {
      return null
    }
    return { id: response.rows[0].id }
  } finally {
    client.release()
  }
}

export { findUserById, findUserBasedOnCredential }
