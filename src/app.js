require('dotenv').config();
const express = require("express")
const bodyParser =  require("body-parser")
const dbConnection = require("./database/dbConnection")
const Router =  require("./Routers")

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


Router(app)

dbConnection.authenticate()
    .then(() => console.log("DB conectado ..."))
    .catch( error => console.log("Erro ao conectar DB: ", error))


module.exports =  app