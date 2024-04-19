const UserRouter = require("./apps/Users/Router")

const Routers = app =>{
    app.use(
        UserRouter,
    )
}



module.exports = Routers