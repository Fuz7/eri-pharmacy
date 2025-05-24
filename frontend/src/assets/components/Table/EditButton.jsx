import defaultEditButton from "@images/defaultEditButton.svg";
import hoveredEditButton from "@images/hoveredEditButton.svg";
import { useState } from "react";

export default function EditButton({
  index,
  editIndexModal,
  setEditIndexModal,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (editIndexModal === index) {
            setEditIndexModal(null);
          } else {
            setEditIndexModal(index);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="mt-[8px] cursor-pointer"
      >
        <img
          className="w-[10px]"
          src={isHovered ? hoveredEditButton : defaultEditButton}
          alt=""
        />
      </button>
      <span
        className={`absolute -translate-x-full top-0
          transition-all flex flex-col
        ${
          editIndexModal === index
            ? "left-0 opacity-100 visible"
            : "-left-2 opacity-0 invisible"
        }
       w-[221px] min-h-[100px] bg-white rounded-[10px] 
       border border-grayFont px-[5px] py-[10px]
       flex flex-col gap-[10px]`}
      >
        <button
          className={`w-full h-[34px] text-[24px] text-left px-[8px] 
          hover:bg-filterHover hover:text-primary flex items-center
           rounded-[10px]
          cursor-pointer`}
        >
          Edit
        </button>
        <button
          className={`w-full h-[34px] text-[24px] text-left px-[8px]
          hover:bg-[#FFE6E6] hover:text-deleteButton
           flex items-center rounded-[10px]
          cursor-pointer `}
        >
          Delete
        </button>
      </span>
    </div>
  );
}
