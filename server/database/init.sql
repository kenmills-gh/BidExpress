-- 1. DROP TABLES (Development only)
-- We drop them in reverse order of their dependencies so we don't hit foreign key errors.
-- This makes it easy to wipe and reset your database while building.

DROP TABLE iF EXISTS bids;
DROP TABLE iF EXISTS items;
DROP TABLE iF EXISTS users;

-- 2. USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ITEMS TABLE
-- Represents the products up for auction.
CREATE TABLE items ( 
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    -- NUMERIC(10, 2) is crucial for money to avoid floating-point math errors. 
    -- It allows numbers up to 99,999,999.99
    starting_price NUMERIC(10, 2) NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    -- If a user is deleted, ON DELETE CASCADE automatically removes all items they were selling.
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BIDS TABLE
-- The core of the application. Every time a user clicks "Bid", a new row goes here.
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    bidder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    bid_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);