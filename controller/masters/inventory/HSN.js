const db = require('../../../models');
const HsnSac = db.HsnSac;
const { buildQueryOptions } = require('../../../utils/queryOptions');

// Add HSN
const addHSN = async (req, res) => {
    try {
        const newHSN = await HsnSac.create(req.body);
        res.status(201).json(newHSN);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all HSNs
const getAllHSN = async (req, res) => {
    try {
        const { where, offset, limit, order, page } = buildQueryOptions(
            req.query,
            ['hsncode'],
            [] 
        );
        const { count, rows } = await HsnSac.findAndCountAll({
            where,
            offset,
            limit,
            order,
        });
        res.status(200).json({
            data: rows,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get HSN BY ID
const getHSNById = async (req, res) => {
  try {
    const { id } = req.params;
    const hsn = await HsnSac.findByPk(id);

    if (!hsn) {
      return res.status(200).json({
        success: false,
        message: `HSN with ID ${id} not found`,
      });
    }
    res.status(200).json(hsn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update HSN by ID
const updateHSN = async (req, res) => {
    const { id } = req.params;
    try {
        const hsn = await HsnSac.findByPk(id);
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
        const hsn = await HsnSac.findByPk(id);
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
    getHSNById,
    updateHSN,
    deleteHSN
};