const User = require("./Model")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

class UserController{

    static async authentication(req,res){
        const {email, password} = req.body
        
        if (email && password){

            const user =  await User.findOne({where: {email}})

            if (user && bcrypt.compareSync(password, user.password)) {

                await jwt.sign(
                    {id: user.id},
                    process.env.JWT_SECRET_KEY,
                    {expiresIn: "48h"}, 
                    (error, token) =>{
                        if (error){
                            res.status(500).json({error})
                        }else{
                            res.status(200).json({token})
                        }
                    }
                )

            }else{
                res.status(400).json({error: "invalid credentials !!"})
            }


        }else{
            res.status(400).json({error: "Bad request !!"})
        }

    }

    static async create(req,res){
        const { name, email, password } = req.body

        if (name, email , password){
            try{
                if( await User.findOne({where: {email}}) != undefined){
                    res.status(400).json({error: "email already registered !!"})
                }
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password,salt)

                const user = await User.create({
                    name,
                    email,
                    password: hash
                })
                
                const data = user.toJSON()

                delete data.password

                res.status(201).json(data)

            }catch (error) {
                res.status(500).json({error})
            }
        }else{
            res.status(400).json({error: "Bad request !!"})
        }

    }

    static async update(req, res) {
        const data = req.body
        const id = req.params.id
    
        try {

            if (req.userId != id){
                res.status(401).json({ error: "You do not have authorization to update this user !!" })
            }else{

                if (data.password) {
                    const salt = bcrypt.genSaltSync(10)
                    data.password = bcrypt.hashSync(data.password, salt)
                }

                await User.update(data, { where: { id } })
                
                const user = await User.findOne({ where: { id } })
                const user_updeted = user.toJSON()

                delete user_updeted.password

                res.status(200).json(user_updeted)
            }

        } catch (error) {

            res.status(400).json({ error: "Invalid data!" })
        }
    }

    static async findOne(req, res) {
        const id = req.params.id
    
        try {
            if (isNaN(id)){
                res.status(400).json({ error: "bad Request !!" })
            }
            
            const user = await User.findByPk(id)
            
            if (!user) {
                res.status(404).json({ error: "User not found!" })
            }else{
                
                const data = user.toJSON()

                delete data.password

                res.status(200).json(data)
            }
        } catch (error) {
            res.status(500).json({ error })
        }
    }

    static async findAll(req, res) {
        
        const data = await User.findAll({raw:true})

        const users = data.map( e => {
            delete e.password

            return e
        })

        res.status(200).json(users)
    }

    static async delete(req, res) {
        const id = req.params.id
    
        try {
            if (req.userId != id){
                res.status(401).json({ error: "You do not have authorization to delete this user !!" })
            }else{

                await User.destroy({where: {id}})

                res.status(200).json({msg:"deleted!!"})
            }

        } catch (error) {
            res.status(500).json({ error })
        }
    }
    

}

module.exports = UserController