import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
export default function useTable(
  isFetchingData,
  setIsFetchingData,
  productFilters
) {
  const queryClient = useQueryClient();
  const { searchQuery, searchFilter, sortFilter, orderFilter } = productFilters;
  const fetchMedicines = async (
    searchQuery,
    searchBy,
    sortBy,
    orderDirection
  ) => {
    const { data } = await axios.get("/api/medicines", {
      params: {
        searchQuery,
        searchBy,
        sortBy,
        orderDirection,
      },
    });
    console.log(data);
    return data;
  };
  const { data } = useQuery({
    queryKey: ["medicines",isFetchingData],
    queryFn: () =>
      fetchMedicines(searchQuery, searchFilter, sortFilter, orderFilter),
    enabled: !!isFetchingData,
  });

  useEffect(() => {
    if (isFetchingData) {
      const fetchTableData = async () => {
 
        setIsFetchingData(false);
      };
      fetchTableData();
    }
  }, [isFetchingData, setIsFetchingData, queryClient]);
  return { data };
}
