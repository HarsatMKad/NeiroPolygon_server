const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "NeiroPolygonClients",
  password: "20040402",
  port: 5432,
});

module.exports = pool;
