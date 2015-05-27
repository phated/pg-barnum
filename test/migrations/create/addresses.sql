CREATE TABLE IF NOT EXISTS addresses(
  id SERIAL PRIMARY KEY,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  archived_at TIMESTAMP
);

ALTER TABLE
  users
ADD COLUMN
  address_id INTEGER REFERENCES addresses (id);