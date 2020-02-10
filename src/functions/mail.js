/* Dependencies */
const nodeMailer = require("nodemailer");

/* Nodemailer Configurations */
const mailconfig = require("../config/mailConfig");

/* Enable the Config Vars */
require("dotenv").config();

/* Send a welcome email to the user */
const welcome = async (user, email, res) => {

	/* Create a transporter */
	const transporter = nodeMailer.createTransport(mailconfig);

	/* Message Configuration */
	const message = {
		from: `Minhas Despesas - Sistema Gerenciador de Despesas Pessoais <nevio@test.com>`,
		to: `${user} <${email}>`,
		subject: `Boas Vindas ao Sistema`,
		html: `
			<html lang="en" ⚡4email>
			<head>
				<style>
					* { margin: 0; padding: 0; }
					.container { padding: 15px; }
					.title { text-align: center; margin: 10px 0; }
					.title h2 { font-weight: normal; }
					.title h2 b { color: #6200ea; font-weight: normal; }
					.content { margin: 0 100px; padding: 15px; text-align: justify; }
					.subContent { margin-top: 60px; text-align: center; }
					.subContent a { text-decoration: none; color: #6200ea; outline: none;  }
				</style>
			</head>
			<body>
				<div class="container">
			
					<div class="title">
						<h2>Boas Vindas <b>${user}</b></h2>
					</div>
			
					<div class="content">
						<p>
							Olá ${user}, te desejamos boas vindas ao nosso sistema! Esperamos que você possa usa-lo ao máximo e que ele
							te ajude no seu dia a dia com suas despesas e gastos para que você tenha uma maior controle da sua vida finaceira.
						</p>
					</div>
			
					<div class="subContent">
						<small>Equipe de Programadores do sistema <em>
						<a href="https://expenses-web-system.firebaseapp.com" target="_blank">Minhas Despesas</a>
						</em></small>
					</div>
			
				</div>
			</body>
			</html>
		`
	};
	
	try {
		/* Send the Email */
		await transporter.sendMail(message, (err, info) => {
			if (err) {
				return res.status(400).json(err);
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Send a link to the user for him recovery his password */
const forgotPass = async (user, email, key, token, res) => {	

	/* Create the Transporter */
	const transporter = nodeMailer.createTransport(mailconfig);

	/* Message Configuration */
	const message = {
		from: `Minhas Despesas - Sistema Gerenciador de Despesas Pessoais <nevio@test.com>`,
		to: `${user} <${email}>`,
		subject: `Redefinição de Senha`,
		html: `
			<html lang="en" ⚡4email>
			<head>
				<style>
					* { margin: 0; padding: 0; }
					.container { padding: 15px; }
					.title { text-align: center; margin: 10px 0; }
					.title h2 { font-weight: normal; }
					.title h2 b { color: #6200ea; font-weight: normal; }
					.content { margin: 0 100px; padding: 15px; text-align: justify; }
					.subContent { margin-top: 60px; text-align: center; }
					.subContent a { text-decoration: none; color: #6200ea; outline: none;  }
					.button { margin-top: 45px; text-align: center; padding: 10px; }
					.button a { 
						text-decoration: none;
						font-weight: bold;
						border-radius: 3px;
						color: #fff;
						outline: none;
						padding: 9px 18px;
						transition: 0.5s ease all;
						background-color: #6200ea;
						border: 1px solid #6200ea;
					}
					.button a:hover, .button a:focus { box-shadow: 1px 1px 13px 2px rgba(0, 0, 0, 0.5) }
				</style>
			</head>
			<body>
				<div class="container">
			
					<div class="title">
						<h2>Olá <b>Usuário</b>!</h2>
					</div>
			
					<div class="content">
						<p>
							Se você recebeu esse email, provavelmente você esqueceu a senha da sua conta no nosso sistema, mas não tem problema!
							Click no botão abaixo para redefinir a sua senha.
						</p>
					</div>
			
					<div class="button">
						<a href="${process.env.RESET_PASS_URL}/auth/${key}/${email}/${token}" target="_blank">Redefinir Senha</a>
					</div>
			
					<div class="subContent">
						<small>Equipe de Programadores do sistema <em>
						<a href="https://expenses-web-system.firebaseapp.com" target="_blank">Minhas Despesas</a>
						</em></small>
					</div>
			
				</div>
			</body>
			</html>
		`
	};

	try {
		/* Send the Email */
		await transporter.sendMail(message, err => {
			if (err) {
				return res.status(400).json(err);
			} else {
				return res.status(200).json({ message: `Um email foi enviado para ${email}` });
			}
		});
	} catch (err) {
		return res.status(400).json(err);
	}
}

/* Export the functions */
module.exports = { welcome, forgotPass }