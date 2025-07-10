const Unit= require('../../../model/masters/inventory/unit');

// Add Unit

const addUnit = async (req, res) => {
    try {
        const newUnit = await Unit.create(req.body);
        res.status(201).json(newUnit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Units
const getAllUnits = async (req, res) => {
    try {
        const units = await Unit.findAll();
        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Unit
const updateUnit = async (req, res) => {

    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({ error: "Unit ID is required" });
        const unit = await Unit.findByPk(id);
        if (!unit) return res.status(404).json({ error: "Unit not found" });
        const updatedUnit = await unit.update(req.body);    
        res.status(200).json(updatedUnit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Unit
const deleteUnit = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({ error: "Unit ID is required" });
        const unit = await Unit.findByPk(id);
        if (!unit) return res.status(404).json({ error: "Unit not found" });
        await unit.destroy();
        res.status(200).json({ message: "Unit deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addUnit,
    getAllUnits,
    updateUnit,
    deleteUnit
};

