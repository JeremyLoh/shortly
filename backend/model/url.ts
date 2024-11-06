import pool from "../database.js"
import { generateId } from "./id.js"

async function createNewUrl(url: string, userId: string | null) {
  const shortCode = generateId(7)
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const insertedRow =
      userId == null
        ? await client.query(
            `INSERT INTO urls (url, short_code) VALUES ($1, $2)
      RETURNING id, url, short_code AS "shortCode", created_at AS "createdAt", updated_at AS "updatedAt"`,
            [url, shortCode]
          )
        : await client.query(
            `INSERT INTO urls (url, short_code, user_id) VALUES ($1, $2, $3)
      RETURNING id, url, short_code AS "shortCode", created_at AS "createdAt", updated_at AS "updatedAt"`,
            [url, shortCode, userId]
          )
    if (!insertedRow || insertedRow.rowCount !== 1) {
      await client.query("ROLLBACK")
      throw new Error("Could not create new url entry")
    }
    const id = insertedRow.rows[0]["id"]
    await client.query(`INSERT INTO stats (url_id) VALUES ($1)`, [id])
    await client.query("COMMIT")
    return insertedRow.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

async function getOriginalUrl(shortCode: string) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const response = await client.query(
      `SELECT id, url, short_code AS "shortCode", created_at AS "createdAt", updated_at AS "updatedAt"
      FROM urls
      WHERE short_code = $1`,
      [shortCode]
    )
    if (response.rows[0] == null) {
      await client.query("ROLLBACK")
      return null
    }
    const id = response.rows[0]["id"]
    await client.query(
      `UPDATE stats SET access_count = (SELECT access_count FROM stats WHERE url_id = $1) + 1
      WHERE url_id = $1`,
      [id]
    )
    await client.query("COMMIT")
    return response.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

async function isExistingShortCode(shortCode: string) {
  const client = await pool.connect()
  try {
    const response = await client.query(
      `SELECT EXISTS(SELECT 1 FROM urls WHERE short_code = $1)`,
      [shortCode]
    )
    return response.rows[0].exists
  } finally {
    client.release()
  }
}

async function updateUrl(shortCode: string, url: string) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const response = await client.query(
      `UPDATE urls SET url = $1 WHERE short_code = $2 RETURNING id, url, short_code AS "shortCode", created_at AS "createdAt", updated_at AS "updatedAt"`,
      [url, shortCode]
    )
    const updateTimestampResponse = await client.query(
      `UPDATE urls SET updated_at = now() WHERE short_code = $1 RETURNING updated_at AS "updatedAt"`,
      [shortCode]
    )
    await client.query(`UPDATE stats SET access_count = 0 WHERE url_id = $1`, [
      response.rows[0]["id"],
    ])
    await client.query("COMMIT")
    const updatedTimestamp = updateTimestampResponse.rows[0]["updatedAt"]
    return { ...response.rows[0], updatedAt: updatedTimestamp }
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

async function deleteUrl(shortCode: string) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    await client.query(
      `DELETE FROM stats WHERE url_id = (SELECT id FROM urls WHERE short_code = $1)`,
      [shortCode]
    )
    const deleteUrlresponse = await client.query(
      `DELETE FROM urls WHERE short_code = $1`,
      [shortCode]
    )
    if (deleteUrlresponse.rowCount !== 1) {
      throw new Error("Could not delete short url")
    }
    await client.query("COMMIT")
    return true
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

async function getUrlStats(shortCode: string) {
  const client = await pool.connect()
  try {
    const response = await client.query(
      `SELECT u.id, u.url, u.short_code AS "shortCode", u.created_at AS "createdAt", u.updated_at AS "updatedAt",
        s.access_count AS "accessCount"
      FROM urls u
      INNER JOIN stats s ON u.id = s.url_id
      WHERE u.short_code = $1
      `,
      [shortCode]
    )
    return response.rows[0]
  } finally {
    client.release()
  }
}

export {
  createNewUrl,
  getOriginalUrl,
  isExistingShortCode,
  updateUrl,
  deleteUrl,
  getUrlStats,
}
