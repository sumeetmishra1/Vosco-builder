"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Map from "@/components/Map";

export default function Home() {
  const [cityName, setCityName] = useState("");
  const router = useRouter();
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="flex relative items-center  flex-col  gap-1  border-black shadow-mn min-w-full md:min-w-[560px] px-10 pt-10 pb-8 rounded-xl">
        <div className="text-2xl text-gray-800 font-semibold mb-2">
          Find Your Dream Home
        </div>
        <input
          value={cityName}
          onChange={(e) => {
            setCityName(e.target.value);
          }}
          placeholder="City Name"
          className="bg-white border ps-4 border-[#FF914D] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-2.5"
        />
        <button
          type="button"
          onClick={()=>{
            if (cityName.trim()) {
              router.push(`/city/${cityName}`);
            }
          }}
          className={`bg-[#FF914D] mt-2  border-[1px] px-4 py-1 rounded-md poppins-light text-sm text-white  hover:text-white `}
        >
          Search
        </button>
        {/* <Map/> */}
      </div>
    </div>
  );
}
