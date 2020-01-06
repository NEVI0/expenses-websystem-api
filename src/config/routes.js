/* Dependencias */
const express = require("express");

/* Controllers */
const ExpensesCtrl = require("../controllers/expenseCtrl");
const UserCtrl = require("../controllers/userCtrl");

/* Exporta as Rotas para o arquivo Inicializador */
module.exports = (server) => {

    /* Configura as rotas Abertas */
    const openApi = express.Router();
    server.use("/oapi", openApi);

    /* Rotas Abertas - Rota Inicial */
    openApi.get("/", (req, res, next) => {
        return res.status(200).send(`API's Running - Status: OK`);   
    });

    /* =========== Rotas de Usuario =========== */

    /* Rotas Abertas */
    openApi.post("/signup", UserCtrl.signup);
    openApi.post("/login", UserCtrl.login);

    /* Rotas Fechadas */
    openApi.get("/users", UserCtrl.getUsers);
    openApi.get("/user/:id", UserCtrl.getUserById);

    openApi.put("/userSimple/:id", UserCtrl.updateUserSimple);
    openApi.put("/userAdvanced/:id", UserCtrl.updateUserAdvanced);

    openApi.delete("/user/:id", UserCtrl.deleteUser);
    
    /* =========== Rotas de Despesas =========== */

    /* Rotas Fechadas */
    openApi.get("/allExpenses", ExpensesCtrl.getExpenses);
    openApi.get("/expenses/:userId", ExpensesCtrl.getExpensesByUserId);
    openApi.post("/expenses", ExpensesCtrl.insertExpense);
    openApi.put("/expenses/:id", ExpensesCtrl.updateExpense);
    openApi.delete("/expenses/:id", ExpensesCtrl.deleteExpense);

}