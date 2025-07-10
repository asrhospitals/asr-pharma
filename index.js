const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const sequelize = require("./db/db");
const cors = require("cors");
app.use(cors());
app.use(express.json());
const MasterRoutes = require("./routes/master/masterroutes");



// Routes for Inventory
  app.use("/pharmacy/master", MasterRoutes);





const startServer = async () => {
  try {
    await sequelize.authenticate().then(() => { console.log("Db connected to the localHost");}).catch((err) => {console.log("Error connecting to the Db", err);});
    //  await sequelize.sync();
    app.listen(port, () => {console.log(`Server is running on port ${port}`);})} catch (error) {console.log(error);}
};

startServer();


