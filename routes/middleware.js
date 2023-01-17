const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) =>{

    const authHeader = req.header.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
            if(err) res.status(403).json("Token non valide");
            req.user = user;
            next()
        })
    }else{
        return res.status(401).json("Vous n'êtes pas authentifié");

    }
}

const verifyTokenAndAuth = (req,res, next) =>{
verifyToken(req,res, () =>{
    if(req.user.id === res.params.id || req.user.isAdmin){
        next();
    }else{
        return res.status(403).json("impossible d'effectuer cette action");

    }
})
}

const verifyTokenAndAdmin = (req,res,next) =>{
    verifyToken(req,res, () =>{
        if(req.user.isAdmin){
            next();
        }else{
             res.status(403).json("impossible d'effectuer cette ction");

        }
    })
}

module.exports ={
    verifyToken,
    verifyTokenAndAuth,
    verifyTokenAndAdmin
};