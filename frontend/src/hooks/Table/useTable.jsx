import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
export default function useTable(
  isFetchingData,
  setIsFetchingData,
  productFilters,
  productFilterRefs
) {
  const queryClient = useQueryClient();
  const { searchQuery, searchFilter, sortFilter, orderFilter } = productFilters;
  const { searchQueryRef, searchFilterRef, sortFilterRef, orderFilterRef } = productFilterRefs;

  const fetchMedicines = async () => {
    const { data } = await axios.get("/api/medicines", {
      params: {
        searchQuery:searchQueryRef.current,
        searchBy: searchFilterRef.current,
        sortBy: sortFilterRef.current,
        orderDirection: orderFilterRef.current,
      },
    });
    return data;
  };
  const { data } = useQuery({
    queryKey: ["medicines",isFetchingData],
    queryFn: fetchMedicines,
    enabled: true,
  });

  useEffect(() => {
    if (isFetchingData) {
      const fetchTableData = async () => {
        setIsFetchingData(false);
        queryClient.invalidateQueries(["medicines"]);
      };
      fetchTableData();
    } 
  }, [isFetchingData, setIsFetchingData, queryClient]);
  return { data: data?.data };
}
