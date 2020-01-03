/* Dependencia do Mongoose */
const mongoose = require("mongoose");

/* Schema / Model de User */
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

/* Exporta o Schema / Model */
module.exports = mongoose.model("User", userSchema);