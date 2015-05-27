CREATE TABLE IF NOT EXISTS books(
  id SERIAL PRIMARY KEY,
  title TEXT,
  author_id INTEGER REFERENCES authors (id)
);