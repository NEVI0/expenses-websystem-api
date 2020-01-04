/* Dependencias */
const mongoose = require("mongoose");

/* Traz os Schemas / Models */
require("../models/Expenses");
const Expenses = mongoose.model("Expense");

/* ===================== Controllers ===================== */

/* Busca todas das Despesas pelo ID do Usuário */
const getExpensesByUserId = (req, res, next) => {
    Expenses.find({ userId: req.params.userId }, (err, resp) => {
        if (err) {
            return res.json(err);
        } else {
            return res.status(200).json(resp);
        }
    });
}

/* Inseri uma nova Despesa */
const insertExpense = (req, res, next) => {
    Expenses.create({
        name: req.body.name,
        value: req.body.value,
        createdAt: req.body.createdAt,
        description: req.body.description,
        userId: req.body.userId
    }, (err, resp) => {
        if (err) {
            return res.json(err);
        } else {
            return res.json({ message: "Despesa inserida com Sucesso!" });
        }
    });
}

/* Atualiza uma Expencia pelo ID */
const updateExpenseById = (req, res, next) => {}

/* Deleta uma Expense pelo ID */
const deleteExpenseById = (req, res, next) => {
    Expenses.findByIdAndDelete(req.params.id, (err, resp) => {
        if (err) {
            return res.json(err);
        } else {
            return res.status(200).send("Despesa deletada com Sucesso");
        }
    });
}

/* Exporta os Controllers para as rotas */
module.exports = { getExpensesByUserId, insertExpense, updateExpenseById, deleteExpenseById }