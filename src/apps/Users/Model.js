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

const ResetPassword = dbConnection.define("reset_password", {
    token: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: true
    },

})

ResetPassword.belongsTo(User)
User.hasMany(ResetPassword)


module.exports = {User, ResetPassword}

