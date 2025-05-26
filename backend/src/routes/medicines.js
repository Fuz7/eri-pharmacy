import express from "express";
import {
  getMedicinesByFilter,
  insertMedicine,
  updateMedicine,
} from "../controller/medicines.js";

const medicineRouter = express.Router();

medicineRouter.get("/", getMedicinesByFilter);
medicineRouter.post("/", insertMedicine);
medicineRouter.patch("/:id", updateMedicine);
export default medicineRouter;
