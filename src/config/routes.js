/* Dependencies */
const express = require("express");

/* Controllers */
const ExpensesCtrl = require("../controllers/expenseCtrl");
const UserCtrl = require("../controllers/userCtrl");

/* Middleware that block the routes */
const auth = require("./auth");

/* Export the routes to the initial file */
module.exports = (server) => {

    /* Opened Routes Configuration */
    const openApi = express.Router();
    server.use("/oapi", openApi);

    /* Blocked Routes Configuration */
    const api = express.Router();
    server.use("/api", api);
    api.use(auth);

    /* Initial Route */
    openApi.get("/", (req, res) => {
		try {
			return res.status(200).send(`API's Running - Status: OK`);   
		} catch (err) {
			return res.status(400).json(err);
		}
    });

    /* =========== User Routes =========== */

    /* Opened */
    openApi.post("/signup", UserCtrl.signup);
    openApi.post("/login", UserCtrl.login);
	openApi.post("/validateToken", UserCtrl.validateToken);
	
    /* Blocked */
    api.get("/users", UserCtrl.getUsers);
	api.get("/user/:id", UserCtrl.getUserById);

	api.post("/forgotPass", UserCtrl.forgotPass);
	api.post("/resetPass", UserCtrl.resetPass);
	
	api.put("/user/:id", UserCtrl.updateUser);

    api.delete("/user/:id", UserCtrl.deleteUser);

    /* =========== Expenses Routes =========== */

    api.get("/allExpenses", ExpensesCtrl.getExpenses);
    api.get("/lastExpenses/:userId", ExpensesCtrl.getLastTen);
	api.get("/expenses/:userId", ExpensesCtrl.getExpensesByUserId);
	api.get("/expense/:id", ExpensesCtrl.getExpenseById);
	api.get("/dataController/:userId", ExpensesCtrl.getDataController);
	api.get("/search/:userId", ExpensesCtrl.search);
	api.get("/expensesByMonth/:userId", ExpensesCtrl.getSumOfExpensesByMonth);
	
    api.post("/expenses", ExpensesCtrl.insertExpense);
	
	api.put("/expenses/:id", ExpensesCtrl.updateExpense);
	
    api.delete("/expenses/:id", ExpensesCtrl.deleteExpense);

}