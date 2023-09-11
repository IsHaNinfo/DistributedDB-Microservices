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

// Find a single products with an id
exports.findOne = async(req, res) => {
  const id = req.body.id;

  Product.findByPk(id)
    .then(data => {
      console.log(data)
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Product with id=" + id
      });
    });
};

// Update a product by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  
  try {
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).send({
        message: `Product with id=${id} not found.`
      });
    }
    if(product.quantity<req.body.quantity){
      return res.status(400).json({
        error:"quantity not available"
      })
    }


    const updatedQuantity = product.quantity - req.body.quantity;

    
    const updatedProduct = await Product.update(
      { quantity: updatedQuantity },
      { where: { id: id } }
    );

    if (updatedProduct[0] === 1) {
      res.send({
        message: "Product was updated successfully."
      });
    } else {
      res.status(500).send({
        message: `Cannot update Product with id=${id}.`
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating Product with id=" + id
    });
  }
};

// Delete a product with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Product.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Product was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Product with id=" + id
      });
    });
};

// Delete all products from the database.
exports.deleteAll = (req, res) => {
  Product.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Products were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Products."
        });
      });
};


// // Find all published Tutorials
// exports.findAllPublished = (req, res) => {
  
// };
