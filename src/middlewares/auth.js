const jwt = require("jsonwebtoken")

function auth(req,res,next){
    const authToken =  req.headers["authorization"]
    
    if (authToken){

        jwt.verify(authToken,process.env.JWT_SECRET_KEY,
            (error, token_data) => {
                

                if(error){
                    res.status(401).json({error: "Invalid token !!!"})
                }else{

                    req.token = token_data
                    req.userId = token_data.id

                    next()

                }
            }  
        )
        
    }else{
        res.status(401).json({error: "Invalid token !!!"})
    }
}

module.exports = auth