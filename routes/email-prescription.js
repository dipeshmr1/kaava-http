const nodemailer = require("nodemailer");

async function emailPrescription(req, res){

  
//   let account = await nodemailer.createTestAccount();

try{
    console.log('hello')
  // create reusable transporter object using the default SMTP transport
  let transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'dipeshmr1@gmail.com', // generated ethereal user
      pass: 'Hellonemo@123' // generated ethereal password
    }
  })

  // setup email data with unicode symbols
  //attachment option see nodemailer site
  let mailOptions = {
    from: '"dipeshmr1@gmail.com', // sender address
    to: "dipesh.maurya@bookmyshow.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  }

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId)
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
  res.status(200).send(info.messageId)
}catch(err) {


}


}

module.exports = emailPrescription