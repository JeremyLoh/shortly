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
  } catch (error) {
    throw error
  } finally {
    client.release()
  }
}

export { createNewUrl }
