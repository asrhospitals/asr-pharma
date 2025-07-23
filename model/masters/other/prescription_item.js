const sequelize = require('../../../db/db');
const { DataTypes } = require('sequelize');
const Prescription = require('./prescription');
const Item = require('../../masters/inventory/item');

const PrescriptionItem = sequelize.define('prescription_item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    prescriptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Prescription,
            key: 'id',
        },
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Item,
            key: 'id',
        },
    },
    presDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    dose: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isDays: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, { timestamps: false });

PrescriptionItem.belongsTo(Prescription, { foreignKey: 'prescriptionId' });
PrescriptionItem.belongsTo(Item, { foreignKey: 'itemId' });

module.exports = PrescriptionItem; 