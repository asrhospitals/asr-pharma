'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      
      Company.belongsToMany(models.User, {
        through: 'UserCompanies',
        as: 'users',
        foreignKey: 'companyId',
        otherKey: 'userId'
      });
      
      
      Company.hasMany(models.Item, {
        as: "CompanyItems",
        foreignKey: "company",
      });
      
      
      Company.hasMany(models.Ledger, {
        as: "CompanyLedgers",
        foreignKey: "companyId",
      });
      
      
      Company.hasMany(models.Group, {
        as: "CompanyGroups",
        foreignKey: "companyId",
      });
    }
  }

  Company.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'India',
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pinCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[1-9][0-9]{5}$/
      }
    },
    
    
    branchCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    businessType: {
      type: DataTypes.ENUM(
        'Billing [General]',
        'Chemist [Pharmacy]',
        'Pharma Distribution [Batch]',
        'Automobile',
        'Garment',
        'Mobile Trade',
        'Supermarket/Grocery',
        'Computer Hardware'
      ),
      allowNull: false,
    },
    calendarType: {
      type: DataTypes.ENUM('English', 'Hindi', 'Gujarati'),
      allowNull: false,
      defaultValue: 'English',
    },
    financialYearFrom: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    financialYearTo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    taxType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'GST',
    },
    
    
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[\+]?[1-9][\d]{9,14}$/
      }
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    
    
    companyRegType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    panNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
      }
    },
    
    
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
    },
    
    companyname: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.companyName;
      }
    },
    printremark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prohibited: {
      type: DataTypes.ENUM('Yes', 'No'),
      defaultValue: 'No',
    },
    invoiceprintindex: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    recorderformula: {
      type: DataTypes.FLOAT,
      defaultValue: 0.00,
    },
    recorderprefrence: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    expiredays: {
      type: DataTypes.INTEGER,
      defaultValue: 90,
    },
    dumpdays: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
    },
    minimummargin: {
      type: DataTypes.FLOAT,
      defaultValue: 0.00,
    },
    storeroom: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    
    
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: "Company",
    tableName: "companies",
    timestamps: true
  });

  return Company;
};
