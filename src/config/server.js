/* Dependencias */
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

/* Habilita as Váriaveis de Ambiente */
require("dotenv").config();

/* Habilita o CORS da Aplicação */
const allowCors = require("./cors");

/* constante que contém o Servidor */
const server = express();

/* Configurações do Servidor */
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(allowCors);
server.use(morgan("dev"));

/* Constante que armazena a porta da Apliação */
const port = process.env.PORT || 3100;

/* Starta o Servidor */
server.listen(port, () => console.log(`Server's Running - Port: ${port}`));

/* Exporta o servidor para o arquivo inicializador */
module.exports = server;