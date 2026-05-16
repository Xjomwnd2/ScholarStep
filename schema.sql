-- Run this in psql: \i db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  program       VARCHAR(100),
  year          INTEGER,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  code       VARCHAR(20),
  instructor VARCHAR(100),
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id  INTEGER REFERENCES courses(id) ON DELETE SET NULL,
  title      VARCHAR(200) NOT NULL,
  priority   VARCHAR(10)  DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  status     VARCHAR(15)  DEFAULT 'todo'   CHECK (status IN ('todo','in-progress','done')),
  progress   INTEGER      DEFAULT 0        CHECK (progress BETWEEN 0 AND 100),
  due_date   DATE NOT NULL,
  notes      TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grades (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id    INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE SET NULL,
  score        NUMERIC(5,2),
  max_score    NUMERIC(5,2) DEFAULT 100,
  graded_at    TIMESTAMP DEFAULT NOW()
);
