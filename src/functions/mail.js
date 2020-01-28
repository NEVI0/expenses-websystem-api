/* Dependencias */
const nodeMailer = require("nodemailer");

/* Configurações do NodeMailer */
const mailconfig = require("../config/mailConfig");

/* Função para enviar email */
module.exports = {

	/* Envia um email de Boas Vindas para o usuário */
	async welcome(user, email, res) {
		/* Cria o transporter para enviar o email */
		const transporter = nodeMailer.createTransport(mailconfig);
	
		/* Configurações para a mensagem */
		const message = {
			from: `Minhas Despesas - Sistema Gerenciador de Despesas Pessoais <nevio@test.com>`,
			to: `${user} <${email}>`,
			subject: `Boas Vindas ao Sistema`,
			html: `
				<html ⚡4email>
					<head>
						<meta charset="utf-8">
						<style>
							h1 {
								text-align: center;
								color: blue;
							}
						</style>
					</head>
					<body>
						<h1>Hey ${user}!</h1>
	
						<p>Bem vindo ao nosso sistema!</p>
	
						<br>
						
						:)
					</body>
				</html>
			`
		};
		
		try {
			/* Envia o email */
			await transporter.sendMail(message, (err, info) => {
				if (err) {
					return res.status(400).json(err);
				}
			});
		} catch (err) {
			return res.status(400).json(err);
		}
	},

	/* Envia um email para o usuário para a redefinição de senha */
	async forgotPass(user, email, token, res) {	
		/* Cria o transporter para enviar o email */
		const transporter = nodeMailer.createTransport(mailconfig);
	
		/* Configurações para a mensagem */
		const message = {
			from: `Minhas Despesas - Sistema Gerenciador de Despesas Pessoais <nevio@test.com>`,
			to: `${user} <${email}>`,
			subject: `Redefinição de Senha`,
			html: `
				<html ⚡4email>
					<head>
						<meta charset="utf-8">
						<style>
							h1 {
								text-align: center;
								color: red;
							}
						</style>
					</head>
					<body>
						<h1>Hey ${user}!</h1>
	
						<p>Você esqueceu sua senha, não tem problema! Use o token abaixo para redefini-lá.</p>
	
						<br>
						
						<p>Token: ${token}</p>
					</body>
				</html>
			`
		};
		
		try {
			/* Envia o email */
			await transporter.sendMail(message, (err, info) => {
				if (err) {
					return res.status(400).json(err);
				} else {
					return res.status(200).json({ msg: `Um email foi enviado para ${email}` });
				}
			});
		} catch (err) {
			return res.status(400).json(err);
		}
	}

}