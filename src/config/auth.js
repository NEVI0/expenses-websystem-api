/* JsonWebToken Dependencie */
const jwt = require("jsonwebtoken");

/* Enable the Config Vars */
require("dotenv").config();

/* Export the middleware that block the routes */
module.exports = async (req, res, next) => {

    /* Verify if this is an OPTIONS request */
    if (req.method == "OPTIONS") {
        next();
    } else {

        /* Take the Token */
        const token = req.body.token || req.query.token || req.headers["authorization"];

        /* Verify if the token exists */
        if (!token) {
            return res.status(403).json({ errorMsg: "No token Provided" });
        }

		try {
			/* Verify the Token */
			await jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
				/* 1 - Return the Errors */
				/* 2 - Call the next middleware */
				if (err) {
					return res.status(403).json({ errorMsg: "Failed to authenticate token" });
				} else {
					req.decoded = decoded;
					next();
				}
			});
		} catch (err) {
			return res.status(400).json(err);
		}

    }

}