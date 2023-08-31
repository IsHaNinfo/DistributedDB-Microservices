const User = require("../models/UserModel");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const createToken = require("../utils/createToken");
const keysecret = process.env.SECRET;

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const token = createToken(user._id);

    res.status(200).json({
      email,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const { Name, email, password } = req.body;

  try {
    const user = await User.create({
      Name,
      email,
      password,
    });
    const token = createToken(user._id);
    res.status(200).json({
      Name: user.Name,
      email: user.email,
      password: user.password,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//UPDATE
const updateUser = async (req, res) => {
  const { id, Name, email, password } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        Name,
        email,
        password,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id })
      .populate("Name")
      .populate("email");

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  createUser,
  updateUser,
  getUser,
  deleteUser,
  loginUser,
};
