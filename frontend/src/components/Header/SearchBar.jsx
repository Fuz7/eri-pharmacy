import searchBarIcon from "@images/searchBarIcon.svg";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  isFetchingData,
  setIsFetchingData,
  productFilters,
  productFilterRefs,
}) {
  const {
    searchQueryRef,
    searchFilterRef,
    sortFilterRef,
    orderFilterRef
  } = productFilterRefs;
  const {
    searchFilter,
    sortFilter,
    orderFilter
  } = productFilters;
  return (
    <div className="relative">
      <input
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && isFetchingData === false) {
            setIsFetchingData(true);
            searchQueryRef.current = searchQuery
            searchFilterRef.current = searchFilter
            sortFilterRef.current = sortFilter
            orderFilterRef.current = orderFilter
          }
        }}
        value={searchQuery}
        className="w-[450px] min-h-[54px] border-[#959595] border
    rounded-[10px] pl-[50px] text-[24px]"
        placeholder="Search Products"
      ></input>
      <img
        className="absolute left-[20px] top-1/2 -translate-y-1/2"
        src={searchBarIcon}
        alt=""
      />
    </div>
  );
}
