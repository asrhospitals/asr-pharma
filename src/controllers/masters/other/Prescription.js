const db = require('../../../database/index');
const Prescription = db.Prescription;
const PrescriptionItem = db.PrescriptionItem;
const Patient = db.Patient;
const Doctor = db.Doctor;
const Item = db.Item;
const sequelize = db.sequelize;
const { buildQueryOptions } = require('../../../utils/queryOptions');

// Helper to generate prescription number
async function generatePresNo(id) {
    return 'PRES' + id.toString().padStart(6, '0');
}

// Create a new prescription with items
exports.createPrescription = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { items, ...presData } = req.body;
        const prescription = await Prescription.create({ ...presData, presNo: 'TEMP' }, { transaction: t });
        const presNo = await generatePresNo(prescription.id);
        await prescription.update({ presNo }, { transaction: t });
        if (Array.isArray(items)) {
            for (const item of items) {
                await PrescriptionItem.create({ ...item, prescriptionId: prescription.id }, { transaction: t });
            }
        }
        await t.commit();
        res.status(201).json({
            success: true,
            message: 'Prescription created successfully',
            data: prescription,
        });
    } catch (error) {
        await t.rollback();
        res.status(400).json({
            success: false,
            message: 'Error creating prescription',
            error: error.message,
        });
    }
};

// Get all prescriptions (with patient/doctor, paginated)
exports.getPrescriptions = async (req, res) => {
    try {
        const { where, offset, limit, order, page } = buildQueryOptions(
            req.query,
            ['presNo', 'diagnosis', 'oldHistory'],
            [
                'id',
                'presNo',
                'presDate',
                'patientId',
                'doctorId',
                'days',
                'admissionDate',
                'dischargeDate',
                'diagnosis',
                'oldHistory',
            ]
        );
        const { count, rows: prescriptions } = await Prescription.findAndCountAll({
            where,
            offset,
            limit,
            order,
            include: [
                { model: Patient },
                { model: Doctor },
            ],
        });
        res.status(200).json({
            data: prescriptions || [],
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get prescription by ID (with items, patient, doctor)
exports.getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findByPk(req.params.id, {
            include: [
                { model: Patient },
                { model: Doctor },
                { model: PrescriptionItem, include: [Item] },
            ],
        });
        if (!prescription) {
            return res.status(200).json({
                success: false,
                message: `Prescription with ID ${req.params.id} not found`,
            });
        }
        res.status(200).json({
            success: true,
            data: prescription,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching prescription',
            error: error.message,
        });
    }
};

// Update prescription and its items
exports.updatePrescription = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { items, ...presData } = req.body;
        const prescription = await Prescription.findByPk(req.params.id);
        if (!prescription) {
            await t.rollback();
            return res.status(200).json({
                success: false,
                message: 'Prescription not found',
            });
        }
        await prescription.update(presData, { transaction: t });
        await PrescriptionItem.destroy({ where: { prescriptionId: prescription.id }, transaction: t });
        if (Array.isArray(items)) {
            for (const item of items) {
                await PrescriptionItem.create({ ...item, prescriptionId: prescription.id }, { transaction: t });
            }
        }
        await t.commit();
        res.status(200).json({
            success: true,
            message: 'Prescription updated successfully',
            data: prescription,
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            message: 'Error updating prescription',
            error: error.message,
        });
    }
};

// Delete prescription and its items
exports.deletePrescription = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const prescription = await Prescription.findByPk(req.params.id);
        if (!prescription) {
            await t.rollback();
            return res.status(200).json({
                success: false,
                message: 'Prescription not found',
            });
        }
        await PrescriptionItem.destroy({ where: { prescriptionId: prescription.id }, transaction: t });
        await prescription.destroy({ transaction: t });
        await t.commit();
        res.status(200).json({
            success: true,
            message: 'Prescription deleted successfully',
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            message: 'Error deleting prescription',
            error: error.message,
        });
    }
}; 