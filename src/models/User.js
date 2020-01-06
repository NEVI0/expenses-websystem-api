/* Dependencia do Mongoose */
const mongoose = require("mongoose");

/* Schema / Model de User */
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salary: { type: Number, required: true },
    imgName: { type: String },
    imgUrl: { type: String }
});

/* Exporta o Schema / Model */
module.exports = mongoose.model("User", userSchema);