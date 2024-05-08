const { body} = require('express-validator');
const  validateData = require("../validateData")

function updateUserRules(req, res, next) {

    const validationRules = [
        body('name').optional(),
        body('email').optional().isEmail().withMessage('Invalid Email'),
    ];
    
    validateData(validationRules,req, res, next)

}

module.exports = updateUserRules;
