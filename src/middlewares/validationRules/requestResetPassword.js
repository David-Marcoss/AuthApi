const { body} = require('express-validator');
const  validateData = require("../validateData")

function requestResetPasswordUserRules(req, res, next) {

    const validationRules = [
        body('email').isEmail().withMessage('Invalid Email'),
    ];
    
    validateData(validationRules,req, res, next)

}

module.exports = requestResetPasswordUserRules;
