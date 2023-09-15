const express = require('express');
const connection = require('../connection');
const {authenticateToken} = require('../services/authentication');
const {isAdmin} = require('../services/isAdmin');

const router = express.Router();


router.get('/details',authenticateToken,(req, res, next) => {
    let categoryCount
    let productCount;
    let billCount;
    let query = "select count(category_id) as categoryCount from categories";
    connection.query(query,(err,results) => {
        if(!err){
            categoryCount = results[0].categoryCount;
        } else {
            return res.status(500).json(err);
        }
    });

    query = "select count(product_id) as productCount from products";
    connection.query(query,(err,results) => {
        if(!err){
            productCount = results[0].productCount;
        } else {
            return res.status(500).json(err);
        }
    });

    query = "select count(bill_id) as billCount from bills";
    connection.query(query,(err,results) => {
        if(!err){
            billCount = results[0].billCount;
            let data = {
                categories: categoryCount,
                products: productCount,
                bills: billCount
            }
            return res.status(200).json(data);
        } else {
            return res.status(500).json(err);
        }
    });
});



module.exports = router;