import { useState } from "react";

export default function CategoryModal({ categoryGroup, identifierText }) {
  return (
    <div
      className="w-[370px] h-[390px] bg-white rounded-[20px] 
    border border-grayFont py-[20px] px-[40px]
    flex flex-col gap-[20px]"
    >
      <h1 className="text-[24px] font-semibold font-poppins">Search by</h1>
      <div className="grid grid-cols-2 grid-rows-2 gap-[20px]">
        {categoryGroup.map((item) => (
          <CategoryItem key={{ identifierText } + item.name} {...item} />
        ))}
      </div>
    </div>
  );
}

function CategoryItem({ title, imgLink, hoveredImgLink }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      className={`${isHovered?'bg-filterHover' :'bg-[#F7F7F7]'} min-h-[130px] aspect-square 
        rounded-[10px] flex flex-col gap-[10px] pt-[32px] items-center
        cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        className="w-[50px]"
        src={isHovered ? hoveredImgLink : imgLink}
        alt=""
      />
      <p
        className={`text-[20px] text-grayFont ${
          isHovered ? "text-primary" : "text-grayFont"
        }`}
      >
        {title}
      </p>
    </button>
  );
}
