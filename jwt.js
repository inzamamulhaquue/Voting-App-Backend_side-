const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) =>{
    
    // check request header authirized or not
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({ error: 'Token not found'});

    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({ error: 'Unauthorised'});

    try{
        // verify jwt token
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decode
        next();
    } catch (err){
        console.log(err);
        res.status(401).json({ error: 'Invalid token'});
    }

}

// Generate token
const generateToken = (userData) =>{
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 10000});
}

module.exports = {jwtAuthMiddleware, generateToken};