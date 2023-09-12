const express = require('express');
const connection = require('../connection');
const {isAdmin} = require('../services/isAdmin');
const {authenticateToken} = require("../services/authentication");

const router = express.Router();



//adding category api ---- authentication api ---- admin api
router.post('/add',authenticateToken, isAdmin, (req, res, next) => {
    let category = req.body;
    let query = "insert into categories (category_name) values(?)"
    connection.query(query,[category.category_name], (err,results) => {
        if(!err){
            return res.status(200).json({message:'Category added successfully.'})
        } else {
            return res.status(500).json(err);
        }
    });
});


router.get('/get',authenticateToken,(req, res, next) => {
    let query = "select * from categories order by category_name";
    connection.query(query,(err,results) => {
        if(!err){
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});


router.patch('/update',authenticateToken,isAdmin,(req, res, next) => {
    let product = req.body;
    let query = "update categories set category_name=? where category_id=?";
    connection.query(query,[product.category_name,product.category_id],(err,results) => {
        if(!err){
            if(results.affectedRows === 0){
                return res.status(404).json({message:"Category id does not exist..."});
            }
            return res.status(200).json({message:"Category updated successfully."});
        } else {
            return res.status(500).json(err);
        }
    });
});

module.exports = router;