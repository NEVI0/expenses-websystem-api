/* Mongoose Dependencie */
const mongoose = require("mongoose");

/* User Schema / Model */
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salary: { type: Number, required: true },
    imgName: { type: String },
    imgUrl: { type: String }
});

/* Export the Schema / Model */
module.exports = mongoose.model("User", userSchema);