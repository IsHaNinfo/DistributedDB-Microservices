const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;

// Create and Save a new product
exports.create = (req, res) => {
   // Validate request
   if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a product
  const product = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category, 
    quantity : req.body.quantity,
  };

  // Save product in the database
  Product.create(product)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the product."
      });
    });
};

// Retrieve all products from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  
    Product.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving products."
        });
      });
};


// // Find all published Tutorials
// exports.findAllPublished = (req, res) => {
  
// };
