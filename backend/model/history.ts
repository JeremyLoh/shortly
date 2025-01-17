import pool from "../database.js"

async function getUrlHistory(
  userId: string,
  page: string,
  resultPerPage: string
) {
  // page is one indexed
  let offset: number = (parseInt(page) - 1) * parseInt(resultPerPage)
  const client = await pool.connect()
  try {
    const response = await client.query(
      `SELECT id, url, short_code AS "shortCode", updated_at AS "updatedAt", created_at AS "createdAt"
      FROM urls WHERE user_id = $1
      LIMIT $2
      OFFSET $3`,
      [userId, resultPerPage, offset]
    )
    const countResponse = await client.query(
      `SELECT COUNT(*) FROM urls WHERE user_id = $1`,
      [userId]
    )
    return { urls: response.rows, total: countResponse.rows[0].count }
  } catch (error) {
  } finally {
    client.release()
  }
}

export { getUrlHistory }
