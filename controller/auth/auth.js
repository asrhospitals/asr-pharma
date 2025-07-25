const db = require('../../models');
const User = db.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// A. Register A User including Role

const register = async (req, res) => {
  try {
    // Include the model
    const { uname, pwd, role, module, fname, lname, isactive } =
      req.body;

    // Add a check to role
    if (!role)
      return res
        .status(400)
        .json({ message: "You must specify the User Role" });

    // Hashed the password
    const hpwd = await bcrypt.hash(pwd, 10);

    // create user
    const register = await User.create({
      uname,
      pwd: hpwd,
      role,
      module,
      fname,
      lname,
      isactive,
    });

    res.status(201).json({ message: "Success", user: register });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Somthing went wrong while creating user", err:error.message });
  }
};

// B. Login a User

const login = async (req, res) => {
  try {
    const { uname, pwd } = req.body;
    // Check User exists or not
    const user = await User.findOne({
      where: { uname },
    });
    if (!user) return res.status(404).json({ message: "User not exists" });

    // match the password
    const isMatchPWD = await bcrypt.compare(pwd, user.pwd);
    if (!isMatchPWD)
      return res
        .status(400)
        .json({ message: "Invalid Password" });

    // generate token

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        module: user.module,
      },
      process.env.JWT_SECRET
    );

    //send response with token
    return res
      .status(200)
      .json({
        success: true,
        token,
        id:user.id,
        role: user.role,
        module: user.module,
        username: user.fname + " " + user.lname,
      });
  } catch (e) {
    return res.status(403).json({
      success: false,
      error: e.message,
    });
  }
};

module.exports = {
  register,
  login,
};
