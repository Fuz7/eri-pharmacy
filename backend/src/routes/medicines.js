import express from "express";
import { getAllMedicines } from "../controller/medicines.js";

const medicineRouter = express.Router();

medicineRouter.get("/", getAllMedicines);

export default medicineRouter;
