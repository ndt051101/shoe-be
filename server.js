require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 8000;
const cors = require("cors");
const logger = require("morgan");
const route = require("./src/routes");
const secureApp = require("helmet");
const db = require("./src/db");
var bodyParser = require("body-parser");

const app = express();

app.use(
    cors({
        origin: "*",
    })
);
// app.use(express.json())
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app.use(express.urlencoded({ extended: true }))
// app.use(express.urlencoded({ extended: true }))
app.use(logger("dev"));
app.use(secureApp());
app.use(express.static("./src/publics"));

db.connect();

route(app);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
