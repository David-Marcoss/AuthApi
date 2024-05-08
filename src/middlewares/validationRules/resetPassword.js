const { body} = require('express-validator');
const  validateData = require("../validateData")

function resetPasswordUserRules(req, res, next) {

    const validationRules = [
        body('password').isLength({min: 8}).withMessage('the password must contain at least 8 characters')
    ];
    
    validateData(validationRules,req, res, next)

}

module.exports = resetPasswordUserRules;
