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
    api.get("/dataController/:userId", ExpensesCtrl.getDataController);
    api.post("/expenses", ExpensesCtrl.insertExpense);
    api.put("/expenses/:id", ExpensesCtrl.updateExpense);
    api.delete("/expenses/:id", ExpensesCtrl.deleteExpense);

}

/* Configura as rotas Abertas */
// const openApi = express.Router();
// server.use("/oapi", openApi);

// /* Rotas Abertas - Rota Inicial */
// openApi.get("/", (req, res, next) => {
//     return res.status(200).send(`API's Running - Status: OK`);   
// });

// /* =========== Rotas de Usuario =========== */

// /* Rotas Abertas */
// openApi.post("/signup", UserCtrl.signup);
// openApi.post("/login", UserCtrl.login);

// /* Rotas Fechadas */
// openApi.get("/users", UserCtrl.getUsers);
// openApi.get("/user/:id", UserCtrl.getUserById);

// openApi.put("/userSimple/:id", UserCtrl.updateUserSimple);
// openApi.put("/userAdvanced/:id", UserCtrl.updateUserAdvanced);

// openApi.delete("/user/:id", UserCtrl.deleteUser);
    
// /* =========== Rotas de Despesas =========== */

// /* Rotas Fechadas */
// openApi.get("/allExpenses", ExpensesCtrl.getExpenses);
// openApi.get("/lastExpenses/:userId", ExpensesCtrl.getLastTen);
// openApi.get("/expenses/:userId", ExpensesCtrl.getExpensesByUserId);
// openApi.post("/expenses", ExpensesCtrl.insertExpense);
// openApi.put("/expenses/:id", ExpensesCtrl.updateExpense);
// openApi.delete("/expenses/:id", ExpensesCtrl.deleteExpense);
// openApi.get("/userController/:userId", ExpensesCtrl.getDataController);