const HSN = require('../../../model/masters/inventory/hsn_sac');

// Add HSN
const addHSN = async (req, res) => {
    try {
        const newHSN = await HSN.create(req.body);
        res.status(201).json(newHSN);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all HSNs
const getAllHSN = async (req, res) => {
    try {
        const hsnList = await HSN.findAll();
        res.status(200).json(hsnList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update HSN by ID
const updateHSN = async (req, res) => {
    const { id } = req.params;
    try {
        const hsn = await HSN.findByPk(id);
        if (!hsn) {
            return res.status(404).json({ message: 'HSN not found' });
        }
        await hsn.update(req.body);
        res.status(200).json(hsn);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete HSN by ID
const deleteHSN = async (req, res) => {
    const { id } = req.params;
    try {
        const hsn = await HSN.findByPk(id);
        if (!hsn) {
            return res.status(404).json({ message: 'HSN not found' });
        }
        await hsn.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addHSN,
    getAllHSN,
    updateHSN,
    deleteHSN
};