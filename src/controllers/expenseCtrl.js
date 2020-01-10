/* Dependencias */
const mongoose = require("mongoose");

/* Traz os Schemas / Models */
require("../models/Expenses");
const Expenses = mongoose.model("Expense");

/* ===================== Controllers ===================== */

/* Busca as 10 ultimas Despesas */
const getLastTen = (req, res, next) => {
    Expenses.find({ userId: req.params.userId }, (err, resp) => {
        if (err) {
            return res.status(503).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
        }
    }).sort({ _id: -1 }).limit(10);
}

/* Busca todas as Despesas */
const getExpenses = (req, res, next) => {
    Expenses.find((err, resp) => {
        if (err) {
            return res.status(503).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
        }
    });
}

/* Busca todas das Despesas pelo ID do Usuário */
const getExpensesByUserId = (req, res, next) => {
    Expenses.find({ userId: req.params.userId }, (err, resp) => {
        if (err) {
            return res.status(503).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
        }
    });
}

/* Inseri uma nova Despesa */
const insertExpense = (req, res, next) => {
    Expenses.create(req.body, (err, resp) => {
        if (err) {
            return res.status(503).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna a despesa cadastrada */
        }
    });
}

/* Atualiza uma Expencia pelo ID */
const updateExpense = (req, res, next) => {
    Expenses.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, resp) => {
        if (err) {
            return res.status(503).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna a despesa atualizada */
        }
    });
}

/* Deleta uma Expense pelo ID */
const deleteExpense = (req, res, next) => {
    Expenses.findByIdAndDelete(req.params.id, (err, resp) => {
        if (err) {
            return res.status(503).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json({ msg: "Despesa deletada com sucesso" }); /* 2 - Senão uma mensagem de sucess */
        }
    });
}

/* Exporta os Controllers para as rotas */
module.exports = { getLastTen, getExpenses, getExpensesByUserId, insertExpense, updateExpense, deleteExpense }