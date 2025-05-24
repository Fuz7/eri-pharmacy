
import { useState } from "react";
import DropDownInput from "../Inputs/DropDownInput";
import NumberInput from "../Inputs/NumberInput";

export default function EditMedicineModal({setIsEditShown}) {
  const inputClass = `border-grayFont rounded-[10px] border
              w-full min-h-[50px] pl-[20px] text-[20px] `;

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  return (
    <div
      className="fixed w-full min-h-[100vh] modalBackground flex 
    justify-center items-center top-0 left-0 font-poppins"
    >
      <div
        className="w-[600px] h-[700px] bg-white rounded-[30px]
       pb-[30px] py-[50px] flex flex-col items-center px-[30px]"
      >
        <h2
          className="text-darkFont text-[36px] font-semibold
          mb-[45px]
        "
        >
          Edit Medicine
        </h2>

        <div className="flex flex-col gap-[27px] w-full">
          <div className="flex flex-col gap-[10px]">
            <InputName name={"Medicine Name"} />
            <input className={inputClass} type="text" />
          </div>
          <div className="flex flex-col gap-[10px]">
            <InputName name={"Category"} />
            <DropDownInput />
          </div>
          <div className="flex flex-col gap-[10px]">
            <InputName name={"Quantity"} />
            <NumberInput
              value={quantity}
              setValue={setQuantity}
              allowFloat={false}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <InputName name={"Price"} />
            <NumberInput
              value={price}
              setValue={setPrice}
              allowFloat={true}
              className={inputClass}
            />
          </div>
        </div>
        <div className="flex gap-[30px] mt-auto">
          <button
            className="min-h-[60px] w-[255px] text-darkFont
           text-[20px] border border-grayFont rounded-[10px] 
           cursor-pointer"
           onClick={()=>setIsEditShown(false)}
          >
            Cancel
          </button>
          <button
            className="min-h-[60px]  bg-primary text-lightFont
          w-[255px] rounded-[10px] text-[20px] cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function InputName({ name }) {
  return (
    <p
      className="text-[24px] text-darkFont 
            font-medium leading-none"
    >
      {name}
    </p>
  );
}
