import pool from "../database.js"
import { generateId } from "./id.js"

async function createNewUrl(url: string) {
  const shortCode = generateId(7)
  const client = await pool.connect()
  try {
    const insertedRow = await client.query(
      `INSERT INTO urls (url, short_code) VALUES ($1, $2) RETURNING id, created_at, updated_at`,
      [url, shortCode]
    )
    if (!insertedRow || insertedRow.rowCount !== 1) {
      throw new Error("Could not create new url entry")
    }
    const { id, created_at, updated_at } = insertedRow.rows[0]
    return {
      id,
      url,
      shortCode,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  } finally {
    client.release()
  }
}

async function getOriginalUrl(shortCode: string) {
  const client = await pool.connect()
  try {
    const response = await client.query(
      `SELECT id, url, short_code AS "shortCode", created_at AS "createdAt", updated_at AS "updatedAt"
      FROM urls
      WHERE short_code = $1`,
      [shortCode]
    )
    return response.rows[0] || null
  } finally {
    client.release()
  }
}

export { createNewUrl, getOriginalUrl }
