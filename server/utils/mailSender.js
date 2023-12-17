const nodemailer = require("nodemailer");


const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })

            transporter.verify((error, success) => {
                if (error) {
                    console.log(error);
                    console.log("Mail service Not Working...")
                }
                if (success) {
                    console.log("Mail service activated...")
                    console.log("Ready to send messages...")
                }
            })

            let info = await transporter.sendMail({
                from:process.env.MAIL_USER,
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


module.exports = mailSender;