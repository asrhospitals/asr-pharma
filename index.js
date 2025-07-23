require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require("./db/db");
const cors = require("cors");
app.use(cors({origin: "https://pharmacy.asrhospitals.com"}));
const MasterRoutes = require("./routes/master/masterroutes");
const AuthRoutes = require("./routes/auth/auth");
const verifyToken = require("./middleware/authMiddleware");
const role = require("./middleware/roleMiddleware");
const User = require("./model/auth/userModel");
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());

// Server Test Route
app.get("/", async (req, res) => {
  return res.json({ message: "Pharmacy server is running" });
});

// Routes for Authentication
app.use("/pharmacy/auth", AuthRoutes);

// Routes for Masters
app.use("/pharmacy/admin/master", verifyToken, role("admin"), MasterRoutes);

// For LocalHost Test
//app.use("/pharmacy/master", MasterRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Db Connected");

    // await sequelize.sync({alter:true});
    console.log("All models were synchronized successfully.");

    const admin = await User.findOne({ where: { uname: "admin" } });
    if (!admin) {
      const hpwd = await bcrypt.hash("Admin@123", 10);
      await User.create({
        uname: "Admin",
        pwd: hpwd,
        role: "admin",
        module: ["admin"],
        fname: "Admin",
        lname: "User",
        isactive: "active",
      });
      console.log("Default admin user created.");
    } else {
      console.log("Default admin user already exists.");
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
