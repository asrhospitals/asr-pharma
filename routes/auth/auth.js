const Router=require("express");
const { register, login } = require("../../controller/auth/auth");

const router=Router();

//  Create User

router.route('/signup').post(register);

// Log In User

router.route('/signin').post(login);


module.exports=router;