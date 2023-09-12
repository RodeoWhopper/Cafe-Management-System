function isAdmin(req,res,next){
    if(res.locals.role === "user"){
        res.sendStatus(401)
    } else {
        next();
    }
}

module.exports = { isAdmin : isAdmin };