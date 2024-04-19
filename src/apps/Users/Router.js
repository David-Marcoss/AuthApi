const express = require("express")
const UserController = require("./Controller")

const UserRouter = express.Router()

UserRouter.post("/users", UserController.create)
UserRouter.get("/users", UserController.findAll)
UserRouter.get("/users/:id", UserController.findOne)
UserRouter.put("/users/:id", UserController.update)
UserRouter.delete("/users/:id", UserController.delete)


module.exports = UserRouter