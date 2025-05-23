import sortByButton from "@images/sortByButton.svg";
import CategoryModal from "../Modal/CategoryModal";
import defaultDescendingButton from "@images/defaultDescendingButton.svg";
import defaultAscendingButton from "@images/defaultAscendingButton.svg";
import focusedDescendingButton from "@images/focusedDescendingButton.svg";
  import focusedAscendingButton from "@images/focusedAscendingButton.svg";
import { useState } from "react";

export default function SortByButton({ categoryGroup, productFilters }) {
  const [isActive, setIsActive] = useState(false);
  const { sortFilter, setSortFilter, orderFilter, setOrderFilter } =
    productFilters;
  return (
    <div className="flex gap-[5px]  min-h-full relative">
      <button
        className="flex gap-[15px] text-[24px] font-semibold 
    cursor-pointer min-h-full items-center hover:bg-filterHover 
    hover:text-primary
    px-[10px] rounded-[5px]"
        onClick={() => setIsActive(!isActive)}
      >
        <img className="" src={sortByButton} alt="" />
        Sort by
      </button>
      <span
        className=" text-[24px] ml-[10px]
       text-grayFont font-semibold flex items-center"
      >
        {sortFilter}
      </span>
      <button
        onClick={() =>
          orderFilter === "descending"
            ? setOrderFilter("ascending")
            : setOrderFilter("descending")
        }
        className="flex gap-[6px] cursor-pointer
       hover:bg-filterHover justify-center w-[60px]
      rounded-[10px]"
      >
        <img
          className="w-[18px]"
          src={
            orderFilter === "descending"
              ? focusedDescendingButton
              : defaultDescendingButton
          }
          alt=""
        />
        <img
          className="w-[18px]"
          src={
            orderFilter === "ascending"
              ? focusedAscendingButton
              : defaultAscendingButton
          }
          alt=""
        />
      </button>
      <div
        className={`absolute left-0 
      transition-all
        ${
          isActive
            ? "top-[60px] opacity-100 visible"
            : "top-[50px] opacity-0 invisible"
        }
      
        `}
      >
        <CategoryModal
          categoryGroup={categoryGroup}
          identifierText={"sortBy"}
          setName={setSortFilter}
          setIsActive={setIsActive}
        />
      </div>
    </div>
  );
}
