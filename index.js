const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express()
dotenv.config();

const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")


//connxeion avec mongo
mongoose
.connect(process.env.MONGO_DB_URL)
.then(() => console.log("Connexion à la base de donnée reussie!!"))
.catch((err) =>{
    console.log(err);
})

//tous les chemins

app.use(cors());
app.use(express.json())
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);



//creation du serveur
app.listen(process.env.PORT || 5000, () => {
    console.log('Demarrage du serveur sur le port', process.env.PORT);
})