import { Router } from "express";
import { pool } from "@/db/pool";
import type { User } from "@/types/user";
import type { AuthRequest } from "@/types/authRequest";

type Item = {
  id: number
  title?: string
  content?: string
  list: string
  index: number
}

const router = Router();

router.get('/', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query<Item>('SELECT * FROM tasks WHERE user_id = $1;', [req.user?.userId])
    const items: Item[] = result.rows
    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
});

router.put('/update', async (req: AuthRequest, res) => {
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
          'UPDATE tasks SET index = index - 1 WHERE user_id = $1 AND list = $2 AND index > $3 AND index <= $4;',
          [req.user?.userId, item.list, currentItem.index, item.index]
        )
      } else if (currentItem.index > item.index) {
        await pool.query(
          'UPDATE tasks SET index = index + 1 WHERE user_id = $1 AND list = $2 AND index >= $3 AND index < $4;',
          [req.user?.userId, item.list, item.index, currentItem.index]
        )
      }
    } else {
      await pool.query(
        'UPDATE tasks SET index = index - 1 WHERE user_id = $1 AND list = $2 AND index > $3;',
        [req.user?.userId, currentItem.list, currentItem.index]
      )
      await pool.query(
        'UPDATE tasks SET index = index + 1 WHERE user_id = $1 AND list = $2 AND index >= $3;',
        [req.user?.userId, item.list, item.index]
      )
    }
    const result = await pool.query(
      'UPDATE tasks SET list = $1, title = $2, content = $3, index = $4 WHERE user_id = $5 AND id = $6;',
      [item.list, item.title, item.content, item.index, req.user?.userId, item.id]
    )
    res.json({ success: true, rowCount: result.rowCount })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
});

export default router;