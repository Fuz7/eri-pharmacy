import db from "../utils/postgres.js";

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
  } catch (error) {
    console.error("❌ Error creating table:", error.message);
  }
};

export const seedMedicines = async () => {
  const query = `
    INSERT INTO medicines (name, category, price, quantity)
    VALUES
      ('Paracetamol', 'Pain Reliever', 5.99, 100),
      ('Amoxicillin', 'Antibiotic', 12.50, 50),
      ('Ibuprofen', 'Anti-inflammatory', 7.25, 75),
      ('Cetirizine', 'Antihistamine', 3.80, 120),
      ('Omeprazole', 'Antacid', 9.40, 60);
  `;

  try {
    await db.query(query);
    console.log("✅ Sample medicines inserted.");
  } catch (err) {
    console.error("❌ Insert error:", err.message);
  }
};

export const getAllMedicinesOrderedByNameDesc = async () => {
  try {
    const result = await db.query(`
      SELECT * FROM medicines
      ORDER BY name DESC;
    `);
    return result.rows;
  } catch (err) {
    console.error("error cant get all the medicines");
  }
};


export const updateMedicine = async (id, name, category, price, quantity) => {
  const query = `
    UPDATE medicines
    SET name = $1, category = $2, price = $3, quantity = $4
    WHERE id = $5;
  `;

  const values = [name, category, price, quantity, id];

  await db.query(query, values);
  return true; // returns the updated row
};

export const deleteMedicineById = async (id) => {
  const query = `
    DELETE FROM medicines
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);
  return true; // returns the deleted row, or undefined if not found
};

export const searchMedicines = async (searchBy, orderBy, searchQuery) => {
  const validColumns = ['name', 'category', 'price', 'quantity'];
  const validDirections = ['ASC', 'DESC'];

  if (!validColumns.includes(searchBy)) {
    throw new Error('Invalid searchBy column');
  }

  if (!validDirections.includes(orderBy.toUpperCase())) {
    throw new Error('Invalid order direction');
  }

  const values = [];
  let filterClause = '';

  if (searchQuery && searchQuery.trim() !== '') {
    filterClause = `WHERE name ILIKE $1 OR category ILIKE $1`;
    values.push(`%${searchQuery}%`);
  }

  const query = `
    SELECT * FROM medicines
    ${filterClause}
    ORDER BY ${searchBy} ${orderBy.toUpperCase()}
  `;

  const result = await pool.query(query, values);
  return result.rows;
};