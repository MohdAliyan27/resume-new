const express = require('express');
const app=express();
const path = require('path');
const nodemailer = require('nodemailer');
const { engine }= require('express-handlebars');
const bodyParser = require('body-parser');

const port = process.env.port || 4000;
app.locals.layout = false;

//View Engine SetUp
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');


//Static Folder (PUBLIC Folder)
app.use(express.static('public'))
//app.use(express.json())    // <==== parse request body as JSON
//app.use('/public', express.static(path.join(__dirname,'public')));

//Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req,res) =>{
    res.sendFile(path.resolve(__dirname,'views/index.html'));
})

app.get('/map', (req,res) =>{
    res.sendFile(path.resolve(__dirname,'views/map.html'));
})

app.get('/index', (req,res) =>{
    res.render('index');
})

app.post('/sending', (req, res) => {
    console.log("body is ");
    console.log(req.body);
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Subject: ${req.body.subject}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'imap.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'mohd.aliyan.mca@gmail.com', // generated ethereal user
          pass: 'knnentvqvecjjxwy'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'mohd.aliyan.mca@gmail.com', // sender address
        to: 'mohd.aliyan.mca@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        if(info.messageId !=null){
            $(".sent-message").hide();
            console.log("NON Working")
        } else{
            $(".sent-message").show();
            console.log("Working")
        }
        //res.render('index', {msg:'Email has been sent'});
        res.render('index')
    });
});

app.listen(port, () =>{
    console.log("Server Running at 4000");
})
