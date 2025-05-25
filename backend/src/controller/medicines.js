import db from "../utils/postgres.js";

export async function getAllMedicines(req, res) {
  return res.status(200).json({
    data: process.env.POSTGRES_USER,
  });
}

export const createMedicinesTableIfNotExists = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS medicines (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(50),
      price NUMERIC(10, 2),
      quantity INTEGER
    );
  `;

  try {
    await db.query(query);
    console.log('✅ Medicines table ensured.');
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
  }
};