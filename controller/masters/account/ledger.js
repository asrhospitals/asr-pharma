const Ledger = require("../../../models/masters/accountMaster/ledger");

const createLedger = async (req, res) => {
  try {
    const ledger = await Ledger.create(req.body);
    res.status(201).json(ledger);
  } catch (error) {
    res.status(400).json({ error: `Something went wrong ${error}` });
  }
};

const getLedger = async (req, res) => {
  try {
    const ledger = await Ledger.findAll();
    res.status(200).json(ledger);
  } catch (error) {
    res.status(400).json({ error: `Something went wrong ${error}` });
  }
};

const getLedgerById = async (req, res) => {
  try {
    const { id } = req.params;
    const ledger = await Ledger.findByPk(id);
    res.status(200).json(ledger);
  } catch (error) {
    res.status(400).json({ error: `Something went wrong ${error}` });
  }
};

const updateLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const ledger = await Ledger.findByPk(id);
    await ledger.update(req.body);
    res.status(200).json(ledger);
  } catch (error) {
    res.status(400).json({ error: `Something went wrong ${error}` });
  }
};

const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const ledger = await Ledger.findByPk(id);
    await ledger.destroy(req.body);
    res.status(200).json({ message: "Ledger Deleted" });
  } catch (error) {
    res.status(400).json({ error: `Something went wrong ${error}` });
  }
};


module.exports={
    createLedger,
    getLedger,
    getLedgerById,
    updateLedger,
    deleteLedger,
};