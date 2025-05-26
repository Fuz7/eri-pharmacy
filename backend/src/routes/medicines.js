import express from "express";
import { getMedicinesByFilter } from "../controller/medicines.js";

const medicineRouter = express.Router();

medicineRouter.get("/", getMedicinesByFilter);

export default medicineRouter;
