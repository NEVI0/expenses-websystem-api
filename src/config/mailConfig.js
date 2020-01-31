/* Enable the Config Vars */
require("dotenv").config();

/* Export the Nodemailer Configurations */
module.exports = {
    host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD
	}
}