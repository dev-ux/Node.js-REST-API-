const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require ("crypto-js");
const jwt = require("jsonwebtoken");

//user register/sign up

router.post("/register", async (req, res) =>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(
            req.body.password,
            process.env.SEC_PASS
        ).toString(),

    });

    try{
        const savedUser = await newUser.save();
        res.json(201).json(savedUser);
    }catch(error){
        res.json(500).json(savedUser);
    }
});

router.post("/login", async(req, res) =>{
    try{
        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json("Erreur d'authentification");

        const hashedPassword = CryptoJs.AES.decrypt(
            user.password,
            process.env.SEC_PASS
        );

        const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);


        originalPassword !== req.body.password &&
        res.status(401).json("Erreur d'auth !!");

        //Cree un accestoken

        const accessToken = jwt.sign(
            {
            id: user._id,
            isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            {expiresIn: "3d"}
        );
        const {password, ...others} = user._doc;
        res.status(200).json({... others, accessToken});
    }catch(error){
        res.status(500).json(err);
    }
});


module.exports = router;