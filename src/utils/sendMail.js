const nodemailer = require("nodemailer")
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth:{
        user: process.env.EMAIL_HOST_USER ,
        pass: process.env.EMAIL_HOST_PASSWORD
    }
})


function sendMail(user_email,url){
    
    let mailOptions = {
        from: process.env.EMAIL_HOST_USER,
        to: user_email,
        subject: "Solicitação de redefinição de senha - AUTHAPI",
        html:`<h2> Acesse o link abaixo para redefinir sua senha</h2><br><p>${url}</p>`
      };

      transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
          console.log(data);
        }
      });
}


module.exports = sendMail