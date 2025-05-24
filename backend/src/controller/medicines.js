export async function getAllMedicines(req, res) {
  return res.status(200).json({
    data: process.env.POSTGRES_USER,
  });
}
