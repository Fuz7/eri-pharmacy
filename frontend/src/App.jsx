import { useState } from "react";
import "./App.css";
import Background from "./components/Background";
import Header from "./components/Header/Header";
import Table from "./components/Table/Table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";
function App() {
  const queryClient = new QueryClient();
  const [isFetchingData, setIsFetchingData] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("Name");
  const [sortFilter, setSortFilter] = useState("Name");
  const [orderFilter, setOrderFilter] = useState("DESC");
  const searchQueryRef = useRef("")
  const searchFilterRef = useRef("Name")
  const sortFilterRef = useRef("Name")
  const orderFilterRef = useRef("DESC")
  




  const productFilters = {
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    sortFilter,
    setSortFilter,
    orderFilter,
    setOrderFilter,
  };

  const productFilterRefs = {
    searchQueryRef,
    searchFilterRef,
    sortFilterRef,
    orderFilterRef
  };
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="w-[100%] min-h-[100vh] h-[100vh] relative py-[50px] px-[90px] 
    font-poppins"
      >
        <main className=" w-full min-h-full glassy px-[65px] py-[50px]">
          <h1 className="font-poppins font-bold text-primary text-[50px] leading-none mb-[40px]">
            Eri Pharmacy
          </h1>
          <Header
            productFilters={productFilters}
            isFetchingData={isFetchingData}
            setIsFetchingData={setIsFetchingData}
            productFilterRefs={productFilterRefs}
          />
          <Table
            isFetchingData={isFetchingData}
            setIsFetchingData={setIsFetchingData}
            productFilters={productFilters}
            productFilterRefs={productFilterRefs}
          />
        </main>
        <Background />
      </div>
    </QueryClientProvider>
  );
}

export default App;
