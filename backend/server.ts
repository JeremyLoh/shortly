import express, { Request, Response } from "express"
import pool, { setupDatabase } from "./database.js"
import { generateId } from "./id.js"

const PORT = 3000 // port need to match docker compose setup for app

async function setupServer() {
  await setupDatabase(pool)
  setupRoutes()
}

function setupRoutes() {
  const app = express()
  app.use(express.json()) // middleware to parse json request body
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
  app.post("/api/shorten", async (req: Request, res: Response) => {
    const { url }: { url: string } = req.body
    const shortCode = generateId(7)
    const client = await pool.connect()
    try {
      const insertedRow = await client.query(
        `INSERT INTO urls (url, short_code) VALUES ($1, $2) RETURNING id, created_at, updated_at`,
        [url, shortCode]
      )
      if (!insertedRow || insertedRow.rowCount !== 1) {
        res.sendStatus(500)
        return
      }
      const { id, created_at, updated_at } = insertedRow.rows[0]
      res.status(201).send({
        id,
        url,
        shortCode,
        createdAt: created_at,
        updatedAt: updated_at,
      })
    } catch (error) {
      res.sendStatus(500)
    } finally {
      client.release()
    }
  })

  app.get("/api/shorten/:id", (req: Request, res: Response) => {
    const { id } = req.params
    // TODO get original url details
    res.status(200).send("Hello" + id)
  })
}

setupServer()
