CREATE TABLE IF NOT EXISTS publishers(
  id SERIAL PRIMARY KEY,
  name TEXT
);

ALTER TABLE
  books
ADD COLUMN
  publisher_id INTEGER REFERENCES publishers (id);