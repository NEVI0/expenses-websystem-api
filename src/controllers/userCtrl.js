/* Dependencies */
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/* Bring the Schemas / Models */
require("../models/User");
const User = mongoose.model("User");
require("../models/Expenses");
const Expenses = mongoose.model("Expense");

/* Email and Password Regex */
const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /((?=.*[a-z])(?=.*[A-Z]).{7})/;

/* Enable the Config Vars */
require("dotenv").config();

/* Bring the Functions */
const mail = require("../functions/mail");
const upload = require("../functions/uploadImage");

/* ===================== Controllers ===================== */

/* Get all the users */
const getUsers = async (req, res) => {
    try {
        await User.find((err, users) => {        
            if (err) {
                return res.status(404).json(err); /* Return the Errors */
            } else {
                return res.status(200).json(users); /* Return the Users */
            }
        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

/* Get an user bu OD */
const getUserById = async (req, res) => {
    try {
        await User.findById(req.params.id, (err, user) => {
            if (err) {
                return res.status(404).json(err); /* Return the Errors */
            } else {
                return res.status(200).json(user); /* Return the User */
            }
        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

/* Create a User / Signup */
const signup = async (req, res) => {

    /* Take the User Informations */
    const name = req.body.name || "";
    const email = req.body.email || "";
    const password = req.body.password || "";
    const confPassword = req.body.conf_password || "";

    /* Verify if the email is correct */
    if (!emailRegex.test(email)) {
        return res.status(404).json({ errorMsg: "O E-mail está incorreto." });
    }

    /* Verify if the password is correct */
    if (!passwordRegex.test(password)) {
        return res.status(404).json({
            errorMsg: "A Senha deve ter: 1 letra em Maiúscula, 1 em Minúscula e ter mais de 7 Caracteres."
        });
    }

    /* Verify if the passwords are equal */
    if (password !== confPassword) {
        return res.status(404).json({ errorMsg: "As Senhas não são iguais." });
    }

    /* Make the password cryptografy */
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);

    try {
        await User.findOne({ email: email }, (err, user) => {

            /* Return the Errors */
            if (err) {
                return res.status(404).json(err);
            }

            /* 1 - Verify if the user already exists */
            /* 2 - Create a new user */
            if (user) {
                return res.status(404).json({ errorMsg: "O Usuário já existe." });
            } else {

                User.create({
                    name: name,
                    email: email,
                    password: passwordHash,
                    salary: 1000,
                    imgName: ""
                }, (err, user) => {

                    /* Return the Errors */
                    if (err) {
                        return res.status(404).json(err);
                    }

					/* Send a welcome email to the user */
					mail.welcome(user.name, user.email, res);

                    /* Create a token end send it to the client */
                    const token = jwt.sign(user.toJSON(), process.env.AUTH_SECRET, { expiresIn: "1 day" });
                    const { _id, name, email, salary, imgName } = user;
                    return res.status(200).json({ _id, name, email, salary, imgName, token });

                });

            }

        });
    } catch (err) {
        return res.status(400).json(err);
    }

}

/* User Authentication / Login */
const login = async (req, res) => {

    /* Take the user Informations */
    const email = req.body.email || "";
    const password = req.body.password || "";
    
    try {
        await User.findOne({ email: email }, (err, user) => {
            
            /* Return the Errors */
            if (err) {
                return res.status(404).json(err);
            }

            /* Verify if the user already exists */
            if (!user) {
                return res.status(404).json({ errorMsg: "O usuário não existe" });
            }   
            
            /* Verify is the passwords are equal */
            if (bcrypt.compareSync(password, user.password)) {
                
                /* Create the token and send it to the client */
                const token = jwt.sign(user.toJSON(), process.env.AUTH_SECRET, { expiresIn: "1 day" });
                const { _id, name, email, salary, imgName } = user;
                return res.status(200).json({ _id, name, email, salary, imgName, token });

            } else {
                return res.status(404).json({ errorMsg: "Email ou Senha inválidos" });
            }

        });
    } catch (err) {
        return res.status(400).json(err);
    }   

}

/* update the user by ID */
const updateUser = async (req, res) => {
    try {

        /* Update the user Data */
        await User.findByIdAndUpdate(req.params.id, req.body, { 
            new: true 
        }, (err , user) => {

            if (err) {
                return res.status(404).json(err); /* Return the Errors */
			}
			            
            /* Create the token and send it to the client */
            const token = jwt.sign(user.toJSON(), process.env.AUTH_SECRET, { expiresIn: "1 day" });
            const { _id, name, email, salary, imgName } = user;
            return res.status(200).json({ _id, name, email, salary, imgName, token });

        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

/* Update the User Image */
const updateUserImage = async (req, res) => {
	try {

		/* Verify if the image exists */
		if (!req.file) {
			return res.status(400).json({ errorMsg: "Nenhuma imagem foi enviada!" });
		}

		/* Send the image to the Firebase */
		upload.uploadImageToFirebase(req.file);
		console.log("");
		console.log(req.file); 
		console.log("");
		await User.findByIdAndUpdate(req.params.id, {
			imgName: req.file.filename
		}, { new: true }, (err, user) => {

			if (err) {
                return res.status(404).json(err); /* Return the Errors */
			}
			            
            /* Create the token and send it to the client */
            const token = jwt.sign(user.toJSON(), process.env.AUTH_SECRET, { expiresIn: "1 day" });
            const { _id, name, email, salary, imgName } = user;
			return res.status(200).json({ _id, name, email, salary, imgName, token });
			
		});


	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Send a email to reset the user password */
const forgotPass = async (req, res) => {
	
	/* Take the user email Information  */
	const email = req.body.email || "";
	
	try {				
		await User.findOne({ email }, (err, user) => {
			
			/* Return the Errors */
			if (err) {
				return res.status(400).json(err);
			}
			
			/* Verify if the user already exists */
			if (!user) {
				return res.status(400).json({ errorMsg: "O usuário não existe!" });
			}
			
			/* Create the token / key to reset the password */
			const key = jwt.sign({
				email: user.email,
				password: user.password
			}, process.env.AUTH_SECRET, { expiresIn: 7200000 });

			/* Create a token to enable the request */
			const token = jwt.sign(user.toJSON(), process.env.AUTH_SECRET, { expiresIn: "1 day" });
			
			/* Send the email to the user */
			mail.forgotPass(user.name, email, key, token, res);

		});
    } catch (err) {
        return res.status(400).json(err);
    }

}

/* Reset the user password */
const resetPass = async (req, res) => {
	
	/* Take the user Informations */
	const { email, password, key } = req.body;

	try {

		/* Taken the Token Values */
		const keyValues = jwt.verify(key, process.env.AUTH_SECRET);

		await User.findOne({ email }, (err, user) => {

			/* Return the Errors */
			if (err) {
				return res.status(400).json(err);
			}

			/* Verify if the user already exists */
			if (!user) {
				return res.status(400).json({ errorMsg: "O usuário não existe" });
			}			

			/* Verify if the password is empty */
			if (password == "" || password == null) {
				return res.status(400).json({ errorMsg: "Você precisa informar a senha" });
			}

			/* Verify if the password is correct */
			if (!passwordRegex.test(password)) {
				return res.status(404).json({
					errorMsg: "A Senha deve ter: 1 letra em Maiúscula, 1 em Minúscula e ter mais de 7 Caracteres."
				});
			}

			/* Verify if the password is the equal to the old one */
			if (bcrypt.compareSync(password, keyValues.password)) {
				return res.status(400).json({ errorMsg: "A senha não pode ser igual a antiga" });
			}

			/* Make the password cryptografy */
			const salt = bcrypt.genSaltSync();
    		const passwordHash = bcrypt.hashSync(password, salt);

			/* Update the user password */
			user.updateOne({
				password: passwordHash
			}, (err) => {
				if (err) {
					return res.status(400).json(err); /* Return the Errors */
				} else {
					return res.status(200).json({ msg: "Sua senha foi atualizada com sucesso!" }); /* Return a success message */
				}
			});

		});

	} catch (err) {
		return res.status(400).json(err);
	}

}

/* Delete the user by ID */
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id, (err, resp) => {
            if (err) {
                return res.status(404).json(err); /* Return the Errors */
            } 
            
            /* Delete all user expenses */
            Expenses.deleteMany({ userId: req.params.id }, (err) => {
                if (err) {
                    return res.status(404).json(err); /* Return the Errors */
                } else {
                    return res.status(200).json({ msg: "Usuário deletado com sucesso." }); /* Return a success message */
                }
            });		
        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

/* Validate the user Token */
const validateToken = async (req, res) => {
    /* Take the token Information */
    const token = req.body.token || ""; 

    try {
        /* Verify the Token */
        await jwt.verify(token, process.env.AUTH_SECRET, function(err) {
            if (err) {
                return res.status(404).json({ valid: false }); /* Return the status */
            } else {
                return res.status(200).json({ valid: true }); /* Return the status */
            }
        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

/* Export the controller to the routes */
module.exports = { 
    getUsers,
    getUserById, 
    signup,
    login, 
	updateUser,
	updateUserImage,
	forgotPass, 
	resetPass,
    deleteUser,
	validateToken
}
