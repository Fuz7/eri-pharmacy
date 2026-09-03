import { useState } from "react";
import MoreButton from "./MoreButton";
import useTable from "../../hooks/Table/useTable";

const LOW_STOCK_THRESHOLD = 20;
const ROW_TARGET = 5;

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Table({
  isFetchingData,
  setIsFetchingData,
  productFilters,
  productFilterRefs,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const { data, isPending, isError } = useTable(
    isFetchingData,
    setIsFetchingData,
    productFilters,
    productFilterRefs
  );

  const medicines = data ?? [];
  const stateRow = isPending
    ? "Loading medicines…"
    : isError
    ? "Could not load medicines. Please try again."
    : medicines.length === 0
    ? "No medicines match this search."
    : null;

  const fillerCount = Math.max(
    0,
    ROW_TARGET - medicines.length - (stateRow ? 1 : 0)
  );

  return (
    <div className="w-full mt-[30px] rounded-t-[10px] overflow-hidden">
      <div className="h-[500px] overflow-auto">
        <table className="table-fixed w-full min-w-[720px] bg-white border-collapse">
          <caption className="sr-only">
            Medicines in inventory with category, price, quantity and row actions
          </caption>
          <TableHead />
          <tbody>
            {stateRow && (
              <tr className="h-[84px]">
                <td
                  colSpan={6}
                  className="text-center text-grayFont text-[20px] font-medium"
                >
                  {stateRow}
                </td>
              </tr>
            )}

            {medicines.map((medicine, i) => (
              <tr
                key={medicine.id}
                className="even:bg-evenTable h-[84px] font-medium
                  text-[clamp(16px,1.7vw,28px)]"
              >
                <td className="text-center text-grayFont font-semibold">
                  {i + 1}
                </td>
                <td
                  className="text-left px-[8px] truncate"
                  title={medicine.name}
                >
                  {medicine.name}
                </td>
                <td
                  className="text-center px-[8px] truncate"
                  title={medicine.category}
                >
                  {medicine.category}
                </td>
                <td className="text-right px-[16px] tabular-nums">
                  {priceFormatter.format(Number(medicine.price))}
                </td>
                <td className="text-right px-[16px] tabular-nums">
                  <QuantityCell quantity={medicine.quantity} />
                </td>
                <td className="relative h-full z-[2]">
                  <MoreButton
                    id={medicine.id}
                    data={medicine}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    setIsFetchingData={setIsFetchingData}
                  />
                </td>
              </tr>
            ))}

            {Array.from({ length: fillerCount }, (_, i) => (
              <tr
                key={`filler-${i}`}
                aria-hidden="true"
                className="even:bg-evenTable h-[84px]"
              >
                <td colSpan={6}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QuantityCell({ quantity }) {
  const isOut = quantity === 0;
  const isLow = quantity > 0 && quantity <= LOW_STOCK_THRESHOLD;

  if (!isOut && !isLow) return quantity;

  return (
    <span
      className={`inline-flex items-center gap-[6px] rounded-full
        px-[12px] py-[2px] text-[0.75em] font-semibold ${
          isOut
            ? "bg-[#FFE6E6] text-deleteButton"
            : "bg-[#FFF4E5] text-[#B25E00]"
        }`}
    >
      {quantity}
      <span>{isOut ? "out" : "low"}</span>
    </span>
  );
}

function TableHead() {
  return (
    <thead className="sticky top-0 h-[80px] bg-primary z-[3]">
      <tr className="text-white text-[clamp(16px,1.7vw,28px)]">
        <th scope="col" className="w-[70px]">
          <span className="sr-only">Row number</span>
        </th>
        <th
          scope="col"
          className="w-[calc((100%-140px)*0.4)] font-semibold text-left px-[8px]"
        >
          Name
        </th>
        <th
          scope="col"
          className="w-[calc((100%-140px)*0.3)] font-semibold text-center px-[8px]"
        >
          Category
        </th>
        <th
          scope="col"
          className="w-[calc((100%-140px)*0.15)] font-semibold text-right px-[16px]"
        >
          Price
        </th>
        <th
          scope="col"
          className="w-[calc((100%-140px)*0.15)] font-semibold text-right px-[16px]"
        >
          Quantity
        </th>
        <th scope="col" className="w-[70px]">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
}
