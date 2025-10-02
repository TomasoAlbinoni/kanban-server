import express from "express";
import cors from "cors";
import { Pool } from 'pg';
const pool = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DB,
    password: process.env.DBPASS,
    port: Number(process.env.DBPORT ?? 5432),
});
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks;');
        const items = result.rows;
        res.json(items);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});
app.post('/move', async (req, res) => {
    try {
        const item = req.body;
        const result = await pool.query('UPDATE tasks SET list = $1 WHERE id = $2', [item.list, item.id]);
        res.json({ success: true, rowCount: result.rowCount });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});
// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map