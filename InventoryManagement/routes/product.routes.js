module.exports = app => {
    const products = require("../controllers/product.controller.js");
  
    var router = require("express").Router();
  
    // Create a new products
    router.post("/add", products.create);
  
    // Retrieve all products
    router.get("/findall", products.findAll);
  
    // Retrieve a single products with id
    router.get("/findbyid/:id", products.findOne);
  
    // Update a products with id
    router.put("/update/:id", products.update);
  
    // Delete a products with id
    router.delete("/deletebyid/:id", products.delete);
  
    // Delete all products
    router.delete("/deleteall", products.deleteAll);
  
    app.use('/api/products', router);
  };