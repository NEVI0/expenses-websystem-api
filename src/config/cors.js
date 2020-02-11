module.exports = (req, res, next) => {
	// const allowedOrigins = ["https://expenses-web-system.firebaseapp.com", "https://expenses-web-system-reset-pass.firebaseapp.com"];
	// const origin = req.headers.origin;

	// if (allowedOrigins.indexOf(origin) > -1) {
	// 	res.setHeader("Access-Control-Allow-Origin", origin);
	// }
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
}