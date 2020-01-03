/* Dependencia do Mongoose */
const mongoose = require("mongoose");

/* Schema / Model de Expenses */
const expensesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, required: true },
    userId: { type: String, required: true }
});

/* Exporta o Schema / Model */
module.exports = mongoose.model("Expense", expensesSchema);