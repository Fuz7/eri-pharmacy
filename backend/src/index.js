import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Routes from "./routes/index.js";
import { createMedicinesTableIfNotExists, seedMedicines } from "./model/medicines.js";
const app = express();

createMedicinesTableIfNotExists()
app.get("/", (req, res) => res.send("Hello, world!"));
Routes(app);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});
