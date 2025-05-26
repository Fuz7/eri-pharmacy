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

  const fetchMedicines = async () => {
    const { data } = await axios.get("/api/medicines", {
      params: {
        searchQuery,
        searchBy: searchFilter,
        sortBy: sortFilter,
        orderDirection: orderFilter,
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
