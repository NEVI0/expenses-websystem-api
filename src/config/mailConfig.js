/* Enable the Config Vars */
require("dotenv").config();

/* Export the Nodemailer Configurations */
module.exports = {
    host: "smtp.gmail.com",
	port: 587,
	secure: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD
	}
}