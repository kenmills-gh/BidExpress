// server/routes/bids.js
import express from 'express';
import pool from '../database/db.js';

const router = express.Router();

// POST a new bid
router.post('/', async (req, res) => {
  const { item_id, bidder_id, bid_amount } = req.body;

  // 1. Grab a dedicated client from the pool to run our transaction
  const client = await pool.connect();

  try {
    // 2. Start the transaction
    await client.query('BEGIN');

    // 3. Lock the item row.
    // FOR UPDATE tells Postgres: "Nobody else can touch this item's data until I am done."
    const itemQuery = await client.query(
      'SELECT starting_price FROM items WHERE id = $1 FOR UPDATE',
      [item_id]
    );

    if (itemQuery.rows.length === 0) {
      throw new Error('Item not found');
    }

    const startingPrice = parseFloat(itemQuery.rows[0].starting_price);

    // 4. Find the current highest bid for this item
    const highestBidQuery = await client.query(
      'SELECT MAX(bid_amount) as max_bid FROM bids WHERE item_id = $1',
      [item_id]
    );

    // If there are no bids yet, the highest bid defaults to 0
    const currentHighestBid = highestBidQuery.rows[0].max_bid
      ? parseFloat(highestBidQuery.rows[0].max_bid)
      : 0;

    // 5. The Business Logic Validation
    const minimumRequiredBid = Math.max(startingPrice, currentHighestBid);

    if (bid_amount <= minimumRequiredBid) {
      // If the bid is too low, we manually throw an error to trigger the catch block
      throw new Error(`Bid must be higher than $${minimumRequiredBid}`);
    }

    // 6. Insert the new winning bid!
    const newBid = await client.query(
      `INSERT INTO bids (item_id, bidder_id, bid_amount) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [item_id, bidder_id, bid_amount]
    );

    // 7. Commit the transaction (this successfully saves the data and unlocks the row)
    await client.query('COMMIT');

    const io = req.app.get('io');
    io.to(String(item_id)).emit('receive_new_bid', newBid.rows[0]);

    res.status(201).json(newBid.rows[0]);
  } catch (err) {
    // If ANYTHING fails above, ROLLBACK destroys the transaction so bad data isn't saved
    await client.query('ROLLBACK');
    console.error('Transaction Failed:', err.message);
    res.status(400).json({ error: err.message });
  } finally {
    // 8. Always release the client back to the pool, whether it succeeded or failed
    client.release();
  }
});

// GET bid history for a specific item
router.get('/:item_id', async (req, res) => {
  try {
    const { item_id } = req.params;

    // Fetch all bids for this item, joining the users table to get the bidder's name
    // We order by bid_amount DESC so the highest/newest bid is always at the top (index 0)
    const bidsQuery = await pool.query(
      'SELECT bids.id, users.username, bids.bid_amount, bids.created_at FROM bids JOIN users ON bids.bidder_id = users.id WHERE bids.item_id = $1 ORDER BY bids.bid_amount DESC',
      [item_id]
    );

    res.json(bidsQuery.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
