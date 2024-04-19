const dbConnection = require("../../database/dbConnection")
const Sequelize = require("sequelize"); // importar o sequelize


const User = dbConnection.define("users", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password : {
        type: Sequelize.STRING,
        allowNull: false
    },

})


module.exports = User

