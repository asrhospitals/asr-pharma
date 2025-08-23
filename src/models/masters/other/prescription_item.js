'use strict'

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class PrescriptionItem extends Model {
        static associate(models) {
            PrescriptionItem.belongsTo(models.Prescription, { foreignKey: 'prescriptionId' });
            PrescriptionItem.belongsTo(models.Item, { foreignKey: 'itemId' });
        }
    }

    PrescriptionItem.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        prescriptionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
    }, {
        sequelize,
        modelName: "PrescriptionItem",
        tableName: "prescription_items",
        timestamps: false,
    })

    return PrescriptionItem;
}



