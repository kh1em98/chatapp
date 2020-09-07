const nodemailer = require('nodemailer');

module.exports = async function (name, email, message) {
    const emailVerification = `
    <h4>Hello ${name} </h4>
    <p>Click here to verify your account : ${message}</p> 
    `;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'bestvohoctest@gmail.com', // generated ethereal user
            pass: process.env.PASS_GMAIL // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "Khiem dep trai 👻", // sender address
        to: email, // list of receivers
        subject: 'Email verfication ✔', // Subject line
        html: emailVerification
    })
}