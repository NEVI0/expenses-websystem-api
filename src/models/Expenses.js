/* Dependencias */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

/* Schema / Model de Expenses */
// const expensesSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     value: { type: Number, required: true },
//     description: { type: String, required: true },
//     createdAt: { type: String, required: true },
//     userId: { type: String, required: true }
// });

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
    userData: { 
        type: Array, required: true
    },
    tags: {
        type: Array, required: true
    }
});

/* Adiciona a paginação */
expensesSchema.plugin(mongoosePaginate);

/* Exporta o Schema / Model */
module.exports = mongoose.model("Expense", expensesSchema);