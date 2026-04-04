import express from 'express';
import pool from '../database/db.js';

const router = express.Router();

// GET all items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new item
router.post('/', async (res, req) => {
  try {
    const { name, description, starting_price, end_time, seller_id } = req.body;

    // The $1, $2 syntax prevents SQL Injection attacks
    // RETURNING * tells Postgres to send back the newly created row
    const newItem = await pool.query(
      'INSERT INTO items (name, description, starting_price, end_time, seller_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, starting_price, end_time, seller_id]
    );
    // Send the newly created item back to the client
    res.status(201).json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
