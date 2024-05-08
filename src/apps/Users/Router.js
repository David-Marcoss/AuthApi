const express = require("express")
const UserController = require("./Controller")

const auth = require("./../../middlewares/auth")
const authenticationRules = require("../../middlewares/validationRules/authentication")
const createRules = require("../../middlewares/validationRules/create")
const updateRules = require("../../middlewares/validationRules/update")
const changePasswordRules = require("../../middlewares/validationRules/changePassword")
const requestResetPasswordRules = require("../../middlewares/validationRules/requestResetPassword")
const resetPasswordRules = require("../../middlewares/validationRules/resetPassword")

const UserRouter = express.Router()

UserRouter.post("/users/login", authenticationRules, UserController.authentication)
UserRouter.post("/users", createRules, UserController.create)
UserRouter.get("/users",auth, UserController.findAll)
UserRouter.get("/users/:id",auth, UserController.findOne)
UserRouter.put("/users/:id",auth, updateRules,UserController.update)
UserRouter.delete("/users/:id",auth, UserController.delete)
UserRouter.post("/users/change-password/:id",auth,changePasswordRules, UserController.changePassword)
UserRouter.post("/users/request-reset-password",requestResetPasswordRules,UserController.requestResetPassword),
UserRouter.post("/users/reset-password/:token",resetPasswordRules,UserController.resetPassword)


module.exports = UserRouter