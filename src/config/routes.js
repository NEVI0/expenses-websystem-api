/* Dependencias */
const express = require("express");

/* Controllers */
const ExpensesCtrl = require("../controllers/expenseCtrl");
const UserCtrl = require("../controllers/userCtrl");

/* Middleware que bloqueia as rotas */
const auth = require("./auth");

/* Exporta as Rotas para o arquivo Inicializador */
module.exports = (server) => {

    /* Configura as Rotas Abertas */
    const openApi = express.Router();
    server.use("/oapi", openApi);

    /* Configura as Rotas Fechadas */
    const api = express.Router();
    server.use("/api", api);
    api.use(auth);

    /* Rota Inicial */
    openApi.get("/", (req, res, next) => {
        return res.status(200).send(`API's Running - Status: OK`);   
    });

    /* =========== Rotas de Usuario =========== */

    /* Abertas */
    openApi.post("/signup", UserCtrl.signup);
    openApi.post("/login", UserCtrl.login);
    openApi.post("/validateToken", UserCtrl.validateToken);

    /* Fechadas */
    api.get("/users", UserCtrl.getUsers);
    api.get("/user/:id", UserCtrl.getUserById);

    api.put("/userSimple/:id", UserCtrl.updateUserSimple);
    api.put("/userAdvanced/:id", UserCtrl.updateUserAdvanced);

    api.delete("/user/:id", UserCtrl.deleteUser);

    /* =========== Rotas de Despesas =========== */

    api.get("/allExpenses", ExpensesCtrl.getExpenses);
    api.get("/lastExpenses/:userId", ExpensesCtrl.getLastTen);
	api.get("/expenses/:userId", ExpensesCtrl.getExpensesByUserId);
	api.get("/expense/:id", ExpensesCtrl.getExpenseById);
    api.get("/dataController/:userId", ExpensesCtrl.getDataController);
    api.post("/expenses", ExpensesCtrl.insertExpense);
    api.post("/search", ExpensesCtrl.search);
    api.put("/expenses/:id", ExpensesCtrl.updateExpense);
    api.delete("/expenses/:id", ExpensesCtrl.deleteExpense);

}