
function authRequired(req, res, next){
    if (!req.cookies.userName) {
        res.redirect("/?err=true");
        return;
    }

    next();
}

module.exports = {
    authRequired
}