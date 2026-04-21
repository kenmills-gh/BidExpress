import express from 'express';
import pool from '../database/db.js';

const router = express.Router();

// GET all items (Populates the homepage grid)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET a single item by ID (Populates the specific auction room)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const itemQuery = await pool.query('SELECT * FROM items WHERE id = $1', [id]);

    if (itemQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(itemQuery.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new item (Create a new auction listing)
router.post('/', async (req, res) => {
  try {
    // ADDED: image_url is now destructured from the request body
    const { name, description, starting_price, end_time, seller_id, image_url } = req.body;

    const newItem = await pool.query(
      `INSERT INTO items (name, description, starting_price, end_time, seller_id, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, description, starting_price, end_time, seller_id, image_url]
    );

    res.status(201).json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
