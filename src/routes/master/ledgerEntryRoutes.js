const Router = require('express');
const LedgerEntryService = require('../../services/ledgerEntryService');
const {
  canCreateTransaction,
  canViewTransaction,
  canDeleteTransaction,
  canEditTransaction
} = require('../../middleware/permissions/groupPermissionMiddleware');

const router = Router();


router.post('/create-from-bill', canCreateTransaction, async (req, res) => {
  try {
    const { billData, billType } = req.body;
    const userId = req.user.id;


    if (!billData || !billType) {
      return res.status(400).json({
        success: false,
        message: 'billData and billType are required'
      });
    }

    if (!['PURCHASE', 'SALE'].includes(billType)) {
      return res.status(400).json({
        success: false,
        message: 'billType must be either PURCHASE or SALE'
      });
    }


    try {
      LedgerEntryService.validateBillData(billData);
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError.message
      });
    }


    const entries = await LedgerEntryService.createLedgerEntriesFromBill(
      billData,
      billType,
      userId
    );

    res.status(201).json({
      success: true,
      message: 'Ledger entries created successfully',
      data: {
        entries,
        billId: billData.id,
        billType
      }
    });

  } catch (error) {
    console.error('Error creating ledger entries:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create ledger entries'
    });
  }
});


router.get('/by-bill/:billId', canViewTransaction, async (req, res) => {
  try {
    const { billId } = req.params;
    const userId = req.user.id;

    if (!billId) {
      return res.status(400).json({
        success: false,
        message: 'Bill ID is required'
      });
    }

    const entries = await LedgerEntryService.getLedgerEntriesByBill(billId, userId);

    res.json({
      success: true,
      data: entries
    });

  } catch (error) {
    console.error('Error getting ledger entries by bill:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get ledger entries'
    });
  }
});


router.delete('/by-bill/:billId', canDeleteTransaction, async (req, res) => {
  try {
    const { billId } = req.params;
    const userId = req.user.id;

    if (!billId) {
      return res.status(400).json({
        success: false,
        message: 'Bill ID is required'
      });
    }

    await LedgerEntryService.deleteLedgerEntriesForBill(billId, userId);

    res.json({
      success: true,
      message: 'Ledger entries deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting ledger entries:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete ledger entries'
    });
  }
});


router.put('/by-bill/:billId', canEditTransaction, async (req, res) => {
  try {
    const { billId } = req.params;
    const { billData, billType } = req.body;
    const userId = req.user.id;

    if (!billId || !billData || !billType) {
      return res.status(400).json({
        success: false,
        message: 'Bill ID, billData, and billType are required'
      });
    }

    if (!['PURCHASE', 'SALE'].includes(billType)) {
      return res.status(400).json({
        success: false,
        message: 'billType must be either PURCHASE or SALE'
      });
    }


    try {
      LedgerEntryService.validateBillData(billData);
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError.message
      });
    }

    const entries = await LedgerEntryService.updateLedgerEntriesForBill(
      billId,
      billData,
      billType,
      userId
    );

    res.json({
      success: true,
      message: 'Ledger entries updated successfully',
      data: {
        entries,
        billId,
        billType
      }
    });

  } catch (error) {
    console.error('Error updating ledger entries:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update ledger entries'
    });
  }
});


router.get('/summary/:billId', canViewTransaction, async (req, res) => {
  try {
    const { billId } = req.params;
    const userId = req.user.id;

    if (!billId) {
      return res.status(400).json({
        success: false,
        message: 'Bill ID is required'
      });
    }

    const summary = await LedgerEntryService.getTransactionSummaryForBill(billId, userId);

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error getting transaction summary:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get transaction summary'
    });
  }
});


router.post('/validate-bill', async (req, res) => {
  try {
    const { billData } = req.body;

    if (!billData) {
      return res.status(400).json({
        success: false,
        message: 'billData is required'
      });
    }

    try {
      LedgerEntryService.validateBillData(billData);
      res.json({
        success: true,
        message: 'Bill data is valid'
      });
    } catch (validationError) {
      res.status(400).json({
        success: false,
        message: validationError.message
      });
    }

  } catch (error) {
    console.error('Error validating bill data:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to validate bill data'
    });
  }
});

module.exports = router; 