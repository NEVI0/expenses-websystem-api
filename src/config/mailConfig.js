/* Habilita as variaveis de ambiente */
require("dotenv").config();

/* Exporta as configurações do Nodemailer */
module.exports = {
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD
    }
}