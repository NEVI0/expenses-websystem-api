/* ========================= Importante ========================= */

/**
 * Leia a mensagem no final do código
**/

/* Dependencias */
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");

/* Traz os Schemas / Models */
require("../models/User");
const User = mongoose.model("User");
require("../models/Expenses");
const Expenses = mongoose.model("Expense");

/* Padrão para o email e senha */
const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /((?=.*[a-z])(?=.*[A-Z]).{7})/;

/* Habilita as variaveis de ambiente */
require("dotenv").config();

/* Traz as configurações do email */
const mailConfig = require("../config/mailConfig");

/* ===================== Controllers ===================== */

/* Busca todos os usuários */
const getUsers = async (req, res) => {
    try {
        await User.find((err, resp) => {        
            if (err) {
                return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
            } else {
                return res.status(200).json(resp); /* 2 - Senão retorna o usuário */
            }
        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

/* Busca dados do usuário pelo ID */
const getUserById = async (req, res) => {
    try {
        await User.findById(req.params.id, (err, resp) => {
            if (err) {
                return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
            } else {
                return res.status(200).json(resp); /* 2 - Senão retorna o usuário */
            }
        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

/* Cria um usuário / Signup */
const signup = async (req, res) => {

    /* Pega as informações do usuário */
    const name = req.body.name || "";
    const email = req.body.email || "";
    const password = req.body.password || "";
    const confPassword = req.body.conf_password || "";

    /* Verifica se o email está correto */
    if (!emailRegex.test(email)) {
        return res.status(404).json({ errorMsg: "O E-mail está incorreto." });
    }

    /* Verifica se a senha está correta */
    if (!passwordRegex.test(password)) {
        return res.status(404).json({
            errorMsg: "A Senha deve ter: 1 letra em Maiúscula, 1 em Minúscula e ter mais de 7 Caracteres."
        });
    }

    /* Verifica se as senha são iguais */
    if (password !== confPassword) {
        return res.status(404).json({ errorMsg: "As Senhas não são iguais." });
    }

    /* Faz a cryptografia da senha e coloca o hash na senha */
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);

    try {
        /* Busca no banco um usuário existente */
        await User.findOne({ email: email }, (err, user) => {

            /* Se houver algum error, o retorna */
            if (err) {
                return res.status(404).json(err);
            }

            /* 1 - Se existir um usuário, retorna um error */
            /* 2 - Cria um novo usuário */
            if (user) {
                return res.status(404).json({ errorMsg: "O Usuário já existe." });
            } else {

                /* Cria um usuário */
                User.create({
                    name: name,
                    email: email,
                    password: passwordHash,
                    salary: 1000,
                    imgName: "376574365784-imagem.png",
                    imgUrl: "https://amazon-s3.com/debbuing"
                }, (err, resp) => {

                    /* Se houver algum error, o retorna */
                    if (err) {
                        return res.status(404).json(err);
                    }

                    /* Cria o Token e envia as informações do usuário para o client */
                    const token = jwt.sign(resp.toJSON(), process.env.AUTH_SECRET, { expiresIn: "1 day" });
                    const { _id, name, email, salary, imgName, imgUrl } = resp;
                    return res.status(200).json({ _id, name, email, salary, imgName, imgUrl, token });

                });

            }

        });
    } catch (err) {
        return res.status(400).json(err);
    }

}

/* Autenticação de usuário / Login */
const login = async (req, res) => {

    /* Pega as informações do usuário */
    const email = req.body.email || "";
    const password = req.body.password || "";
    
    try {
        /* Procura o usuário */
        await User.findOne({ email: email }, (err, user) => {
            
            /* Verifica se existe algum error */
            if (err) {
                return res.status(404).json(err);
            }

            /* Verifica se o usuário existe */
            if (!user) {
                return res.status(404).json({ errorMsg: "O usuário não existe" });
            }   
            
            /* Verifica se as senha são iguais */
            if (bcrypt.compareSync(password, user.password)) {
                
                /* Cria o Token do usuário e envia as informações para o cliente */
                const token = jwt.sign(user.toJSON(), process.env.AUTH_SECRET, { expiresIn: "1 day" });
                const { _id, name, email, salary, imgUrl } = user;
                return res.status(200).json({ _id, name, email, salary, imgUrl, token });

            } else {
                return res.status(404).json({ errorMsg: "Email ou Senha inválidos" });
            }

        });
    } catch (err) {
        return res.status(400).json(err);
    }   

}

/* Atualização de usuário */
const updateUserSimple = async (req, res) => {
    try {
        /* Atualiza os dados o usuário */
        await User.findByIdAndUpdate(req.params.id, req.body, { 
            new: true 
        }, (err , user) => {

            /* Se houver algum error, o retorna */
            if (err) {
                return res.status(404).json(err);
            }
            
            /* Cria o Token do usuário e envia as informções para o client */
            const token = jwt.sign(user.toJSON(), process.env.AUTH_SECRET, { expiresIn: "1 day" });
            const { _id, name, email, salary, imgUrl } = user;
            return res.status(200).json({ _id, name, email, salary, imgUrl, token });

        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

/* Atualização de usuário */
const updateUserAdvanced = async (req, res) => {
    
    /* Pega as informações do usuário */
    const oldPassword = req.body.old_password || "";
    const password = req.body.password || "";
    const confPassword = req.body.conf_password || "";
    
    /* Verifica se a senha nova é diferente da antiga */
    if (password === oldPassword) {
        return res.status(400).json({ errorMsg: "A sua nova senha não pode ser igual a antiga." });
    }

    /* Verifica se a senha está correta */
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            errorMsg: "A Senha deve ter: 1 letra em Maiúscula, 1 em Minúscula e ter mais de 7 Caracteres."
        });
    }

    /* Verifica se as senha são iguais */
    if (password !== confPassword) {
        return res.status(400).json({ errorMsg: "As Senhas não são iguais." });
    }

    /* Faz a cryptografia da senha e coloca o hash na senha */
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);

    try {
        /* Atualiza a Senha */
        await User.findByIdAndUpdate(req.params.id, {
            password: passwordHash
        }, { new: true }, (err, resp) => {
            if (err) {
                return res.status(404).json(err); /* 1 - Se houver algum error, o retorna */
            } else {
                return res.status(200).json(resp); /* 2 - Senão retorna os dados do usuário */
            }
        });
    } catch (err) {
        return res.status(400).json(err);
    }

}

/* Exclução de Usuário */
const deleteUser = async (req, res) => {
    try {
        /* Deleta o usário */
        await User.findByIdAndDelete(req.params.id, (err, resp) => {
            /* Se houver algum error, o retorna */
            if (err) {
                return res.status(404).json(err); 
            } 
            
            /* Deleta todas as despesas do usuário */
            Expenses.deleteMany({ userId: req.params.id }, (err) => {
                if (err) {
                    return res.status(404).json(err); /* Se houver algum error, o retorna */
                } else {
                    return res.status(200).json({ msg: "Usuário deletado com sucesso." });
                }
            });		
        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

/* Valida o Token do usuário */
const validateToken = async (req, res) => {
    /* Pega a informação do Token */
    const token = req.body.token || ""; 

    try {
        /* Verifica o token */
        await jwt.verify(token, process.env.AUTH_SECRET, function(err, decoded) {
            if (err) {
                return res.status(404).json({ valid: false });
            } else {
                return res.status(200).json({ valid: true });
            }
        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

/* Recuperação de senha */
const recoveryPassword = (req, res) => {
    try {
        return res.status(200).json({ msg: "Dummy Text!" });
    } catch (err) {
        return res.status(400).json(err);
    }
	/* Pega o email */
	// const email = req.body.email || "";

	// /* Procura no banco o usuário pelo email */
	// User.findOne({ email: email }, (err, user) => {

	// 	/* Se tiver errors, retorna */
	// 	if (err) {
	// 		return res.status(404).json(err);
	// 	}

	// 	/* Verifica se o usuário não existe */
	// 	if (!user) {
	// 		return res.status(404).json({ errorMsg: "O usuário com este email não existe" });
	// 	}

	// 	/* Configura o email */
	// 	const transporter = nodeMailer.createTransport(mailConfig);

	// 	/* Envia o email */
	// 	transporter.sendMail({
	// 		from: `Minhas Despesas - Sistema Gerenciador de Despesas Pessoais <${process.env.MAIL_EMAIL}>`,
	// 		to: email,
	// 		subject: "Recuperação de Senha",
	// 		text: `Sua senha é: ${user.password}`,
	// 		html: `Sua senha é: ${user.password}`
	// 	}, (err, info) => {
	// 		if (err) {
	// 			console.log(`Error: \n ${err}`);
	// 		} else {
	// 			console.log(`Information: \n ${info}`);
	// 		}
	// 	});
		
	// 	/* Envia uma mensagem de sucesso */
	// 	return res.status(200).json({ msg: `Um email foi enviado para: ${email}` });

	// });

}

/* Exporta os Controllers para as rotas */
module.exports = { 
    getUsers,
    getUserById, 
    signup,
    login, 
    updateUserSimple,
    updateUserAdvanced, 
    deleteUser,
	validateToken,
	recoveryPassword
}

/* ========================= Importante ========================= */

/**
 * As duas funções de atualização de usuário são funções Simples e Avançadas.
 * A função simples é apenas um formulário no frontend que só poderá atualizar
 * o nome, email e salário (por enquanto).
 * 
 * Já a função avançada é um formúlario que tem 3 campos: A senha antiga, nova senha
 * e confirmação de senha. Decidi fazer isso pois nem sempre o usuário quer atualizar
 * todos os dados da sua conta, então vou fazer isso de formas separadas
 * 
**/