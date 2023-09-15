const express = require('express');
const connection = require('../connection');
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const {authenticateToken} = require('../services/authentication');
const {isAdmin} = require('../services/isAdmin');

const router = express.Router();

router.post('/generateReport',authenticateToken,(req, res, next) => {

    // productDetails:  Example JSON Array
    //     [
    //         {
    //             "bill_id":"1",
    //             "product_name":"Black Coffe",
    //             "price":99,
    //             "total":99,
    //             "category":"Coffee",
    //             "quantity":"1"
    //         },
    //         {
    //             "bill_id": "2",
    //             "product_name": "Doppio Coffe",
    //             "price": 120,
    //             "total": 120,
    //             "category": "Coffee",
    //             "quantity": 1
    //         }
    //     ]


    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    const productDetailsJson = JSON.stringify(orderDetails.product_details);
    let productDetailsReport =orderDetails.product_details;

    let query = "insert into bills (uuid,name,email,contact_number,payment_method,total,product_details,created_by) values (?,?,?,?,?,?,?,?)";
    connection.query(query,[generatedUuid,orderDetails.name,orderDetails.email,orderDetails.contact_number,orderDetails.payment_method,orderDetails.total_amount,productDetailsJson,res.locals.email],(err,results) => {
        if(!err){
            ejs.renderFile(path.join(__dirname,'',"report.ejs"),
                {
                    product_details: productDetailsReport,
                    name:orderDetails.name,
                    email:orderDetails.email,
                    contact_number:orderDetails.contact_number,
                    payment_method:orderDetails.payment_method,
                    total_amount:orderDetails.total_amount
                },
                (err,results) => {
                    if(!err){
                        pdf.create(results).toFile('./generated_pdf/'+generatedUuid+'.pdf',(err,data) =>{
                            if(!err){
                                return res.status(200).json({ uuid: generatedUuid });
                            } else {
                                console.log(err);
                                return res.status(500).json(err)
                            }
                        });
                    } else {
                        return res.status(500).json(err);
                    }
                });
        } else {
            return res.status(500).json(err);
        }
    })
});




router.post('/getPdf',authenticateToken,(req, res, next) => {
    let orderDetails = req.body;
    let pdfPath = "./generated_pdf/" + orderDetails.uuid + ".pdf";
    if (fs.existsSync(pdfPath)) {
        res.contentType('application/pdf');
        fs.createReadStream(pdfPath).pipe(res);
    } else {
        let productDetailsReport = orderDetails.product_details;
        ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
            product_details: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contact_number: orderDetails.contact_number,
            payment_method: orderDetails.payment_method,
            total_amount: orderDetails.total_amount
        }, (err, results) => {
            if (!err) {
                pdf.create(results).toFile(pdfPath, (err, data) => {
                    if (!err) {
                        res.contentType('application/pdf');
                        fs.createReadStream(pdfPath).pipe(res);
                    } else {
                        console.log(err);
                        return res.status(500).json(err);
                    }
                });
            } else {
                return res.status(500).json(err);
            }
        });
    }
});




router.get('/getBills',authenticateToken,(req, res, next) => {
    let query = "select * from bills order by id DESC";
    connection.query(query,(err, results) => {
        if(!err){
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});



router.delete('/delete/:id',authenticateToken,(req, res, next) => {
    const id = req.params.id;
    let query = "delete from bills where id=?";
    connection.query(query,[id],(err, results) => {
        if(!err){
            if(results.affectedRows === 0){
                return res.status(404).json({message:"Bill is does not exist..."});
            }
            return res.status(200).json("Bill deleted successfully");
        } else {
            return res.status(500).json(err);
        }
    });
});




module.exports = router;