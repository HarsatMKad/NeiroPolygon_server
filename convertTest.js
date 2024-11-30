const express = require("express");
const shpwrite = require("@mapbox/shp-write");
const fs = require("node:fs/promises"); 
const cors = require("cors");
const JSZip = require("jszip");

const app = express();
const port = 5000; 

app.use(cors());

app.get("/shapefile", async (req, res) => {
  try {
    const zip = await shpwrite.zip({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [0, 0],
          },
          properties: {
            name: "Foo",
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [0, 10],
          },
          properties: {
            name: "Bar",
          },
        },
      ],
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=geojson.zip');
    res.send(zip);
  } catch (error) {
    console.error("Error creating shapefile:", error);
    res.status(500).send("Error creating shapefile");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
