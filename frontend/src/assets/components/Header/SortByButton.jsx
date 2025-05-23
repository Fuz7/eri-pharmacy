
import sortByButton from "@images/sortByButton.svg";
import CategoryModal from "../Modal/CategoryModal";

export default function SortByButton({ categoryGroup }) {

  return (
    <div className="flex gap-[15px]  min-h-full relative">
      <button
        className="flex gap-[15px] text-[24px] font-semibold 
    cursor-pointer min-h-full items-center hover:bg-filterHover 
    hover:text-primary
    px-[10px] rounded-[5px]"
      >
        <img className="" src={sortByButton} alt="" />
        Sort by
      </button>
      <span className="text-[24px] text-grayFont font-semibold flex items-center">
        Name
      </span>
      <div className="absolute left-0 top-[60px]">
        <CategoryModal
          categoryGroup={categoryGroup}
          identifierText={"searchBy"}
        />
      </div>
    </div>
  );
}
