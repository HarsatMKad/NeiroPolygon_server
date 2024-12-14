const express = require("express");
const app = express();
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const pool = require("./config/db");
const JSZip = require("jszip");
const shpwrite = require("@mapbox/shp-write");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.post("/users", routes);
app.use("/api", routes);

app.get("/substrates/:userId", async (req, res) => {
  const { userId } = req.params;
  const { index } = req.query;

  const result = await pool.query(
    "SELECT image_link FROM custom_substrates WHERE user_id = $1",
    [userId]
  );

  if (!result.rows.length) {
    return res.status(404).json({ message: "Изображение не найдено" });
  }

  if (!index) {
    return res.status(404).json({ message: "Неверно указан индекс" });
  }

  const imgPath = result.rows[index].image_link;
  const fp = path.join(__dirname, imgPath);

  res.sendFile(fp);
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
