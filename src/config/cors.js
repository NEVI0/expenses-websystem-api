module.exports = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://expenses-web-system.firebaseapp.com, https://expenses-web-system-reset-pass.firebaseapp.com");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
}