import { useEffect, useState } from "react";
import MoreButton from "./MoreButton";
import useTable from "../../hooks/Table/useTable";

export default function Table({
  isFetchingData,
  setIsFetchingData,
  productFilters,
}) {
  const [moreIndexModal, setMoreIndexModal] = useState(null);
  const { data } = useTable(isFetchingData, setIsFetchingData, productFilters);
   return (
    <div
      className="w-full h-[500px] overflow-clip rounded-t-[10px]
    mt-[30px]"
    >
      <div className="overflow-auto h-full  ">
        <table
          className="table-fixed w-full min-h-[500px] 
    bg-white border-collapse  "
        >
          <TableHead />
          <tbody className="">

            {data?.map((data,i)=>
            {
              return (
              <tr
                className="even:bg-evenTable w-full text-[28px] h-[84px]
            font-medium"
                key={ data.id+"" +i + data.name +data.price}
              >
                <td className="text-grayFont font-semibold">{i + 1}</td>
                <td>{data.name}</td>
                <td>{data.category}</td>
                <td>${data.price}</td>
                <td>{data.quantity}</td>
                <td
                  className=" relative
                h-full z-[2]"
                >
                  <MoreButton
                    index={i}
                    data={data}
                    moreIndexModal={moreIndexModal}
                    setIsFetchingData={setIsFetchingData}
                    setMoreIndexModal={setMoreIndexModal}
                  />
                </td>
              </tr>

            )})}
            {Array.from({length:(5 - data?.length)},(_,i)=>(
              <tr
                className="even:bg-evenTable w-full text-[28px] h-[84px]
            font-medium"
                key={i}
              >
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableHead() {
  return (
    <thead
      className="sticky top-0 h-[80px] bg-primary
           rounded-t-[10px] z-[3] "
    >
      <tr className="text-[28px] text-white ">
        <th className="w-[100px]"></th>
        <th className="w-[calc((100%-200px)*0.4)] font-semibold">Name</th>
        <th className="w-[calc((100%-200px)*0.3)] font-semibold">Category</th>
        <th className="w-[calc((100%-200px)*0.15)] font-semibold">Price</th>
        <th className="w-[calc((100%-200px)*0.15)] font-semibold">Quantity</th>
        <th className="w-[100px] font-semibold"></th>
      </tr>
    </thead>
  );
}
