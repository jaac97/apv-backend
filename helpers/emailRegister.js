import nodemailer from 'nodemailer';

import dotenv, {
  config
} from 'dotenv';
dotenv.config()
const emailRegister = async (data) => {
  const {
    name,
    email,
    token
  } = data;

  var transporter = nodemailer.createTransport({
    host: `${process.env.EMAIL_HOST}`,
    port: `${process.env.EMAIL_PORT}`,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASS}`
    }
  });
  let info = await transporter.sendMail({
    from: 'registro@apv.com.ec', // sender address
    to: `${email}`, // list of receivers
    subject: "Registro", // Subject line
          text: "Comprueba tu cuenta en APV",   // plain text body
    html: `
        <p>Hola: ${name},
        <p>Para terminar de registrar tu cuenta es necesario que abras el siguente enlace <a href="${process.env.FRONT_URL}/confirm/${token}">Validar cuenta</a></p>
        <p>Si tu no creaste esta cuenta, puedes ignorar este email</p>
        `, // html body
  });
  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou... 

}
// emailRegister().catch(console.error);
export default emailRegister