/* Dependencias */
const mongoose = require("mongoose");

/* Traz os Schemas / Models */
require("../models/Expenses");
const Expenses = mongoose.model("Expense");

/* ===================== Controllers ===================== */

/* Busca as 10 ultimas Despesas */
const getLastTen = async (req, res) => {
    try {
		await Expenses.find({ userId: req.params.userId }, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
			} else {
				return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
			}
		}).sort({ _id: -1 }).limit(10);
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Busca todas as Despesas */
const getExpenses = async (req, res) => {
	try {
		await Expenses.find((err, resp) => {
			if (err) {
				return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
			} else {
				return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Busca somente uma Despesa pelo ID */
const getExpenseById = async (req, res) => {
	try {
		await Expenses.findById(req.params.id, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
			} else {
				return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Busca todas das Despesas pelo ID do Usuário */
const getExpensesByUserId = async (req, res) => {

	/* Solução temporária */
	try {
		await Expenses.find({ userId: req.params.userId }, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
			} else {
				return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
			}
		}).sort({ _id: -1 });
	} catch (err) {
		return res.status(400).json(err);
	}

}

/* Faz o controle de dados para o usuário */
const getDataController = async (req, res) => {
	try {
		await Expenses.find({ userId: req.params.userId }, (err, resp) => {
			
			/* Se houver algum error, o retorna */
			if (err) {
				return res.status(404).json(err); 
			}

			/* Variavel que armazena a soma dos valores */
			var values = 0;

			/* Percorre o array de resposta e armazena os valores na variavel */
			for (var i = 0; i < resp.length; i++) {
				values += resp[i].value;
			}

			/* Faz a média de valores */
			const avg = values / resp.length;

			/* Retorna a soma de todos os valores */
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

/* Inseri uma nova Despesa */
const insertExpense = async (req, res) => {
	try {
		await Expenses.create(req.body, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
			} else {
				return res.status(200).json(resp); /* 2 - Senão retorna a despesa cadastrada */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Atualiza uma Expencia pelo ID */
const updateExpense = async (req, res) => {
	try {
		await Expenses.findByIdAndUpdate(req.params.id, req.body, {
			new: true
		}, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
			} else {
				return res.status(200).json(resp); /* 2 - Senão retorna a despesa atualizada */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Deleta uma Expense pelo ID */
const deleteExpense = async (req, res) => {
	try {
		await Expenses.findByIdAndDelete(req.params.id, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
			} else {
				return res.status(200).json({ msg: "Despesa deletada com sucesso" }); /* 2 - Senão uma mensagem de sucess */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Busca uma Despesa / Middleware de pesquisa do usuário */
const search = async (req, res) => {

    /* Pega a informção enviada */
    const data = req.body.tag || "";

    /* Verifica se tag tem conteudo */
    if (data == "" || data == null) {
        return res.status(200).json({ msg: "Nada encontrado!" });
    } 
    
    /* Transforma o valor em UpperCase */
    const tag = data.toUpperCase();

	try {
		/* Busca a informção no banco */
		await Expenses.find({ tags: new RegExp(tag) }, (err, resp) => {
			if (err) {
				return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
			} else {
				return res.status(200).json(resp); /* 2 - Senão uma mensagem de sucess */
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}

}

/* Exporta os Controllers para as rotas */
module.exports = { 
    getLastTen,
	getExpenses,
	getExpenseById,
    getExpensesByUserId,
    getDataController,
    insertExpense,
    updateExpense,
    deleteExpense,
    search
}