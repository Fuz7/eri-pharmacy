import { useState } from "react";
import "./App.css";
import Background from "./assets/components/Background";
import Header from "./assets/components/Header/Header";

function App() {
  const [searchFilter, setSearchFilter] = useState("Name");
  const [sortFilter, setSortFilter] = useState("Name");
  const [orderFilter,setOrderFilter] = useState("descending")
  const productFilters = {
    searchFilter,
    setSearchFilter,
    sortFilter,
    setSortFilter,
    orderFilter,
    setOrderFilter
  };
  return (
    <div
      className="w-[100%] min-h-[100vh] h-[100vh] relative py-[50px] px-[90px] 
    font-poppins"
    >
      <main className=" w-full min-h-full glassy px-[65px] py-[50px]">
        <h1 className="font-poppins font-bold text-primary text-[50px] leading-none mb-[40px]">
          Eri Pharmacy
        </h1>
        <Header productFilters={productFilters} />
      </main>
      <Background />
    </div>
  );
}

export default App;
