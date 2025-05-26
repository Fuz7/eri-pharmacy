import SearchBar from "./SearchBar";
import SearchByButton from "./SearchByButton";
import defaultNameIcon from "@images/defaultNameIcon.svg";
import hoveredNameIcon from "@images/hoveredNameIcon.svg";
import defaultCategory from "@images/defaultCategory.svg";
import hoveredCategory from "@images/hoveredCategory.svg";
import defaultQuantity from "@images/defaultQuantity.svg";
import hoveredQuantity from "@images/hoveredQuantity.svg";
import defaultPrice from "@images/defaultPrice.svg";
import hoveredPrice from "@images/hoveredPrice.svg";
import SortByButton from "./SortByButton";
import AddMedicineButton from "./AddMedicineButton";
export default function Header({
  productFilters,
  isFetchingData,
  setIsFetchingData,
}) {
  const { searchQuery, setSearchQuery, searchFilter, setSearchFilter } =
    productFilters;

  const categoryGroup = [
    {
      title: "Name",
      imgLink: defaultNameIcon,
      hoveredImgLink: hoveredNameIcon,
    },
    {
      title: "Category",
      imgLink: defaultCategory,
      hoveredImgLink: hoveredCategory,
    },
    {
      title: "Price",
      imgLink: defaultPrice,
      hoveredImgLink: hoveredPrice,
    },
    {
      title: "Quantity",
      imgLink: defaultQuantity,
      hoveredImgLink: hoveredQuantity,
    },
  ];

  return (
    <header className="flex justify-between flex-wrap gap-[10px]">
      <div className="flex gap-[50px] items-end">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFetchingData={isFetchingData}
          setIsFetchingData={setIsFetchingData}
        />
        <div className="flex gap-[30px] items-center h-full">
          <SearchByButton
            categoryGroup={categoryGroup}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
          />
          <div className="w-[3px] min-h-[35px] bg-grayFont"></div>
          <SortByButton
            categoryGroup={categoryGroup}
            productFilters={productFilters}
          />
        </div>
      </div>
      <AddMedicineButton setIsFetchingData={setIsFetchingData} />
    </header>
  );
}
