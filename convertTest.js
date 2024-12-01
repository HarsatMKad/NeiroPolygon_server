const express = require("express");
const shpwrite = require("@mapbox/shp-write");
const fs = require("fs");
const cors = require("cors");
const JSZip = require("jszip");

const app = express();
const port = 5000;

app.use(cors());

function toBuffer(ab) {
  var buffer = Buffer.alloc(ab.byteLength),
    view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

// Маршрут для генерации Shape-файлов и отправки их клиенту
app.get("/shapefile", async (req, res) => {
  try {
    var points = [
      [
        [
          [0, 0],
          [10, 0],
          [10, 10],
          [0, 10],
          [0, 0],
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
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=data.zip"
          );
          res.send(content);
        })
        .catch((err) => {
          console.error("Error generating zip:", err);
          res.status(500).send("Error generating zip");
        });
    }

    shpwrite.write(
      // feature data
      [{ id: 0 }],
      // geometry type
      "POLYGON",
      // geometries
      points,
      finish
    );
  } catch (error) {
    console.error("Error creating shapefile:", error);
    res.status(500).send("Error creating shapefile");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
