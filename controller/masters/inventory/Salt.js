const Salt = require("../../../model/masters/inventory/salt");

// A. Create Salt

const createSalt = async (req, res) => {
  try {
    const addSalt = await Salt.create(req.body);
    res.status(201).json(addSalt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// B. Get All salt 

const getSalt = async(req,res)=>{

    try {
        const getSalt=await Salt.findAll();
        res.status(200).json(getSalt);
    } catch (error) {
        res.status(400).json({error:error.message})
    }
};


// C. Update Salt

const updateSalt=async (req,res) => {

     const {id}=req.params;
       if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Salt ID is required',
        });
    } 

        try {
        const salt = await Salt.findByPk(id);
        if (!salt) {
            return res.status(404).json({
                success: false,
                message: 'Salt not found',
            });
        }

        await salt.update(req.body);
        res.status(200).json({
            success: true,
            message: 'Salt updated successfully',
            data: salt,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating salt',
            error: error.message,
        });
    }
    
}


// D. Delete Salt

const deleteSalt = async (req, res) => {    
    const { id } = req.params;
    if(!id) return res.status(400).json({message:"Salt not found"})
    try {
        const salt = await Salt.findByPk(id);
        await salt.destroy();
        res.status(200).json({
            success: true,
            message: 'Salt deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting salt',
            error: error.message,
        });
    }
};  

module.exports={

    createSalt,getSalt,updateSalt,deleteSalt
}