const db = require('../../../database/index');
const Rack = db.Rack;
const Store = db.Store;
const { buildQueryOptions } = require('../../../utils/queryOptions');


const createRack = async (req, res) => {
    try {
        const { storeid, rackname } = req.body;
        if (!storeid || !rackname) {
            return res.status(400).json({
                success: false,
                message: 'storeid and rackname are required',
            });
        }

        const store = await Store.findByPk(storeid);
        if (!store) {
            return res.status(400).json({
                success: false,
                message: 'storeid does not exist',
            });
        }
        
        const existingRack = await Rack.findOne({ where: { rackname } });
        if (existingRack) {
            return res.status(400).json({
                success: false,
                message: 'rackname already exists',
            });
        }
        const rack = await Rack.create({ storeid, rackname });
        res.status(201).json(rack);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating rack',
            error: error.message,
        });
    }
};


const getRacks = async (req, res) => {
    try {
        const { where, offset, limit, order, page } = buildQueryOptions(
            req.query,
            ['rackname'],
            [] 
        );
        const { count, rows } = await Rack.findAndCountAll({
            where,
            offset,
            limit,
            order,
            include: {
                model: Store,
                as: 'store',
                attributes: ['storename']
            }
        });
        res.status(200).json({
            data: rows,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving racks',
            error: error.message,
        });
    }
};



const getRackId=async (req,res) => {

    try {
        const {id}=req.params;
        const rack=await Rack.findByPk(id,{
            include:{
                model:Store,
                as:"store",
                attributes:['storename']
            }
        });
        res.status(200).json(rack);
    } catch (error) {
        
    }
    
};




const updateRack = async (req, res) => {  
    
    const {id}=req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Rack ID is required',
        });
    }
    
    try {
        const rack = await Rack.findByPk(id);
        if (!rack) {
            return res.status(404).json({
                success: false,
                message: 'Rack not found',
            });
        }

        await rack.update(req.body);
        res.status(200).json({
            success: true,
            message: 'Rack updated successfully',
            data: rack,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating rack',
            error: error.message,
        });
    }
};



const deleteRack = async (req, res) => {    
    const { id } = req.params;
    try {
        const rack = await Rack.findByPk(id);
        if (!rack) {
            return res.status(404).json({
                success: false,
                message: 'Rack not found',
            });
        }
        await rack.destroy();
        res.status(200).json({
            success: true,
            message: 'Rack deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting rack',
            error: error.message,
        });
    }
};  

module.exports = {
    createRack,
    getRacks,
    getRackId,
    updateRack,
    deleteRack,
};