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
            return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
        }
    }).sort({ _id: -1 }).limit(10);
}

/* Busca todas as Despesas */
const getExpenses = (req, res, next) => {
    Expenses.find((err, resp) => {
        if (err) {
            return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
        }
    });
}

/* Busca somente uma Despesa pelo ID */
const getExpenseById = (req, res, next) => {
	Expenses.findById(req.params.id, (err, resp) => {
		if (err) {
            return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
        }
	});
}

/* Busca todas das Despesas pelo ID do Usuário */
const getExpensesByUserId = (req, res, next) => {

    /* Solução temporária */
    Expenses.find({ userId: req.params.userId }, (err, resp) => {
        if (err) {
            return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
        }
    }).sort({ _id: -1 });

    /* Pega a page por parametro GET */
    // const { page = 1 } = req.query;

    // Expenses.paginate({
    //     userId: req.params.userId 
    // }, { 
    //     page, limit: 10, sort: { _id: -1 }
    // }, (err, resp) => {
    //     if (err) {
    //         return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
    //     } else {
    //         return res.status(200).json(resp); /* 2 - Senão retorna as Despesas */
    //     }
    // });
}

/* Faz o controle de dados para o usuário */
const getDataController = (req, res, next) => {
    Expenses.find({ userId: req.params.userId }, (err, resp) => {
        
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
}

/* Inseri uma nova Despesa */
const insertExpense = (req, res, next) => {
    Expenses.create(req.body, (err, resp) => {
        if (err) {
            return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna a despesa cadastrada */
        }
    });
}

/* Atualiza uma Expencia pelo ID */
const updateExpense = (req, res, next) => {
    Expenses.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, resp) => {
        if (err) {
            return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna a despesa atualizada */
        }
    });
}

/* Deleta uma Expense pelo ID */
const deleteExpense = (req, res, next) => {
    Expenses.findByIdAndDelete(req.params.id, (err, resp) => {
        if (err) {
            return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json({ msg: "Despesa deletada com sucesso" }); /* 2 - Senão uma mensagem de sucess */
        }
    });
}

/* Busca uma Despesa / Middleware de pesquisa do usuário */
const search = (req, res, next) => {

    /* Pega a informção enviada */
    const data = req.body.tag || "";

    /* Verifica se tag tem conteudo */
    if (data == "" || data == null) {
        return res.status(200).json({ msg: "Nada encontrado!" });
    } 
    
    /* Transforma o valor em UpperCase */
    const tag = data.toUpperCase();

    /* Busca a informção no banco */
    Expenses.find({ tags: new RegExp(tag) }, (err, resp) => {
        if (err) {
            return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão uma mensagem de sucess */
        }
    });

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