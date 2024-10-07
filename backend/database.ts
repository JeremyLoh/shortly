import pg from "pg"

// https://github.com/brianc/node-postgres/issues/3060
const pool = new pg.Pool({
  host: "urlShortener", // name of postgresql container (in docker compose)
  port: 5432,
  user: process.env.POSTGRES_USER || "todoChangeUser",
  password: process.env.POSTGRES_PASSWORD || "todoChangePassword",
  database: "urlShortener",
})

async function setupDatabase(pool: pg.Pool) {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS "urls" (
      id BIGSERIAL PRIMARY KEY,
      url VARCHAR(2048),
      short_code CHAR(7),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ
    )`)
  } catch (error) {}
}

export default pool
export { setupDatabase }