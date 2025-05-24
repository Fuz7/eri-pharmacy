import { useState } from "react";
import EditButton from "./EditButton";

export default function Table() {
  const [editIndexModal, setEditIndexModal] = useState(null);

  return (
    <div
      className="w-full h-[500px] overflow-clip rounded-t-[10px]
    mt-[30px]"
    >
      <div className="overflow-auto h-full  ">
        <table
          className="table-fixed w-full min-h-[500px] 
    bg-white border-collapse "
        >
          <TableHead />
          <tbody className="">
            {Array.from({ length: 7 }, (_, i) => (
              <tr
                className="even:bg-evenTable w-full text-[28px] h-[84px]
            font-medium"
                key={i}
              >
                <td className="text-grayFont font-semibold">{i + 1}</td>
                <td>Paracetamol</td>
                <td>Capsule</td>
                <td>10</td>
                <td>$20.00</td>
                <td
                  className=" relative
                h-full z-[2]"
                >
                  <EditButton
                  index={i}
                    editIndexModal={editIndexModal}
                    setEditIndexModal={setEditIndexModal}
                  />
                </td>
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
        <th className="w-[calc((100%-200px)*0.15)] font-semibold">Quantity</th>
        <th className="w-[calc((100%-200px)*0.15)] font-semibold">Price</th>
        <th className="w-[100px] font-semibold"></th>
      </tr>
    </thead>
  );
}
