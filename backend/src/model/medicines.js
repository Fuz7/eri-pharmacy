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

// export const getAllMedicinesOrderedByNameDesc = async () => {
//   try {
//     const result = await db.query(`
//       SELECT * FROM medicines
//       ORDER BY name DESC;
//     `);
//     return result.rows;
//   } catch (err) {
//     console.error("error cant get all the medicines");
//   }
// };
export const insertMedicineDB = async (name, category, price, quantity) => {
  const query = `
    INSERT INTO medicines (name, category, price, quantity)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [name, category, price, quantity];
  const result = await db.query(query, values);
  return result.rows[0]; // return the inserted row
};

export const updateMedicineDB = async (id, name, category, price, quantity) => {
  const query = `
    UPDATE medicines
    SET name = $1, category = $2, price = $3, quantity = $4
    WHERE id = $5;
  `;

  const values = [name, category, price, quantity, id];

  await db.query(query, values);
  return true; // returns the updated row
};

export const deleteMedicineByIdDB = async (id) => {
  const query = `
    DELETE FROM medicines
    WHERE id = $1
    RETURNING *;
  `;

  const result = await db.query(query, [id]);
  return true; // returns the deleted row, or undefined if not found
};

export const searchMedicines = async (
  searchQuery = "",
  searchBy = null,
  sortBy = "name",
  orderDirection = "ASC"
) => {
  const validColumns = ["name", "category", "price", "quantity"];
  const validDirections = ["ASC", "DESC"];
  
  // Validate sort column
  if (!validColumns.includes(sortBy.toLowerCase())) {
    throw new Error(`Invalid sortBy: ${sortBy}`);
  }

  // Validate sort direction
  const dir = orderDirection.toUpperCase();
  if (!validDirections.includes(dir)) {
    throw new Error(`Invalid orderDirection: ${orderDirection}`);
  }

  // Prepare filtering if requested
  let filterClause = "";
  const values = [];

  if (
    searchBy &&
    validColumns.includes(searchBy.toLowerCase()) &&
    searchQuery.trim() !== ""
  ) {
    if (["quantity", "price"].includes(searchBy.toLowerCase())) {
      // Numeric filter — use WHERE with = operator
      values.push(searchQuery.trim()); // no casting
      filterClause = `WHERE ${searchBy} = $1`;
    } else {
      // Text filter — use ILIKE for case-insensitive search
      values.push(`%${searchQuery.trim()}%`);
      filterClause = `WHERE ${searchBy} ILIKE $1`;
    }
  }

  // Build final SQL query
  const query = `
    SELECT *
    FROM medicines
    ${filterClause}
    ORDER BY ${sortBy} ${dir};
  `;

  const result = await db.query(query, values);
  return result.rows;
};