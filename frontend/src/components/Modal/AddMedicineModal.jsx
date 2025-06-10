import { useEffect, useState } from "react";
import DropDownInput from "../Inputs/DropDownInput";
import NumberInput from "../Inputs/NumberInput";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function AddMedicineModal({ setIsShown,setIsFetchingData }) {
  const inputClass = `border-grayFont rounded-[10px] border
              w-full min-h-[50px] pl-[20px] text-[20px] `;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Antibiotic");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [isInserting, setIsInserting] = useState();
  const [isError, setIsError] = useState(false);
  const addMedicine = async () => {
    const { data } = await axios.post("/api/medicines", {
      name:  name,
      category,
      quantity,
      price,
    });
    return data;
  };

  const mutation = useMutation({
    mutationFn: addMedicine,
    onSettled: () => {
      console.log("settled");
      setIsInserting(false);
      setIsShown(false)
      setIsFetchingData(true)
    },
  });

  useEffect(() => {
    setIsError(false);
  }, [name, category, quantity, price]);


  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      category.trim() !== "" &&
      quantity.trim() !== "" &&
      price.trim() !== ""
    );
  };

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
          Add New Medicine
        </h2>

        <div className="flex flex-col gap-[27px] w-full">
          <div className="flex flex-col gap-[10px]">
            <InputName name={"Medicine Name"} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              type="text"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <InputName name={"Category"} />
            <DropDownInput category={category} setCategory={setCategory} />
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
            onClick={() => setIsShown(false)}
          >
            Cancel
          </button>
          <button
            disabled={isInserting}
            onClick={() => {
              if (!isFormValid()) {
                setIsError(true);
                return;
              }
              setIsInserting(true);
              mutation.mutate()
            }}
            className={`min-h-[60px]

                ${
                  isInserting
                    ? "bg-buttonHover"
                    : isError
                    ? "bg-deleteButtonHover"
                    : "bg-primary"
                }
                 text-lightFont
          w-[255px] rounded-[10px] text-[20px] cursor-pointer`}
          >
            Add Medicine
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
