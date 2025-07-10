const sequelize = require("../../../db/db");
const { DataTypes } = require("sequelize");

const StoreMaster = sequelize.define("store", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    storecode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    
    storename: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    address1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
   

},
{
    timestamps: false,
}
);


module.exports = StoreMaster;
