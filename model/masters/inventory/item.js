const sequelize = require("../../../db/db");
const { DataTypes } = require("sequelize");

const Item = sequelize.define("itemmaster", {
    itemId: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    ///---------------Item Details----------------
    productname: {
        type:DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
  
    goods: {
        type:DataTypes.ENUM,
        values: ['Goods', 'Service'],
        allowNull: false,
        defaultValue: 'Goods',
    },
      packing: {
        type: DataTypes.STRING,
    },
    unit1: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    unit2: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: true,
        },
    },
    conversion: {
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    unitindecimal: {
        type: DataTypes.STRING,
        defaultValue: "No",
    },
    hsnsac: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    taxcategory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    salt: {
        type: DataTypes.STRING,
    },
    rack: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.FLOAT,
      

        defaultValue: 0.00,
    },
    purchasePrice: {
        type: DataTypes.FLOAT,
      
 
        defaultValue: 0.00,
    },  
    cost: {
        type: DataTypes.FLOAT,
       
 
        defaultValue: 0.00,
    },
    salerate: {
        type: DataTypes.FLOAT,
   

        defaultValue: 0.00,
    },
    narcotic: {
        type: DataTypes.STRING,
     
        defaultValue: "No",
    },
    scheduleH: {
        type: DataTypes.STRING,
      
        defaultValue: "No",
    },
    scheduleH1: {
        type: DataTypes.STRING,

        defaultValue: "No",
    },
    scheduledrug: {
        type: DataTypes.STRING,
     
        defaultValue: "No",
    },
    prescription: {
        type: DataTypes.STRING,
      
        defaultValue: "No",
    },
    storagetype: {
        type: DataTypes.STRING,
        defaultValue: "Normal",
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "Continue",
    },
    colortype: {
        type: DataTypes.STRING,
    },


    /// Additional fields can be added as needed
    ///---------------Discount Fields----------------
    discount: {
      type:DataTypes.STRING,
    },
    itemdiscount: {
      type:DataTypes.FLOAT,
        validate: {
            isFloat: true,
            min: 0,
        },
        defaultValue: 0.00,
    },
    maxdiscount: {
      type:DataTypes.FLOAT,
        validate: {
            isFloat: true,
            min: 0,
        },
        defaultValue: 0.00,
    },

    ///---------------Quantity Fields----------------
    minimumquantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            isInt: true,
            min: 0,
        },
    },
    maximumquantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            isInt: true,
            min: 0,
        },
    },

    recorderdays: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            isInt: true,
            min: 0,
        },
    },

    recorderquantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            isInt: true,
            min: 0,
        },
    },
    ////---------------Other Fields----------------
    minimummargin: {
        type: DataTypes.FLOAT,
        defaultValue: 0.00,
        validate: {
            isFloat: true,
            min: 0,
        },
    },
    prohbited: {
        type: DataTypes.STRING,
        defaultValue: "No",
    },
    visibility: {
        type: DataTypes.STRING,
        defaultValue: "Show",
    },
    mfrname: {
        type: DataTypes.STRING,
    },

}, 
{
    timestamps: false,
}
);


module.exports = Item;