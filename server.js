const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("hello from server");
});

app.get("/api/data", (req, res) => {
  const data = { message: "this is data from server" };
  res.json(data);
});
``;
app.post("/api/data", (req, res) => {
  const { name, email } = req.body;

  console.log("Received data:", name, email);

  res.status(200).json({
    message: "Data received successfully",
  });
});

app.listen(port, () => {
  console.log("server is running on http://localhost:" + port);
});
