const RackMaster=require("../../../model/masters/inventory/rack");

// A. Add Rack
const createRack = async (req, res) => {
    try {
        const rack = await RackMaster.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Rack created successfully',
            data: rack,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating rack',
            error: error.message,
        });
    }
};

// B. Get All Racks
const getRacks = async (req, res) => {
    try {
        const racks = await RackMaster.findAll();
        if (racks.length === 0) {
            return res.status(404).json({
                message: 'No racks found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Racks retrieved successfully',
            data: racks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving racks',
            error: error.message,
        });
    }
};
// C. Update Rack from Rack Id
const updateRack = async (req, res) => {  
    
    const {id}=req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Rack ID is required',
        });
    }
    
    try {
        const rack = await RackMaster.findByPk(id);
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


// D. Delete Rack from Rack Id
const deleteRack = async (req, res) => {    
    const { id } = req.params;
    try {
        const rack = await RackMaster.findByPk(id);
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
    updateRack,
    deleteRack,
};