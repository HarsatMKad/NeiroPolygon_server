const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const JSZip = require("jszip");
const shpwrite = require("@mapbox/shp-write");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.get("/api/data", (req, res) => {
  const points = [
    [
      [4231948.594451497, 7517751.719223182],
      [4254115.332654199, 7525701.17016484],
      [4270167.108594085, 7516528.726770619],
      [4262676.279822138, 7502311.439509576],
      [4247236.000108533, 7505674.668754124],
      [4230114.105772653, 7508579.27582896],
      [4231948.594451497, 7517751.719223182],
    ],
    [
      [4118974.6666460065, 7501088.447057013],
      [4120350.53315514, 7509955.142338094],
      [4132733.3317373386, 7507356.283376398],
      [4118974.6666460065, 7501088.447057013],
    ],
    [
      [4164072.513334261, 7500324.076774161],
      [4177219.682199311, 7519891.956015167],
      [4210851.974644789, 7503840.180075279],
      [4173244.9567284817, 7486718.2857394],
      [4164072.513334261, 7500324.076774161],
    ],
  ];

  const data = { points: points };
  res.json(data);
});

app.post("/api/data", (req, res) => {
  const { name, email } = req.body;

  console.log("Received data:", name, email);

  res.status(200).json({
    message: "Data received successfully",
  });
});

// Маршрут для генерации Shape-файлов и отправки их клиенту
app.get("/api/data/shapefile", async (req, res) => {
  try {
    var points = [
      [
        [
          [4231948.594451497, 7517751.719223182],
          [4254115.332654199, 7525701.17016484],
          [4270167.108594085, 7516528.726770619],
          [4262676.279822138, 7502311.439509576],
          [4247236.000108533, 7505674.668754124],
          [4230114.105772653, 7508579.27582896],
          [4231948.594451497, 7517751.719223182],
        ],
        [
          [4118974.6666460065, 7501088.447057013],
          [4120350.53315514, 7509955.142338094],
          [4132733.3317373386, 7507356.283376398],
          [4118974.6666460065, 7501088.447057013],
        ],
        [
          [4164072.513334261, 7500324.076774161],
          [4177219.682199311, 7519891.956015167],
          [4210851.974644789, 7503840.180075279],
          [4173244.9567284817, 7486718.2857394],
          [4164072.513334261, 7500324.076774161],
        ],
      ],
    ];

    const zip = new JSZip();

    function finish(err, files) {
      zip.file("polygon.shp", files.shp.buffer);
      zip.file("polygon.shx", files.shx.buffer);
      zip.file("polygon.dbf", files.dbf.buffer);

      zip
        .generateAsync({ type: "nodebuffer" })
        .then((content) => {
          res.setHeader("Content-Type", "application/zip");
          res.setHeader("Content-Disposition", "attachment; filename=data.zip");
          res.send(content);
        })
        .catch((err) => {
          console.error("Error generating zip:", err);
          res.status(500).send("Error generating zip");
        });
    }

    shpwrite.write([{ id: 0 }], "POLYGON", points, finish);
  } catch (error) {
    console.error("Error creating shapefile:", error);
    res.status(500).send("Error creating shapefile");
  }
});

app.listen(port, () => {
  console.log("server is running on http://localhost:" + port);
});
