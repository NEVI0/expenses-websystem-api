/* Dependencias */
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

/* Traz a função de enviar email */
const mail = require("../functions/mail");

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
                }, (err, user) => {

                    /* Se houver algum error, o retorna */
                    if (err) {
                        return res.status(404).json(err);
                    }

					/* Envia um email de boas vindas para o usuário */
					mail.welcome(user.name, user.email, res);

                    /* Cria o Token e envia as informações do usuário para o client */
                    const token = jwt.sign(user.toJSON(), process.env.AUTH_SECRET, { expiresIn: "1 day" });
                    const { _id, name, email, salary, imgName, imgUrl } = user;
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
const updateUser = async (req, res) => {
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

/* Envio de email para recuperação de senha */
const forgotPass = async (req, res) => {
	
	/* Pega a informação de email do usuário  */
	const email = req.body.email || "";
	
	try {				
		/* Busca o usuário no banco */
		await User.findOne({ email }, (err, user) => {
			
			/* Se houver algum error, o retorna */
			if (err) {
				return res.status(400).json(err);
			}
			
			/* Verifica se o usuário não existe */
			if (!user) {
				return res.status(400).json({ errorMsg: "O usuário não existe!" });
			}
			
			/* Cria o token para redefinir a senha */
			const key = jwt.sign({
				email: user.email,
				password: user.password
			}, process.env.AUTH_SECRET, { expiresIn: 7200000 });

			/* Cria o token para fazer a requisição */
			const token = jwt.sign(user.toJSON(), process.env.AUTH_SECRET, { expiresIn: "1 day" });
			
			mail.forgotPass(user.name, email, key, token, res);

		});
    } catch (err) {
        return res.status(400).json(err);
    }

}

/* Redefinição de senha do usuário */
const resetPass = async (req, res) => {
	
	/* Pega as informções do usuário */
	const { email, password, token } = req.body;

	try {

		/* Pega o valor contido no token */
		const tokenValues = jwt.verify(token, process.env.AUTH_SECRET);

		await User.findOne({ email }, (err, user) => {

			/* Verifica se existe algum error */
			if (err) {
				return res.status(400).json(err);
			}

			/* Verifica se o usuário existe */
			if (!user) {
				return res.status(400).json({ errorMsg: "O usuário não existe" });
			}			

			/* Verifica se a senha está fazia */
			if (password == "" || password == null) {
				return res.status(400).json({ errorMsg: "Você precisa informar a senha" });
			}

			/* Verifica se a senha está correta */
			if (!passwordRegex.test(password)) {
				return res.status(404).json({
					errorMsg: "A Senha deve ter: 1 letra em Maiúscula, 1 em Minúscula e ter mais de 7 Caracteres."
				});
			}

			/* Verifica se a senha é igual a antiga */
			if (bcrypt.compareSync(password, tokenValues.password)) {
				return res.status(400).json({ errorMsg: "A senha não pode ser igual a antiga" });
			}

			/* Criptografa a senha */
			const salt = bcrypt.genSaltSync();
    		const passwordHash = bcrypt.hashSync(password, salt);

			/* Atualiza a senha do usuário */
			user.updateOne({
				password: passwordHash
			}, (err, resp) => {
				/* Verifica se existe algum error */
				if (err) {
					return res.status(400).json(err);
				} else {
					return res.status(200).json({ msg: "Sua senha foi atualizada com sucesso!" });
				}
			});

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

/* Exporta os Controllers para as rotas */
module.exports = { 
    getUsers,
    getUserById, 
    signup,
    login, 
    updateUser,
	forgotPass, 
	resetPass,
    deleteUser,
	validateToken
}
