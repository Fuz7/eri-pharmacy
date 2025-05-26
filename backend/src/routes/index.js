import express from "express";
import medicineRouter from "./medicines.js";

export default (app) => {
  const router = express.Router();

  router.use("/medicines", medicineRouter);
  app.use("/api", router);
};
