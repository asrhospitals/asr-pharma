const sequelize = require("../../../db/db");
const { DataTypes } = require("sequelize");
const Unit = require('./unit');
const HsnSac = require('./hsn_sac');
const Company = require('./company');
const Salt = require('./salt');
const Rack = require('./rack');

const Item = sequelize.define("item", {
    id: {
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
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Unit,
            key: 'id',
        },
    },
    unit2: {
        type: DataTypes.INTEGER,
        references: {
            model: Unit,
            key: 'id',
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
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: HsnSac,
            key: 'id',
        },
    },
    taxcategory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: 'id',
        },
    },
    salt: {
        type: DataTypes.INTEGER,
        references: {
            model: Salt,
            key: 'id',
        },
    },
    rack: {
        type: DataTypes.INTEGER,
        references: {
            model: Rack,
            key: 'id',
        },
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

// Associations
Item.belongsTo(Unit, { as: 'Unit1', foreignKey: 'unit1' });
Item.belongsTo(Unit, { as: 'Unit2', foreignKey: 'unit2' });
Item.belongsTo(HsnSac, { as: 'HsnSacDetail', foreignKey: 'hsnsac' });
Item.belongsTo(Company, { as: 'CompanyDetail', foreignKey: 'company' });
Item.belongsTo(Salt, { as: 'SaltDetail', foreignKey: 'salt' });
Item.belongsTo(Rack, { as: 'RackDetail', foreignKey: 'rack' });

module.exports = Item;