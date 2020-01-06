/* ========================= Importante ========================= */

/**
 * Leia a mensagem no final do código
**/

/* Dependencias */
const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/* Traz os Schemas / Models */
require("../models/User");
const User = mongoose.model("User");

/* Padrão para o email e senha */
const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /((?=.*[a-z])(?=.*[A-Z]).{7})/;

/* Habilita as variaveis de ambiente */
require("dotenv").config();

/* ===================== Controllers ===================== */

/* Busca todos os usuários */
const getUsers = (req, res, next) => {
    User.find((err, resp) => {        
        if (err) {
            return res.status(503).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna o usuário */
        }
    });
}

/* Busca dados do usuário pelo ID */
const getUserById = (req, res, next) => {
    User.findById(req.params.id, (err, resp) => {
        if (err) {
            return res.status(503).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json(resp); /* 2 - Senão retorna o usuário */
        }
    });
}

/* Cria um usuário / Signup */
const signup = (req, res, next) => {

    /* Pega as informações do usuário */
    const name = req.body.name || "";
    const email = req.body.email || "";
    const password = req.body.password || "";
    const confPassword = req.body.conf_password || "";
    const salary = req.body.salary || "";

    /* Verifica se o email está correto */
    if (!emailRegex.test(email)) {
        return res.status(400).json({ errorMsg: "O E-mail está incorreto." });
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

    /* Criptografa a senha */
    const cipher = crypto.createCipher(process.env.CRYPTO_ALG, process.env.CRYPTO_SECRET);
    cipher.update(password);
    const passwordHash = cipher.final("hex");

    /* Busca no banco um usuário existente */
    User.findOne({ email: email }, (err, user) => {

        /* Se houver algum error, o retorna */
        if (err) {
            return res.status(503).json(err);
        }

        /* 1 - Se existir um usuário, retorna um error */
        /* 2 - Cria um novo usuário */
        if (user) {
            return res.status(400).json({ errorMsg: "O Usuário já existe." });
        } else {

            /* Cria um usuário */
            User.create({
                name: name,
                email: email,
                password: passwordHash,
                salary: salary,
                imgName: "376574365784-imagem.png",
                imgUrl: "https://amazon-s3.com/debbuing"
            }, (err, resp) => {

                /* Se houver algum error, o retorna */
                if (err) {
                    return res.status(503).json(err);
                }

                /* Cria o Token */
                const token = jwt.sign(resp.toJSON(), process.env.AUTH_SECRET, { expiresIn: "1 day" });

                /* Extrai as informações do usuário */
                const { _id, name, email, salary, imgName, imgUrl } = resp;

                /* Retorna para o cliente (Frontend) os dados */
                return res.status(200).json({ _id, name, email, salary, imgName, imgUrl, token });

            });

        }

    });

}

/* Autenticação de usuário / Login */
const login = (req, res, next) => {

}

/* Atualização de usuário */
const updateUserSimple = (req, res, next) => {

    /* Pega as informações do usuário */
    const name = req.body.name || "";
    const email = req.body.email || "";
    const salary = req.body.salary || "";

    /* Verifica se o email está correto */
    if (!emailRegex.test(email)) {
        return res.status(400).json({ errorMsg: "O E-mail está incorreto." });
    }

    /* Busca no banco um usuário existente */
    User.findOne({ email: email }, (err, user) => {

        /* Se houver algum error, o retorna */
        if (err) {
            return res.status(503).json(err);
        }

        /* 1 - Se existir um usuário, retorna um error */
        /* 2 - Cria um novo usuário */
        if (user) {
            return res.status(400).json({ errorMsg: "O Email já está cadastrado" });
        } else {

            User.findByIdAndUpdate(req.params.id, {
                name: name,
                email: email,
                salary: salary,                
                imgName: "376574365784-imagem.png",
                imgUrl: "https://amazon-s3.com/debbuing"
            }, { new: true }, (err , resp) => {
                /* 1 - Se houver algum error, o retorna */
                /* 2 - Senão retorna os dados do usuário */
                if (err) {
                    return res.status(503).json(err);
                } else {
                    return res.status(200).json(resp);
                }
            });

        }

    });

}

/* Atualização de usuário */
const updateUserAdvanced = (req, res, next) => {
    
    /* Pega as informações do usuário */
    const oldPassword = req.body.old_password || "";
    const password = req.body.password || "";
    const confPassword = req.body.conf_password || "";

    /* Verifica se a senha está correta */
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            errorMsg: "A Senha deve ter: 1 letra em Maiúscula, 1 em Minúscula e ter mais de 7 Caracteres."
        });
    }
    
    /* Verifica se a senha nova é diferente da antiga */
    if (password === oldPassword) {
        return res.status(400).json({ errorMsg: "A sua nova senha não pode ser igual a antiga." });
    }

    /* Verifica se as senha são iguais */
    if (password !== confPassword) {
        return res.status(400).json({ errorMsg: "As Senhas não são iguais." });
    }

    /* Criptografa a senha */
    const cipher = crypto.createCipher(process.env.CRYPTO_ALG, process.env.CRYPTO_SECRET);
    cipher.update(password);
    const passwordHash = cipher.final("hex");

    /* Atualiza a Senha */
    User.findByIdAndUpdate(req.params.id, {
        password: passwordHash
    }, { new: true }, (err, resp) => {
        /* 1 - Se houver algum error, o retorna */
        /* 2 - Senão retorna os dados do usuário */
        if (err) {
            return res.status(503).json(err);
        } else {
            return res.status(200).json(resp);
        }
    });

}

/* Exclução de Usuário */
const deleteUser = (req, res, next) => {
    User.findByIdAndDelete(req.params.id, (err, resp) => {
        if (err) {
            return res.status(503).json(err); /* 1 - Se houver algum error, o retorna */
        } else {
            return res.status(200).json({ msg: "Usuário deletado com sucesso." }); /* 2 - Senão retorna o usuário */
        }
    });
}

/* Exporta os Controllers para as rotas */
module.exports = { getUsers, getUserById, signup, login, updateUserSimple, updateUserAdvanced, deleteUser }

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