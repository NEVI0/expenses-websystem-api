/* Dependencies */
const mongoose = require("mongoose");

/* Bring the Schemas / Models */
require("../models/Expenses");
const Expenses = mongoose.model("Expense");

/* ===================== Controllers ===================== */

/* Get the last 10 expenses */
const getLastTen = async (req, res) => {
    try {
		await Expenses.find({ userId: req.params.userId }, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* Return the Errors */
			} else {
				return res.status(200).json(resp); /* Return the Expenses */
			}
		}).sort({ _id: -1 }).limit(10);
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Get all expenses */
const getExpenses = async (req, res) => {
	try {
		await Expenses.find((err, resp) => {
			if (err) {
				return res.status(404).json(err); /* Return the Errors */
			} else {
				return res.status(200).json(resp); /* Return the Expenses */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Get only one expenses by ID */
const getExpenseById = async (req, res) => {
	try {
		await Expenses.findById(req.params.id, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* Return the Errors */
			} else {
				return res.status(200).json(resp); /* Return the Expenses */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Get only the user expenses by his ID */
const getExpensesByUserId = async (req, res) => {

	/* Solução temporária */
	try {
		await Expenses.find({ userId: req.params.userId }, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* Return the Errors */
			} else {
				return res.status(200).json(resp); /* Return the Expenses */
			}
		}).sort({ _id: -1 });
	} catch (err) {
		return res.status(400).json(err);
	}

}

/* User Data Controller */
const getDataController = async (req, res) => {		
	try {
		await Expenses.find({ userId: req.params.userId }, (err, resp) => {
			
			/* Return the Errors */
			if (err) {
				return res.status(404).json(err); 
			}
			
			/* Variable that contains the sum of all values */
			var values = 0;

			/* Take the values of all the expenses */
			for (var i = 0; i < resp.length; i++) {
				values += resp[i].value;
			}

			/* Make the AVG */
			const avg = values / resp.length;

			/* Return the data */
			return res.status(200).json({
				success: true,
				numberOfExpenses: resp.length,
				sumOfValues: values,
				avgOfValues: avg
			});

		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Get the sum of expenses by month to the chart */
const chartController = async (req, res) => {
	try {
		/* MongoDB Aggregation */
		await Expenses.aggregate([
			{
				"$match": {
					userId: req.params.userId, /* Select where the userId is equal to userId */
					status: "PAGO" /* And select just paied expenses */
				}
			},
			{
				"$group": {
					_id: { $month: "$createdAt" }, /* Month */
					avg: { $avg: "$value" }, /* Avg of the values */
					sum: { $sum: "$value" },
					total: { $sum: 1 } /* Number of Expenses */
				}
			}
		], (err, resp) => {
			if (err) {
				return res.status(400).json(err); /* Return the Errors */
			} else {
				return res.status(200).json(resp); /* Return the Aggregation */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}

}

/* Create a new expense */
const insertExpense = async (req, res) => {
	try {
		if (req.body.description == "" || null) {
			req.body.description = "Sem Descrição"
		}

		if (req.body.name == "" || null) {
			return res.status(404).json({ message: "O nome é obrigatório" });
		}

		if (req.body.value == "" || null) {
			return res.status(404).json({ message: "O valor é obrigatório" });
		}

		await Expenses.create(req.body, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* Return the Errors */
			} else {
				return res.status(200).json(resp); /* Return the Expense */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Update an expense by ID */
const updateExpense = async (req, res) => {
	try {
		await Expenses.findByIdAndUpdate(req.params.id, req.body, {
			new: true
		}, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* Return the Errors */
			} else {
				return res.status(200).json(resp); /* Return the Expense */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Delete an expense by ID */
const deleteExpense = async (req, res) => {
	try {
		await Expenses.findByIdAndDelete(req.params.id, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* Return the Errors */
			} else {
				return res.status(200).json({ msg: "Despesa deletada com sucesso" }); /* Return a success message */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Search for a expense */
const search = async (req, res) => {

	/* Take the user ID */
	const id = req.params.userId;

    /* Take the search information */
	const data = req.query.tag;

    /* Verify if it has content */
    if (data == "" || data == null) {
        return res.status(200).json({ msg: "Nada encontrado!" });
    } 
    
    /* Transform the text to upper case */
	const tag = data.toUpperCase();
	
	try {
		await Expenses.find({
			userId: id, 
			$or: [
				{ tags: new RegExp(tag) },
				{ status: new RegExp(tag) }
			]
		}, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* Return the Errors */
			} else {
				return res.status(200).json(resp); /* Return the Expenses */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}

}

/* Export the Controllers to the rotas */
module.exports = { 
    getLastTen,
	getExpenses,
	getExpenseById,
    getExpensesByUserId,
	getDataController,
	chartController,
    insertExpense,
    updateExpense,
    deleteExpense,
	search
}
