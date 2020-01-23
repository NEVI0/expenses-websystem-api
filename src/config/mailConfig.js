/* Habilita as variaveis de ambiente */
require("dotenv").config();

/* Exporta as configurações do Nodemailer */
module.exports = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD
    }
}