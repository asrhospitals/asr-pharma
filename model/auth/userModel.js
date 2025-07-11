const { DataTypes } = require('sequelize');
const sequelize=require('../../db/db');

const User=sequelize.define('user',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    uname:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    pwd:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role:{
        type:DataTypes.ENUM('admin','manager'),
        allowNull:false,
    },
    module:{
        type:DataTypes.ARRAY(DataTypes.STRING),
        allowNull:false
    },
    fname:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lname:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isactive:{
        type:DataTypes.ENUM,
        defaultValue:'active',
        values:["active","inactive"]
    }
},{timestamps:false});

module.exports=User;