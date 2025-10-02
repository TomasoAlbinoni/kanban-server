import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DB,
  password: process.env.DBPASS,
  port: Number(process.env.DBPORT ?? 5432),
})

const app = express();

const port = process.env.PORT || 3000;

interface Item {
  id: number
  title?: string
  content?: string
  list: string
}

app.use(cors<Request>());
app.use(express.json())

app.get('/', async (req, res) => {
  try {
    const result = await pool.query<Item>('SELECT * FROM tasks;')
    const items: Item[] = result.rows
    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
});

app.post('/move', async (req, res) => {
    try {
    const item: Item = req.body
    const result = await pool.query(
      'UPDATE tasks SET list = $1 WHERE id = $2',
      [item.list, item.id]
    )
    res.json({ success: true, rowCount: result.rowCount })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
});

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});