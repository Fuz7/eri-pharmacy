import {insertMedicineDB, searchMedicines, updateMedicineDB} from "../model/medicines.js";

export async function getMedicinesByFilter(req, res) {
  const { searchQuery, searchBy, sortBy, orderDirection } = req.query;

  const result = await searchMedicines(
    searchQuery,
    searchBy,
    sortBy,
    orderDirection
  );
  return res.status(200).json({
    data: result,
  });
}

export async function insertMedicine(req,res){
  console.log(req.body)
  const{name,category,price,quantity} = req.body
  const result = await insertMedicineDB(name,category,price,quantity)
  return res.status(200).json(result)
}
export async function updateMedicine(req,res){
  const {id} = req.params
  console.log("sad")
  const{name,category,price,quantity} = req.body
  const result = await updateMedicineDB(id,name,category,price,quantity)
  return res.status(200).json(result)
}