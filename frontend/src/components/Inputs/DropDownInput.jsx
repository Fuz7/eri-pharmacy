import toggleButton from "@images/toggleButton.svg";
import { useState } from "react";

export default function DropDownInput({ category, setCategory }) {
  const [isActive, setIsActive] = useState(false);

  const medicineCategoryList = [
    "Antibiotic",
    "Anti-inflammatory",
    "Antihistamine",
    "Antacid",
    "Antidepressant",
    "Pain Reliever",
  ];

  return (
    <div className="relative">
      <button
        className={`${
          isActive ? "border-primary " : "border-grayFont"
        } rounded-[10px] border 
    w-full min-h-[54px] px-[20px] flex items-center relative 
    text-[20px] justify-between cursor-pointer`}
        onClick={() => setIsActive(!isActive)}
      >
        {category}
        <img
          className={`w-[22px] mt-[4px] transition-all ${
            isActive && "rotate-180"
          }`}
          src={toggleButton}
          alt=""
        />
      </button>

      <span
        className={`w-full bg-white p-[10px] absolute 
      top-0 rounded-[10px] border  transition-all
      border-grayFont text-darkFont 
      ${
        isActive
          ? "left-[calc(100%+40px)] opacity-100 visible"
          : "left-[calc(100%+35px)] opacity-0 invisible"
      }
      `}
      >
        <div className="flex flex-col gap-[10px] w-full">
          {/* Add Mo Og Capsule Diri */}
          {medicineCategoryList.map((name, index) => {
            return (
              <DropDownItem
                key={name + index}
                setIsActive={setIsActive}
                setCategory={setCategory}
                name={ name }
              />
            );
          })}
        </div>
      </span>
    </div>
  );
}

function DropDownItem({ name, setCategory, setIsActive }) {
  return (
    <button
      onClick={() => {
        setCategory(name);
        setIsActive(false);
      }}
      className="w-full flex items-center pl-[10px]
          py-[8px]  text-[20px] cursor-pointer leading-none
          hover:bg-filterHover hover:text-primary
          rounded-[10px]"
    >
      {name}
    </button>
  );
}
