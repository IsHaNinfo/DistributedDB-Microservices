const express = require("express");
const {
  createUser,
  updateUser,
  getUser,
  deleteUser,
  loginUser,
} = require("../controllers/UserController");
const router = express.Router();

router.post("/createUser", createUser);
router.post("/loginUser", loginUser);
router.put("/updateuser", updateUser);
router.get("/getUser/:id", getUser);
router.delete("/deleteUser/:id", deleteUser);
module.exports = router;
