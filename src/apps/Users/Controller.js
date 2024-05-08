const {User, ResetPassword} = require("./Model")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
var crypto = require('crypto');
const sequelize = require("../../database/dbConnection"); // importar o sequelize
const sendMail = require("../../utils/sendMail")

class UserController{

    async authentication(req,res){
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

    async create(req,res){
        try{
            const { name, email, password } = req.body

            if (name, email , password){

                if( await User.findOne({where: {email}}) != undefined){
                    res.status(400).json({error: "email already registered !!"})
                }else{
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
                }
            
            }else{
                res.status(400).json({error: "Bad request !!"})
            }

        }catch (error) {
            res.status(500).json({error})
        }

    }

    async update(req, res) {
        const data = req.body
        const id = req.params.id
    
        try {

            if (req.userId != id){
                res.status(401).json({ error: "You do not have authorization to update this user !!" })
            }else{

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

    async delete(req, res) {
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

    async findOne(req, res) {
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

    async findAll(req, res) {
        
        const data = await User.findAll({raw:true})

        const users = data.map( e => {
            delete e.password

            return e
        })

        res.status(200).json(users)
    }

    async changePassword(req, res) {
        const {old_password, new_password} = req.body
        const id = req.params.id
    
        try {

            if (req.userId != id){
                res.status(401).json({ error: "You do not have authorization to update this user !!" })
            }else{
                
                const user = await User.findByPk(id)
                
                if (bcrypt.compareSync(old_password, user.password)) {
                    
                    const salt = bcrypt.genSaltSync(10)
                    const hash = bcrypt.hashSync(new_password, salt)
                    
                    await User.update({password: hash}, { where: { id } })

                    res.status(200).json({ msg: "password changed !!" })
                
                }else{
                    res.status(400).json({ error: "incorrect password !!" })
                }
            }
        } catch (error) {
            res.status(500).json({ error })
        }
    }

    async requestResetPassword(req, res){
        const {email} = req.body

        const user = await User.findOne({
            where: { email }
        })

        if(user){

            const hasRequest = await ResetPassword.findOne({
                where: {
                    userId: user.id,
                    ative: true
                }
            })
            
            if ( hasRequest == null){

                const token = crypto.randomBytes(20).toString('hex'); // Gera um token seguro

                await ResetPassword.create({
                    token,
                    ative: true,
                    userId: user.id
                })

                const url =  `http://localhost:3000/users/reset-password/${token}`
                sendMail(email,url)

                res.status(200).json({
                    msg:"An email was sent with instructions for resetting your password !!"
                })
            
            }else{
                res.status(400).json({ 
                    error: "There is a password reset request pending for this user, please check your email. !!" 
                })
            }

        }else{
            res.status(400).json({ error: "E-mail does not exist !!" })
        }
    }

    async resetPassword(req, res){
        try {
            const { password } = req.body;
            const { token } = req.params;
    
            const request = await ResetPassword.findOne({
                where: {
                    token
                }
            });
    
            if (request == null || !request.active) {
                return res.status(404).json({ error: "Invalid or expired token" });
            }
    
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
    
            await sequelize.transaction(async (t) => {
                await User.update({ password: hash }, { where: { id: request.userId }, transaction: t });
                await ResetPassword.update({ active: false }, { where: { id: request.id }, transaction: t });
            });
    
            res.status(200).json({ msg: "Password changed successfully" });
        } catch (error) {
            console.error("Error in resetPassword:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    
}

module.exports = new UserController()