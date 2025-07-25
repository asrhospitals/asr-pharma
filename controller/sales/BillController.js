const db = require('../../models');
const Bill = db.Bill;
const BillItem = db.BillItem;
const { buildQueryOptions } = require('../../utils/queryOptions');

// Create a new bill
const createBill = async (req, res) => {
  try {
    const { items, ...billData } = req.body;
    const bill = await Bill.create(billData);
    if (items && items.length) {
      for (const item of items) {
        await BillItem.create({ ...item, billId: bill.id });
      }
    }
    const fullBill = await Bill.findByPk(bill.id, { include: [{ model: BillItem, as: 'items' }] });
    res.status(201).json({ success: true, message: 'Bill created successfully', data: fullBill });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all bills (paginated, searchable)
const getAllBills = async (req, res) => {
  try {
    const { where, offset, limit, order, page } = buildQueryOptions(
      req.query,
      ['billNo', 'patientName', 'partyName', 'doctorName'],
      []
    );
    const { count, rows } = await Bill.findAndCountAll({
      where,
      offset,
      limit,
      order,
      include: [{ model: BillItem, as: 'items' }],
    });
    res.status(200).json({
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bill by id
const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findByPk(id, { include: [{ model: BillItem, as: 'items' }] });
    if (!bill) {
      return res.status(404).json({ success: false, message: `Bill with ID ${id} not found` });
    }
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update bill by ID
const updateBill = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Bill ID is required' });
  }
  try {
    const bill = await Bill.findByPk(id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    const { items, ...billData } = req.body;
    await bill.update(billData);
    await BillItem.destroy({ where: { billId: bill.id } });
    if (items && items.length) {
      for (const item of items) {
        await BillItem.create({ ...item, billId: bill.id });
      }
    }
    const fullBill = await Bill.findByPk(bill.id, { include: [{ model: BillItem, as: 'items' }] });
    res.status(200).json({ success: true, message: 'Bill updated successfully', data: fullBill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete bill by ID
const deleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    const bill = await Bill.findByPk(id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    await BillItem.destroy({ where: { billId: bill.id } });
    await bill.destroy();
    res.status(200).json({ success: true, message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
}; 