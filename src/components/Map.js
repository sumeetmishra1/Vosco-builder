"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet's default styles
import L from "leaflet";

// Fix Leaflet marker icon issue in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function Map({ project }) {
 
  return (
    <div className="w-full h-[200px]"> {/* Ensures container takes full width */}
      <MapContainer center={[project.latitude||51.505,project.longitude||-0.09]} zoom={8} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[project.latitude||51.505,project.longitude||-0.09]} icon={customIcon}>
          <Popup>{project?.projectName||"Builders"} <br /> {project?.location||"Delhi"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
