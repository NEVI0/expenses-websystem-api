/* Dependencies */
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

/* Enable the Config Vars */
require("dotenv").config();

/* Enable the CORS at the Application */
const allowCors = require("./cors");

/* Constant that contains the server */
const server = express();

/* Server Configurations */
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(allowCors);
server.use(morgan("dev"));

/* Constant that contains the application port */
const port = process.env.PORT || 3100;

/* Init the server */
server.listen(port, () => console.log(`Server's Running - Port: ${port}`));

/* Export the server to the initial file */
module.exports = server;