const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "jhanelyalmendras26@gmail.com",
        pass: "cmehqlfpeilyxgjx",
    },
});

transporter.verify().then(() => {
    console.log('Verificación de Gmail completada');
});

module.exports = transporter;
