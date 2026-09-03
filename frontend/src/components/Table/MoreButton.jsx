import defaultEditButton from "@images/defaultEditButton.svg";
import hoveredEditButton from "@images/hoveredEditButton.svg";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DeleteMedecineModal from "../Modal/DeleteMedicineModal";
import EditMedicineModal from "../Modal/EditMedicineModal";

const MENU_WIDTH = 221;

export default function MoreButton({
  id,
  openMenuId,
  setOpenMenuId,
  setIsFetchingData,
  data,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteShown, setIsDeleteShown] = useState(false);
  const [isEditShown, setIsEditShown] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const buttonRef = useRef(null);
  const isOpen = openMenuId === id;

  // The table body scrolls, so an absolutely positioned menu gets clipped on
  // the last rows. Portal it to <body> and track the trigger instead.
  useLayoutEffect(() => {
    if (!isOpen) return;

    const place = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuPosition({ top: rect.bottom + 4, left: rect.right - MENU_WIDTH });
    };

    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Actions for ${data.name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setOpenMenuId(isOpen ? null : id)}
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

      {isOpen &&
        menuPosition &&
        createPortal(
          <div
            role="menu"
            style={{ top: menuPosition.top, left: menuPosition.left }}
            className="fixed z-[40] w-[221px] min-h-[100px] bg-white
              rounded-[10px] border border-grayFont px-[5px] py-[10px]
              flex flex-col gap-[10px]"
          >
            <EditButton
              setIsEditShown={setIsEditShown}
              setOpenMenuId={setOpenMenuId}
            />
            <DeleteButton
              setIsDeleteShown={setIsDeleteShown}
              setOpenMenuId={setOpenMenuId}
            />
          </div>,
          document.body
        )}

      {isDeleteShown &&
        createPortal(
          <DeleteMedecineModal
            id={data.id}
            setMoreIndexModal={setOpenMenuId}
            setIsFetchingData={setIsFetchingData}
            setIsDeleteShown={setIsDeleteShown}
          />,
          document.body
        )}
      {isEditShown &&
        createPortal(
          <EditMedicineModal
            setMoreIndexModal={setOpenMenuId}
            setIsEditShown={setIsEditShown}
            setIsFetchingData={setIsFetchingData}
            data={data}
          />,
          document.body
        )}
    </>
  );
}

function DeleteButton({ setIsDeleteShown, setOpenMenuId }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={`w-full h-[34px] text-[24px] text-left px-[8px]
          hover:bg-[#FFE6E6] hover:text-deleteButton
           flex items-center rounded-[10px]
          cursor-pointer `}
      onClick={() => {
        setIsDeleteShown(true);
        setOpenMenuId(null);
      }}
    >
      Delete
    </button>
  );
}

function EditButton({ setIsEditShown, setOpenMenuId }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={`w-full h-[34px] text-[24px] text-left px-[8px] 
          hover:bg-filterHover hover:text-primary flex items-center
           rounded-[10px]
          cursor-pointer`}
      onClick={() => {
        setIsEditShown(true);
        setOpenMenuId(null);
      }}
    >
      Edit
    </button>
  );
}
