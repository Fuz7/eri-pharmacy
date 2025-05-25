import { getAllMedicinesOrderedByNameDesc } from "../model/medicines.js";

export async function getAllMedicines(req, res) {
  const result = await getAllMedicinesOrderedByNameDesc();
  return res.status(200).json({
    data: result,
  });
}
