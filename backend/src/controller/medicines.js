import {  searchMedicines} from "../model/medicines.js";

export async function getMedicinesByFilter(req, res) {
  console.log("called");
  const { searchQuery, searchBy, sortBy, orderDirection } = req.query;

  const result = await searchMedicines(
    searchQuery,
    searchBy,
    sortBy,
    orderDirection
  );
  console.log(result)
  return res.status(200).json({
    data: result,
  });
}
