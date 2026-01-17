-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- BOOKS TABLE
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  cover_image TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ORDERS TABLE
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  mpesa_checkout_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
