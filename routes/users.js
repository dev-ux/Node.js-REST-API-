const router = require("express").Router();
const User = require("../models/User");


const {
    verifyToken,
    verifyTokenAndAuth,
    verifyTokenAndAdmin
} = require("./middleware");

//mise à jour du profile

router.put("/:id", verifyTokenAndAuth, async (req,res) =>{
    //if(req.body.password){

    //}

    try{
        const updateUser = await User.findByIdAndUpdate(
            res.params.id,
            {
                $set: req.body,
            },
            {
                new: true
            }
            
            );
            res.status(201).json(updateUser);
    }catch(error){
        res.status(500).json(error);
    }
});


router.delete("/:id", verifyTokenAndAuth, async (req,res) =>{
    //if(req.body.password){

    //}

    try{
        const updateUser = await User.findByIdAndDelete(
            res.params.id,);
            res.status(201).json("Utilisateur supprimé avec succès");
    }catch(error){
        res.status(500).json(error);
    }
});


// partie admin

router.get("/find/:id", verifyTokenAndAuth, async (req,res) =>{

    try{
        const user = await User.findById(
            res.params.id,);
            const{password, ...others} = user._doc;
            res.status(201).json(others);
    }catch(error){
        res.status(500).json(error);
    }
});





router.get("/", verifyTokenAndAuth, async (req,res) =>{
    const query = req.query.new;

    try{
        const users = query ? await User.find().sort({_id: -1}).limit(5) 
        :await User.find();
            //const{password, ...others} = user._doc;
            res.status(201).json(users);
    }catch(error){
        res.status(500).json(error);
    }
});



// obtenir le nombre d'utilisateurs
router.get("/stats", verifyTokenAndAuth, async (req,res) =>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try{
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project:{
                    mont: {$month: "$createdAt"},
                },
            },
           {
            $group:{
                _id: "$month",
                total: {$sum: 1},
                },
           }
        ]);
        res.status(202).json(data);
    }catch(error){
        res.status(500).json(error);
    }
});


module.exports = router;