module.exports = app => {
    const products = require("../controllers/product.controller.js");
  
    var router = require("express").Router();
  
    // Create a new products
    router.post("/add", products.create);
  
    // Retrieve all products
    router.get("/findall", products.findAll);
  
  
    app.use('/api/products', router);
  };