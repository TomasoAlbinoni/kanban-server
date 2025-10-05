import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool.js";
import type { User } from "../types/user.js";
import type KanbanJwtPayload from "../types/kanbanJwtPayload.js";
import { SECRET_KEY } from "../config.js";

type Credentials = {
  username: string;
  password: string;
}

const router = Router();

router.post("/login", async (req, res) => {
    const credentials: Credentials = req.body;
    let user: User | undefined;
    try {
        const result = await pool.query<User>('SELECT * FROM users WHERE username = $1;', [credentials.username]);
        const users: User[] = result.rows;
        user = users[0];
        if (!user || !(await bcrypt.compare(credentials.password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Database error' })
    }
    
    const token = jwt.sign({ userId: user?.id, admin: user?.admin } as KanbanJwtPayload, SECRET_KEY, { expiresIn: '6h' });
    
    res.status(200).send({ token });
});

router.post("/signup", async (req, res) => {
    const credentials: Credentials = req.body;
    try {
        const result = await pool.query('SELECT 1 FROM users WHERE username = $1;', [credentials.username]);
        if (result.rowCount) {
            return res.status(400).json({ error: 'Username is already taken' });
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database lookup error' })
    }

    const hashedPassword: string = await bcrypt.hash(credentials.password, 8);

    try {
        await pool.query('INSERT INTO users (username, password_hash, admin) VALUES ($1, $2, $3);', [credentials.username, hashedPassword, false]);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database saving error' })
    }

    res.status(201).send('User created');
});

export default router;


