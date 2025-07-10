require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require("./db/db");
const cors = require("cors");
app.use(cors());
app.use(express.json());
const MasterRoutes = require("./routes/master/masterroutes");


// Server Test Route
app.get('/',async (req,res) => {
    return res.json({message:"Server up and running"});
});


// Routes for Masters
  app.use("/pharmacy/admin/master", MasterRoutes);





const startServer = async () => {
  try {
    await sequelize.authenticate().then(() => { console.log("Db connected to the localHost");}).catch((err) => {console.log("Error connecting to the Db", err);});
    //  await sequelize.sync();
    app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);})} catch (error) {console.log(error);}
};

startServer();


