const { body} = require('express-validator');
const  validateData = require("../validateData")

function changePasswordUserRules(req, res, next) {

    const validationRules = [
        body('old_password').isLength({min: 8}).withMessage('the password must contain at least 8 characters'),
        body('new_password').isLength({min: 8}).withMessage('the password must contain at least 8 characters')
    ];
    
    validateData(validationRules,req, res, next)

}

module.exports = changePasswordUserRules;
