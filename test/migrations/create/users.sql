CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  age INT,
  username TEXT,
  password TEXT,
  hobbies TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  archived_at TIMESTAMP
);