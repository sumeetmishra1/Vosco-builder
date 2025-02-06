import axios from "axios";

export default async function handler(req, res) {
  const { location } = req.query;
  if (!location) return res.status(400).json({ error: "Location required" });

  
  const url = `http://api.positionstack.com/v1/forward?access_key=${API_KEY}&query=${encodeURIComponent(location)}`;

  try {
    const { data } = await axios.get(url);
    if (data.data.length === 0) return res.status(404).json({ error: "Location not found" });

    res.status(200).json({ lat: data.data[0].latitude, lon: data.data[0].longitude });
  } catch (error) {
    res.status(500).json({ error: "Geocoding failed", details: error.message });
  }
}



