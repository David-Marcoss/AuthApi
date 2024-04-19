const dbConnection = require("./dbConnection")
const User = require("../apps/Users/UserModel")

// criar tabelas no banco de dados

dbConnection.authenticate()
    .then(() => console.log("DB conectado ..."))
    .catch( error => console.log("Erro ao conectar DB: ", error))

User.sync({force: false}).then(() => {})
