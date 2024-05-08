const {validationResult } = require('express-validator');

function validateData(validationRules, req, res, next) {

    Promise.all(validationRules.map(validation => validation.run(req))).then(() => {
      
        
        const errors = validationResult(req);
        // Verifica se há dados extras na requisição
        const extraKeys = Object.keys(req.body).filter(key => !validationRules.some(rule => rule.builder.fields.includes(key)));
        
        // verifica se alguma regra foi quebrada
        if (extraKeys.length > 0) {
            res.status(422).json({ error: 'Extra data is not allowed' });
        }else if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        }else{
            next();
        }

        
    });
}

module.exports = validateData;
