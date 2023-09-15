const jwt = require('jsonwebtoken');
const connectionUtil = require('../util/connectionUtil');

const configObject = connectionUtil.getYaml();

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.sendStatus(401);
    }
    jwt.verify(token,configObject.server.authentication.secret_key,(err,response) => {
        if(err){
            return res.sendStatus(403);
        }
        res.locals = response;
        next();
    });
}

module.exports = { authenticateToken : authenticateToken };