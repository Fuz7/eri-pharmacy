import searchByButton from "@images/searchByButton.svg";
import CategoryModal from "../Modal/CategoryModal";

export default function SearchByButton({ categoryGroup }) {
  return (
    <div className="flex gap-[15px]  min-h-full relative">
      <button
        className="flex gap-[15px] text-[24px] font-semibold 
    cursor-pointer min-h-full items-center hover:bg-filterHover 
    hover:text-primary
    px-[10px] rounded-[5px]"
      >
        <img className="" src={searchByButton} alt="" />
        Search by
      </button>
      <span className="text-[24px] text-grayFont font-semibold flex items-center">
        Name
      </span>
      <div className="absolute right-0 top-[60px]">
        <CategoryModal
          categoryGroup={categoryGroup}
          identifierText={"searchBy"}
        />
      </div>
    </div>
  );
}
