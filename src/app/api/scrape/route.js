import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
const API_KEY = process.env.POSITIONSTACK_API_KEY;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  const url = `https://www.magicbricks.com/new-projects-${city}`;

  try {
    console.log(`Fetching data from: ${url}`);

    // Fetch page content
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
      },
    });

    if (!response.data) {
      return NextResponse.json(
        { error: "Failed to fetch page data" },
        { status: 500 }
      );
    }

    const $ = cheerio.load(response.data);
    let projects = [];

    console.log($(".projdis__newprjs").length); // This will show the number of cards found
    const elements = $(".projdis__newprjs .projdis__prjcard").toArray();

    for await (const element of elements) {
      // Extract project name
      const projectName = $(element)
        .find(".mghome__prjblk__prjname")
        .text()
        .trim();

      // Extract location
      const location = $(element)
        .find(".mghome__prjblk__locname")
        .text()
        .trim();

      // Extract price range
      const priceRange = $(element)
        .find(".mghome__prjblk__price")
        .text()
        .trim();

      // Extract builder name
      const builderName = $(element)
        .find(".mghome__prjblk__ads--name")
        .text()
        .trim();

      // Extract coordinates from JSON-LD data (if available)
      let latitude = 28.459497;
      let longitude = 77.026634;

      // Fetch coordinates dynamically
      if (location) {
        const coords = await getCoordinates(location);
        latitude = coords.latitude ?? latitude;
        longitude = coords.longitude ?? longitude;
      }

      // Store extracted information in an array if the project name exists
      if (projectName && location && priceRange) {
        console.log("Project Name:", projectName);
        console.log("Location:", location);
        console.log("Price Range:", priceRange);
        console.log("Builder Name:", builderName);
        projects.push({
          projectName,
          location,
          priceRange,
          builderName,
          latitude,
          longitude,
        });
      }
    };

    // Return the results
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Scraping Error:", error);
    return NextResponse.json(
      { error: "Failed to scrape data", details: error.message },
      { status: 500 }
    );
  }
}


async function getCoordinates(location) {
  if (!location) return { latitude: null, longitude: null };

  const url = `http://api.positionstack.com/v1/forward?access_key=${API_KEY}&query=${encodeURIComponent(location)}`;

  try {
    const { data } = await axios.get(url);
    if (!data || !data.data || data.data.length === 0) {
      console.warn(`Location not found: ${location}`);
      return { latitude: null, longitude: null }; // Return default or null values
    }

    return {
      latitude: data.data[0].latitude,
      longitude: data.data[0].longitude,
    };
  } catch (error) {
    console.error("Geocoding failed:", error.message);
    return { latitude: null, longitude: null };
  }
}