const express = require('express');
const connection = require('../connection');
const {isAdmin} = require('../services/isAdmin');
const {authenticateToken} = require('../services/authentication');

const router = express.Router();

//user must be signed in to use authenticateToken APIs
//user role must be admin to use isAdmin APIs



//add product api ---- authentication ---- admin
router.post('/add',authenticateToken,isAdmin,(req, res) => {
    let product = req.body;
    let query = "insert into products (product_name,category_id,description,price,status) values(?,?,?,?,'true')"
    connection.query(query,[product.product_name,product.category_id,product.desc,product.price],(err,results) => {
        if(!err){
            return res.status(200).json({message:'Product added successfully.'});
        } else {
            return res.status(500).json(err);
        }
    });
    //this api gets the values from body
    //and it runs the query with given values
});



//get all products api ---- authentication
router.get('/get',authenticateToken,(req, res, next) => {
    let query = "select p.product_id,p.product_name,p.description,p.price,p.status,p.category_id,c.category_name " +
        "from products as p inner join categories as c where p.category_id = c.category_id";
    connection.query(query,(err,results) => {
        if(!err){
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
    //this api runs the query and returns
    //all products which are taken as results
    //also it is return an information message on success
});



//get product by category api ---- authentication
router.get('/getByCategory/:id',authenticateToken, (req, res, next) => {
    let id = req.params.id;
    let query = "select product_id,product_name from products where category_id=? and status='true'";
    connection.query(query,[id],(err, results) => {
         if(!err){
             return res.status(200).json(results);
         } else {
             return res.status(500).json(err);
         }
    });
    //this api gets the category id from the path parameter
    //and returns the specific products in that category
});



//get product by id api ---- authentication
router.get('/getById/:id',authenticateToken, (req, res, next) => {
    let id = req.params.id;
    let query = "select product_id,product_name,description,price from products where product_id=?";
    connection.query(query,[id],(err, results) => {
        if(!err){
            return res.status(200).json(results[0]);
        } else {
            return res.status(500).json(err);
        }
    });
    //this api gets the product id from the path parameter
    //and returns the specific product in that category
});



//update product api ---- authentication ---- admin
router.patch('/update',authenticateToken,isAdmin,(req, res, next) => {
    let product = req.body;
    let query = "update products set product_name=?,category_id=?,description=?,price=? where product_id=?";
    connection.query(query,[product.product_name,product.category_id,product.desc,product.price,product.product_id], (err, results) => {
        if(!err){
            if(results.affectedRows === 0){
                return res.status(404).json({message:"Product does not exist..."});
            }
            return res.status(200).json({message:"Product updated successfully"});
        } else {
            return res.status(500).json(err);
        }
    });
    //this api makes specific changes on a product,
    //it gets id from path parameter
    //and returns a message for information
});



//update product status api ---- authentication ---- admin
router.patch('/updateStatus',authenticateToken,isAdmin,(req, res, next) =>{
    let data = req.body;
    let query = "update products set status=? where product_id=?";
    connection.query(query,[data.status,data.product_id],(err, results) => {
        if(!err){
            if(results.affectedRows === 0){
                return res.status(404).json({message:"Product does not exists..."});
            }
            return res.status(200).json({message:"Product status updated successfully"});
        } else {
            return res.status(500).json(err);
        }
    });
    //this method gets new status of the product and
    //product id from body
    //it runs a query and updates the status of product with given id
    //also sends a message on success
});



//delete product api ---- authentication ---- admin
router.delete('/delete/:id',authenticateToken,isAdmin, (req, res, next) => {
    let id = req.params.id;
    let query = "delete from products where product_id=?";
    connection.query(query,[id],(err,results) => {
        if(!err){
            if(results.affectedRows === 0){
                return res.status(404).json({message:'Product does not exist...'});
            }
            return res.status(200).json({message:"Product deleted successfully"});
        } else {
            return res.status(500).json(err);
        }
    });
    //this api runs the query for delete a product
    //with given id and returns a message for information
});

module.exports = router;