import searchByButton from "@images/searchByButton.svg";
import CategoryModal from "../Modal/CategoryModal";
import { useState } from "react";

export default function SearchByButton({ categoryGroup,searchFilter,setSearchFilter }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="flex gap-[15px]  min-h-full relative">
      <button
        className="flex gap-[15px] text-[24px] font-semibold 
    cursor-pointer min-h-full items-center hover:bg-filterHover 
    hover:text-primary
    px-[10px] rounded-[5px]"
        onClick={() => setIsActive(!isActive)}
      >
        <img className="" src={searchByButton} alt="" />
        Search by
      </button>
      <span className="min-w-[115px] text-[24px] text-grayFont font-semibold flex items-center">
        {searchFilter}
      </span>
      <div
        className={`absolute right-0 
      transition-all z-10
        ${
          isActive
            ? "top-[60px] opacity-100 visible"
            : "top-[50px] opacity-0 invisible"
        }
        `}
      >
        <CategoryModal
          categoryGroup={categoryGroup}
          identifierText={"searchBy"}
          setName={setSearchFilter}
          setIsActive={setIsActive}
        />
      </div>
    </div>
  );
}
