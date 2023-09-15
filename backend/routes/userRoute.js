const express = require('express');
const connection = require('../connection');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const connectionUtil = require('../util/connectionUtil');
const auth = require('../services/authentication');
const checkRole = require('../services/isAdmin');
const {authenticateToken} = require("../services/authentication");
const {isAdmin} = require("../services/isAdmin");

const router = express.Router();

const configObject = connectionUtil.getYaml();

//user must be signed in to use authenticateToken APIs
//user role must be admin to use isAdmin APIs

//signup api
router.post('/signup',(req, res) => {
    let user = req.body;
    let checkQuery = "select * from users where email=?";
    connection.query(checkQuery,[user.email],(err,results) => {
        if(!err){
            if(results.length <= 0){
                let insertQuery = "insert into users(name,contact_number,email,password,status,role) values(?,?,?,?,'false','user')";
                connection.query(insertQuery,[user.username,user.contactNumber,user.email,user.password],(err,results) =>{
                    if(!err){
                        return res.status(200).json({message:'Successfully registered.'});
                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({message:'Email already taken bu another user.'});
            }
        } else {
            return res.status(500).json(err);
        }
    })

})



//login api
router.post('/login',(req, res) => {
    let user = req.body;
    let checkQuery = "select email,password,role,status from users where email=?";
    connection.query(checkQuery,[user.email],(err,results) => {
        if(!err){
            if(results.length <= 0 || results[0].password !== user.password) {
                return res.status(401).json({message:'Unauthorized email or password'});
            } else if(results[0].status === 'false') {
                return res.status(401).json({message:'Wait for admin approval'});
            } else if(results[0].password === user.password) {
                const response = { email: results[0].email, role: results[0].role};
                const authToken = jwt.sign(response,String(configObject.server.authentication.secret_key),{expiresIn:'1h'});
                res.status(200).json({ token: authToken });
            } else {
                return res.status(400).json({message:'Something went wrong'});
            }
        } else {
            return res.status(500).json(err);
        }
    })
})


//change password api ---- authentication
router.post('/changePassword',authenticateToken ,(req, res) => {
    let user = req.body;
    const email = res.locals.email;
    let query = "select * from users where email=? and password=?";
    connection.query(query,[email,user.oldPassword], (err,results) =>{
        if(!err){
            if(results.length <= 0){
                return res.status(400).json({message:"Incorrect old password..."});
            } else if(results[0].password === user.oldPassword){
                let query = "update users set password=? where email=?";
                connection.query(query,[user.newPassword,email],(err,results) => {
                    if(!err){
                        return res.status(200).json({message:"Password changed successfully."});
                    } else {
                        return res.status(500).json(err);
                    }
                });
            } else {
                return res.status(400).json({message:"Something went wrong. Please try again later..."});
            }
        } else {
            return res.status(500).json(err);
        }
    });
});



let transporter = nodemailer.createTransport({
   service: 'gmail',
   auth:{
       user: String(configObject.server.nodemailer.email),
       password: String(configObject.server.nodemailer.password)
   }
});


//forgot password api
router.post('/forgotPassword',(req, res) => {
    const user = req.body;
    const checkQuery = 'select email,password from users where email=?';
    connection.query(checkQuery,[user.email],(err,results) => {
        if(!err){
            if(results.length <= 0){
                return res.status(200).json({message:'Password sent successfully to your email.'})
            } else {
                let mailOptions = {
                    from: configObject.server.nodemailer.email,
                    to: results[0].email,
                    subject: 'Password by Cafe Management System',
                    html: '<p>' +
                        '<b>Your login details for Cafe Management System</b> <br>' +
                        '<b>Email: </b>' + results[0].email + '<br>' +
                        '<b>Password: </b>' + results[0].password + '<br>' +
                        '<a href="http://localhost:4200">Click here for more detail</a>' +
                        '</p>'
                };
                transporter.sendMail(mailOptions,function(error,info) {
                    if(error){
                        console.error(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.status(200).json({message:'Password sent successfully to your email.'});
            }
        } else {
            return res.status(500).json(err);
        }
    })
});



//get all api ---- authentication ----  admin
router.get('/get',authenticateToken ,isAdmin ,(req,res) => {
   let query = "select id,name,contact_number,email,status from users where role='user'";
   connection.query(query,(err,results) =>{
       if(!err){
           return res.status(200).json(results);
       } else {
           return res.status(500).json(err);
       }
   });
});

//authentication
router.get('/checkToken',authenticateToken  , (req, res) => {
    return res.status(200).json({message:'true'});
});


//update user api ---- authentication ---- admin
router.patch('/update',authenticateToken ,isAdmin ,(req, res) => {
    let user = req.body;
    let query = "update users set status=? where id=?";
    connection.query(query,[user.status,user.id],(err,results) => {
        if(!err){
            if(results.affectedRows === 0){
                return res.status(404).json({message:"User id does not exist"});
            }
            return res.status(200).json({message:"User updated successfully"});
        } else {
            return res.status(500).json(err);
        }
    });
});



module.exports = router;