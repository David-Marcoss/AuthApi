const { raw } = require("body-parser");
const User = require("./Model")
const bcrypt = require('bcrypt');

class UserController{

    static async create(req,res){
        const { name, email, password } = req.body

        if (name, email , password){
            try{
                if( await User.findOne({where: {email}}) != undefined){
                    res.status(400).json({error: "email already registered !!"})
                }
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password,salt)

                await User.create({
                    name,
                    email,
                    password: hash
                })

                res.status(201).json({msg: "created"})

            }catch (error) {
                res.status(500).json({error})
            }
        }else{
            res.status(400).json({error: "Bad request !!"})
        }

    }

    static async update(req, res) {
        const data = req.body;
        const id = req.params.id;
    
        try {
            const user = await User.findByPk(id);
            if (!user) {
                res.status(404).json({ error: "User not found!" });
            }
    
            if (data.password) {
                const salt = bcrypt.genSaltSync(10);
                data.password = bcrypt.hashSync(data.password, salt);
            }

            const updatedUser  = await User.update(data, { where: { id } });

            res.status(200).json({msg: "updeted"});

        } catch (error) {
            console.error("Error updating user:", error);

            res.status(400).json({ error: "Invalid data!" });
        }
    }

    static async findOne(req, res) {
        const id = req.params.id;
    
        try {
            if (isNaN(id)){
                res.status(400).json({ error: "bad Request !!" });
            }
            
            const user = await User.findByPk(id);
            
            if (!user) {
                res.status(404).json({ error: "User not found!" });
            }else{
                
                const data = user.toJSON()

                delete data.password

                res.status(200).json(data);
            }
        } catch (error) {
            res.status(500).json({ error });
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
        const id = req.params.id;
    
        try {
            if ( await User.findByPk(id)  == undefined) {
                res.status(404).json({ error: "User not found!" });
            
            }else{

                await User.destroy({where: {id}})

                res.status(200).json({msg:"deleted!!"});
            }

        } catch (error) {
            res.status(500).json({ error });
        }
    }
    

}

module.exports = UserController