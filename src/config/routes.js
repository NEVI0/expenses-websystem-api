/* Dependencias */
const express = require("express");

/* Controllers */
const ExpensesCtrl = require("../controllers/expenseCtrl");

/* Exporta as Rotas para o arquivo Inicializador */
module.exports = (server) => {

    /* Configura as rotas Abertas */
    const openApi = express.Router();
    server.use("/oapi", openApi);

    /* Rotas Abertas */
    openApi.get("/", (req, res, next) => {
        return res.status(200).send(`API's Running - Status: OK`);   
    });

    /* Rotas Abertas Temporariamente */
    openApi.get("/expenses/:userId", ExpensesCtrl.getExpensesByUserId);
    openApi.post("/expenses", ExpensesCtrl.insertExpense);
    openApi.put("/expenses/:id", ExpensesCtrl.updateExpenseById);
    openApi.delete("/expenses/:id", ExpensesCtrl.deleteExpenseById);

}