-- Baseline. Uses IF NOT EXISTS so it is safe to run against a database that
-- already has the table from the old boot-time createMedicinesTableIfNotExists()
-- as well as against an empty one. Every later migration can assume this ran.

-- Up Migration
CREATE TABLE IF NOT EXISTS medicines (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  price    NUMERIC(10, 2),
  quantity INTEGER
);

-- Down Migration
DROP TABLE IF EXISTS medicines;
