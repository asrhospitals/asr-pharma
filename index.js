require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("./models");
const sequelize = db.sequelize;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const MasterRoutes = require("./routes/master/masterroutes");
const AuthRoutes=require('./routes/auth/auth');
const verifyToken=require('./middleware/authMiddleware');
const role =require('./middleware/roleMiddleware');
const salesBillRoutes = require('./routes/sales/billRoutes');
const accountRoutes = require('./routes/master/accountRoutes');
const groupRoutes = require('./routes/master/groupRoutes');

// Server Test Route
app.get('/',async (req,res) => {
    return res.json({message:"Pharmacy server is running"});
});


// Routes for Authentication
app.use("/pharmacy/auth",AuthRoutes);

// Routes for Masters
app.use("/pharmacy/admin/master",verifyToken,role('admin'), MasterRoutes);

// Routes for Accounting (ledgers)
app.use("/pharmacy/admin/master",verifyToken,role('admin'), accountRoutes);

// Routes for Accounting Groups (with permission-based access)
app.use("/pharmacy/api", verifyToken, groupRoutes);

// Register sales bill routes
app.use('/pharmacy/sales/bills/v1', salesBillRoutes);

// For LocalHost Test
//app.use("/pharmacy/master", MasterRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate().then(() => { console.log("Db Connected");}).catch((err) => {console.log("Error connecting to the Db", err);});
    // await sequelize.sync();
    app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);})} catch (error) {console.log(error);}
};

startServer();


