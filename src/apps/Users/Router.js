const express = require("express")
const UserController = require("./Controller")
const auth = require("./../../middlewares/auth")

const UserRouter = express.Router()

UserRouter.post("/users/login", UserController.authentication)
UserRouter.post("/users", UserController.create)
UserRouter.get("/users",auth, UserController.findAll)
UserRouter.get("/users/:id",auth, UserController.findOne)
UserRouter.put("/users/:id",auth, UserController.update)
UserRouter.delete("/users/:id",auth, UserController.delete)


module.exports = UserRouter