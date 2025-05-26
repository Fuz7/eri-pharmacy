import defaultEditButton from "@images/defaultEditButton.svg";
import hoveredEditButton from "@images/hoveredEditButton.svg";
import { useState } from "react";
import { createPortal } from "react-dom";
import DeleteMedecineModal from "../Modal/DeleteMedicineModal";
import EditMedicineModal from "../Modal/EditMedicineModal";

export default function MoreButton({
  index,
  moreIndexModal,
  setMoreIndexModal,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteShown, setIsDeleteShown] = useState(false);
  const [isEditShown, setIsEditShown] = useState(false);
  return (
    <>
      <div className="relative">
        <button
          onClick={() => {
            if (moreIndexModal === index) {
              setMoreIndexModal(null);
            } else {
              setMoreIndexModal(index);
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
          moreIndexModal === index
            ? "left-0 opacity-100 visible"
            : "-left-2 opacity-0 invisible"
        }
       w-[221px] min-h-[100px] bg-white rounded-[10px] 
       border border-grayFont px-[5px] py-[10px]
       flex flex-col gap-[10px]`}
        >
          <EditButton setIsEditShown={setIsEditShown} setMoreIndexModal={setMoreIndexModal} />
          <DeleteButton setIsDeleteShown={setIsDeleteShown} setMoreIndexModal={setMoreIndexModal} />
        </span>
      </div>

      {isDeleteShown &&
        createPortal(
          <DeleteMedecineModal
            setMoreIndexModal={setMoreIndexModal}
            setIsDeleteShown={setIsDeleteShown}
          />,
          document.body
        )}
      {isEditShown &&
        createPortal(
          <EditMedicineModal
            setMoreIndexModal={setMoreIndexModal}
            setIsEditShown={setIsEditShown}
          />,
          document.body
        )}
    </>
  );
}

function DeleteButton({ setIsDeleteShown, setMoreIndexModal }) {
  return (
    <button
      className={`w-full h-[34px] text-[24px] text-left px-[8px]
          hover:bg-[#FFE6E6] hover:text-deleteButton
           flex items-center rounded-[10px]
          cursor-pointer `}
      onClick={() => {
        setIsDeleteShown(true);
        setMoreIndexModal(null);
      }}
    >
      Delete
    </button>
  );
}

function EditButton({ setIsEditShown, setMoreIndexModal }) {
  return (
    <button
      className={`w-full h-[34px] text-[24px] text-left px-[8px] 
          hover:bg-filterHover hover:text-primary flex items-center
           rounded-[10px]
          cursor-pointer`}
      onClick={() => {
        setIsEditShown(true);
        setMoreIndexModal(null);
      }}
    >
      Edit
    </button>
  );
}
