require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const dbUrl = Object.values(process.env).find(
  (v) => typeof v === "string" && v.startsWith("mongodb+srv") && v.includes("fepiyl6")
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function geocode(query) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(query);
  const res = await fetch(url, {
    headers: { "User-Agent": "wanderlust-seed-script" },
  });
  const data = await res.json();
  if (data.length === 0) return null;
  return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
}

async function getCoordinates(obj) {
  let coords = await geocode(`${obj.location}, ${obj.country}`);
  await sleep(1100);
  if (!coords) {
    coords = await geocode(obj.country);
    await sleep(1100);
  }
  return coords || [77.209, 28.6139];
}

async function main() {
  if (!dbUrl) {
    console.log(".env mein fepiyl6 wali mongodb+srv line nahi mili");
    return;
  }

  await mongoose.connect(dbUrl);
  console.log("DB Connected!");

  let owner = await User.findOne();

  if (!owner) {
    owner = await User.register(
      new User({ email: "demo@gmail.com", username: "demo" }),
      "Demo12345"
    );
    console.log("Demo user bana: username demo, password Demo12345");
  }

  await Listing.deleteMany({});

  const listings = [];
  for (const obj of initData.data) {
    const coordinates = obj.geometry
      ? obj.geometry.coordinates
      : await getCoordinates(obj);
    listings.push({
      ...obj,
      owner: owner._id,
      geometry: { type: "Point", coordinates },
    });
    console.log(`${obj.title}: ${coordinates}`);
  }

  await Listing.insertMany(listings);
  console.log(`${listings.length} listings added`);
}

main()
  .catch((err) => console.log("Error:", err.message))
  .finally(() => mongoose.connection.close());