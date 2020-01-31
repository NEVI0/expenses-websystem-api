/* Mongoose Dependencie */
const mongoose = require("mongoose");

/* Enable the Config Vars */
require("dotenv").config();

/* Export the connection to the initial file */
module.exports = mongoose.connect(process.env.URI_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(resp => {
    console.log(`MongoDB's Connected!`);
}).catch(err => {
    console.log(`An Error Occured \n Error: ${err}`);
});

/* ================ IMPORTANT ================ */
/* Change process.env.URI_MONGO to mongodb://localhost:27017/expenses_websystem */
/* to use the MongoDB in localhost */