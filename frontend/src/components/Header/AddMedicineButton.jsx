import addMedicine from "@images/addMedicine.svg";
import { useState } from "react";
import { createPortal } from "react-dom";
import AddMedicineModal from "../Modal/AddMedicineModal";

export default function AddMedicineButton() {
  const [isShown, setIsShown] = useState(false);

  return (
    <>
      <button
        className="min-h-[74px] w-[320px] bg-primary 
      hover:bg-buttonHover px-[30px] flex items-center rounded-[10px]
      cursor-pointer gap-[20px] text-lightFont font-semibold 
      text-[26px]"
        onClick={() => {
          setIsShown(true);
        }}
      >
        <img className="" src={addMedicine} alt="" />
        Add Medicine
      </button>
      {isShown &&
        createPortal(
          <AddMedicineModal setIsShown={setIsShown} />,
          document.body
        )}
    </>
  );
}
