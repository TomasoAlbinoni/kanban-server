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
  index: number
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

app.put('/update', async (req, res) => {
  try {
    const item: Item = req.body
    const currentItem: Item | undefined = (await pool.query<Item>('SELECT * FROM tasks WHERE id = $1;', [item.id])).rows[0]
    if (!currentItem) {
      res.status(404).json({ error: 'Item not found' })
      return
    }
    if (currentItem.list === item.list) {
      if (currentItem.index < item.index) {
        await pool.query(
          'UPDATE tasks SET index = index - 1 WHERE list = $1 AND index > $2 AND index <= $3;',
          [item.list, currentItem.index, item.index]
        )
      } else if (currentItem.index > item.index) {
        await pool.query(
          'UPDATE tasks SET index = index + 1 WHERE list = $1 AND index >= $2 AND index < $3;',
          [item.list, item.index, currentItem.index]
        )
      }
    } else {
      await pool.query(
        'UPDATE tasks SET index = index - 1 WHERE list = $1 AND index > $2;',
        [currentItem.list, currentItem.index]
      )
      await pool.query(
        'UPDATE tasks SET index = index + 1 WHERE list = $1 AND index >= $2;',
        [item.list, item.index]
      )
    }
    const result = await pool.query(
      'UPDATE tasks SET list = $1, title = $2, content = $3, index = $4 WHERE id = $5;',
      [item.list, item.title, item.content, item.index, item.id]
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