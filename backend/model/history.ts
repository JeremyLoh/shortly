import pool from "../database.js"

async function getUrlHistory(userId: string) {
  // TODO limit query using pagination
  const client = await pool.connect()
  try {
    const response = await client.query(
      `SELECT id, url, short_code AS "shortCode", updated_at AS "updatedAt", created_at AS "createdAt"
      FROM urls WHERE user_id = $1`,
      [userId]
    )
    return response.rows
  } catch (error) {
  } finally {
    client.release()
  }
}

export { getUrlHistory }
