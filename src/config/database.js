/* Dependencia do Mongoose */
const mongoose = require("mongoose");

/* Habilita as Variaveis de Ambiente */
require("dotenv").config();

/* Exporta a Conexão para o arquivo inicializador */
module.exports = mongoose.connect(process.env.URI_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(resp => {
    console.log(`MongoDB's Conencted!`);
}).catch(err => {
    console.log(`An Error Occured \n Error: ${err}`);
});

/* ================ IMPORTANTE ================ */
/* Troque process.env.URI_MONGO para mongodb://localhost:27017/expenses_websystem */
/* Paara poder usar o MongoDb localmente (localhost) */