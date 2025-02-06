"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { SyncLoader } from "react-spinners";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function CityProjects() {
  const { cityName } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityName) return;

    const fetchData = async () => {
      try {
        console.log(`Fetching projects for ${cityName}...`);

        // ✅ Fetch from our Next.js API (bypassing CORS)
        const { data } = await axios.get(`/api/scrape?city=${cityName}`);
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [cityName]);

  return (
    <div className="container mx-auto p-4 mt-16 flex flex-col gap-10 items-center">
      <h1 className="text-3xl font-bold">Real Estate Projects in {cityName}</h1>
      {loading && <SyncLoader color="red" />}
      {projects.length === 0 && !loading && <p>No projects found.</p>}
      <div className="flex flex-col gap-4 w-full">
        {projects.map((project, index) => (
          <div key={index} className=" flex items-start gap-12 border p-4 mb-2 rounded-xl">
            <div className="w-[50%]">
              <Map project={project}/>
            </div>
            <div className="mt-4">
              <h2 className="font-bold text-3xl text-red-500">{project.projectName}</h2>
              <p className="text-xl">{project.location}</p>
              <p className="text-xl font-bold">{project.priceRange}</p>
              <p className="text-lg">{project.builderName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
