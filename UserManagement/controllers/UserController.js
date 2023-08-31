const User = require("../models/UserModel");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const createUser = async (req, res) => {
  console.log("dsd")
  const { Name, email, password } = req.body;

  try {
    const user = await User.create({
      Name,
      email,
      password,
    });

    res.status(200).json({
      Name: user.Name,
      email: user.email,
      password: user.password,
      _id: user._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const testFun = async (a) => {
  return(a)
}

module.exports = {
  createUser, testFun
};
