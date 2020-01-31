/* Dependencies */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

/* Expenses Schema / Model */
const expensesSchema = new mongoose.Schema({
    name: { 
        type: String, required: true
    },
    value: { 
        type: Number, required: true
    },
    description: { 
        type: String, required: true
    },
    date: { 
        type: Date, required: true
    },
    createdAt: { 
        type: Date, default: Date.now 
    },
    userId: { 
        type: String, required: true 
    },
    tags: {
        type: Array, required: true
    }
});

/* Add a paginator */
expensesSchema.plugin(mongoosePaginate);

/* Export the Schema / Model */
module.exports = mongoose.model("Expense", expensesSchema);