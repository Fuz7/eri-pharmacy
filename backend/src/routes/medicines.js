import express from "express";
import {
  deleteMedicineById,
  getMedicinesByFilter,
  insertMedicine,
  updateMedicine,
} from "../controller/medicines.js";

const medicineRouter = express.Router();

medicineRouter.get("/", getMedicinesByFilter);
medicineRouter.post("/", insertMedicine);
medicineRouter.patch("/:id", updateMedicine);
medicineRouter.delete("/:id", deleteMedicineById);
export default medicineRouter;
